const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const yearEl = document.getElementById('year');
const motionToggles = Array.from(document.querySelectorAll('.motion-toggle'));
const consentBanner = document.querySelector('.consent-banner');
const analyticsTemplate = document.querySelector('script[data-analytics-template]');
const metricElements = Array.from(document.querySelectorAll('.metric[data-count-to]'));
let metricObserver = null;
const metricFormatters = new WeakMap();

const relayEmailTokenSegments = ['ZXRs', 'Z2lz', 'Y29u', 'c3Vs', 'dGlu', 'Z0Bn', 'bWFp', 'bC5j', 'b20='];
const relayEmailToken = relayEmailTokenSegments.join('');
const relayPhoneTokenSegments = ['KzE4', 'NjMy', 'NjEz', 'MTAz'];
const relayPhoneToken = relayPhoneTokenSegments.join('');
const displayEmailAddress = 'etlgisconsulting@gmail.com';
const displayPhoneNumber = '+1 (888) 555-0149';
const displayPhoneHref = 'tel:+18885550149';

const decodeToken = (token) => {
    if (!token || typeof atob !== 'function') {
        return '';
    }
    try {
        return atob(token);
    } catch (error) {
        console.warn('Unable to decode relay token.', error);
        return '';
    }
};

const resolvedRelayEmail = decodeToken(relayEmailToken);
const resolvedRelayPhone = decodeToken(relayPhoneToken);

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

const applyPhoneRelayToLinks = () => {
    if (!resolvedRelayPhone) {
        return;
    }

    document.querySelectorAll('[data-relay-phone]').forEach((link) => {
        link.setAttribute('href', displayPhoneHref);

        link.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = `tel:${resolvedRelayPhone}`;
            window.location.href = destination;
        });
    });
};

applyPhoneRelayToLinks();

const metricEaseOut = (t) => 1 - Math.pow(1 - t, 3);

const getMetricFormattingConfig = (metric) => {
    if (metricFormatters.has(metric)) {
        return metricFormatters.get(metric);
    }

    const decimalsAttr = metric.getAttribute('data-decimals');
    const decimalsRaw = Number(decimalsAttr);
    const decimals = Number.isFinite(decimalsRaw) ? Math.max(0, decimalsRaw) : 0;
    const locale = metric.getAttribute('data-locale') || 'en-US';
    const notation = metric.getAttribute('data-format') === 'compact' ? 'compact' : 'standard';
    const prefix = metric.getAttribute('data-prefix') || '';
    const suffix = metric.getAttribute('data-suffix') || '';

    const formatter = new Intl.NumberFormat(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
        notation,
    });

    const config = { formatter, prefix, suffix };
    metricFormatters.set(metric, config);
    return config;
};

const setMetricDisplayValue = (metric, value) => {
    const valueElement = metric.querySelector('.metric-value');
    if (!valueElement) {
        return;
    }

    const { formatter, prefix, suffix } = getMetricFormattingConfig(metric);
    const safeValue = Number.isFinite(value) ? value : 0;
    valueElement.textContent = `${prefix}${formatter.format(safeValue)}${suffix}`;
};

const animateMetric = (metric) => {
    const targetValue = Number(metric.getAttribute('data-count-to'));
    if (!Number.isFinite(targetValue) || targetValue <= 0) {
        setMetricDisplayValue(metric, targetValue || 0);
        metric.dataset.metricAnimated = 'true';
        return;
    }

    const duration = 1800;
    let startTime = null;

    const step = (timestamp) => {
        if (!startTime) {
            startTime = timestamp;
        }
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = metricEaseOut(progress);
        setMetricDisplayValue(metric, targetValue * eased);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            setMetricDisplayValue(metric, targetValue);
            metric.dataset.metricAnimated = 'true';
        }
    };

    requestAnimationFrame(step);
};

const initializeMetricAnimations = (reduceMotion) => {
    if (!metricElements.length) {
        return;
    }

    if (metricObserver) {
        metricObserver.disconnect();
        metricObserver = null;
    }

    if (reduceMotion) {
        metricElements.forEach((metric) => {
            if (!metric.dataset.metricAnimated) {
                metric.dataset.metricAnimated = 'false';
            }
            const targetValue = Number(metric.getAttribute('data-count-to')) || 0;
            setMetricDisplayValue(metric, targetValue);
            metric.dataset.metricAnimated = 'true';
        });
        return;
    }

    metricElements.forEach((metric) => {
        metric.dataset.metricAnimated = 'false';
        setMetricDisplayValue(metric, 0);
    });

    metricObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            const metric = entry.target;
            observer.unobserve(metric);
            if (metric.dataset.metricAnimated === 'true') {
                return;
            }
            animateMetric(metric);
        });
    }, { threshold: 0.4 });

    metricElements.forEach((metric) => {
        metricObserver.observe(metric);
    });
};

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
initializeMetricAnimations(initialPreference === 'reduced');

motionToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const current = document.body.dataset.motion === 'reduced' ? 'reduced' : 'animated';
        const next = current === 'reduced' ? 'animated' : 'reduced';
        localStorage.setItem('motion-preference', next);
        applyMotionPreference(next);
        initializeMetricAnimations(next === 'reduced');
    });
});

if (!storedMotionPreference) {
    motionPreferenceMedia.addEventListener('change', (event) => {
        applyMotionPreference(event.matches ? 'reduced' : 'animated');
        initializeMetricAnimations(event.matches);
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
            formResponse.style.color = '#e38b17';
            return;
        }

        formResponse.textContent = 'Submitting your inquiry securely…';
        formResponse.style.color = '#0f7ae5';

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
            formResponse.style.color = '#0f7ae5';
            contactForm.reset();
        } catch (error) {
            formResponse.textContent = `We were unable to submit your request automatically. Please email ${displayEmailAddress} or call ${displayPhoneNumber}.`;
            formResponse.style.color = '#d9423a';
        }
    });
}

