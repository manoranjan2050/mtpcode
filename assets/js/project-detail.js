import './main.js';
import { renderIcons } from './icons.js';
import { fetchJson } from './renderers.js';
import { refreshAOS } from './animations.js';

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function linkButtons(links = {}) {
  const meta = {
    github: { label: 'View Source on GitHub', icon: 'github' },
    demo: { label: 'Live Demo', icon: 'external-link' },
  };
  return Object.entries(links)
    .filter(([, url]) => url)
    .map(([key, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="btn-outline w-full !justify-start"><i data-lucide="${meta[key]?.icon ?? 'link'}" class="h-4 w-4"></i> ${meta[key]?.label ?? key}</a>`)
    .join('');
}

const STATUS_LABELS = { live: 'Live', 'in-development': 'In Development', archived: 'Archived' };

function renderDetail(project) {
  const root = document.getElementById('project-detail-root');
  const [hero, ...rest] = project.images ?? [];
  root.innerHTML = `
    <section class="relative overflow-hidden bg-gradient-hero pb-20 pt-40 sm:pt-48">
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="bg-blob left-[-10%] top-0 h-96 w-96 bg-secondary-600"></div>
        <div class="bg-blob right-[-5%] top-20 h-96 w-96 bg-accent-500"></div>
      </div>
      <div class="container-page">
        <a href="/projects.html" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"><i data-lucide="arrow-left" class="h-4 w-4"></i> All Projects</a>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <span class="badge-accent">${esc(STATUS_LABELS[project.status] ?? project.status)}</span>
        </div>
        <h1 class="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">${esc(project.name)}</h1>
        <p class="mt-2 max-w-2xl text-lg text-slate-300">${esc(project.tagline)}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          ${project.technology.map((t) => `<span class="badge bg-white/10 text-white ring-1 ring-inset ring-white/20">${esc(t)}</span>`).join('')}
        </div>
      </div>
    </section>

    <section class="section !pt-16">
      <div class="container-page grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div class="lg:col-span-2">
          ${hero ? `<img src="${esc(hero)}" alt="${esc(project.name)} screenshot" loading="lazy" class="w-full rounded-2xl shadow-glass" />` : ''}

          <h2 class="mt-12 font-display text-2xl font-bold text-dark-900 dark:text-white">Overview</h2>
          <p class="mt-4 leading-relaxed text-dark-700/80 dark:text-slate-400">${esc(project.description)}</p>

          <h2 class="mt-10 font-display text-2xl font-bold text-dark-900 dark:text-white">Key Features</h2>
          <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            ${project.features.map((f) => `<li class="flex items-start gap-2 text-sm text-dark-700/80 dark:text-slate-400"><i data-lucide="check-circle-2" class="mt-0.5 h-4 w-4 shrink-0 text-secondary-500"></i>${esc(f)}</li>`).join('')}
          </ul>

          ${rest.length ? `
          <h2 class="mt-10 font-display text-2xl font-bold text-dark-900 dark:text-white">More Screenshots</h2>
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            ${rest.map((g) => `<img src="${esc(g)}" alt="${esc(project.name)} screenshot" loading="lazy" class="w-full rounded-xl border border-dark-900/10 dark:border-white/10" />`).join('')}
          </div>` : ''}
        </div>

        <aside class="space-y-6">
          <div class="card-glass space-y-3 p-6">
            <h3 class="font-display text-sm font-bold uppercase tracking-wide text-dark-900 dark:text-white">Links</h3>
            ${linkButtons(project.links) || '<p class="text-sm text-dark-700/60 dark:text-slate-400">No public links yet.</p>'}
          </div>
          <div class="card-glass space-y-3 p-6">
            <h3 class="font-display text-sm font-bold uppercase tracking-wide text-dark-900 dark:text-white">Technology</h3>
            <div class="flex flex-wrap gap-2">${project.technology.map((t) => `<span class="badge-neutral">${esc(t)}</span>`).join('')}</div>
          </div>
        </aside>
      </div>
    </section>
  `;

  renderIcons();
  refreshAOS();
}

async function bootstrap() {
  const slug = document.getElementById('project-detail-root')?.dataset.slug;
  if (!slug) return;
  try {
    const project = await fetchJson(`/data/projects/${slug}.json`);
    renderDetail(project);
  } catch (err) {
    document.getElementById('project-detail-root').innerHTML = `<div class="container-page py-32 text-center"><p class="text-lg text-dark-700 dark:text-slate-300">Project not found.</p></div>`;
    console.error(err);
  }
}

document.addEventListener('mtpcode:ready', bootstrap);
