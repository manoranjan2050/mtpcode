import './main.js';
import { renderIcons } from './icons.js';
import { fetchJson } from './renderers.js';
import { refreshAOS } from './animations.js';

const TYPE_META = {
  apk: { label: 'Android', icon: 'smartphone', badge: 'badge-primary' },
  zip: { label: 'ZIP', icon: 'folder-archive', badge: 'badge-secondary' },
  pdf: { label: 'PDF', icon: 'file-text', badge: 'badge-accent' },
  firmware: { label: 'Firmware', icon: 'cpu', badge: 'badge-neutral' },
  source: { label: 'Source', icon: 'github', badge: 'badge-neutral' },
  web: { label: 'Web', icon: 'globe', badge: 'badge-accent' },
};

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function isComingSoon(item) {
  return item.status === 'under-construction' || item.url === 'coming-soon' || !item.url;
}

function isExternal(url) {
  return /^https?:\/\//i.test(url || '');
}

function primaryCta(item) {
  // Android / APK cards: Play Store only — never direct APK file links.
  if (item.type === 'apk') {
    const playUrl = item.playstore || (item.cta === 'play' ? item.url : '');
    if (!playUrl || playUrl === 'coming-soon' || item.status === 'under-construction') {
      return `<span class="btn-outline flex-1 !py-2.5 text-sm cursor-not-allowed opacity-60"><i data-lucide="play" class="h-4 w-4"></i> Play Store soon</span>`;
    }
    return `<a href="${esc(playUrl)}" target="_blank" rel="noopener noreferrer" class="btn-primary flex-1 !py-2.5 text-sm"><i data-lucide="play" class="h-4 w-4"></i> Get on Play</a>`;
  }
  if (isComingSoon(item)) {
    return `<span class="btn-outline flex-1 !py-2.5 text-sm cursor-not-allowed opacity-60"><i data-lucide="construction" class="h-4 w-4"></i> Coming soon</span>`;
  }
  if (item.cta === 'play' || /play\.google\.com/i.test(item.url)) {
    return `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary flex-1 !py-2.5 text-sm"><i data-lucide="play" class="h-4 w-4"></i> Get on Play</a>`;
  }
  if (item.cta === 'github' || item.type === 'source') {
    return `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary flex-1 !py-2.5 text-sm"><i data-lucide="github" class="h-4 w-4"></i> View on GitHub</a>`;
  }
  if (item.cta === 'web' || item.type === 'web') {
    return `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary flex-1 !py-2.5 text-sm"><i data-lucide="external-link" class="h-4 w-4"></i> Open site</a>`;
  }
  if (isExternal(item.url)) {
    return `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-primary flex-1 !py-2.5 text-sm"><i data-lucide="external-link" class="h-4 w-4"></i> Open</a>`;
  }
  return `<a href="${esc(item.url)}" download class="btn-primary flex-1 !py-2.5 text-sm"><i data-lucide="download" class="h-4 w-4"></i> Download</a>`;
}

function statusBadge(item) {
  if (item.status === 'under-construction' || item.status === 'in-development') {
    return `<span class="badge-secondary !text-[10px]">Coming soon</span>`;
  }
  if (item.kind === 'project') {
    return `<span class="badge-neutral !text-[10px]">Project</span>`;
  }
  return '';
}

function logoBlock(item, meta) {
  if (item.logo) {
    return `<img src="${esc(item.logo)}" alt="${esc(item.name)} icon" width="44" height="44" loading="lazy"
      class="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-dark-900/10 dark:ring-white/10 bg-white dark:bg-dark-800" />`;
  }
  return `<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400">
    <i data-lucide="${meta.icon}" class="h-5 w-5"></i>
  </span>`;
}

function downloadCard(item) {
  const meta = TYPE_META[item.type] ?? { label: item.type, icon: 'file-text', badge: 'badge-neutral' };
  const released = new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  return `
  <div data-aos="fade-up" class="card p-6 flex flex-col">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        ${logoBlock(item, meta)}
        <div class="min-w-0">
          <h3 class="font-display font-bold text-dark-900 dark:text-white truncate">${esc(item.name)}</h3>
          <p class="text-xs text-dark-700/60 dark:text-slate-400 truncate">${esc(item.platform)}</p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1.5 shrink-0">
        <span class="${meta.badge}">${meta.label}</span>
        ${statusBadge(item)}
      </div>
    </div>

    <dl class="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
      <div class="rounded-lg bg-dark-900/5 py-2 dark:bg-white/5">
        <dt class="text-dark-700/50 dark:text-slate-500">Version</dt>
        <dd class="mt-0.5 font-semibold text-dark-900 dark:text-white">${esc(item.version)}</dd>
      </div>
      <div class="rounded-lg bg-dark-900/5 py-2 dark:bg-white/5">
        <dt class="text-dark-700/50 dark:text-slate-500">Size</dt>
        <dd class="mt-0.5 font-semibold text-dark-900 dark:text-white">${esc(item.size)}</dd>
      </div>
      <div class="rounded-lg bg-dark-900/5 py-2 dark:bg-white/5">
        <dt class="text-dark-700/50 dark:text-slate-500">Released</dt>
        <dd class="mt-0.5 font-semibold text-dark-900 dark:text-white">${released}</dd>
      </div>
    </dl>

    <details class="mt-4 group open:mb-1" open>
      <summary class="cursor-pointer list-none text-xs font-semibold text-primary-600 dark:text-primary-400">
        Release notes <i data-lucide="chevron-down" class="inline h-3.5 w-3.5 transition-transform group-open:rotate-180"></i>
      </summary>
      <ul class="mt-2 list-inside list-disc space-y-1 text-xs text-dark-700/70 dark:text-slate-400">
        ${(item.notes || []).map((n) => `<li>${esc(n)}</li>`).join('')}
      </ul>
    </details>

    <div class="mt-auto pt-5 flex gap-2">
      ${primaryCta(item)}
      ${item.appLink ? `<a href="${esc(item.appLink)}" ${isExternal(item.appLink) ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-outline !px-3 !py-2.5" aria-label="View details"><i data-lucide="info" class="h-4 w-4"></i></a>` : ''}
    </div>
  </div>`;
}

function renderFilters(items, root) {
  const types = ['all', ...new Set(items.map((i) => i.type))];
  root.innerHTML = types
    .map((t) => `<button type="button" data-filter="${t}" class="filter-chip ${t === 'all' ? 'filter-chip-active' : ''}">${t === 'all' ? 'All' : TYPE_META[t]?.label ?? t}</button>`)
    .join('');
}

function renderGrid(items, root) {
  root.innerHTML = items.length
    ? items.map(downloadCard).join('')
    : `<p class="col-span-full text-center text-dark-700/60 dark:text-slate-400">Nothing here yet.</p>`;
  renderIcons();
  refreshAOS();
}

async function bootstrap() {
  const gridRoot = document.getElementById('downloads-grid-root');
  const filterRoot = document.getElementById('downloads-filter-root');
  if (!gridRoot) return;

  const items = await fetchJson('/data/downloads.json');
  // Newest first
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  renderFilters(items, filterRoot);
  renderGrid(items, gridRoot);

  filterRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filterRoot.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('filter-chip-active'));
    btn.classList.add('filter-chip-active');
    const filter = btn.dataset.filter;
    renderGrid(filter === 'all' ? items : items.filter((i) => i.type === filter), gridRoot);
  });
}

document.addEventListener('mtpcode:ready', bootstrap);
