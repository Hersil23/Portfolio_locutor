// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables
let isMenuOpen = false;
let typingInterval;
let particlesCreated = false;

// Improved Particle System
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Evitar crear partículas múltiples veces
    if (particlesCreated) return;
    particlesCreated = true;
    
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;
    
    // Clear existing particles
    container.innerHTML = '';
    
    // Crear diferentes tipos de partículas
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Determinar tipo de partícula aleatoriamente
        const type = Math.floor(Math.random() * 3) + 1;
        particle.className = `particle type${type}`;
        
        // Posición inicial aleatoria
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        
        particle.style.left = initialX + '%';
        particle.style.top = initialY + '%';
        
        // Delay aleatorio para las animaciones
        particle.style.animationDelay = Math.random() * 4 + 's';
        
        container.appendChild(particle);
        
        // Animación adicional con GSAP para movimiento más complejo
        gsap.set(particle, {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
        });
        
        // Animación continua
        gsap.to(particle, {
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            duration: Math.random() * 4 + 3,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: Math.random() * 2
        });
    }
    
    console.log(`✨ ${particleCount} partículas creadas`);
}

// Improved Mobile Menu
function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('#mobile-nav .nav-link');
    
    if (!toggleBtn || !mobileNav) {
        console.error('❌ Elementos del menú móvil no encontrados');
        return;
    }
    
    // Toggle mobile menu
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileNav.classList.remove('hidden');
            toggleBtn.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Animar entrada del menú
            gsap.fromTo(mobileNav, 
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
            );
            
            // Animar links del menú
            gsap.fromTo(navLinks,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.1 }
            );
        } else {
            // Animar salida del menú
            gsap.to(mobileNav, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    mobileNav.classList.add('hidden');
                }
            });
            
            toggleBtn.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                gsap.to(mobileNav, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        mobileNav.classList.add('hidden');
                    }
                });
                
                toggleBtn.classList.remove('open');
                document.body.style.overflow = 'auto';
                isMenuOpen = false;
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
            gsap.to(mobileNav, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    mobileNav.classList.add('hidden');
                }
            });
            
            toggleBtn.classList.remove('open');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            gsap.to(mobileNav, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    mobileNav.classList.add('hidden');
                }
            });
            
            toggleBtn.classList.remove('open');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            mobileNav.classList.add('hidden');
            toggleBtn.classList.remove('open');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
    
    console.log('📱 Menú móvil configurado');
}

// Smooth Scrolling for Navigation
function setupSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const isMobile = window.innerWidth < 768;
                const offsetTop = targetElement.offsetTop - (isMobile ? 100 : 80);
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('⚡ Scroll suave configurado');
}

// Typing Animation
function setupTypingAnimation() {
    const text = "Herasi Silva";
    const element = document.querySelector('.typing-animation');
    
    if (!element) return;
    
    let i = 0;
    let isDeleting = false;
    
    function typeWriter() {
        if (!isDeleting && i < text.length) {
            element.textContent = text.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, 150);
        } else if (!isDeleting && i === text.length) {
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 2000);
        } else if (isDeleting && i > 0) {
            element.textContent = text.substring(0, i - 1);
            i--;
            setTimeout(typeWriter, 100);
        } else if (isDeleting && i === 0) {
            isDeleting = false;
            setTimeout(typeWriter, 500);
        }
    }
    
    typeWriter();
    console.log('⌨️ Animación de escritura iniciada');
}

