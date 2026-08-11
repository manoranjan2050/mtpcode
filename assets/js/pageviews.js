import { gsap } from 'gsap';

/**
 * Loads total page views from /data/pageviews.json and animates the
 * footer counter when it scrolls into view. Update the JSON manually
 * to change the displayed total — no backend required.
 */
export async function initPageviewsCounter() {
  const root = document.getElementById('footer-pageviews');
  const countEl = document.getElementById('footer-pageviews-count');
  if (!root || !countEl) return;

  let total = 0;
  try {
    const res = await fetch('/data/pageviews.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    total = Math.max(0, Number(data.total) || 0);
    if (data.label) {
      const labelEl = root.querySelector('.pageviews-chip__label');
      if (labelEl) labelEl.textContent = data.label;
    }
  } catch (err) {
    console.warn('[pageviews] failed to load counter:', err);
    root.classList.add('pageviews-chip--error');
    countEl.textContent = '—';
    return;
  }

  countEl.dataset.counterTarget = String(total);
  root.classList.add('pageviews-chip--ready');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(root);
        animatePageviews(root, countEl, total);
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(root);
}

function animatePageviews(root, countEl, total) {
  root.classList.add('pageviews-chip--animating');

  const state = { val: 0 };
  gsap.to(state, {
    val: total,
    duration: 2.2,
    ease: 'power3.out',
    onUpdate: () => {
      countEl.textContent = Math.floor(state.val).toLocaleString('en-IN');
    },
    onComplete: () => {
      countEl.textContent = total.toLocaleString('en-IN');
      root.classList.remove('pageviews-chip--animating');
      root.classList.add('pageviews-chip--done');
      // Brief celebratory pop on the digits
      gsap.fromTo(
        countEl,
        { scale: 1 },
        { scale: 1.08, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    },
  });

  // Soft icon bob while counting
  const icon = root.querySelector('.pageviews-chip__icon');
  if (icon) {
    gsap.fromTo(
      icon,
      { rotate: -8, scale: 0.9 },
      { rotate: 8, scale: 1.05, duration: 0.55, yoyo: true, repeat: 3, ease: 'sine.inOut' }
    );
  }
}
