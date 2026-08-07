/**
 * Client-side partial include system. Elements with data-include="/components/x.html"
 * get their contents fetched and injected, then a `partials:loaded` event fires so
 * page scripts can safely wire up nav toggles, active-link state, etc.
 */
export async function loadPartials(root = document) {
  const nodes = Array.from(root.querySelectorAll('[data-include]'));
  await Promise.all(
    nodes.map(async (node) => {
      const url = node.getAttribute('data-include');
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        node.innerHTML = await res.text();
      } catch (err) {
        console.error(`[partials] failed to load ${url}:`, err);
      }
    })
  );
  document.dispatchEvent(new CustomEvent('partials:loaded'));
}

export function markActiveNavLinks() {
  const path = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const normalized = href.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    const isActive = normalized === path || (normalized !== '/' && path.startsWith(normalized));
    link.classList.toggle('nav-link-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });
}