// GSAP Animations
function setupGSAPAnimations() {
    // Hero Section Animation
    const heroTimeline = gsap.timeline();
    
    heroTimeline
        .from('.hero-text h1', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: "power3.out"
        })
        .from('.hero-text p', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.5")
        .from('.pulse-button', {
            duration: 0.8,
            scale: 0,
            opacity: 0,
            ease: "back.out(1.7)"
        }, "-=0.3")
        .from('.hero-image', {
            duration: 1.5,
            scale: 0.5,
            opacity: 0,
            rotation: 180,
            ease: "power2.out"
        }, "-=1");

    // Navbar hide/show on scroll mejorado
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');
        
        if (Math.abs(currentScrollY - lastScrollY) > 5) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                gsap.to(navbar, {duration: 0.3, y: -100, ease: "power2.out"});
            } else {
                gsap.to(navbar, {duration: 0.3, y: 0, ease: "power2.out"});
            }
            lastScrollY = currentScrollY;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // About Section Animations - Simplificadas
    ScrollTrigger.create({
        trigger: '#quien-soy',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.from('.about-text', {
                duration: 0.8,
                x: -50,
                opacity: 0,
                ease: "power2.out"
            });
            
            gsap.from('.about-skills', {
                duration: 0.8,
                x: 50,
                opacity: 0,
                ease: "power2.out",
                delay: 0.2
            });
        }
    });

    // Skill Bars Animation - Corregida
    gsap.utils.toArray('.skill-bar').forEach((bar, index) => {
        const widths = ['95%', '90%', '88%'];
        
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(bar, {
                    width: widths[index],
                    duration: 1.2,
                    ease: "power2.out",
                    delay: index * 0.15
                });
            }
        });
    });

    // Portfolio Items Animation - Corregida para evitar bloqueos
    ScrollTrigger.create({
        trigger: '#portafolio',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
                gsap.from(item, {
                    duration: 0.6,
                    y: 50,
                    opacity: 0,
                    delay: index * 0.1,
                    ease: "power2.out"
                });
            });
        }
    });

    // Services Cards Animation - Simplificada
    ScrollTrigger.create({
        trigger: '#servicios',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            gsap.utils.toArray('.service-card').forEach((card, index) => {
                gsap.from(card, {
                    duration: 0.6,
                    y: 40,
                    opacity: 0,
                    delay: index * 0.08,
                    ease: "power2.out"
                });
            });
        }
    });

    // Contact Form Animation
    ScrollTrigger.create({
        trigger: '#contacto',
        start: 'top 75%',
        once: true,
        onEnter: () => {
            gsap.from('.form-group', {
                duration: 0.5,
                y: 30,
                opacity: 0,
                stagger: 0.08,
                ease: "power2.out"
            });
        }
    });

    // Social Links Animation - Corregida
    ScrollTrigger.create({
        trigger: 'footer',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            gsap.from('.social-link', {
                duration: 0.5,
                scale: 0,
                rotation: 90,
                stagger: 0.08,
                ease: "back.out(1.7)"
            });
        }
    });
    
    console.log('🎬 Animaciones GSAP configuradas');
}

// Service Cards Hover Effects
function setupServiceCardEffects() {
    gsap.utils.toArray('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                y: -10,
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                y: 0,
                scale: 1,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                ease: "power2.out"
            });
        });
    });
    
    console.log('💳 Efectos de tarjetas configurados');
}

// Form Enhancements
function setupFormEnhancements() {
    const form = document.querySelector('form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    // Input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                duration: 0.3,
                scale: 1.02,
                ease: "power2.out"
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    });

    // Form submission handling
    form.addEventListener('submit', function(e) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Add loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        button.disabled = true;
        button.classList.add('loading');
        
        // Simular envío (en producción esto se manejará con el action del form)
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check mr-2"></i>¡Mensaje Enviado!';
            button.classList.remove('loading');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        }, 2000);
    });
    
    console.log('📋 Formulario mejorado configurado');
}

// Video Hover Effects
function setupVideoEffects() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        const container = video.closest('.video-container');
        
        if (container) {
            container.addEventListener('mouseenter', () => {
                gsap.to(video, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: "power2.out"
                });
            });
            
            container.addEventListener('mouseleave', () => {
                gsap.to(video, {
                    duration: 0.3,
                    scale: 1,
                    ease: "power2.out"
                });
            });
        }
    });
    
    console.log('🎥 Efectos de video configurados');
}

// WhatsApp Contact Button
function setupWhatsAppButton() {
    const whatsappButtons = document.querySelectorAll('.pulse-button');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!button.closest('form')) { // Only open WhatsApp if not in form
                e.preventDefault();
                const message = encodeURIComponent('Hola Herasi! Me interesa conocer más sobre tus servicios de locución.');
                window.open(`https://wa.me/584145116337?text=${message}`, '_blank');
            }
        });
    });
    
    console.log('📱 Botones de WhatsApp configurados');
}

