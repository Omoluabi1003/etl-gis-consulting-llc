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

const relayEmailTokenSegments = ['ZXRsZ2', 'lzY29u', 'c3VsdG', 'luZ0Bn', 'bWFpbC', '5jb20='];
const relayEmailToken = relayEmailTokenSegments.join('');
const displayEmailAddress = 'etlgisconsulting@gmail.com';

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

const partnerLogoPath = '/assets/images/7b1128b2-0e23-4d63-85c1-659301e3575c.jpeg';
const arklandedPropertyImagePaths = [
    '/assets/images/051e492f-e70a-4379-a2a2-4b116c39f0ee.jpeg',
    '/assets/images/25f9b81b-b546-49f8-8a2e-c498a03bc32a.jpeg',
    '/assets/images/219f9403-4567-4d7a-9faa-67b93e00f436.jpeg',
    '/assets/images/30fa0fe1-2e27-43bf-bb5d-5d749e794fda.jpeg',
    '/assets/images/6a520af7-f471-44e8-80e6-1b839f46142d.jpeg',
    '/assets/images/862a13cc-773e-46d6-a629-8d6254f5fb99.jpeg',
    '/assets/images/90470e2e-f875-4bfd-a778-94c18e9f2a00.jpeg',
    '/assets/images/ad505ff9-b1ea-4083-8e5a-4f8c77d6321d.jpeg',
    '/assets/images/c8711cfb-f114-494c-bf48-c864b4699c0d.jpeg',
    '/assets/images/c9a654bf-a281-4f3f-9316-42986448340e.jpeg',
    '/assets/images/e6c671e7-0bcd-4f5d-a742-0e4af085d147.jpeg',
    '/assets/images/f2017961-0211-43fd-b875-a7665db5bca0.jpeg',
    '/assets/images/fa2b2786-414c-4c1e-bbfa-8dd9d086b1c8.jpeg',
    '/assets/images/fb54a1e5-d0f6-4ec0-8b99-afedbeb1963e.jpeg',
    '/assets/images/IMG_2173.jpeg',
];
const partners = {
    'arklanded-properties-limited': {
        name: 'Arklanded Properties Limited',
        tagline: 'Trusted Real Estate Partner',
        location: 'Nigeria',
        ceo: 'John A. Olaitan',
        logo: partnerLogoPath,
        logoSquare: partnerLogoPath,
        ctaLabel: 'Explore Properties',
        sponsoredLabel: 'Sponsored',
        supportingLine: 'A Nigeria-based real estate firm led by John A. Olaitan',
        link: '#featured-partner-gallery',
        alt: 'Arklanded Properties Limited logo',
        propertyImages: arklandedPropertyImagePaths,
    },
};
const sponsoredProperties = {
    'arklanded-core-portfolio': {
        id: 'arklanded-core-portfolio',
        slug: 'arklanded-core-portfolio',
        title: 'Arklanded Property Gallery',
        partnerName: 'Arklanded Properties Limited',
        partnershipLabel: 'In partnership with Arklanded Properties Limited',
        location: 'Nigeria',
        sourcePdfUrl: '',
        galleryLabel: 'Arklanded available property thumbnails',
        category: 'featured-partner-properties',
        galleryImages: arklandedPropertyImagePaths,
    },
    'the-legacy-ibadan': {
        id: 'the-legacy-ibadan',
        slug: 'the-legacy-ibadan',
        title: 'THE LEGACY (Ibadan)',
        partnerName: 'MKH Properties',
        partnershipLabel: 'In partnership with Arklanded Properties Limited',
        location: 'Ibadan-Ijebu Ode Road Corridor, Oyo State',
        sourcePdfUrl: 'https://mkhproperties.com/wp-content/uploads/2026/03/The-Legacy-Brochure-1.pdf',
        galleryLabel: 'Legacy Brochure Gallery',
        category: 'partner-sponsored-property',
        galleryImages: [
            '/assets/js/5ec81a53-8e6d-4baf-9692-8cfe9dfc745d.jpeg',
            '/assets/js/669c4a54-9bf8-4850-b683-366bcc956fd2.jpeg',
            '/assets/js/68ee4b1f-bdaa-4ff3-acbd-90ad0aacb350.jpeg',
            '/assets/js/7b1db5ee-8489-4185-8d80-790fe3a064e3.jpeg',
        ],
    },
};

