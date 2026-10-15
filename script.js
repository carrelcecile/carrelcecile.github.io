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

  document.querySelectorAll('.offer, .topic, .cred, .research-item, .domain-head, .stat, .region').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ---------- Pop-ups (summaries and maps) ----------
const modal = document.getElementById('modal');

if (modal) {
  const box = modal.querySelector('.modal-box');
  const closeBtn = modal.querySelector('.modal-close');
  const tagEl = document.getElementById('modal-tag');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  const sourceEl = document.getElementById('modal-source');
  let lastFocus = null;

  // A map button only appears once it has a source (embed URL or image path).
  document.querySelectorAll('[data-map-src]').forEach(btn => {
    if (!btn.dataset.mapSrc.trim()) btn.hidden = true;
  });

  function openModal({ tag, title, content, href, hrefLabel }) {
    lastFocus = document.activeElement;
    tagEl.textContent = tag || '';
    titleEl.textContent = title || '';
    bodyEl.replaceChildren(content);
    if (href) {
      sourceEl.href = href;
      sourceEl.textContent = hrefLabel || 'Open in a new tab ↗';
      sourceEl.hidden = false;
    } else {
      sourceEl.hidden = true;
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    bodyEl.replaceChildren();   // stops any embedded map from running
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = document.getElementById(btn.dataset.open);
      openModal({
        tag: btn.dataset.tag,
        title: btn.dataset.title,
        content: tpl.content.cloneNode(true),
        href: btn.dataset.link,
        hrefLabel: btn.dataset.linkLabel
      });
    });
  });

  document.querySelectorAll('[data-map-src]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.mapSrc.trim();
      const isImage = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(src);
      const el = document.createElement(isImage ? 'img' : 'iframe');
      el.src = src;
      if (isImage) {
        el.alt = btn.dataset.mapTitle || 'Map';
      } else {
        el.title = btn.dataset.mapTitle || 'Map';
        el.loading = 'lazy';
        el.referrerPolicy = 'no-referrer';
      }
      openModal({
        tag: btn.dataset.tag || 'Map',
        title: btn.dataset.mapTitle,
        content: el,
        href: btn.dataset.mapLink || src,
        hrefLabel: 'Open map in a new tab ↗'
      });
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {            // keep focus inside the dialog
      const f = box.querySelectorAll('a[href], button, iframe');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

// ---------- Copy-to-clipboard (speaker bio) ----------
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = document.getElementById(btn.dataset.copy).innerText.trim();
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch (e) {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById(btn.dataset.copy));
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      btn.textContent = 'Selected: press Ctrl/Cmd+C';
    }
    setTimeout(() => { btn.textContent = original; }, 2200);
  });
});
