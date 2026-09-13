import { fetchCollection } from './renderers.js';
import { renderIcons } from './icons.js';
import { refreshAOS } from './animations.js';

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function isLivePlaystore(url) {
  return typeof url === 'string' && /^https:\/\/play\.google\.com\//.test(url);
}

function appLinkCard(app) {
  return `
  <a href="${esc(app.links.playstore)}" target="_blank" rel="noopener noreferrer" data-aos="fade-up"
    class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all hover:bg-white/10 hover:-translate-y-0.5">
    <img src="${esc(app.logo)}" alt="${esc(app.name)} logo" loading="lazy" width="56" height="56"
      class="h-14 w-14 shrink-0 rounded-2xl object-cover" />
    <div class="min-w-0 flex-1">
      <p class="truncate font-display font-bold text-white">${esc(app.name)}</p>
      <p class="truncate text-xs text-slate-400">${esc(app.tagline)}</p>
    </div>
    <span class="flex shrink-0 items-center gap-1.5 rounded-full bg-primary-500/15 px-3 py-1.5 text-xs font-semibold text-primary-300">
      <i data-lucide="download" class="h-3.5 w-3.5"></i> Install
    </span>
  </a>`;
}

async function bootstrap() {
  const root = document.getElementById('app-links-root');
  if (!root) return;
  const apps = (await fetchCollection('/data/apps')).filter((a) => isLivePlaystore(a.links?.playstore));
  root.innerHTML = apps.map(appLinkCard).join('');
  renderIcons();
  refreshAOS();
}

document.addEventListener('mtpcode:ready', bootstrap);
