/* ==========================================================================
   Aura Luxury Jewels - Core Logic & Data Handling
   ========================================================================== */

// --- Product Catalog ---
const products = [
    { 
        id: 1, 
        name: "The Royal Temple Choker", 
        type: "Gold", 
        weight: "45.5g", 
        img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 2, 
        name: "Eternal Sparkle Solitaire", 
        type: "Diamond", 
        weight: "1.2 Carat", 
        img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 3, 
        name: "Antique Peacock Jhumkas", 
        type: "Gold", 
        weight: "22.0g", 
        img: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 4, 
        name: "Celestial Bridal Haaram", 
        type: "Bridal", 
        weight: "120.0g", 
        img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 5, 
        name: "Contemporary Rose Gold Band", 
        type: "Custom", 
        weight: "8.5g", 
        img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 6, 
        name: "Sterling Silver Bracelet", 
        type: "Silver", 
        weight: "18.5g", 
        img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 7, 
        name: "Mango Mala Traditional", 
        type: "Gold", 
        weight: "65.0g", 
        img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 8, 
        name: "Diamond Tennis Bracelet", 
        type: "Diamond", 
        weight: "3.5 Carat", 
        img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 9, 
        name: "Princess Cut Emerald Ring", 
        type: "Diamond", 
        weight: "2.4 Carat", 
        img: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 10, 
        name: "Heritage Nakshi Kada", 
        type: "Gold", 
        weight: "48.0g", 
        img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 11, 
        name: "Sleek Platinum Band", 
        type: "Custom", 
        weight: "10.0g", 
        img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 12, 
        name: "Silver Filigree Anklets", 
        type: "Silver", 
        weight: "28.0g", 
        img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80" 
    }
];

// --- Product Card Generation ---
function createProductCard(p) {
    return `
        <div class="product-card" data-id="${p.id}" data-category="${p.type.toLowerCase()}">
            <div class="product-card-sheen"></div>
            <div class="product-image">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div>
                    <span class="product-meta">${p.type} • ${p.weight}</span>
                    <h3 class="serif">${p.name}</h3>
                </div>
                <a href="https://wa.me/919000000000?text=I%27m%20interested%20in%20the%20${encodeURIComponent(p.name)}" target="_blank" class="whatsapp-btn magnet-target">
                    <i class="ph ph-whatsapp-logo"></i> Get Price
                </a>
            </div>
        </div>
    `;
}

// --- Load Products with Smooth Transition Shuffling ---
function loadProducts(category = 'all', targetGridId = 'collections-grid') {
    const grid = document.getElementById(targetGridId);
    if (!grid) return;
    
    // Filter logic
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.type.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(p.type.toLowerCase()));
    
    // Wipe and animate in
    grid.style.opacity = 0;
    
    setTimeout(() => {
        grid.innerHTML = '';
        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; opacity: 0.5; font-size: 0.9rem; letter-spacing: 2px;">NO MASTERPIECES FOUND</div>`;
        } else {
            filtered.forEach(p => {
                grid.innerHTML += createProductCard(p);
            });
        }
        
        // Re-trigger card-tilt listeners, cursors, and GSAP reveals
        if (window.initCardTilt) window.initCardTilt();
        if (window.initCardCursorTriggers) window.initCardCursorTriggers();
        
        // Dynamic GSAP staggered grid entrance
        if (window.gsap) {
            window.gsap.to(grid, { opacity: 1, duration: 0.4 });
            window.gsap.fromTo(grid.querySelectorAll('.product-card'), 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }
            );
        } else {
            grid.style.opacity = 1;
        }
    }, 300);
}

// --- Filter Category Click Trigger ---
function filterProducts(category, event) {
    if (!event || !event.target) return;
    
    // Update active state in parent container
    const items = event.target.parentElement.querySelectorAll('.category-item');
    items.forEach(i => i.classList.remove('active'));
    event.target.classList.add('active');
    
    // Check which page and grid we are loading into
    const isCollectionsPage = document.getElementById('collections-page').classList.contains('active');
    const targetGrid = isCollectionsPage ? 'collections-grid' : 'featured-grid';
    
    loadProducts(category, targetGrid);
}

