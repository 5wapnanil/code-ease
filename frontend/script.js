// GSAP ScrollTrigger Registration
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getApiBaseUrl() {
    const configured = window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.apiBaseUrl;
    if (configured && typeof configured === 'string') return configured.replace(/\/$/, '');
    if (window.location && window.location.protocol === 'file:') return 'http://localhost:5000/api';
    return '/api';
}

function setLink(el, { href, text }) {
    if (!el) return;
    if (typeof href === 'string') el.href = href;
    if (typeof text === 'string') el.textContent = text;

    const isExternal = typeof href === 'string' && /^https?:\/\//i.test(href);
    if (isExternal) {
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
    }
}

function applyPortfolioConfig() {
    const cfg = window.PORTFOLIO_CONFIG;
    if (!cfg) return;

    if (cfg.site && typeof cfg.site.title === 'string') {
        document.title = cfg.site.title;
    }

    const navBrand = document.getElementById('nav-brand');
    if (navBrand && cfg.branding && typeof cfg.branding.logoText === 'string') {
        navBrand.textContent = cfg.branding.logoText;
    }

    const heroName = document.getElementById('hero-name');
    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');

    if (heroName && cfg.hero && typeof cfg.hero.name === 'string') heroName.textContent = cfg.hero.name;
    if (heroTitle && cfg.hero && typeof cfg.hero.role === 'string') heroTitle.textContent = cfg.hero.role;
    if (heroDescription && cfg.hero && typeof cfg.hero.tagline === 'string') heroDescription.textContent = cfg.hero.tagline;

    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');
    const contactLocation = document.getElementById('contact-location');

    if (cfg.contact) {
        if (contactEmail && typeof cfg.contact.email === 'string') {
            setLink(contactEmail, { href: `mailto:${cfg.contact.email}`, text: cfg.contact.email });
        }

        if (contactPhone && typeof cfg.contact.phone === 'string') {
            const telHref = `tel:${cfg.contact.phone.replace(/[^\d+]/g, '')}`;
            setLink(contactPhone, { href: telHref, text: cfg.contact.phone });
        }

        if (contactLocation && typeof cfg.contact.location === 'string') {
            contactLocation.textContent = cfg.contact.location;
        }
    }

    const footerText = document.getElementById('footer-text');
    if (footerText && cfg.branding && typeof cfg.branding.footerText === 'string') {
        footerText.textContent = cfg.branding.footerText;
    }

    const social = cfg.social || {};
    setLink(document.getElementById('social-github'), { href: social.github });
    setLink(document.getElementById('social-linkedin'), { href: social.linkedin });
    setLink(document.getElementById('social-twitter'), { href: social.twitter });
    setLink(document.getElementById('social-instagram'), { href: social.instagram });
    setLink(document.getElementById('social-facebook'), { href: social.facebook });

    const copyrightEl = document.getElementById('footer-copyright');
    if (copyrightEl && cfg.branding) {
        const year = cfg.branding.copyrightYear || new Date().getFullYear();
        const brand = cfg.branding.logoText || 'Portfolio';
        copyrightEl.textContent = `© ${year} ${brand}. All rights reserved.`;
    }

    renderProjects(cfg.projects);
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!Array.isArray(projects) || projects.length === 0) return;

    projects.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const image = document.createElement('div');
        image.className = 'project-image';
        const icon = document.createElement('i');
        icon.className = project && project.iconClass ? project.iconClass : 'fas fa-laptop-code';
        image.appendChild(icon);

        const content = document.createElement('div');
        content.className = 'project-content';

        const title = document.createElement('h3');
        title.textContent = (project && project.title) || 'Project';

        const desc = document.createElement('p');
        desc.textContent = (project && project.description) || '';

        const tech = document.createElement('div');
        tech.className = 'project-tech';
        if (project && Array.isArray(project.tech)) {
            project.tech.forEach((t) => {
                const span = document.createElement('span');
                span.textContent = t;
                tech.appendChild(span);
            });
        }

        const links = document.createElement('div');
        links.className = 'project-links';

        const github = document.createElement('a');
        github.className = 'project-link';
        setLink(github, { href: project && project.githubUrl ? project.githubUrl : '#' });
        github.innerHTML = '<i class="fab fa-github"></i> GitHub';

        const live = document.createElement('a');
        live.className = 'project-link';
        setLink(live, { href: project && project.liveUrl ? project.liveUrl : '#' });
        live.innerHTML = '<i class="fas fa-external-link-alt"></i> Live';

        links.appendChild(github);
        links.appendChild(live);

        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(tech);
        content.appendChild(links);

        card.appendChild(image);
        card.appendChild(content);
        grid.appendChild(card);
    });
}