const resolveAvailableImages = async (paths) => {
    const candidates = Array.isArray(paths) ? paths : [];
    const checks = candidates.map((path) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(path);
        img.onerror = () => resolve('');
        img.src = path;
    }));
    const resolved = await Promise.all(checks);
    return resolved.filter(Boolean);
};

const createPartnerLogo = ({
    src,
    squareSrc,
    alt,
    mode,
    priority = false,
    className = '',
}) => {
    const logo = document.createElement('div');
    const isThumbnailMode = mode === 'thumbnail';
    const imageSrc = isThumbnailMode ? (squareSrc || src) : src;
    logo.className = `partner-logo partner-logo--${mode}${className ? ` ${className}` : ''}`;

    if (isThumbnailMode && !squareSrc) {
        logo.classList.add('partner-logo--fallback-square');
    }

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = alt;
    img.decoding = 'async';
    img.loading = priority ? 'eager' : 'lazy';
    img.width = isThumbnailMode ? 240 : 760;
    img.height = isThumbnailMode ? 240 : 160;

    img.addEventListener('error', () => {
        if (isThumbnailMode && squareSrc && img.src !== new URL(src, window.location.origin).toString()) {
            logo.classList.add('partner-logo--fallback-square');
            img.src = src;
            return;
        }
        logo.classList.add('partner-logo--image-failed');
        logo.textContent = alt;
    }, { once: true });

    logo.append(img);
    return logo;
};

const applyPartnerData = (rootNode, partner) => {
    rootNode.querySelectorAll('[data-partner-field]').forEach((fieldNode) => {
        const fieldName = fieldNode.dataset.partnerField;
        if (!fieldName || !Object.prototype.hasOwnProperty.call(partner, fieldName)) {
            return;
        }

        if (fieldNode.tagName === 'A' && fieldName === 'ctaLabel') {
            fieldNode.textContent = partner[fieldName];
            fieldNode.href = partner.link || '#';
            return;
        }

        fieldNode.textContent = partner[fieldName];
    });
};

const renderPartnerLogos = (rootNode, partner) => {
    rootNode.querySelectorAll('[data-partner-logo]').forEach((logoSlot) => {
        const mode = logoSlot.dataset.partnerLogo === 'thumbnail' ? 'thumbnail' : 'featured';
        const logo = createPartnerLogo({
            src: partner.logo,
            squareSrc: partner.logoSquare,
            alt: partner.alt,
            mode,
            priority: mode === 'featured',
        });

        logoSlot.replaceChildren(logo);
    });
};

const hydratePartnerPlacements = () => {
    document.querySelectorAll('[data-featured-partner], [data-ad-thumbnail]').forEach((placement) => {
        const partnerKey = placement.dataset.featuredPartner || placement.dataset.adThumbnail;
        if (!partnerKey || !partners[partnerKey]) {
            return;
        }

        const partner = partners[partnerKey];
        applyPartnerData(placement, partner);
        renderPartnerLogos(placement, partner);
    });
};

const hydrateSponsoredItems = () => {
    document.querySelectorAll('[data-sponsored-item]').forEach((itemNode) => {
        const sponsoredKey = itemNode.dataset.sponsoredItem;
        const sponsoredItem = sponsoredProperties[sponsoredKey];
        if (!sponsoredItem) {
            return;
        }

        const titleNode = itemNode.querySelector('.ad-thumbnail-title');
        if (titleNode) {
            titleNode.textContent = sponsoredItem.title;
        }

        const partnerLabelNode = itemNode.querySelector('.ad-thumbnail-partner-label');
        if (partnerLabelNode) {
            partnerLabelNode.textContent = sponsoredItem.partnershipLabel;
        }
    });
};