// --- Smooth Page Navigation Router ---
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const targetPage = document.getElementById(pageId + '-page');
    if (!targetPage) return;
    
    // Seamless transition fading
    pages.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
        p.style.opacity = 0;
    });
    
    targetPage.style.display = 'block';
    // Allow thread to register block display before fading
    setTimeout(() => {
        targetPage.classList.add('active');
        targetPage.style.opacity = 1;
    }, 50);
    
    // Reset window offset beautifully
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset and reload grids matching specific pages
    if (pageId === 'home') {
        loadProducts('all', 'featured-grid');
    } else if (pageId === 'collections') {
        loadProducts('all', 'collections-grid');
    }
    
    // Update navigation active highlight links
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.includes(pageId)) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });

    // Re-initialize scroll animations on page swap
    setTimeout(() => {
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }, 100);
}

// --- Navbar Scrolled State Shift ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 80) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Scroll progress bar indicator
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }
});

// --- Dynamic Form Submissions Success Modal ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Hamburger Navigation Drawer ---
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
        
        // Close mobile menu on clicking any navigation link (seamless SPA swap)
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // Setup initial calculations on load
    calculateStudioPrice();
    calculateGoldEstimate();

    const form = document.querySelector('.inquiry-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Premium notification box injection
            const successModal = document.createElement('div');
            successModal.style.position = 'fixed';
            successModal.style.top = '50%';
            successModal.style.left = '50%';
            successModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            successModal.style.background = 'rgba(10, 10, 11, 0.95)';
            successModal.style.border = '1px solid var(--gold)';
            successModal.style.padding = '3rem';
            successModal.style.zIndex = '999999';
            successModal.style.textAlign = 'center';
            successModal.style.backdropFilter = 'blur(20px)';
            successModal.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8), 0 0 50px rgba(212, 175, 55, 0.1)';
            successModal.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            successModal.style.opacity = '0';
            
            successModal.innerHTML = `
                <i class="ph-fill ph-seal-check" style="font-size: 4.5rem; color: var(--gold); margin-bottom: 1.5rem; display: inline-block;"></i>
                <h3 class="serif" style="font-size: 2rem; color: var(--pearl); margin-bottom: 1rem;">Inquiry Received</h3>
                <p style="color: var(--pearl-muted); font-size: 0.9rem; margin-bottom: 2rem; max-width: 320px; line-height: 1.7;">Our master consultant will contact you via phone or WhatsApp shortly.</p>
                <button class="cta-button" style="padding: 0.8rem 2.2rem; font-size: 0.75rem;">CLOSE</button>
            `;
            
            document.body.appendChild(successModal);
            
            // Elegant scaling reveal
            setTimeout(() => {
                successModal.style.opacity = '1';
                successModal.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50);
            
            // Close modal bindings
            const closeBtn = successModal.querySelector('button');
            const closeModal = () => {
                successModal.style.opacity = '0';
                successModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    successModal.remove();
                }, 500);
            };
            closeBtn.addEventListener('click', closeModal);
            successModal.addEventListener('click', (ev) => {
                if (ev.target === successModal) closeModal();
            });
            
            form.reset();
        });
    }

    // Salon Consultation Appointment Reservation
    const bookingForm = document.getElementById('salon-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const focusVal = document.getElementById('booking-focus').value;
            const advisorVal = document.getElementById('booking-advisor').value;
            const dateVal = document.getElementById('booking-date').value;
            const timeVal = document.getElementById('booking-time').value;
            const nameVal = document.getElementById('booking-name').value;
            const phoneVal = document.getElementById('booking-phone').value;
            
            // Show a premium custom booking confirmation popup
            const bookingModal = document.createElement('div');
            bookingModal.style.position = 'fixed';
            bookingModal.style.top = '50%';
            bookingModal.style.left = '50%';
            bookingModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            bookingModal.style.background = 'rgba(10, 10, 11, 0.95)';
            bookingModal.style.border = '1px solid var(--gold)';
            bookingModal.style.padding = '3rem';
            bookingModal.style.zIndex = '999999';
            bookingModal.style.textAlign = 'center';
            bookingModal.style.backdropFilter = 'blur(20px)';
            bookingModal.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8), 0 0 50px rgba(212, 175, 55, 0.1)';
            bookingModal.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            bookingModal.style.opacity = '0';
            
            const wabaMsg = `Hello Aura Jewels! I have scheduled a Private Showroom Salon reservation:\n\n- Name: ${nameVal}\n- Phone: ${phoneVal}\n- Focus: ${focusVal}\n- Selected Advisor: ${advisorVal}\n- Date: ${dateVal}\n- Time Slot: ${timeVal}\n\nPlease confirm my slot. Thank you!`;
            const wabaUrl = `https://wa.me/919000000000?text=${encodeURIComponent(wabaMsg)}`;
            
            bookingModal.innerHTML = `
                <i class="ph-fill ph-calendar-check" style="font-size: 4.5rem; color: var(--gold); margin-bottom: 1.5rem; display: inline-block;"></i>
                <h3 class="serif" style="font-size: 2.2rem; color: var(--pearl); margin-bottom: 0.5rem;">Salon Reserved</h3>
                <p style="color: var(--gold-light); font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 2rem;">Reservation Ticket Created</p>
                
                <div style="background: rgba(18, 18, 20, 0.65); border: 1px solid rgba(212, 175, 55, 0.1); padding: 1.8rem; text-align: left; margin-bottom: 2rem; font-size: 0.85rem; line-height: 1.8; color: var(--pearl);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;"><span style="opacity:0.6;">Patron:</span> <strong>${nameVal}</strong></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;"><span style="opacity:0.6;">Focus:</span> <strong>${focusVal}</strong></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;"><span style="opacity:0.6;">Advisor:</span> <strong>${advisorVal}</strong></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;"><span style="opacity:0.6;">Schedule:</span> <strong>${dateVal} @ ${timeVal}</strong></div>
                </div>
                
                <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                    <a href="${wabaUrl}" target="_blank" class="cta-button magnet-target" style="padding: 0.9rem 2.2rem; font-size: 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem;"><i class="ph-fill ph-whatsapp-logo" style="font-size:1.1rem;"></i> CONFIRM ON WHATSAPP</a>
                    <button class="cta-button btn-outline magnet-target" style="padding: 0.9rem 2.2rem; font-size: 0.75rem;">CLOSE</button>
                </div>
            `;
            
            document.body.appendChild(bookingModal);
            
            setTimeout(() => {
                bookingModal.style.opacity = '1';
                bookingModal.style.transform = 'translate(-50%, -50%) scale(1)';
                if (window.initCardCursorTriggers) window.initCardCursorTriggers();
            }, 50);
            
            const closeBtn = bookingModal.querySelector('button');
            const closeModal = () => {
                bookingModal.style.opacity = '0';
                bookingModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    bookingModal.remove();
                }, 500);
            };
            closeBtn.addEventListener('click', closeModal);
            bookingModal.addEventListener('click', (ev) => {
                if (ev.target === bookingModal) closeModal();
            });
            
            bookingForm.reset();
            // Re-apply active state to first option
            const defaultOpt = document.querySelector('.booking-grid-opt');
            if (defaultOpt) {
                setBookingFocus(defaultOpt, 'Bridal Registry Consultation');
            }
        });
    }
});