const playbookForm = document.getElementById('playbook-form');
const playbookMessage = playbookForm ? playbookForm.querySelector('.playbook-message') : document.querySelector('.playbook-message');
const playbookDownloads = document.querySelector('.playbook-downloads');
const playbookAccessKey = 'playbook-access-granted';

const revealPlaybookDownloads = () => {
    if (!playbookDownloads) {
        return;
    }
    playbookDownloads.hidden = false;
    playbookDownloads.classList.add('playbook-downloads--visible');
};

if (localStorage.getItem(playbookAccessKey) === 'true') {
    revealPlaybookDownloads();
    if (playbookMessage) {
        playbookMessage.textContent = 'Downloads ready—feel free to grab the playbooks again.';
        playbookMessage.style.color = '#0f7ae5';
    }
}

if (playbookForm) {
    playbookForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!playbookForm.checkValidity()) {
            if (playbookMessage) {
                playbookMessage.textContent = 'Please complete each required field and confirm consent to unlock the playbooks.';
                playbookMessage.style.color = '#e38b17';
            }
            return;
        }

        if (playbookMessage) {
            playbookMessage.textContent = 'Preparing your downloads…';
            playbookMessage.style.color = '#0f7ae5';
        }

        const formData = new FormData(playbookForm);
        const payload = Object.fromEntries(formData.entries());
        payload._subject = 'ETL GIS Playbook Request';
        payload._template = 'table';

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

            if (playbookMessage) {
                playbookMessage.textContent = 'Playbooks unlocked! Downloads are ready and a copy is on the way to your inbox.';
                playbookMessage.style.color = '#0f7ae5';
            }
            localStorage.setItem(playbookAccessKey, 'true');
            revealPlaybookDownloads();
            playbookForm.reset();
        } catch (error) {
            if (playbookMessage) {
                playbookMessage.textContent = `We couldn’t submit automatically. Email ${displayEmailAddress} and we’ll send the playbooks manually.`;
                playbookMessage.style.color = '#d9423a';
            }
            revealPlaybookDownloads();
        }
    });
}

const caseModalOverlays = Array.from(document.querySelectorAll('[data-case-modal]'));
const caseModalTriggers = Array.from(document.querySelectorAll('[data-case-modal-trigger]'));
const caseModalCloseButtons = Array.from(document.querySelectorAll('[data-case-modal-close]'));
const modalFocusHandlers = new WeakMap();
let activeCaseModal = null;
let lastFocusedBeforeCaseModal = null;

const closeCaseModal = () => {
    if (!activeCaseModal) {
        return;
    }

    activeCaseModal.setAttribute('aria-hidden', 'true');
    const handler = modalFocusHandlers.get(activeCaseModal);
    if (handler) {
        activeCaseModal.removeEventListener('keydown', handler);
        modalFocusHandlers.delete(activeCaseModal);
    }
    document.body.classList.remove('modal-open');

    if (lastFocusedBeforeCaseModal && typeof lastFocusedBeforeCaseModal.focus === 'function') {
        lastFocusedBeforeCaseModal.focus({ preventScroll: true });
    }

    activeCaseModal = null;
    lastFocusedBeforeCaseModal = null;
};

const openCaseModal = (modal) => {
    if (!modal || activeCaseModal === modal) {
        return;
    }

    lastFocusedBeforeCaseModal = document.activeElement;
    activeCaseModal = modal;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const focusableElements = Array.from(modal.querySelectorAll(focusableSelectors));
    const focusTrapHandler = (event) => {
        if (event.key !== 'Tab' || focusableElements.length === 0) {
            return;
        }

        const [firstItem] = focusableElements;
        const lastItem = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
        }
    };

    modal.addEventListener('keydown', focusTrapHandler);
    modalFocusHandlers.set(modal, focusTrapHandler);

    if (focusableElements.length) {
        focusableElements[0].focus();
    } else {
        modal.focus({ preventScroll: true });
    }
};

const openCaseModalById = (modalId) => {
    const modal = caseModalOverlays.find((element) => element.id === modalId);
    if (!modal) {
        return;
    }
    openCaseModal(modal);
};

caseModalTriggers.forEach((trigger) => {
    const targetId = trigger.getAttribute('data-case-modal-trigger');
    trigger.addEventListener('click', () => openCaseModalById(targetId));
});

caseModalCloseButtons.forEach((button) => {
    button.addEventListener('click', () => closeCaseModal());
});

caseModalOverlays.forEach((modal) => {
    modal.setAttribute('aria-hidden', modal.getAttribute('aria-hidden') || 'true');
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeCaseModal();
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeCaseModal) {
        closeCaseModal();
    }
});

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

const navigationButton = document.querySelector('[data-navigate-port-st-lucie]');

if (navigationButton) {
    const destination = encodeURIComponent('Port St. Lucie, FL 34984');
    const defaultLabel = navigationButton.textContent;

    const openDirections = (origin) => {
        const originParam = origin ? `&origin=${origin}` : '';
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}${originParam}`;
        window.open(url, '_blank', 'noopener');
    };

    const resetButton = () => {
        navigationButton.disabled = false;
        navigationButton.textContent = defaultLabel;
    };

    navigationButton.addEventListener('click', () => {
        navigationButton.disabled = true;
        navigationButton.textContent = 'Opening directions…';

        if (!('geolocation' in navigator)) {
            openDirections('');
            resetButton();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                openDirections(origin);
                resetButton();
            },
            () => {
                openDirections('');
                resetButton();
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
        );
    });
}
