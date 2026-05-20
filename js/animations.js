/* ==========================================================================
   Aura Luxury Jewels - Futuristic Motion & Cinematic FX Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Custom Magnetic Cursor
    initCustomCursor();
    
    // 2. Initialize HTML5 Interactive Golden Particles Canvas
    initParticlesCanvas();

    // 3. Initialize GSAP & ScrollTrigger Animations
    setTimeout(initGsapScrollEffects, 100);

    // 4. Initialize 3D Card Tilt Effects
    initCardTilt();
});

// ==========================================================================
// 1. Cinematic Custom Cursor & Magnetic Pull Engine
// ==========================================================================
function initCustomCursor() {
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0; // Actual mouse position
    let ringX = 0, ringY = 0;   // Interpolated ring position
    let dotX = 0, dotY = 0;     // Interpolated dot position
    const lerpFactorRing = 0.15; // Smooth trailing delay factor
    const lerpFactorDot = 0.85;  // Fast follow factor
    
    // Update mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Buttery-smooth hardware-accelerated tracking loop
    function updateCursor() {
        dotX += (mouseX - dotX) * lerpFactorDot;
        dotY += (mouseY - dotY) * lerpFactorDot;
        
        ringX += (mouseX - ringX) * lerpFactorRing;
        ringY += (mouseY - ringY) * lerpFactorRing;
        
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursor);
    }
    
    // Initialize positions to avoid jumping from top-left
    dotX = ringX = mouseX = window.innerWidth / 2;
    dotY = ringY = mouseY = window.innerHeight / 2;
    updateCursor();

    // Setup Hover Class State Changes
    window.initCardCursorTriggers = function() {
        const hoverables = document.querySelectorAll('a, button, .category-item, select, input, textarea, .product-card');
        
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
                document.body.classList.remove('cursor-magnetic');
            });
        });

        // Setup Magnetic Snapping Effects with Cached Bounding Rects (Anti-Layout Thrashing)
        const magnets = document.querySelectorAll('.magnet-target, .cta-button, .category-item, nav .logo, .nav-links a');
        
        magnets.forEach(magnet => {
            let rect = null;
            
            magnet.addEventListener('mouseenter', () => {
                rect = magnet.getBoundingClientRect();
            });
            
            magnet.addEventListener('mousemove', (e) => {
                if (!rect) rect = magnet.getBoundingClientRect();
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                
                // Pull the item slightly toward the cursor (GPU translate3d)
                magnet.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
                
                // Snap cursor ring directly to item bounds
                document.body.classList.add('cursor-magnetic');
                ringX += (rect.left + rect.width / 2 - ringX) * 0.25;
                ringY += (rect.top + rect.height / 2 - ringY) * 0.25;
            });
            
            magnet.addEventListener('mouseleave', () => {
                rect = null;
                magnet.style.transform = 'translate3d(0px, 0px, 0)';
                document.body.classList.remove('cursor-magnetic');
            });
        });
    };
    
    window.initCardCursorTriggers();
}

// ==========================================================================
// 2. Interactive Golden Particles Canvas Background
// ==========================================================================
function initParticlesCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const colors = [
        'rgba(212, 175, 55, 0.25)', 
        'rgba(212, 175, 55, 0.15)', 
        'rgba(243, 229, 171, 0.2)', 
        'rgba(255, 255, 255, 0.1)'
    ];
    
    // Set responsive width/height
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Mouse coords for proximity interaction
    let mouse = { x: null, y: null, radius: 150, radiusSq: 22500 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.2 + 0.6;
            this.baseX = this.x;
            this.baseY = this.y;
            this.speedY = Math.random() * 0.35 + 0.1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.density = (Math.random() * 20) + 10;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill(); // Bypassed expensive shadowBlur and shadowColor for a massive rendering speed boost
        }
        
        update() {
            // Floating upwards
            this.y -= this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
            
            // Proximity repulsion/warping logic from mouse cursor (Anti-Math.sqrt Math Optimization)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distanceSq = dx * dx + dy * dy;
                
                if (distanceSq < mouse.radiusSq) {
                    let distance = Math.sqrt(distanceSq);
                    if (distance > 0) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let maxDistance = mouse.radius;
                        let force = (maxDistance - distance) / maxDistance;
                        let directionX = forceDirectionX * force * this.density * 0.4;
                        let directionY = forceDirectionY * force * this.density * 0.4;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }
    }
    
    function init() {
        particlesArray = [];
        // Responsive density capped at a maximum of 60 particles for perfect performance
        const baseCount = Math.floor((canvas.width * canvas.height) / 22000);
        const numberOfParticles = Math.min(baseCount, 60);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    init();
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', init);
}

// ==========================================================================
// 3. Cinematic GSAP and ScrollTrigger Animation Timelines
// ==========================================================================
function initGsapScrollEffects() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in preloader logo first
    gsap.fromTo('.preloader-logo', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" });
    
    // --- Hero entrance timeline ---
    const heroTl = gsap.timeline({ delay: 0.8 });
    
    heroTl.fromTo('#navbar', 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    )
    .fromTo('.hero-sub', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.6"
    )
    .fromTo('.hero-content h1', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=0.8"
    )
    .fromTo('.hero-content .cta-button', 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.7"
    );

    // Parallax scrolling on Hero Background
    gsap.to('#home', {
        backgroundPosition: "50% 80%",
        ease: "none",
        scrollTrigger: {
            trigger: '#home',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // --- Section Header Reveals ---
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        gsap.fromTo(title.querySelectorAll('span, h2'), 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                stagger: 0.15, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%"
                }
            }
        );
    });

    // --- Trust Badge Entrance ---
    const badges = document.querySelectorAll('.badge-item');
    if (badges.length > 0) {
        gsap.fromTo(badges, 
            { opacity: 0, y: 50, scale: 0.9 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                stagger: 0.15, 
                duration: 1, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.trust-badges',
                    start: "top 85%"
                }
            }
        );
    }

    // --- Festive Banner Dynamic Parallax ---
    const festive = document.querySelector('.festive-banner');
    if (festive) {
        // Subtle background scroll shift
        gsap.to(festive, {
            backgroundPosition: "50% 65%",
            ease: "none",
            scrollTrigger: {
                trigger: festive,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        
        // Dynamic content entrance
        gsap.fromTo(festive.querySelectorAll('span, h2, p, .cta-button'), 
            { opacity: 0, y: 35 },
            { 
                opacity: 1, 
                y: 0, 
                stagger: 0.12, 
                duration: 0.9, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: festive,
                    start: "top 75%"
                }
            }
        );
    }

    // --- About Section (Story) Entrance ---
    const aboutImg = document.querySelector('.about-image');
    const aboutContent = document.querySelector('.about-content');
    if (aboutImg && aboutContent) {
        gsap.fromTo(aboutImg, 
            { opacity: 0, x: -50, scale: 0.95 },
            { 
                opacity: 1, 
                x: 0, 
                scale: 1, 
                duration: 1.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.about-container',
                    start: "top 80%"
                }
            }
        );
        
        gsap.fromTo(aboutContent.children, 
            { opacity: 0, x: 50 },
            { 
                opacity: 1, 
                x: 0, 
                stagger: 0.12, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.about-container',
                    start: "top 80%"
                }
            }
        );
    }

    // --- Testimonial Cards Entrance ---
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 0) {
        gsap.fromTo(testimonialCards, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                stagger: 0.15, 
                duration: 1, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.testimonial-grid',
                    start: "top 85%"
                }
            }
        );
    }

    // --- Contact Form Entrance ---
    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) {
        gsap.fromTo(contactContainer.querySelectorAll('.inquiry-form, .contact-info'), 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                stagger: 0.2, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contactContainer,
                    start: "top 80%"
                }
            }
        );
    }
}

// ==========================================================================
// 4. Interactive 3D Card Tilt Engine
// ==========================================================================
function initCardTilt() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        let rect = null;
        
        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });
        
        card.addEventListener('mousemove', (e) => {
            if (!rect) rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse x relative to element
            const y = e.clientY - rect.top;  // Mouse y relative to element
            
            // Map offsets to percentage coordinates (-0.5 to 0.5)
            const xc = ((x / rect.width) - 0.5);
            const yc = ((y / rect.height) - 0.5);
            
            // Setup tilt angle scaling (max 10 degrees)
            const tiltX = yc * 10;
            const tiltY = xc * -10;
            
            // Set element dynamic transforms (hardware-accelerated translate3d)
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(0, -8px, 0)`;
            
            // Update custom styling properties for inner radial glare follow-spot
            const mousePercentX = (x / rect.width) * 100;
            const mousePercentY = (y / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${mousePercentX}%`);
            card.style.setProperty('--mouse-y', `${mousePercentY}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            rect = null;
            // Restore static flat position
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
        });
    });
}