// --- Preloader Progress Simulator ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const bar = document.querySelector('.preloader-progress');
    if (!preloader) return;
    
    if (bar) {
        bar.style.width = '100%';
    }
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Trigger initial home setup
        showPage('home');
    }, 850);
});

// ==========================================================================
// Bespoke Custom Design Studio Operations
// ==========================================================================
let currentMetal = 'platinum';
let metalBaseValue = 6800; // Platinum 950 per gram
let currentMetalLabel = 'Platinum 950';
let currentMetalDesc = 'Pure Platinum 950 base';

let currentGem = 'diamond';
let gemPrice = 250000; // Flawless Solitaire Diamond base
let currentGemLabel = 'Solitaire Diamond';
let currentGemDesc = 'certified flawless D-color Solitaire Diamond';

let currentCarat = 1.5;

function updateStudioMetal(el, metalType, metalBaseVal, metalLabel, metalDesc) {
    const options = el.parentElement.querySelectorAll('.studio-opt');
    options.forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
    
    currentMetal = metalType;
    metalBaseValue = metalBaseVal;
    currentMetalLabel = metalLabel;
    currentMetalDesc = metalDesc;
    
    const band = document.getElementById('studio-band-element');
    const glow = document.getElementById('studio-glow-element');
    if (!band || !glow) return;
    
    // Smooth shader adjustment inside 3D preview stage
    if (metalType === 'platinum') {
        band.style.borderColor = '#E5E4E2';
        band.style.boxShadow = '0 0 25px rgba(229, 228, 226, 0.4)';
        glow.style.background = 'radial-gradient(circle, rgba(229, 228, 226, 0.22) 0%, transparent 70%)';
    } else if (metalType === 'yellow-gold') {
        band.style.borderColor = '#D4AF37';
        band.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.4)';
        glow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)';
    } else if (metalType === 'rose-gold') {
        band.style.borderColor = '#B76E79';
        band.style.boxShadow = '0 0 25px rgba(183, 110, 121, 0.4)';
        glow.style.background = 'radial-gradient(circle, rgba(183, 110, 121, 0.22) 0%, transparent 70%)';
    } else if (metalType === 'silver') {
        band.style.borderColor = '#C0C0C0';
        band.style.boxShadow = '0 0 25px rgba(192, 192, 192, 0.4)';
        glow.style.background = 'radial-gradient(circle, rgba(192, 192, 192, 0.22) 0%, transparent 70%)';
    }
    
    updateStudioSpecs();
    calculateStudioPrice();
}

