// ---------- Scroll reveal (respects reduced motion) ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.offer, .topic, .cred').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ---------- Copy-to-clipboard (speaker bio) ----------
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const target = document.getElementById(btn.dataset.copy);
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(target.innerText.trim());
      btn.textContent = 'Copied';
    } catch (e) {
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      btn.textContent = 'Selected: press Ctrl/Cmd+C';
    }
    setTimeout(() => { btn.textContent = original; }, 2200);
  });
});
