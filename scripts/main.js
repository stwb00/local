document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {
        const toggle = header.querySelector('.menu-toggle');
        const navbar = header.querySelector('.navbar');

        if (!toggle || !navbar) {
            return;
        }

        const closeMenu = () => {
            navbar.classList.remove('navbar-open');
            toggle.classList.remove('is-open');
        };

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();

            const willOpen = !navbar.classList.contains('navbar-open');

            document.querySelectorAll('.navbar.navbar-open').forEach((openNav) => {
                openNav.classList.remove('navbar-open');
            });
            document.querySelectorAll('.menu-toggle.is-open').forEach((openToggle) => {
                openToggle.classList.remove('is-open');
            });

            if (willOpen) {
                navbar.classList.add('navbar-open');
                toggle.classList.add('is-open');
            }
        });

        navbar.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        document.addEventListener('click', (event) => {
            if (!header.contains(event.target)) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    });
});
