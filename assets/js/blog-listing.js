import './main.js';
import { createIcons, icons } from 'lucide';
import { fetchCollection, blogCard } from './renderers.js';
import { refreshAOS } from './animations.js';

let allPosts = [];
let activeCategory = 'all';
let searchTerm = '';

function renderFilters(posts, root) {
  const categories = ['all', ...new Set(posts.map((p) => p.category))];
  root.innerHTML = categories
    .map((c) => `<button data-filter="${c}" class="filter-chip ${c === 'all' ? 'filter-chip-active' : ''}">${c === 'all' ? 'All' : c}</button>`)
    .join('');
}

function applyFilters() {
  return allPosts
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .filter((p) => {
      if (!searchTerm) return true;
      const haystack = `${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase();
      return haystack.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderGrid(root) {
  const posts = applyFilters();
  root.innerHTML = posts.length ? posts.map(blogCard).join('') : `<p class="col-span-full text-center text-dark-700/60 dark:text-slate-400">No articles match your search.</p>`;
  createIcons({ icons });
  refreshAOS();
}

async function bootstrap() {
  const gridRoot = document.getElementById('blog-grid-root');
  const filterRoot = document.getElementById('blog-filter-root');
  const searchInput = document.getElementById('blog-search-input');
  if (!gridRoot) return;

  allPosts = await fetchCollection('/data/blog');
  renderFilters(allPosts, filterRoot);
  renderGrid(gridRoot);

  filterRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filterRoot.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('filter-chip-active'));
    btn.classList.add('filter-chip-active');
    activeCategory = btn.dataset.filter;
    renderGrid(gridRoot);
  });

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderGrid(gridRoot);
  });
}

document.addEventListener('mtpcode:ready', bootstrap);
