import '../css/input.css';
import { createIcons, icons } from 'lucide';
import { loadPartials, markActiveNavLinks } from './partials.js';
import { initTheme, toggleTheme } from './theme.js';
import { initAOS, animateCounters, initPageLoader } from './animations.js';

initTheme();

function renderIcons() {
  createIcons({ icons });
}

function wireHeader() {
  const header = document.getElementById('site-header');
  const navInner = document.getElementById('nav-inner');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const themeToggle = document.getElementById('theme-toggle');

  const onScroll = () => {
    if (!navInner) return;
    const scrolled = window.scrollY > 12;
    navInner.classList.toggle('nav-glass', scrolled);
    navInner.classList.toggle('shadow-glass', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  mobileToggle?.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    mobileToggle.setAttribute('aria-expanded', String(!isHidden));
    mobileToggle.innerHTML = isHidden ? '<i data-lucide="menu" class="h-5 w-5"></i>' : '<i data-lucide="x" class="h-5 w-5"></i>';
    renderIcons();
  });

  themeToggle?.addEventListener('click', () => toggleTheme());

  markActiveNavLinks();
}

function wireFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const form = document.getElementById('newsletter-form');
  const status = document.getElementById('newsletter-status');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = /** @type {HTMLInputElement} */ (document.getElementById('newsletter-email')).value;
    if (!email) return;
    // Static v1 has no backend; this is wired for a future Laravel/3rd-party form endpoint.
    status.textContent = `Thanks! We'll notify ${email} about new releases.`;
    status.classList.remove('hidden');
    form.reset();
  });
}

async function bootstrap() {
  await loadPartials();
  renderIcons();
  wireHeader();
  wireFooter();
  initAOS();
  animateCounters();
  initPageLoader();
  document.dispatchEvent(new CustomEvent('mtpcode:ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
