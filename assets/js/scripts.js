const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const yearEl = document.getElementById('year');
const motionToggles = Array.from(document.querySelectorAll('.motion-toggle'));
const consentBanner = document.querySelector('.consent-banner');
const analyticsTemplate = document.querySelector('script[data-analytics-template]');

const relayEmailTokenSegments = ['b21v', 'bHVh', 'Ymlw', 'M2Fr', 'QGdt', 'YWls', 'LmNv', 'bQ=='];
const relayEmailToken = relayEmailTokenSegments.join('');
const displayEmailAddress = 'hello@etl-gis.com';

const decodeEmailToken = (token) => {
    if (!token || typeof atob !== 'function') {
        return '';
    }
    try {
        return atob(token);
    } catch (error) {
        console.warn('Unable to decode relay email token.', error);
        return '';
    }
};

const resolvedRelayEmail = decodeEmailToken(relayEmailToken);

const extractMailtoQuery = (href) => {
    if (!href) {
        return '';
    }
    const queryIndex = href.indexOf('?');
    if (queryIndex === -1) {
        return '';
    }
    return href.slice(queryIndex + 1);
};

const applyEmailRelayToLinks = () => {
    if (!resolvedRelayEmail) {
        return;
    }

    document.querySelectorAll('[data-relay-email]').forEach((link) => {
        const query = extractMailtoQuery(link.getAttribute('href'));
        const paramString = query ? new URLSearchParams(query).toString() : '';

        link.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = paramString
                ? `mailto:${resolvedRelayEmail}?${paramString}`
                : `mailto:${resolvedRelayEmail}`;
            window.location.href = destination;
        });
    });
};

applyEmailRelayToLinks();

let lastFocusedBeforeMenu = null;
let focusTrapHandler = null;

const focusableSelectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

const isToggleVisible = () => {
    if (!navToggle) return false;
    return window.getComputedStyle(navToggle).display !== 'none';
};

const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    navLinks.setAttribute('aria-hidden', 'true');
    if (focusTrapHandler) {
        navLinks.removeEventListener('keydown', focusTrapHandler);
        focusTrapHandler = null;
    }
    if (restoreFocus && lastFocusedBeforeMenu) {
        lastFocusedBeforeMenu.focus();
    }
};

const openMenu = () => {
    if (!navToggle || !navLinks) return;
    lastFocusedBeforeMenu = document.activeElement;
    navToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    navLinks.setAttribute('aria-hidden', 'false');

    const focusableItems = Array.from(navLinks.querySelectorAll(focusableSelectors));
    if (focusableItems.length) {
        const [firstItem] = focusableItems;
        const lastItem = focusableItems[focusableItems.length - 1];
        focusTrapHandler = (event) => {
            if (event.key !== 'Tab') return;
            if (event.shiftKey && document.activeElement === firstItem) {
                event.preventDefault();
                lastItem.focus();
            } else if (!event.shiftKey && document.activeElement === lastItem) {
                event.preventDefault();
                firstItem.focus();
            }
        };
        navLinks.addEventListener('keydown', focusTrapHandler);
        firstItem.focus();
    }
};

const syncMenuForViewport = () => {
    if (!navLinks) return;
    if (!navToggle || !isToggleVisible()) {
        navLinks.classList.remove('open');
        navLinks.removeAttribute('aria-hidden');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
        if (focusTrapHandler) {
            navLinks.removeEventListener('keydown', focusTrapHandler);
            focusTrapHandler = null;
        }
        return;
    }

    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navLinks.classList.toggle('open', expanded);
    navLinks.setAttribute('aria-hidden', expanded ? 'false' : 'true');
};

const toggleNav = () => {
    if (!navToggle) return;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
        closeMenu();
    } else {
        openMenu();
    }
};

syncMenuForViewport();

if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
    navToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (isToggleVisible()) {
                closeMenu({ restoreFocus: false });
            }
        });
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
    }
});

window.addEventListener('resize', syncMenuForViewport);

const updateBackToTop = () => {
    if (!backToTop) return;
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
};

window.addEventListener('scroll', updateBackToTop);
updateBackToTop();