// Performance optimizations
function optimizePerformance() {
    // Lazy load videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('loading', 'lazy');
        video.setAttribute('preload', 'metadata');
    });
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
            
            // Recrear partículas solo si es necesario
            const container = document.getElementById('particles-container');
            if (container && container.children.length === 0) {
                particlesCreated = false;
                createParticles();
            }
        }, 250);
    });
    
    // Optimizar scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
        }, 16); // ~60fps
    }, { passive: true });
    
    console.log('⚡ Optimizaciones de rendimiento aplicadas');
}

// Error handling
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('❌ JavaScript Error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('❌ Unhandled Promise Rejection:', e.reason);
    });
}

// Accessibility improvements
function setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-2 rounded z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Improve focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusable = Array.from(document.querySelectorAll(focusableElements));
            const index = focusable.indexOf(document.activeElement);
            
            if (e.shiftKey) {
                const prevIndex = index > 0 ? index - 1 : focusable.length - 1;
                if (prevIndex >= 0) {
                    e.preventDefault();
                    focusable[prevIndex].focus();
                }
            } else {
                const nextIndex = index < focusable.length - 1 ? index + 1 : 0;
                if (nextIndex < focusable.length) {
                    e.preventDefault();
                    focusable[nextIndex].focus();
                }
            }
        }
    });
    
    console.log('♿ Mejoras de accesibilidad aplicadas');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🎙️ Inicializando Portfolio Herasi Silva...');
        
        // Core functionality
        createParticles();
        setupMobileMenu();
        setupSmoothScroll();
        setupTypingAnimation();
        setupGSAPAnimations();
        
        // Enhancements
        setupServiceCardEffects();
        setupFormEnhancements();
        setupVideoEffects();
        setupWhatsAppButton();
        
        // Optimizations and accessibility
        optimizePerformance();
        handleErrors();
        setupAccessibility();
        
        console.log('✅ Portfolio cargado exitosamente!');
        
    } catch (error) {
        console.error('❌ Error al inicializar el portfolio:', error);
    }
});

// Ensure particles are created after page load
window.addEventListener('load', () => {
    // Double check particles are created
    if (!particlesCreated) {
        createParticles();
    }
});

// Intersection Observer for better performance
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.portfolio-item, .service-card, .about-text, .about-skills').forEach(el => {
        observer.observe(el);
    });
    
    console.log('👁️ Intersection Observer configurado');
}

// Mobile specific optimizations
function setupMobileOptimizations() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Reduce animation complexity on mobile
        gsap.globalTimeline.timeScale(0.8);
        
        // Optimize touch events
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        
        // Optimize scroll for mobile
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        }
        
        function updateScrollElements() {
            // Update scroll-dependent elements
            ticking = false;
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        console.log('📱 Optimizaciones móviles aplicadas');
    }
}

// Fix for sections not showing properly
function fixSectionVisibility() {
    // Ensure all sections are properly visible
    const sections = ['#portafolio', '#servicios', '#contacto', 'footer'];
    
    sections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            // Force visibility and proper stacking
            section.style.position = 'relative';
            section.style.zIndex = '10';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
            
            // Clear any problematic transforms
            gsap.set(section, {clearProps: "all"});
        }
    });
    
    // Refresh ScrollTrigger after fixing sections
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
    
    console.log('🔧 Visibilidad de secciones corregida');
}

// Debug function to check what's blocking the sections
function debugSections() {
    const sections = ['#inicio', '#quien-soy', '#portafolio', '#servicios', '#contacto', 'footer'];
    
    sections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            const rect = section.getBoundingClientRect();
            console.log(`${selector}:`, {
                visible: rect.height > 0,
                position: getComputedStyle(section).position,
                zIndex: getComputedStyle(section).zIndex,
                opacity: getComputedStyle(section).opacity,
                display: getComputedStyle(section).display
            });
        }
    });
}

// Service worker registration (optional, for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize mobile optimizations and fixes
document.addEventListener('DOMContentLoaded', () => {
    setupIntersectionObserver();
    setupMobileOptimizations();
    fixSectionVisibility(); // Nueva función para corregir visibilidad
    
    // Debug sections if needed (remove in production)
    setTimeout(() => {
        debugSections();
    }, 1000);
});