hydratePartnerPlacements();
hydrateSponsoredItems();

const renderSponsoredGallery = async (galleryKey) => {
    const sponsoredItem = sponsoredProperties[galleryKey];
    if (!sponsoredItem) {
        return;
    }

    const galleryRoot = document.querySelector(`[data-sponsored-gallery="${galleryKey}"]`);
    if (!galleryRoot) {
        return;
    }

    const previewImage = galleryRoot.querySelector('[data-partner-gallery-active-image]');
    const thumbnailTrack = galleryRoot.querySelector('.featured-partner-gallery-thumbnails');
    const fallbackMessage = galleryRoot.querySelector('[data-gallery-fallback-message]');
    const previousButton = galleryRoot.querySelector('[data-gallery-prev]');
    const nextButton = galleryRoot.querySelector('[data-gallery-next]');
    const previewTrigger = galleryRoot.querySelector('[data-gallery-preview-trigger]');
    const pdfLink = galleryRoot.querySelector('[data-gallery-pdf-link]');
    const galleryImages = await resolveAvailableImages(sponsoredItem.galleryImages);
    if (!previewImage || !thumbnailTrack) {
        return;
    }

    if (pdfLink instanceof HTMLAnchorElement && sponsoredItem.sourcePdfUrl) {
        pdfLink.href = sponsoredItem.sourcePdfUrl;
    }

    if (galleryImages.length === 0) {
        if (fallbackMessage) {
            fallbackMessage.hidden = false;
        }
        if (previousButton instanceof HTMLButtonElement) {
            previousButton.disabled = true;
        }
        if (nextButton instanceof HTMLButtonElement) {
            nextButton.disabled = true;
        }
        previewImage.removeAttribute('src');
        previewImage.alt = `${sponsoredItem.title} brochure preview unavailable`;
        thumbnailTrack.replaceChildren();
        console.warn(`[sponsored-gallery] No gallery images available for "${galleryKey}". Falling back to PDF-only mode.`);
    }

    let activeImageIndex = 0;

    const setActiveImage = (imagePath, imageIndex) => {
        previewImage.src = imagePath;
        previewImage.alt = `${sponsoredItem.title} media ${imageIndex + 1}`;
        activeImageIndex = imageIndex;

        thumbnailTrack.querySelectorAll('.featured-partner-gallery-thumbnail').forEach((thumbnailButton, currentIndex) => {
            const isCurrent = currentIndex === imageIndex;
            thumbnailButton.setAttribute('aria-current', isCurrent ? 'true' : 'false');
        });
    };

    thumbnailTrack.replaceChildren();
    galleryImages.forEach((imagePath, imageIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'featured-partner-gallery-thumbnail';
        button.setAttribute('role', 'listitem');
        button.setAttribute('aria-label', `View ${sponsoredItem.title} media ${imageIndex + 1}`);

        const image = document.createElement('img');
        image.src = imagePath;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';

        button.append(image);
        button.addEventListener('click', () => {
            setActiveImage(imagePath, imageIndex);
        });
        thumbnailTrack.append(button);
    });

    if (galleryImages.length > 0) {
        setActiveImage(galleryImages[0], 0);
    }

    const cycleImage = (direction) => {
        if (!galleryImages.length) {
            return;
        }
        const nextIndex = (activeImageIndex + direction + galleryImages.length) % galleryImages.length;
        setActiveImage(galleryImages[nextIndex], nextIndex);
    };

    if (previousButton instanceof HTMLButtonElement) {
        previousButton.addEventListener('click', () => cycleImage(-1));
    }

    if (nextButton instanceof HTMLButtonElement) {
        nextButton.addEventListener('click', () => cycleImage(1));
    }

    if (previewTrigger && galleryImages.length > 0) {
        const openPreview = () => {
            window.open(galleryImages[activeImageIndex], '_blank', 'noopener,noreferrer');
        };
        previewTrigger.addEventListener('click', openPreview);
        previewTrigger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPreview();
            }
        });
    }

    document.querySelectorAll(`[data-sponsored-gallery-trigger="${galleryKey}"]`).forEach((triggerNode) => {
        triggerNode.addEventListener('click', (event) => {
            event.preventDefault();
            galleryRoot.hidden = false;
            galleryRoot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            const firstThumb = thumbnailTrack.querySelector('.featured-partner-gallery-thumbnail');
            if (firstThumb instanceof HTMLButtonElement) {
                firstThumb.focus();
            }
        });
    });
};