if (backToTop) {
    backToTop.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

const applyMotionPreference = (preference) => {
    const reduced = preference === 'reduced';
    document.body.dataset.motion = reduced ? 'reduced' : 'animated';
    motionToggles.forEach((toggle) => {
        toggle.setAttribute('aria-pressed', reduced ? 'true' : 'false');
        toggle.textContent = reduced ? 'Enable motion' : 'Reduce motion';
    });
};

const motionPreferenceMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
const storedMotionPreference = localStorage.getItem('motion-preference');
const prefersReduced = motionPreferenceMedia.matches;
const initialPreference = storedMotionPreference || (prefersReduced ? 'reduced' : 'animated');
applyMotionPreference(initialPreference);

motionToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const current = document.body.dataset.motion === 'reduced' ? 'reduced' : 'animated';
        const next = current === 'reduced' ? 'animated' : 'reduced';
        localStorage.setItem('motion-preference', next);
        applyMotionPreference(next);
    });
});

if (!storedMotionPreference) {
    motionPreferenceMedia.addEventListener('change', (event) => {
        applyMotionPreference(event.matches ? 'reduced' : 'animated');
    });
}

const contactForm = document.getElementById('contact-form');
const formResponse = document.querySelector('.form-response');
const formEndpoint = resolvedRelayEmail
    ? `https://formsubmit.co/ajax/${resolvedRelayEmail}`
    : `https://formsubmit.co/ajax/${displayEmailAddress}`;

if (contactForm && formResponse) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            formResponse.textContent = 'Please complete all required fields before submitting.';
            formResponse.style.color = '#f9a620';
            return;
        }

        formResponse.textContent = 'Submitting your inquiry securely…';
        formResponse.style.color = '#1a4d8f';

        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(formEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            formResponse.textContent = `Thanks${payload['full-name'] ? `, ${payload['full-name']}` : ''}! Our team has received your details and will respond within one business day.`;
            formResponse.style.color = '#1a4d8f';
            contactForm.reset();
        } catch (error) {
            formResponse.textContent = `We were unable to submit your request automatically. Please email ${displayEmailAddress} or call +1 (863) 261-3103.`;
            formResponse.style.color = '#d9423a';
        }
    });
}

const loadAnalytics = () => {
    if (!analyticsTemplate || document.querySelector('script[data-analytics-loaded]')) {
        return;
    }
    const script = document.createElement('script');
    script.src = analyticsTemplate.getAttribute('data-src');
    script.defer = true;
    script.setAttribute('data-domain', analyticsTemplate.getAttribute('data-domain'));
    script.setAttribute('data-analytics-loaded', 'true');
    document.head.appendChild(script);
};

const acknowledgeConsent = () => {
    localStorage.setItem('analytics-consent', 'granted');
    loadAnalytics();
    if (consentBanner) {
        consentBanner.classList.remove('visible');
    }
};

if (consentBanner) {
    const storedConsent = localStorage.getItem('analytics-consent');
    if (storedConsent === 'granted') {
        loadAnalytics();
    } else {
        requestAnimationFrame(() => {
            consentBanner.classList.add('visible');
        });
    }

    const consentButton = consentBanner.querySelector('button');
    if (consentButton) {
        consentButton.addEventListener('click', acknowledgeConsent);
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && consentBanner?.classList.contains('visible')) {
        consentBanner.classList.remove('visible');
    }
});

const mapContainer = document.getElementById('office-map');

if (mapContainer && typeof L !== 'undefined') {
    const map = L.map(mapContainer, {
        scrollWheelZoom: false,
        maxZoom: 16,
    }).setView([27.2731, -80.3582], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const hubs = [
        {
            coordinates: [35.2271, -80.8431],
            title: 'Charlotte, North Carolina',
            description: 'Mobility analytics, utility network strategy, and executive briefings.',
        },
        {
            coordinates: [27.2731, -80.3582],
            title: 'Port St. Lucie, Florida',
            description: 'City and county GIS modernization, public safety dashboards, and data governance.',
        },
        {
            coordinates: [38.9072, -77.0369],
            title: 'Washington, D.C.',
            description: 'Federal agency spatial governance, security alignment, and mission analytics.',
        },
    ];

    hubs.forEach(({ coordinates, title, description }) => {
        L.marker(coordinates)
            .addTo(map)
            .bindPopup(`<strong>${title}</strong><br>${description}`);
    });
}