function updateStudioGem(el, gemType, gemPr, gemLabel, gemDesc) {
    const options = el.parentElement.querySelectorAll('.studio-opt');
    options.forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
    
    currentGem = gemType;
    gemPrice = gemPr;
    currentGemLabel = gemLabel;
    currentGemDesc = gemDesc;
    
    const gemEl = document.getElementById('studio-gem-element');
    if (!gemEl) return;
    
    // Color shader and metallic reflection glow updates
    if (gemType === 'diamond') {
        gemEl.style.color = '#F5EFEB';
        gemEl.style.filter = 'drop-shadow(0 0 15px rgba(245, 239, 235, 0.7))';
    } else if (gemType === 'emerald') {
        gemEl.style.color = '#50C878';
        gemEl.style.filter = 'drop-shadow(0 0 15px rgba(80, 200, 120, 0.8))';
    } else if (gemType === 'sapphire') {
        gemEl.style.color = '#0F52BA';
        gemEl.style.filter = 'drop-shadow(0 0 15px rgba(15, 82, 186, 0.8))';
    } else if (gemType === 'ruby') {
        gemEl.style.color = '#E0115F';
        gemEl.style.filter = 'drop-shadow(0 0 15px rgba(224, 17, 95, 0.8))';
    }
    
    updateStudioSpecs();
    calculateStudioPrice();
}

function updateStudioCarat(val) {
    currentCarat = parseFloat(val);
    const display = document.getElementById('carat-val-display');
    if (display) {
        display.innerText = currentCarat.toFixed(1) + ' Ct';
    }
    
    // Dynamic scale magnification of gemstone logo matching carat choice
    const gemEl = document.getElementById('studio-gem-element');
    if (gemEl) {
        const scaleFactor = 0.85 + ((currentCarat - 0.5) / 4.5) * 0.5; // Scale range 0.85 to 1.35
        gemEl.style.transform = `scale(${scaleFactor})`;
    }
    
    calculateStudioPrice();
}

