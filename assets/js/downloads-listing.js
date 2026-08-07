import './main.js';
import { createIcons, icons } from 'lucide';
import { fetchJson } from './renderers.js';
import { refreshAOS } from './animations.js';

const TYPE_META = {
  apk: { label: 'APK', icon: 'smartphone', badge: 'badge-primary' },
  zip: { label: 'ZIP', icon: 'folder-archive', badge: 'badge-secondary' },
  pdf: { label: 'PDF', icon: 'file-text', badge: 'badge-accent' },
  firmware: { label: 'Firmware', icon: 'cpu', badge: 'badge-neutral' },
};

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function downloadCard(item) {
  const meta = TYPE_META[item.type] ?? { label: item.type, icon: 'file', badge: 'badge-neutral' };
  return `
  <div data-aos="fade-up" class="card p-6">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400">
          <i data-lucide="${meta.icon}" class="h-5 w-5"></i>
        </span>
        <div>
          <h3 class="font-display font-bold text-dark-900 dark:text-white">${esc(item.name)}</h3>
          <p class="text-xs text-dark-700/60 dark:text-slate-400">${esc(item.platform)}</p>
        </div>
      </div>
      <span class="${meta.badge}">${meta.label}</span>
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
        <dd class="mt-0.5 font-semibold text-dark-900 dark:text-white">${new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</dd>
      </div>
    </dl>

    <details class="mt-4 group">
      <summary class="cursor-pointer list-none text-xs font-semibold text-primary-600 dark:text-primary-400">
        Release notes <i data-lucide="chevron-down" class="inline h-3.5 w-3.5 transition-transform group-open:rotate-180"></i>
      </summary>
      <ul class="mt-2 list-inside list-disc space-y-1 text-xs text-dark-700/70 dark:text-slate-400">
        ${item.notes.map((n) => `<li>${esc(n)}</li>`).join('')}
      </ul>
    </details>

    <div class="mt-5 flex gap-2">
      <a href="${esc(item.url)}" download class="btn-primary flex-1 !py-2.5 text-sm"><i data-lucide="download" class="h-4 w-4"></i> Download</a>
      ${item.appLink ? `<a href="${esc(item.appLink)}" class="btn-outline !px-3 !py-2.5" aria-label="View details"><i data-lucide="info" class="h-4 w-4"></i></a>` : ''}
    </div>
  </div>`;
}

function renderFilters(items, root) {
  const types = ['all', ...new Set(items.map((i) => i.type))];
  root.innerHTML = types
    .map((t) => `<button data-filter="${t}" class="filter-chip ${t === 'all' ? 'filter-chip-active' : ''}">${t === 'all' ? 'All' : TYPE_META[t]?.label ?? t}</button>`)
    .join('');
}

function renderGrid(items, root) {
  root.innerHTML = items.length ? items.map(downloadCard).join('') : `<p class="col-span-full text-center text-dark-700/60 dark:text-slate-400">Nothing here yet.</p>`;
  createIcons({ icons });
  refreshAOS();
}

async function bootstrap() {
  const gridRoot = document.getElementById('downloads-grid-root');
  const filterRoot = document.getElementById('downloads-filter-root');
  if (!gridRoot) return;

  const items = await fetchJson('/data/downloads.json');
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
