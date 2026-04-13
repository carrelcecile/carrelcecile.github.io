// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) el.target.classList.add('in');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.card, .research-item, .course, .subsection-label').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Stagger cards in grid
document.querySelectorAll('.cards-grid').forEach(grid => {
  grid.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
});

// Nav active state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'rgba(224,218,208,0.95)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));
