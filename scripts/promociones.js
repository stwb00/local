document.addEventListener('DOMContentLoaded', () => {
    const perfumes = [
        { id: 1, name: 'Fragancia Elegante', brand: 'Armani', price: 89900 },
        { id: 2, name: 'Aroma Seductor', brand: 'Chanel', price: 125500 },
        { id: 3, name: 'Esencia Natural', brand: 'Dior', price: 78250 },
        { id: 4, name: 'Dulce Tentación', brand: 'Armani', price: 95750 },
        { id: 5, name: 'Aire Fresco', brand: 'Versace', price: 67990 },
        { id: 6, name: 'Misterio Oriental', brand: 'Tom Ford', price: 142000 }
    ];

    let calculator = {};

    function initializeCalculator() {
        const calculatorItemsContainer = document.getElementById('calculator-items');
        if (!calculatorItemsContainer) {
            return;
        }

        calculatorItemsContainer.innerHTML = '';

        perfumes.forEach((perfume) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Perfume">${perfume.name}</td>
                <td data-label="Marca">${perfume.brand}</td>
                <td data-label="Precio">$${perfume.price.toLocaleString()}</td>
                <td data-label="Cantidad">
                    <div class="qty-controls">
                        <button onclick="updateQuantity(${perfume.id}, -1)">-</button>
                        <span id="qty-${perfume.id}">0</span>
                        <button onclick="updateQuantity(${perfume.id}, 1)">+</button>
                    </div>
                </td>
                <td data-label="Subtotal" id="subtotal-${perfume.id}">$0</td>
            `;
            calculatorItemsContainer.appendChild(row);
        });
    }

    function setupEventListeners() {
        const clearBtn = document.getElementById('clear-calculator');
        const calcBtn = document.getElementById('calculate-total');

        if (clearBtn) {
            clearBtn.addEventListener('click', clearCalculator);
        }

        if (calcBtn) {
            calcBtn.addEventListener('click', calculateTotal);
        }
    }

    function updateQuantity(perfumeId, change) {
        if (!calculator[perfumeId]) {
            calculator[perfumeId] = 0;
        }

        calculator[perfumeId] += change;

        if (calculator[perfumeId] < 0) {
            calculator[perfumeId] = 0;
        }

        const qtyElement = document.getElementById(`qty-${perfumeId}`);
        if (qtyElement) {
            qtyElement.textContent = calculator[perfumeId];
        }

        const perfume = perfumes.find((p) => p.id === perfumeId);
        if (!perfume) {
            return;
        }

        const subtotalElement = document.getElementById(`subtotal-${perfume.id}`);
        if (subtotalElement) {
            const subtotal = calculator[perfumeId] * perfume.price;
            subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        }
    }

    function clearCalculator() {
        calculator = {};

        perfumes.forEach((perfume) => {
            const qtyElement = document.getElementById(`qty-${perfume.id}`);
            const subtotalElement = document.getElementById(`subtotal-${perfume.id}`);

            if (qtyElement) {
                qtyElement.textContent = '0';
            }
            if (subtotalElement) {
                subtotalElement.textContent = '$0';
            }
        });

        const totalFields = [
            'total-without-promo',
            'total-with-promo',
            'discount-amount',
            'gift-info'
        ];

        totalFields.forEach((field) => {
            const el = document.getElementById(field);
            if (el) {
                el.textContent = field === 'gift-info' ? 'No aplica' : '$0';
            }
        });
    }

    function calculateTotal() {
        let totalWithoutPromo = 0;
        let totalWithPromo = 0;
        let discountAmount = 0;
        let giftInfo = 'No aplica';

        Object.keys(calculator).forEach((perfumeId) => {
            const quantity = calculator[perfumeId];
            const perfume = perfumes.find((p) => p.id === parseInt(perfumeId, 10));
            if (perfume && quantity > 0) {
                totalWithoutPromo += perfume.price * quantity;
            }
        });

        totalWithPromo = totalWithoutPromo;

        if (totalWithoutPromo > 0) {
            let armaniItems = 0;
            Object.keys(calculator).forEach((perfumeId) => {
                const quantity = calculator[perfumeId];
                const perfume = perfumes.find((p) => p.id === parseInt(perfumeId, 10));
                if (perfume && perfume.brand === 'Armani' && quantity > 0) {
                    armaniItems += quantity;
                }
            });

            if (armaniItems >= 2) {
                let armaniCount = 0;
                Object.keys(calculator).forEach((perfumeId) => {
                    const quantity = calculator[perfumeId];
                    const perfume = perfumes.find((p) => p.id === parseInt(perfumeId, 10));
                    if (perfume && perfume.brand === 'Armani' && quantity > 0) {
                        for (let i = 0; i < quantity; i += 1) {
                            armaniCount += 1;
                            if (armaniCount % 2 === 0) {
                                discountAmount += perfume.price * 0.5;
                            }
                        }
                    }
                });
            }

            totalWithPromo = totalWithoutPromo - discountAmount;

            const blackWeekDiscount = totalWithPromo * 0.3;
            discountAmount += blackWeekDiscount;
            totalWithPromo -= blackWeekDiscount;

            if (totalWithPromo >= 100000) {
                giftInfo = 'Neceser Essence exclusivo';
            }
        }

        const totalElements = {
            'total-without-promo': `$${totalWithoutPromo.toLocaleString()}`,
            'total-with-promo': `$${totalWithPromo.toLocaleString()}`,
            'discount-amount': `$${discountAmount.toLocaleString()}`,
            'gift-info': giftInfo
        };

        Object.entries(totalElements).forEach(([field, value]) => {
            const el = document.getElementById(field);
            if (el) {
                el.textContent = value;
            }
        });
    }

    initializeCalculator();
    setupEventListeners();

    window.updateQuantity = updateQuantity;
});