applyPortfolioConfig();

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active') ? 'true' : 'false');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;

        if (href === '#home') {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: Math.max(0, Math.floor(targetTop)), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

if (!prefersReducedMotion) {
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });

    gsap.set(['.hero-text', '.hero-image', '.hero-buttons', '.about-image', '.about-text', '.stat-item', '.timeline-item', '.skill-item', '.project-card', '.contact-item', '.contact-form', '.footer-section'], {
        willChange: 'transform,opacity,filter'
    });

    gsap.from('.navbar', { y: -18, autoAlpha: 0, duration: 0.7, ease: 'power2.out' });
    gsap.from('.nav-menu li', { y: -10, autoAlpha: 0, stagger: 0.06, duration: 0.55, delay: 0.1, ease: 'power2.out' });

    const heroTl = gsap.timeline();
    heroTl
        .from('.hero-name', { y: 22, autoAlpha: 0, filter: 'blur(10px)', duration: 0.75, ease: 'power2.out' })
        .from('.hero-title', { y: 16, autoAlpha: 0, filter: 'blur(8px)', duration: 0.65 }, '-=0.45')
        .from('.hero-description', { y: 14, autoAlpha: 0, filter: 'blur(8px)', duration: 0.65 }, '-=0.45')
        .from('.hero-buttons .btn', { y: 14, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, '-=0.4')
        .from('.hero-avatar', { scale: 0.88, rotate: -6, autoAlpha: 0, duration: 0.75 }, '-=0.6')
        .from('.scroll-indicator', { y: 8, autoAlpha: 0, duration: 0.55 }, '-=0.35');

    gsap.to('.hero-avatar', { y: -10, duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to('.scroll-indicator i', { y: 6, duration: 1.2, ease: 'sine.inOut', repeat: -1, yoyo: true });

    gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.fromTo(title,
            { y: 24, autoAlpha: 0, filter: 'blur(10px)' },
            {
                y: 0,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 0.7,
                scrollTrigger: { trigger: title, start: 'top 86%', toggleActions: 'play none none reverse' }
            }
        );
    });

    gsap.fromTo('.about-image',
        { x: -28, autoAlpha: 0, filter: 'blur(10px)' },
        { x: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.85, scrollTrigger: { trigger: '.about', start: 'top 80%', toggleActions: 'play none none reverse' } }
    );

    gsap.fromTo('.about-text',
        { x: 28, autoAlpha: 0, filter: 'blur(10px)' },
        { x: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.85, delay: 0.05, scrollTrigger: { trigger: '.about', start: 'top 80%', toggleActions: 'play none none reverse' } }
    );

    ScrollTrigger.create({
        trigger: '.about-stats',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            const statNumbers = gsap.utils.toArray('.stat-item h3');
            statNumbers.forEach((el) => {
                const raw = (el.textContent || '').trim();
                const match = raw.match(/^(\d+)(.*)$/);
                if (!match) return;
                const target = Number(match[1]);
                const suffix = match[2] || '';
                const obj = { val: 0 };
                el.textContent = `0${suffix}`;
                gsap.to(obj, {
                    val: target,
                    duration: 1.1,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = `${Math.floor(obj.val)}${suffix}`;
                    }
                });
            });
        }
    });

    ScrollTrigger.batch('.stat-item', {
        start: 'top 88%',
        onEnter: (batch) => gsap.fromTo(batch,
            { y: 24, autoAlpha: 0, scale: 0.96, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)', stagger: 0.08, duration: 0.65 }
        ),
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0 })
    });

    ScrollTrigger.batch('.timeline-item', {
        start: 'top 88%',
        onEnter: (batch) => gsap.fromTo(batch,
            { y: 30, autoAlpha: 0, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.1, duration: 0.75 }
        ),
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0 })
    });

    ScrollTrigger.batch('.skill-item', {
        start: 'top 88%',
        onEnter: (batch) => gsap.fromTo(batch,
            { y: 26, autoAlpha: 0, scale: 0.95, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.7 }
        ),
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0 })
    });

    ScrollTrigger.batch('.project-card', {
        start: 'top 88%',
        onEnter: (batch) => gsap.fromTo(batch,
            { y: 32, autoAlpha: 0, rotateX: 8, transformPerspective: 800, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, rotateX: 0, filter: 'blur(0px)', stagger: 0.08, duration: 0.75 }
        ),
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0 })
    });

    gsap.fromTo('.contact-item',
        { y: 22, autoAlpha: 0, filter: 'blur(10px)' },
        { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.08, duration: 0.7, scrollTrigger: { trigger: '.contact-content', start: 'top 86%', toggleActions: 'play none none reverse' } }
    );

    gsap.fromTo('.contact-form',
        { y: 22, autoAlpha: 0, filter: 'blur(10px)' },
        { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.8, delay: 0.06, scrollTrigger: { trigger: '.contact-content', start: 'top 86%', toggleActions: 'play none none reverse' } }
    );

    ScrollTrigger.batch('.footer-section', {
        start: 'top 92%',
        onEnter: (batch) => gsap.fromTo(batch,
            { y: 18, autoAlpha: 0, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.08, duration: 0.6 }
        ),
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0 })
    });
}

// Contact Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = getApiBaseUrl();
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = contactForm?.querySelector('button[type="submit"]');

    if (!contactForm || !formMessage) {
        console.error('Contact form or message element not found');
        return;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values and trim whitespace
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !email || !subject || !message) {
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formMessage.textContent = 'Please enter a valid email address.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }

        // Disable submit button and show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        const formData = {
            name,
            email,
            subject,
            message
        };

        try {
            const response = await fetch(`${apiBaseUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            let data;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
            }

            if (response.ok) {
                formMessage.textContent = 'Message sent successfully! ✓';
                formMessage.className = 'form-message success';
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                // Handle error response
                const errorMsg = data?.error || data?.message || `Server error: ${response.status} ${response.statusText}`;
                formMessage.textContent = errorMsg;
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        } catch (error) {
            let errorMessage = 'Failed to submit contact form. ';
            
            if (error.message.includes('fetch')) {
                errorMessage += 'Cannot connect to server. Please make sure the backend server is running.';
            } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Please check your connection and server.';
            } else {
                errorMessage += error.message || 'Please try again later.';
            }
            
            formMessage.textContent = errorMessage;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Parallax effect for hero section
if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Skill items hover animation
if (!prefersReducedMotion) {
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });
}

// Project cards hover animation
if (!prefersReducedMotion) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                ease: 'power2.out'
            });
        });
    });
}

