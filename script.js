gsap.registerPlugin(ScrollTrigger);

let isMenuOpen = false;
let particlesCreated = false;

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    if (particlesCreated) return;
    particlesCreated = true;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;
    container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const type = Math.floor(Math.random() * 3) + 1;
        particle.className = `particle type${type}`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        container.appendChild(particle);

        gsap.set(particle, {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
        });

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
}

function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('#mobile-nav .nav-link');

    if (!toggleBtn || !mobileNav) return;

    function closeMenu() {
        gsap.to(mobileNav, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => mobileNav.classList.add('hidden')
        });
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = 'auto';
        isMenuOpen = false;
    }

    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            mobileNav.classList.remove('hidden');
            toggleBtn.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.setAttribute('aria-label', 'Cerrar menú');
            document.body.style.overflow = 'hidden';

            gsap.fromTo(mobileNav,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
            );
            gsap.fromTo(navLinks,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.1 }
            );
        } else {
            closeMenu();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => { if (isMenuOpen) closeMenu(); });
    });

    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            mobileNav.classList.add('hidden');
            toggleBtn.classList.remove('open');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const isMobile = window.innerWidth < 768;
                const offsetTop = targetElement.offsetTop - (isMobile ? 100 : 80);
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

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
            setTimeout(() => { isDeleting = true; typeWriter(); }, 2000);
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

function setupGSAPAnimations() {
    const heroTimeline = gsap.timeline();
    heroTimeline
        .from('.hero-text h1', { duration: 1.2, y: 100, opacity: 0, ease: "power3.out" })
        .from('.hero-text p', { duration: 1, y: 50, opacity: 0, ease: "power2.out" }, "-=0.5")
        .from('.pulse-button', { duration: 0.8, scale: 0, opacity: 0, ease: "back.out(1.7)" }, "-=0.3")
        .from('.hero-image', { duration: 1.5, scale: 0.5, opacity: 0, rotation: 180, ease: "power2.out" }, "-=1");

    // Navbar hide/show on scroll via clase CSS (sin GSAP por frame)
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) > 5) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
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
    }, { passive: true });

    ScrollTrigger.create({
        trigger: '#quien-soy',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.from('.about-text', { duration: 0.8, x: -50, opacity: 0, ease: "power2.out" });
            gsap.from('.about-skills', { duration: 0.8, x: 50, opacity: 0, ease: "power2.out", delay: 0.2 });
        }
    });

    gsap.utils.toArray('.skill-bar').forEach((bar, index) => {
        const widths = ['95%', '90%', '88%'];
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(bar, { width: widths[index], duration: 1.2, ease: "power2.out", delay: index * 0.15 });
            }
        });
    });

    ScrollTrigger.create({
        trigger: '#portafolio',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
                gsap.from(item, { duration: 0.6, y: 50, opacity: 0, delay: index * 0.1, ease: "power2.out" });
            });
        }
    });

    ScrollTrigger.create({
        trigger: '#servicios',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            gsap.utils.toArray('.service-card').forEach((card, index) => {
                gsap.from(card, { duration: 0.6, y: 40, opacity: 0, delay: index * 0.08, ease: "power2.out" });
            });
        }
    });

    ScrollTrigger.create({
        trigger: 'footer',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            gsap.from('.social-link', { duration: 0.5, scale: 0, rotation: 90, stagger: 0.08, ease: "back.out(1.7)" });
        }
    });
}

function setupServiceCardEffects() {
    gsap.utils.toArray('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { duration: 0.3, y: -10, scale: 1.02, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)', ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { duration: 0.3, y: 0, scale: 1, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)', ease: "power2.out" });
        });
    });
}

function setupVideoEffects() {
    document.querySelectorAll('video').forEach(video => {
        const container = video.closest('.video-container');
        if (container) {
            container.addEventListener('mouseenter', () => gsap.to(video, { duration: 0.3, scale: 1.05, ease: "power2.out" }));
            container.addEventListener('mouseleave', () => gsap.to(video, { duration: 0.3, scale: 1, ease: "power2.out" }));
        }
    });
}

function optimizePerformance() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
            const container = document.getElementById('particles-container');
            if (container && container.children.length === 0) {
                particlesCreated = false;
                createParticles();
            }
        }, 250);
    });
}

function setupAccessibility() {
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-2 rounded z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold: 0.1, rootMargin: '50px' });

    document.querySelectorAll('.portfolio-item, .service-card, .about-text, .about-skills').forEach(el => observer.observe(el));
}

function setupMobileOptimizations() {
    if (window.innerWidth < 768) {
        gsap.globalTimeline.timeScale(0.8);
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupMobileMenu();
    setupSmoothScroll();
    setupTypingAnimation();
    setupGSAPAnimations();
    setupServiceCardEffects();
    setupVideoEffects();
    optimizePerformance();
    setupAccessibility();
    setupIntersectionObserver();
    setupMobileOptimizations();
});

window.addEventListener('load', () => {
    if (!particlesCreated) createParticles();
});
