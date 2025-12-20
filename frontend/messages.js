// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active') ? 'true' : 'false');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// API Base URL
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
}

const API_BASE_URL = getApiBaseUrl();
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initPageAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    gsap.defaults({ ease: 'power3.out', duration: 0.8 });

    gsap.from('.navbar', { y: -18, autoAlpha: 0, duration: 0.7, ease: 'power2.out' });
    gsap.from('.nav-menu li', { y: -10, autoAlpha: 0, stagger: 0.06, duration: 0.55, delay: 0.1, ease: 'power2.out' });

    const tl = gsap.timeline({ delay: 0.05 });
    tl
        .from('.page-title', { y: 22, autoAlpha: 0, filter: 'blur(10px)', duration: 0.7, ease: 'power2.out' })
        .from('.messages-subtitle', { y: 14, autoAlpha: 0, filter: 'blur(10px)', duration: 0.6 }, '-=0.35')
        .from('#refresh-btn', { y: 14, autoAlpha: 0, scale: 0.96, duration: 0.6 }, '-=0.35');

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            if (!icon) return;
            gsap.fromTo(icon, { rotate: 0 }, { rotate: 360, duration: 0.7, ease: 'power2.inOut' });
        });
    }
}

// Load messages from API
async function loadMessages() {
    const loading = document.getElementById('loading');
    const messagesContainer = document.getElementById('messages-container');
    const noMessages = document.getElementById('no-messages');

    if (!loading || !messagesContainer || !noMessages) {
        console.error('Required elements not found');
        return;
    }

    try {
        console.log('Fetching messages from:', `${API_BASE_URL}/messages`);
        loading.style.display = 'block';
        messagesContainer.innerHTML = '';
        noMessages.style.display = 'none';

        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const messages = await response.json();
        console.log('Received messages:', messages);
        console.log('Messages type:', Array.isArray(messages) ? 'Array' : typeof messages);
        console.log('Messages count:', Array.isArray(messages) ? messages.length : 'N/A');

        loading.style.display = 'none';

        if (!Array.isArray(messages)) {
            console.error('Invalid response format. Expected array, got:', typeof messages);
            throw new Error('Invalid response format - expected array');
        }

        if (messages.length === 0) {
            console.log('No messages found in database');
            noMessages.style.display = 'block';
            return;
        }

        // Clear container before adding new messages
        messagesContainer.innerHTML = '';

        let validMessages = 0;
        messages.forEach((message, index) => {
            console.log(`Processing message ${index + 1}:`, message);
            if (message && message._id) {
                const messageCard = createMessageCard(message);
                messagesContainer.appendChild(messageCard);
                validMessages++;
            } else {
                console.warn('Invalid message format:', message);
            }
        });

        console.log(`Successfully created ${validMessages} message cards`);

        // Animate cards if GSAP is available
        if (!prefersReducedMotion && typeof gsap !== 'undefined') {
            gsap.from('.message-card', {
                duration: 0.7,
                y: 28,
                opacity: 0,
                rotateX: 8,
                transformPerspective: 800,
                filter: 'blur(10px)',
                stagger: 0.08,
                ease: 'power3.out',
                onComplete: () => gsap.set('.message-card', { clearProps: 'filter' })
            });
        }

        console.log(`Loaded ${validMessages} messages successfully`);

    } catch (error) {
        console.error('Error loading messages:', error);
        loading.style.display = 'none';
        messagesContainer.innerHTML = `
            <div class="form-message error" style="display: block; margin: 2rem 0;">
                <p><strong>Error loading messages:</strong> ${error.message}</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Please make sure:</p>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; font-size: 0.9rem;">
                    <li>The backend server is running on http://localhost:5000</li>
                    <li>MongoDB is connected and running</li>
                    <li>There are no CORS issues</li>
                </ul>
            </div>
        `;
    }
}

// Create message card element
function createMessageCard(message) {
    console.log('Creating card for message:', message);
    
    const card = document.createElement('div');
    card.className = 'message-card';
    card.setAttribute('data-id', message._id || message.id);

    // Handle date formatting
    let dateStr = 'Date not available';
    if (message.createdAt) {
        try {
            const date = new Date(message.createdAt);
            if (!isNaN(date.getTime())) {
                dateStr = date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch (e) {
            console.warn('Error formatting date:', e);
        }
    }

    // Ensure all fields have values
    const name = message.name || 'Unknown';
    const email = message.email || 'No email';
    const subject = message.subject || 'No subject';
    const messageText = message.message || 'No message';

    card.innerHTML = `
        <div class="message-header">
            <div class="message-info">
                <h3>${escapeHtml(name)}</h3>
                <p>${escapeHtml(email)}</p>
            </div>
            <div class="message-date">${dateStr}</div>
        </div>
        <div class="message-subject">${escapeHtml(subject)}</div>
        <div class="message-body">${escapeHtml(messageText)}</div>
        <div class="message-actions">
            <button class="btn-delete" onclick="deleteMessage('${message._id || message.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    return card;
}

// Make deleteMessage globally accessible
window.deleteMessage = async function(messageId) {
    if (!messageId) {
        console.error('Message ID is required');
        return;
    }

    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to delete message');
        }

        // Remove card with animation
        const card = document.querySelector(`[data-id="${messageId}"]`);
        if (card) {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    duration: 0.3,
                    opacity: 0,
                    y: -20,
                    ease: 'power2.in',
                    onComplete: () => {
                        card.remove();
                        checkNoMessages();
                    }
                });
            } else {
                card.remove();
                checkNoMessages();
            }
        } else {
            // If card not found, reload messages
            loadMessages();
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        alert(`Failed to delete message: ${error.message}`);
    }
}

// Check if no messages are left
function checkNoMessages() {
    const remainingMessages = document.querySelectorAll('.message-card');
    const noMessages = document.getElementById('no-messages');
    if (remainingMessages.length === 0 && noMessages) {
        noMessages.style.display = 'block';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (text == null || text === undefined) {
        return '';
    }
    const textStr = String(text);
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return textStr.replace(/[&<>"']/g, m => map[m]);
}

// Load messages on page load
document.addEventListener('DOMContentLoaded', () => {
    applyPortfolioConfig();
    initPageAnimations();
    
    // Load messages immediately
    loadMessages();
    
    // Setup refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            console.log('Refresh button clicked');
            loadMessages();
        });
    } else {
        console.error('Refresh button not found');
    }
});

