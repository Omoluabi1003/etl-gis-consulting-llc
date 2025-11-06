const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const yearEl = document.getElementById('year');

const toggleNav = () => {
    if (!navLinks) return;
    navLinks.classList.toggle('open');
};

if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
    navToggle.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleNav();
        }
    });
}

if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

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
