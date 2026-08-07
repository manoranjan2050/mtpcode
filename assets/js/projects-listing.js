import './main.js';
import { renderIcons } from './icons.js';
import { fetchCollection, projectCard } from './renderers.js';
import { refreshAOS } from './animations.js';

const STATUS_LABELS = { live: 'Live', 'in-development': 'In Development', archived: 'Archived' };

function renderFilters(projects, root) {
  const statuses = ['all', ...new Set(projects.map((p) => p.status))];
  root.innerHTML = statuses
    .map((s) => `<button data-filter="${s}" class="filter-chip ${s === 'all' ? 'filter-chip-active' : ''}">${s === 'all' ? 'All' : STATUS_LABELS[s] ?? s}</button>`)
    .join('');
}

function renderGrid(projects, root) {
  root.innerHTML = projects.length ? projects.map(projectCard).join('') : `<p class="col-span-full text-center text-dark-700/60 dark:text-slate-400">No projects in this status yet.</p>`;
  renderIcons();
  refreshAOS();
}

async function bootstrap() {
  const gridRoot = document.getElementById('projects-grid-root');
  const filterRoot = document.getElementById('projects-filter-root');
  if (!gridRoot) return;

  const projects = await fetchCollection('/data/projects');
  renderFilters(projects, filterRoot);
  renderGrid(projects, gridRoot);

  filterRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filterRoot.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('filter-chip-active'));
    btn.classList.add('filter-chip-active');
    const filter = btn.dataset.filter;
    renderGrid(filter === 'all' ? projects : projects.filter((p) => p.status === filter), gridRoot);
  });
}

document.addEventListener('mtpcode:ready', bootstrap);
