// Mobile menu toggle
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  navbar.classList.toggle('menu-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

hamburger?.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Navbar background once scrolled past the top
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Highlight the nav link for the section in view
const navAnchors = [...navLinks.querySelectorAll('a:not(.btn)')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navAnchors.forEach(a => {
  const section = document.querySelector(a.getAttribute('href'));
  if (section) sectionObserver.observe(section);
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Web3Forms submission (shared by contact + feedback forms)
function setupWeb3Form(formId, btnId, noteId, successMessage) {
  const form = document.getElementById(formId);
  const note = document.getElementById(noteId);
  const submitBtn = document.getElementById(btnId);
  const btnLabel = submitBtn?.textContent;

  function showNote(message, type) {
    note.textContent = message;
    note.className = `form-note ${type}`;
  }

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    showNote("", "");

    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      const result = await response.json();

      if (result.success) {
        showNote(successMessage, "success");
        form.reset();
      } else {
        showNote("Something went wrong. Please email us directly at rkarchitect1503@gmail.com.", "error");
      }
    } catch (error) {
      showNote("Something went wrong. Please email us directly at rkarchitect1503@gmail.com.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = btnLabel;
    }
  });
}

setupWeb3Form('contactForm', 'submitBtn', 'formNote',
  "Thanks! Your message has been sent — we'll get back to you shortly.");
setupWeb3Form('feedbackForm', 'feedbackBtn', 'feedbackNote',
  "Thank you for your feedback! It will appear here once reviewed.");

// Reveal elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Testimonials — approved entries live in testimonials.json
function renderTestimonial(t) {
  const card = document.createElement('div');
  card.className = 'card testimonial-card reveal';

  const rating = Math.max(0, Math.min(5, Number(t.rating) || 0));
  const stars = document.createElement('div');
  stars.className = 'testimonial-stars';
  stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  stars.setAttribute('aria-label', `${rating} out of 5 stars`);

  const quote = document.createElement('p');
  quote.className = 'testimonial-quote';
  quote.textContent = `“${t.quote}”`;

  const author = document.createElement('div');
  author.className = 'testimonial-author';
  const name = document.createElement('strong');
  name.textContent = t.name;
  const meta = document.createElement('span');
  meta.textContent = [t.role, t.company].filter(Boolean).join(', ');
  author.append(name, meta);

  card.append(stars, quote);
  if (t.service) {
    const tag = document.createElement('span');
    tag.className = 'testimonial-tag';
    tag.textContent = t.service;
    card.append(tag);
  }
  card.append(author);
  return card;
}

async function loadTestimonials() {
  const grid = document.getElementById('testimonialGrid');
  const empty = document.getElementById('testimonialEmpty');
  if (!grid) return;

  let items = [];
  try {
    const response = await fetch('testimonials.json', { cache: 'no-cache' });
    if (response.ok) items = await response.json();
  } catch (error) {
    items = [];
  }

  items = items.filter(t => t && t.name && t.quote);
  if (!items.length) {
    grid.hidden = true;
    empty.hidden = false;
    return;
  }

  items.forEach(t => {
    const card = renderTestimonial(t);
    grid.append(card);
    observer.observe(card);
  });
}

loadTestimonials();

// Product CTAs pre-select the matching service in the contact form
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.querySelector('#contactForm select[name="service"]');
    if (select) select.value = link.dataset.service;
  });
});
