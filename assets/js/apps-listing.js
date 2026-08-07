import './main.js';
import { createIcons, icons } from 'lucide';
import { fetchCollection, appCard } from './renderers.js';
import { refreshAOS } from './animations.js';

const CATEGORY_LABELS = { android: 'Android', erp: 'ERP', web: 'Web', desktop: 'Desktop', iot: 'IoT' };

function renderFilters(apps, root) {
  const categories = ['all', ...new Set(apps.map((a) => a.category))];
  root.innerHTML = categories
    .map(
      (c) => `<button data-filter="${c}" class="filter-chip ${c === 'all' ? 'filter-chip-active' : ''}">
        ${c === 'all' ? 'All' : CATEGORY_LABELS[c] ?? c}
      </button>`
    )
    .join('');
}

function renderGrid(apps, root) {
  root.innerHTML = apps.length ? apps.map(appCard).join('') : `<p class="col-span-full text-center text-dark-700/60 dark:text-slate-400">No apps in this category yet.</p>`;
  createIcons({ icons });
  refreshAOS();
}

async function bootstrap() {
  const gridRoot = document.getElementById('apps-grid-root');
  const filterRoot = document.getElementById('apps-filter-root');
  if (!gridRoot) return;

  const apps = await fetchCollection('/data/apps');
  renderFilters(apps, filterRoot);
  renderGrid(apps, gridRoot);

  filterRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filterRoot.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('filter-chip-active'));
    btn.classList.add('filter-chip-active');
    const filter = btn.dataset.filter;
    renderGrid(filter === 'all' ? apps : apps.filter((a) => a.category === filter), gridRoot);
  });
}

document.addEventListener('mtpcode:ready', bootstrap);
