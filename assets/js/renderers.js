/** Card renderers shared by the home page and the full listing pages (Phase 5-7). */

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

export async function fetchCollection(baseDir) {
  const slugs = await fetchJson(`${baseDir}/index.json`);
  return Promise.all(slugs.map((slug) => fetchJson(`${baseDir}/${slug}.json`)));
}

export function appCard(app) {
  return `
  <a href="/apps/${esc(app.slug)}.html" data-aos="fade-up" class="card group flex flex-col overflow-hidden p-6">
    <div class="flex items-center gap-4">
      <img src="${esc(app.logo)}" alt="${esc(app.name)} logo" loading="lazy" class="h-14 w-14 rounded-2xl shadow-sm" width="56" height="56" />
      <div class="min-w-0">
        <h3 class="truncate font-display text-lg font-bold text-dark-900 dark:text-white">${esc(app.name)}</h3>
        <p class="truncate text-sm text-dark-700/70 dark:text-slate-400">${esc(app.tagline)}</p>
      </div>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      ${app.platform.map((p) => `<span class="badge-primary">${esc(p)}</span>`).join('')}
      <span class="badge-neutral">v${esc(app.version)}</span>
    </div>
    <span class="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all dark:text-primary-400">
      View app <i data-lucide="arrow-right" class="h-4 w-4"></i>
    </span>
  </a>`;
}

export function projectCard(project) {
  return `
  <a href="/projects/${esc(project.slug)}.html" data-aos="fade-up" class="card group flex flex-col overflow-hidden">
    <div class="aspect-[16/10] w-full overflow-hidden">
      <img src="${esc(project.images?.[0] ?? '')}" alt="${esc(project.name)} screenshot" loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <div class="flex flex-1 flex-col p-6">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-display text-lg font-bold text-dark-900 dark:text-white">${esc(project.name)}</h3>
        <span class="badge-accent shrink-0 capitalize">${esc(project.status)}</span>
      </div>
      <p class="mt-2 text-sm text-dark-700/70 dark:text-slate-400">${esc(project.tagline)}</p>
      <div class="mt-4 flex flex-wrap gap-2">
        ${project.technology.slice(0, 4).map((t) => `<span class="badge-neutral">${esc(t)}</span>`).join('')}
      </div>
      <span class="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all dark:text-primary-400">
        Case study <i data-lucide="arrow-right" class="h-4 w-4"></i>
      </span>
    </div>
  </a>`;
}

export function githubProjectItem(repo) {
  return `
  <a href="${esc(repo.url)}" target="_blank" rel="noopener noreferrer" data-aos="fade-up"
    class="card-glass flex items-center gap-4 p-5">
    <i data-lucide="github" class="h-6 w-6 shrink-0 text-dark-900 dark:text-white"></i>
    <div class="min-w-0 flex-1">
      <p class="truncate font-semibold text-dark-900 dark:text-white">${esc(repo.name)}</p>
      <p class="truncate text-sm text-dark-700/60 dark:text-slate-400">${esc(repo.description)}</p>
    </div>
    <div class="flex shrink-0 items-center gap-3 text-xs text-dark-700/60 dark:text-slate-400">
      <span class="flex items-center gap-1"><i data-lucide="circle" class="h-2.5 w-2.5 fill-primary-500 text-primary-500"></i>${esc(repo.language)}</span>
      <span class="flex items-center gap-1"><i data-lucide="star" class="h-3.5 w-3.5"></i>${repo.stars}</span>
    </div>
  </a>`;
}

export function blogCard(post) {
  return `
  <a href="/blog/${esc(post.slug)}.html" data-aos="fade-up" class="card group flex flex-col overflow-hidden">
    <div class="aspect-[16/9] w-full overflow-hidden">
      <img src="${esc(post.coverImage)}" alt="${esc(post.title)}" loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <div class="flex flex-1 flex-col p-6">
      <div class="flex items-center gap-3 text-xs text-dark-700/60 dark:text-slate-400">
        <span class="badge-secondary">${esc(post.category)}</span>
        <span>${new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        <span>&middot;</span>
        <span>${post.readMinutes} min read</span>
      </div>
      <h3 class="mt-3 font-display text-lg font-bold leading-snug text-dark-900 dark:text-white">${esc(post.title)}</h3>
      <p class="mt-2 line-clamp-2 text-sm text-dark-700/70 dark:text-slate-400">${esc(post.excerpt)}</p>
      <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all dark:text-primary-400">
        Read article <i data-lucide="arrow-right" class="h-4 w-4"></i>
      </span>
    </div>
  </a>`;
}

export function techBadge(tech) {
  return `
  <div data-aos="zoom-in" class="card-glass flex flex-col items-center gap-2 px-5 py-6 text-center">
    <i data-lucide="${esc(tech.icon)}" class="h-7 w-7 text-primary-600 dark:text-primary-400"></i>
    <span class="text-sm font-semibold text-dark-900 dark:text-white">${esc(tech.name)}</span>
    <span class="text-xs text-dark-700/50 dark:text-slate-500">${esc(tech.category)}</span>
  </div>`;
}
