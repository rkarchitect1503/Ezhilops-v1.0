// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navLinks.style.display = navLinks.classList.contains('open') ? 'flex' : 'none';
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form — Web3Forms submission
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

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
      note.textContent = "Thanks! Your message has been sent — we'll get back to you shortly.";
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
    submitBtn.textContent = "Send Message";
  }
});

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