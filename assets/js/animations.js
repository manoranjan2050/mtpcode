import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';

export function initAOS() {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });
}

/** Re-scans the DOM for new [data-aos] nodes injected after initAOS() ran. */
export function refreshAOS() {
  AOS.refreshHard();
}

/** Types a list of phrases into the target element, looping forever. */
export function typeEffect(el, phrases, { typeSpeed = 70, deleteSpeed = 40, pause = 1800 } = {}) {
  if (!el || !phrases?.length) return;
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        return setTimeout(tick, pause);
      }
    } else {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }
  tick();
}

/** Animates a counter from 0 to target when it scrolls into view. */
export function animateCounters(selector = '[data-counter]') {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.floor(counterObj.val).toLocaleString() + suffix;
          },
        });
        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => observer.observe(el));
}

/** Hides the full-page loader once the window has finished loading. */
export function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const hide = () => loader.classList.add('loaded');
  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
    // Fallback so a slow asset never traps the user behind the loader.
    setTimeout(hide, 2500);
  }
}

/** Simple GSAP hero entrance timeline; pass refs to elements that exist on the page. */
export function heroEntrance({ eyebrow, heading, sub, cta, art } = {}) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.6 });
  if (heading) tl.from(heading, { y: 30, opacity: 0, duration: 0.8 }, '-=0.35');
  if (sub) tl.from(sub, { y: 20, opacity: 0, duration: 0.7 }, '-=0.5');
  if (cta) tl.from(cta, { y: 20, opacity: 0, duration: 0.6 }, '-=0.45');
  if (art) tl.from(art, { scale: 0.9, opacity: 0, duration: 1 }, '-=0.6');
  return tl;
}
