// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables
let isMenuOpen = false;
let typingInterval;

// Particle System
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    // Clear existing particles
    container.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(particle);
        
        // Animate particle with GSAP
        gsap.to(particle, {
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            opacity: Math.random() * 0.8 + 0.2,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }
}

// Mobile Menu Functionality - CORREGIDO
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenu || !navMenu) return;
    
    // Toggle mobile menu
    mobileMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            navMenu.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
        } else {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking on a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                isMenuOpen = false;
            }
        });
    });
    
    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
}

// Smooth Scrolling for Navigation
function setupSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (isMenuOpen) {
                    const navMenu = document.getElementById('nav-menu');
                    const mobileMenu = document.getElementById('mobile-menu');
                    navMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    isMenuOpen = false;
                }
            }
        });
    });
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

    // Navbar hide/show on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            gsap.to(navbar, {duration: 0.3, y: -100, ease: "power2.out"});
        } else {
            // Scrolling up
            gsap.to(navbar, {duration: 0.3, y: 0, ease: "power2.out"});
        }
        
        lastScrollY = currentScrollY;
    });

    // About Section Animations
    ScrollTrigger.create({
        trigger: '#quien-soy',
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => {
            gsap.from('.about-text', {
                duration: 1,
                x: -100,
                opacity: 0,
                ease: "power2.out"
            });
            
            gsap.from('.about-skills', {
                duration: 1,
                x: 100,
                opacity: 0,
                ease: "power2.out"
            });
        }
    });

    // Skill Bars Animation
    gsap.utils.toArray('.skill-bar').forEach((bar, index) => {
        const widths = ['95%', '90%', '88%'];
        
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(bar, {
                    width: widths[index],
                    duration: 1.5,
                    ease: "power2.out",
                    delay: index * 0.2
                });
            }
        });
    });

    // Portfolio Items Animation
    gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 80%',
            onEnter: () => {
                gsap.from(item, {
                    duration: 0.8,
                    y: 80,
                    opacity: 0,
                    delay: index * 0.2,
                    ease: "power2.out"
                });
            }
        });
    });

    // Services Cards Animation
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.from(card, {
                    duration: 0.8,
                    y: 60,
                    opacity: 0,
                    delay: index * 0.1,
                    ease: "power2.out"
                });
            }
        });
    });

    // Contact Form Animation
    ScrollTrigger.create({
        trigger: '#contacto',
        start: 'top 70%',
        onEnter: () => {
            gsap.from('.form-group', {
                duration: 0.6,
                y: 40,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    });

    // Social Links Animation
    ScrollTrigger.create({
        trigger: 'footer',
        start: 'top 80%',
        onEnter: () => {
            gsap.from('.social-link', {
                duration: 0.6,
                scale: 0,
                rotation: 180,
                stagger: 0.1,
                ease: "back.out(1.7)"
            });
        }
    });
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
}

// Form Enhancements
function setupFormEnhancements() {
    const form = document.querySelector('form');
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

        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Add loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        button.disabled = true;
        button.classList.add('loading');
        
        // Note: In a real implementation, you would handle the actual form submission here
        // For this demo, we'll simulate the process
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check mr-2"></i>¡Mensaje Enviado!';
            button.classList.remove('loading');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                // form.reset(); // Uncomment this line in production
            }, 2000);
        }, 2000);
    });
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
}

// Custom Cursor Effect (Desktop only)
function setupCustomCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile
    
    const cursor = document.createElement('div');
    cursor.className = 'fixed w-4 h-4 bg-blue-400 rounded-full pointer-events-none z-50 mix-blend-difference opacity-0';
    cursor.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    // Smooth cursor animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX - 8 + 'px';
        cursor.style.top = cursorY - 8 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    document.querySelectorAll('a, button, .service-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                duration: 0.2,
                scale: 2,
                opacity: 0.8
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                duration: 0.2,
                scale: 1,
                opacity: 1
            });
        });
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
}

// Parallax Effect
function setupParallax() {
    gsap.utils.toArray('.hero-image').forEach(element => {
        gsap.to(element, {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });
}

// Performance optimizations
function optimizePerformance() {
    // Lazy load videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('loading', 'lazy');
    });
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
            createParticles(); // Recreate particles for new screen size
        }, 250);
    });
}

// Error handling
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
    });
    
    // Handle promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
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
    
    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            const navMenu = document.getElementById('nav-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
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
        setupCustomCursor();
        setupParallax();
        
        // Optimizations and accessibility
        optimizePerformance();
        handleErrors();
        setupAccessibility();
        
        console.log('✅ Portfolio cargado exitosamente!');
        
    } catch (error) {
        console.error('❌ Error al inicializar el portfolio:', error);
    }
});

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
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Add loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        button.disabled = true;
        button.classList.add('loading');
        
        // Note: In a real implementation, you would handle the actual form submission here
        // For this demo, we'll simulate the process
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check mr-2"></i>¡Mensaje Enviado!';
            button.classList.remove('loading');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                // form.reset(); // Uncomment this line in production
            }, 2000);
        }, 2000);
    });
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
}

// Custom Cursor Effect (Desktop only)
function setupCustomCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile
    
    const cursor = document.createElement('div');
    cursor.className = 'fixed w-4 h-4 bg-blue-400 rounded-full pointer-events-none z-50 mix-blend-difference opacity-0';
    cursor.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    // Smooth cursor animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX - 8 + 'px';
        cursor.style.top = cursorY - 8 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    document.querySelectorAll('a, button, .service-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                duration: 0.2,
                scale: 2,
                opacity: 0.8
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                duration: 0.2,
                scale: 1,
                opacity: 1
            });
        });
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
}

// Parallax Effect
function setupParallax() {
    gsap.utils.toArray('.hero-image').forEach(element => {
        gsap.to(element, {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });
}

// Performance optimizations
function optimizePerformance() {
    // Lazy load videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('loading', 'lazy');
    });
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
            createParticles(); // Recreate particles for new screen size
        }, 250);
    });
}

// Error handling
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
    });
    
    // Handle promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
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
    
    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            const navMenu = document.getElementById('nav-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
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
        setupCustomCursor();
        setupParallax();
        
        // Optimizations and accessibility
        optimizePerformance();
        handleErrors();
        setupAccessibility();
        
        console.log('✅ Portfolio cargado exitosamente!');
        
    } catch (error) {
        console.error('❌ Error al inicializar el portfolio:', error);
    }
});

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
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Add loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        button.disabled = true;
        button.classList.add('loading');
        
        // Note: In a real implementation, you would handle the actual form submission here
        // For this demo, we'll simulate the process
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check mr-2"></i>¡Mensaje Enviado!';
            button.classList.remove('loading');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                // form.reset(); // Uncomment this line in production
            }, 2000);
        }, 2000);
    });
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
}

// Custom Cursor Effect (Desktop only)
function setupCustomCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile
    
    const cursor = document.createElement('div');
    cursor.className = 'fixed w-4 h-4 bg-blue-400 rounded-full pointer-events-none z-50 mix-blend-difference opacity-0';
    cursor.style.transition = 'opacity 0.3s ease