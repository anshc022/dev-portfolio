// Scroll reveal
const reveals = document.querySelectorAll('.bcard, .pcard, .contact__left, .contact__right, .projects__header, .bento__grid');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

reveals.forEach(el => observer.observe(el));

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'sending... 📡';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'sent! talk soon 🎉';
    btn.style.background = '#39ff14';
    btn.style.color = '#000';
    btn.style.boxShadow = '0 0 20px rgba(57,255,20,0.4)';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'send it 🚀';
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.boxShadow = '';
    }, 3000);
  }, 1000);
});

// Active nav highlight
const navLinks = document.querySelectorAll('.nav__pill a');
const sections = document.querySelectorAll('section[id]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.style.background = '';
        l.style.color = '';
      });
      const a = document.querySelector(`.nav__pill a[href="#${e.target.id}"]`);
      if (a) {
        a.style.background = 'rgba(255,60,172,0.12)';
        a.style.color = '#ff3cac';
      }
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObs.observe(s));