renderSponsoredGallery('arklanded-core-portfolio');
renderSponsoredGallery('the-legacy-ibadan');

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

const buildTrackingPayload = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        pagePath: window.location.pathname,
        referrer: document.referrer || '',
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmTerm: params.get('utm_term') || '',
        utmContent: params.get('utm_content') || '',
    };
};

const updateHiddenTrackingFields = (form) => {
    if (!form) {
        return;
    }
    const tracking = buildTrackingPayload();
    Object.entries(tracking).forEach(([key, value]) => {
        const input = form.querySelector(`input[name="${key}"]`);
        if (input) {
            input.value = value;
        }
    });
};

const submitSecureForm = async ({ form, responseEl, endpoint, successMessage }) => {
    if (!form || !responseEl) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        updateHiddenTrackingFields(form);

        if (!form.checkValidity()) {
            responseEl.textContent = 'Please complete all required fields before submitting.';
            responseEl.style.color = '#e38b17';
            return;
        }

        responseEl.textContent = 'Submitting your request securely…';
        responseEl.style.color = '#0f7ae5';

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Network response was not ok');
            }

            responseEl.textContent = successMessage(data, payload);
            responseEl.style.color = '#0f7ae5';
            form.reset();
        } catch (error) {
            responseEl.textContent = error?.message || `We were unable to submit your request automatically. Please email ${displayEmailAddress}.`;
            responseEl.style.color = '#d9423a';
        }
    });
};

const contactForm = document.getElementById('contact-form');
const formResponse = document.querySelector('.form-response');

if (contactForm && formResponse) {
    submitSecureForm({
        form: contactForm,
        responseEl: formResponse,
        endpoint: '/api/consultation',
        successMessage: (data, payload) => {
            const name = payload['full-name'] ? `, ${payload['full-name']}` : '';
            const leadId = data?.leadId ? ` Your reference ID is ${data.leadId}.` : '';
            return `Thanks${name}! We received your request and will follow up within one business day.${leadId}`;
        },
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
    submitSecureForm({
        form: playbookForm,
        responseEl: playbookMessage,
        endpoint: '/api/playbook',
        successMessage: (data) => {
            localStorage.setItem(playbookAccessKey, 'true');
            revealPlaybookDownloads();
            const leadId = data?.leadId ? ` Reference ID ${data.leadId}.` : '';
            return `Playbooks unlocked! Downloads are ready and a copy has been emailed.${leadId}`;
        },
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

const setAnalyticsConsent = (status) => {
    localStorage.setItem('analytics-consent', status);
    localStorage.setItem('analytics-consent-ts', new Date().toISOString());
    if (status === 'granted') {
        loadAnalytics();
    }
    if (consentBanner) {
        consentBanner.classList.remove('visible');
    }
};

if (consentBanner) {
    const storedConsent = localStorage.getItem('analytics-consent');
    if (storedConsent === 'granted') {
        loadAnalytics();
    } else if (storedConsent !== 'denied') {
        requestAnimationFrame(() => {
            consentBanner.classList.add('visible');
        });
    }

    const acceptButton = consentBanner.querySelector('[data-consent-accept]');
    const declineButton = consentBanner.querySelector('[data-consent-decline]');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => setAnalyticsConsent('granted'));
    }
    if (declineButton) {
        declineButton.addEventListener('click', () => setAnalyticsConsent('denied'));
    }
}

document.querySelectorAll('[data-analytics-preferences]').forEach((button) => {
    button.addEventListener('click', () => {
        if (consentBanner) {
            consentBanner.classList.add('visible');
        }
    });
});

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
