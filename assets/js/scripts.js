const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const yearEl = document.getElementById('year');

const isToggleVisible = () => {
    if (!navToggle) return false;
    return window.getComputedStyle(navToggle).display !== 'none';
};

const syncMenuForViewport = () => {
    if (!navLinks) return;
    if (!navToggle) {
        navLinks.removeAttribute('aria-hidden');
        return;
    }

    const expanded = navToggle.getAttribute('aria-expanded') === 'true';

    if (isToggleVisible()) {
        navLinks.classList.toggle('open', expanded);
        navLinks.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    } else {
        navLinks.classList.remove('open');
        navLinks.removeAttribute('aria-hidden');
    }
};

const setMenuState = (expanded) => {
    if (!navToggle) return;
    navToggle.setAttribute('aria-expanded', String(expanded));
    syncMenuForViewport();
};

const toggleNav = () => {
    if (!navToggle) return;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!expanded);
};

syncMenuForViewport();

if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
}

if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (navToggle) {
                setMenuState(false);
            }
        });
    });
}

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

const contactForm = document.getElementById('contact-form');
const formResponse = document.querySelector('.form-response');

if (contactForm && formResponse) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.checkValidity()) {
            formResponse.textContent = 'Please complete all required fields before submitting.';
            formResponse.style.color = '#f9a620';
            return;
        }

        const formData = new FormData(contactForm);
        const name = formData.get('full-name');
        const interest = formData.get('interest');

        formResponse.textContent = `Thanks${name ? `, ${name}` : ''}! A consultant specializing in ${interest || 'your requested service'} will contact you shortly.`;
        formResponse.style.color = '#1a4d8f';
        contactForm.reset();
    });
}
