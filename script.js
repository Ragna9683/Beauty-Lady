/* ==========================================================================
   Beauty Lady Radzymin - Core JavaScript (Advanced Interactivity)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. CANVAS ANIMATION: Floating Background Lines --- */
    const canvas = document.getElementById('lines-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        let step = 0;
        function drawLines() {
            ctx.clearRect(0, 0, width, height);
            step += 0.004;

            // Primary Wine/Berry gradient line
            ctx.beginPath();
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = 'rgba(155, 44, 70, 0.18)';
            for (let x = 0; x < width; x += 12) {
                let y = Math.sin(x * 0.002 + step) * 70 + Math.cos(x * 0.001 + step) * 35 + height * 0.45;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Secondary Gold accent line
            ctx.beginPath();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = 'rgba(197, 160, 89, 0.22)';
            for (let x = 0; x < width; x += 12) {
                let y = Math.cos(x * 0.0025 - step) * 90 + Math.sin(x * 0.0015 + step) * 45 + height * 0.55;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            requestAnimationFrame(drawLines);
        }
        drawLines();
    }

    /* --- 2. Mobile Menu (Burger) Logic --- */
    const burgerBtn = document.getElementById('burger-btn');
    const mainNav = document.getElementById('main-nav');

    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }

    /* --- 3. Interactive Calculator Logic --- */
    const categorySelect = document.getElementById('calc-category');
    const variantSelect = document.getElementById('calc-variant');
    const priceDisplay = document.getElementById('calc-price');
    const summaryInput = document.getElementById('form-summary');

    const variantsData = {
        laser: [
            { name: "Bikini głębokie, pakiet 6 zabiegów", price: "1 440 zł" },
            { name: "Bikini głębokie, pakiet 8 zabiegów", price: "1 920 zł" },
            { name: "Bikini płytkie, pakiet 6 zabiegów", price: "1 200 zł" },
            { name: "Cała twarz, pakiet 6 zabiegów", price: "1 200 zł" },
            { name: "Brzuch, pakiet 6 zabiegów", price: "960 zł" }
        ],
        face: [
            { name: "Zabieg Geneo", price: "320 zł" },
            { name: "Geneo + kwasy", price: "380 zł" },
            { name: "Retix-C (retinol + witamina C)", price: "380 zł" },
            { name: "Zabieg z witaminą C", price: "320 zł" },
            { name: "Neopen, 3 zabiegi (twarz + szyja)", price: "1 200 zł" }
        ],
        body: [
            { name: "Endomasaż, pakiet 10 zabiegów (kostium gratis)", price: "2 200 zł" },
            { name: "Endomasaż, pakiet 5 zabiegów", price: "1 200 zł" },
            { name: "Endomasaż, pojedynczy zabieg", price: "260 zł" }
        ],
        voucher: [
            { name: "Voucher na wybraną usługę lub kwotę", price: "kwota do ustalenia" }
        ]
    };

    function updateCalculator() {
        const cat = categorySelect.value;
        const options = variantsData[cat] || [];
        
        variantSelect.innerHTML = "";
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.val;
            el.textContent = `${opt.name} (${opt.price})`;
            variantSelect.appendChild(el);
        });

        if(options.length > 0) {
            priceDisplay.textContent = options[0].price;
            summaryInput.value = `${options[0].name} - ${options[0].price}`;
        }
    }

    if(categorySelect && variantSelect) {
        categorySelect.addEventListener('change', updateCalculator);
        variantSelect.addEventListener('change', () => {
            const selectedText = variantSelect.options[variantSelect.selectedIndex].textContent;
            const priceOnly = selectedText.split('(')[1].replace(')', '');
            priceDisplay.textContent = priceOnly;
            summaryInput.value = selectedText;
        });
        updateCalculator();
    }

    /* --- 4. Sliding Drawer Modal Logic --- */
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const openDrawerBtn = document.getElementById('open-drawer-btn');
    const drawerClose = document.getElementById('drawer-close');

    function openDrawer() {
        if(drawer && drawerOverlay) {
            drawer.classList.add('active');
            drawerOverlay.classList.add('active');
        }
    }

    function closeDrawer() {
        if(drawer && drawerOverlay) {
            drawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        }
    }

    if(openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
    if(drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if(drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    /* --- 5. FAQ Accordion Logic --- */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(other => {
                if(other !== item) other.classList.remove('active');
            });
            
            item.classList.toggle('active');
        });
    });

    /* --- 6. Lightbox Gallery Logic --- */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('.open-lightbox').forEach(frame => {
        frame.addEventListener('click', () => {
            const imgSrc = frame.dataset.img;
            if(lightboxImg && lightboxModal) {
                lightboxImg.src = imgSrc;
                lightboxModal.classList.add('active');
            }
        });
    });

    function closeLightbox() {
        if(lightboxModal) lightboxModal.classList.remove('active');
    }

    if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if(lightboxModal) lightboxModal.addEventListener('click', (e) => {
        if(e.target === lightboxModal) closeLightbox();
    });

    /* --- 7. Form Validation with Honeypot --- */
    const inquiryForm = document.getElementById('inquiry-form');
    if(inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check honeypot (spam trap)
            const trap = inquiryForm.querySelector('.honeypot');
            if(trap && trap.value !== "") return; // Bot detected, silent block

            const nameInput = document.getElementById('form-name');
            const phoneInput = document.getElementById('form-phone');
            const successMsg = document.getElementById('success-msg');
            
            let isValid = true;

            if(!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('error');
            }

            const phoneRegex = /^[0-9+\s()-]{9,15}$/;
            if(!phoneRegex.test(phoneInput.value.trim())) {
                phoneInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                phoneInput.parentElement.classList.remove('error');
            }

            if(isValid) {
                successMsg.style.display = 'block';
                inquiryForm.querySelector('button[type="submit"]').style.display = 'none';
                setTimeout(() => {
                    closeDrawer();
                    successMsg.style.display = 'none';
                    inquiryForm.reset();
                    inquiryForm.querySelector('button[type="submit"]').style.display = 'block';
                }, 8000);
            }
        });
    }

    /* --- 8. Smooth Scrolling with Sticky Header Offset --- */
    const header = document.getElementById('header');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault(); 
                
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

});