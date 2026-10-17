// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navLinks.style.display = navLinks.classList.contains('open') ? 'flex' : 'none';
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Web3Forms submission (shared by contact + feedback forms)
function setupWeb3Form(formId, btnId, noteId, successMessage) {
  const form = document.getElementById(formId);
  const note = document.getElementById(noteId);
  const submitBtn = document.getElementById(btnId);
  const btnLabel = submitBtn?.textContent;

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    note.textContent = "";

    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      const result = await response.json();

      if (result.success) {
        note.textContent = successMessage;
        note.style.color = "var(--accent)";
        form.reset();
      } else {
        note.textContent = "Something went wrong. Please email us directly at rkarchitect1503@gmail.com.";
        note.style.color = "#ff6b6b";
      }
    } catch (error) {
      note.textContent = "Something went wrong. Please email us directly at rkarchitect1503@gmail.com.";
      note.style.color = "#ff6b6b";
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

// Reveal cards on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .orbit-card').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// Testimonials — approved entries live in testimonials.json
function renderTestimonial(t) {
  const card = document.createElement('div');
  card.className = 'card testimonial-card';

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

  card.append(stars, quote, author);
  if (t.service) {
    const tag = document.createElement('span');
    tag.className = 'testimonial-tag';
    tag.textContent = t.service;
    card.append(tag);
  }
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
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
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
