document.addEventListener('DOMContentLoaded', function() {

    // --- Animación de Scroll para Header ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Lógica del Menú Móvil ---
    const mobileMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const body = document.body;

    if (navToggle && mobileMenu && navClose) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.add('show-menu');
            body.classList.add('body-no-scroll');
        });

        navClose.addEventListener('click', () => {
            mobileMenu.classList.remove('show-menu');
            body.classList.remove('body-no-scroll');
        });
    }
    
    // --- Tabs de la página de Comandos ---
    const tabs = document.querySelectorAll('.commands__nav-btn');
    const all_content = document.querySelectorAll('.commands__content');

    if (tabs.length > 0 && all_content.length > 0) {
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => { t.classList.remove('active'); });
                tab.classList.add('active');

                all_content.forEach(content => { content.classList.remove('active'); });
                if (all_content[index]) {
                    all_content[index].classList.add('active');
                }
            });
        });
    }

    // --- Lógica para el Selector de Moneda en pricing.html ---
    const currencySwitcher = document.querySelector('.currency-switcher');
    if (currencySwitcher) {
        const currencyBtns = currencySwitcher.querySelectorAll('.currency-btn');
        const allPrices = document.querySelectorAll('.pricing__card__price');
        
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                element.textContent = currentValue.toLocaleString('es-AR');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        currencyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;
                currencyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetCurrency = btn.dataset.currency;
                allPrices.forEach(priceEl => {
                    const valueSpan = priceEl.querySelector('.price-value');
                    const currencySpan = priceEl.querySelector('.price-currency');
                    const startValue = parseInt(valueSpan.textContent.replace(/\./g, ''));
                    const endValue = (targetCurrency === 'ars') 
                        ? parseInt(priceEl.dataset.priceArs) 
                        : parseInt(priceEl.dataset.priceUsd);
                    if (!isNaN(startValue) && !isNaN(endValue)) {
                        currencySpan.textContent = '$';
                        animateValue(valueSpan, startValue, endValue, 500);
                    }
                });
            });
        });
    }

    // --- Lógica para el botón "Volver Arriba" ---
    const scrollUp = document.getElementById('scroll-up');
    if (scrollUp) {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 400) {
                scrollUp.classList.add('show-scroll');
            } else {
                scrollUp.classList.remove('show-scroll');
            }
        });
    }
    
    // --- Lógica para la Animación de Changelogs ---
    const changelogSummaries = document.querySelectorAll('.changelog__summary');
    if (changelogSummaries.length > 0) {
        changelogSummaries.forEach(summary => {
            summary.addEventListener('click', (event) => {
                event.preventDefault();
                const details = summary.parentElement;
                const content = summary.nextElementSibling;
                if (details.hasAttribute('open')) {
                    details.classList.add('is-closing');
                    content.addEventListener('animationend', () => {
                        details.removeAttribute('open');
                        details.classList.remove('is-closing');
                    }, { once: true });
                } else {
                    details.setAttribute('open', '');
                }
            });
        });
    }

    // --- Lógica para el Fondo de Estrellas Animado ---
    const canvas = document.getElementById('starfield-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let mouseX = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
        });

        class Star {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 2 + 0.5;
            }
            draw() {
                ctx.beginPath();
                const radius = (3 - this.z) * 0.5;
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.z * 0.5})`;
                ctx.fill();
            }
            update() {
                this.y += this.z * 0.5;
                this.x += mouseX * this.z * 1.5;
                if (this.y > canvas.height + 5) {
                    this.reset();
                    this.y = -5;
                }
                if (this.x < -5) this.x = canvas.width + 5;
                if (this.x > canvas.width + 5) this.x = -5;
            }
        }

        for (let i = 0; i < 500; i++) {
            stars.push(new Star());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }



    // --- Lógica para activar animaciones al hacer scroll ---
    const animatedElements = document.querySelectorAll('.anim-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añade la clase 'is-visible' para activar la animación
                    entry.target.classList.add('is-visible');
                    // Opcional: deja de observar el elemento una vez animado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // La animación se activa cuando el 10% del elemento es visible
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

}); // Cierre del 'DOMContentLoaded'