function updateStudioSpecs() {
    const specTitle = document.getElementById('spec-title');
    const specDesc = document.getElementById('spec-description');
    if (specTitle) specTitle.innerText = `${currentMetalLabel} ${currentGemLabel}`;
    if (specDesc) specDesc.innerText = `${currentMetalDesc} with a certified ${currentGemDesc} gemstone at ${currentCarat.toFixed(1)} Carats.`;
}

function calculateStudioPrice() {
    const baseMetalWeight = 12; // Average weight for bespoke ring shank
    const metalVal = metalBaseValue * baseMetalWeight;
    const gemsVal = gemPrice * currentCarat;
    const labor = (metalVal + gemsVal) * 0.12; // 12% luxury artisanal labor fees
    const subtotal = metalVal + gemsVal + labor;
    const gstVal = subtotal * 0.03; // Standard 3% GST on jewelry
    const total = Math.round(subtotal + gstVal);
    
    const priceDisplay = document.getElementById('studio-live-price');
    if (priceDisplay) {
        priceDisplay.innerText = '₹' + total.toLocaleString('en-IN');
    }
    
    const inquireBtn = document.getElementById('studio-inquire-btn');
    if (inquireBtn) {
        const msg = `Hello Aura Jewels! I am interested in designing a custom piece using your Bespoke Design Studio:\n\n- Ring Frame: ${currentMetalLabel}\n- Center Stone: ${currentGemLabel} (${currentCarat.toFixed(1)} Ct)\n- Live Price Estimate: ₹${total.toLocaleString('en-IN')}\n\nPlease check master craftsman schedule for a showroom appointment.`;
        inquireBtn.href = `https://wa.me/919000000000?text=${encodeURIComponent(msg)}`;
    }
}

// ==========================================================================
// Live Rate Board Calculations
// ==========================================================================
function calculateGoldEstimate() {
    const puritySelect = document.getElementById('calc-purity');
    const weightInput = document.getElementById('calc-weight');
    if (!puritySelect || !weightInput) return;
    
    const ratePerGram = parseFloat(puritySelect.value);
    const weight = parseFloat(weightInput.value) || 0;
    
    const baseMetalValue = ratePerGram * weight;
    const makingCharges = baseMetalValue * 0.12; // 12% making charges
    const subtotal = baseMetalValue + makingCharges;
    const gstVal = subtotal * 0.03; // 3% GST tax
    const totalInvestment = baseMetalValue > 0 ? Math.round(subtotal + gstVal) : 0;
    
    const baseDisplay = document.getElementById('calc-base-val');
    const makingDisplay = document.getElementById('calc-making-val');
    const gstDisplay = document.getElementById('calc-gst-val');
    const totalDisplay = document.getElementById('calc-total-val');
    
    if (baseDisplay) baseDisplay.innerText = '₹' + Math.round(baseMetalValue).toLocaleString('en-IN');
    if (makingDisplay) makingDisplay.innerText = '₹' + Math.round(makingCharges).toLocaleString('en-IN');
    if (gstDisplay) gstDisplay.innerText = '₹' + Math.round(gstVal).toLocaleString('en-IN');
    if (totalDisplay) totalDisplay.innerText = '₹' + totalInvestment.toLocaleString('en-IN');
    
    const lockBtn = document.querySelector('.calculator-panel a');
    if (lockBtn) {
        const selectedLabel = puritySelect.options[puritySelect.selectedIndex].text;
        const msg = `Hello Aura Jewels! I would like to lock in today's live rate for my target calculation:\n\n- Metal Category: ${selectedLabel}\n- Target Weight: ${weight}g\n- Total Investment Quote: ₹${totalInvestment.toLocaleString('en-IN')}\n\nPlease advise on the booking lock procedure. Thank you!`;
        lockBtn.href = `https://wa.me/919000000000?text=${encodeURIComponent(msg)}`;
    }
}

// ==========================================================================
// Private Salon Booking Selectors
// ==========================================================================
function setBookingFocus(el, focusText) {
    const options = el.parentElement.querySelectorAll('.booking-grid-opt');
    options.forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
    
    const focusInput = document.getElementById('booking-focus');
    if (focusInput) {
        focusInput.value = focusText;
    }
}
