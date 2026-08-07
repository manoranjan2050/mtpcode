import './main.js';
import { createIcons, icons } from 'lucide';
import { fetchJson } from './renderers.js';
import { refreshAOS } from './animations.js';

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function downloadButtons(downloads = {}) {
  const labels = { apk: 'Download APK', zip: 'Download ZIP', pdf: 'Download PDF', firmware: 'Download Firmware' };
  return Object.entries(downloads)
    .map(([key, url]) => `<a href="${esc(url)}" class="btn-primary w-full" download><i data-lucide="download" class="h-4 w-4"></i> ${labels[key] ?? 'Download'}</a>`)
    .join('');
}

function linkButtons(links = {}) {
  const meta = {
    github: { label: 'GitHub', icon: 'github' },
    playstore: { label: 'Play Store', icon: 'play' },
    website: { label: 'Website', icon: 'globe' },
    docs: { label: 'Documentation', icon: 'book-open' },
  };
  return Object.entries(links)
    .filter(([, url]) => url)
    .map(([key, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="btn-outline w-full !justify-start"><i data-lucide="${meta[key]?.icon ?? 'link'}" class="h-4 w-4"></i> ${meta[key]?.label ?? key}</a>`)
    .join('');
}

function legalLinks(legal = {}) {
  const labels = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    disclaimer: 'Disclaimer',
    cookiePolicy: 'Cookie Policy',
    dataDeletion: 'Data Deletion',
    support: 'Support',
  };
  return Object.entries(legal)
    .map(([key, url]) => `<a href="${esc(url)}" class="block text-sm text-dark-700/70 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">${labels[key] ?? key}</a>`)
    .join('');
}

function renderDetail(app) {
  const root = document.getElementById('app-detail-root');
  root.innerHTML = `
    <section class="relative overflow-hidden bg-gradient-hero pb-20 pt-40 sm:pt-48">
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="bg-blob left-[-10%] top-0 h-96 w-96 bg-primary-600"></div>
        <div class="bg-blob right-[-5%] top-20 h-96 w-96 bg-secondary-600"></div>
      </div>
      <div class="container-page">
        <a href="/apps.html" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"><i data-lucide="arrow-left" class="h-4 w-4"></i> All Apps</a>
        <div class="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <img src="${esc(app.logo)}" alt="${esc(app.name)} logo" class="h-20 w-20 rounded-2xl shadow-glow" width="80" height="80" />
          <div>
            <h1 class="font-display text-3xl font-extrabold text-white sm:text-4xl">${esc(app.name)}</h1>
            <p class="mt-2 max-w-2xl text-lg text-slate-300">${esc(app.tagline)}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              ${app.platform.map((p) => `<span class="badge bg-white/10 text-white ring-1 ring-inset ring-white/20">${esc(p)}</span>`).join('')}
              <span class="badge bg-white/10 text-white ring-1 ring-inset ring-white/20">v${esc(app.version)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section !pt-16">
      <div class="container-page grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <img src="${esc(app.banner)}" alt="${esc(app.name)} banner" loading="lazy" class="w-full rounded-2xl shadow-glass" />

          <h2 class="mt-12 font-display text-2xl font-bold text-dark-900 dark:text-white">About ${esc(app.name)}</h2>
          <p class="mt-4 leading-relaxed text-dark-700/80 dark:text-slate-400">${esc(app.description)}</p>

          <h2 class="mt-10 font-display text-2xl font-bold text-dark-900 dark:text-white">Features</h2>
          <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            ${app.features.map((f) => `<li class="flex items-start gap-2 text-sm text-dark-700/80 dark:text-slate-400"><i data-lucide="check-circle-2" class="mt-0.5 h-4 w-4 shrink-0 text-primary-500"></i>${esc(f)}</li>`).join('')}
          </ul>

          ${app.gallery?.length ? `
          <h2 class="mt-10 font-display text-2xl font-bold text-dark-900 dark:text-white">Gallery</h2>
          <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            ${app.gallery.map((g) => `<img src="${esc(g)}" alt="${esc(app.name)} screenshot" loading="lazy" class="w-full rounded-xl border border-dark-900/10 dark:border-white/10" />`).join('')}
          </div>` : ''}

          <h2 class="mt-10 font-display text-2xl font-bold text-dark-900 dark:text-white">Changelog</h2>
          <ol class="mt-4 space-y-6 border-l-2 border-primary-500/20 pl-6">
            ${app.changelog.map((c) => `
            <li class="relative">
              <span class="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary-500"></span>
              <p class="font-semibold text-dark-900 dark:text-white">v${esc(c.version)} <span class="font-normal text-dark-700/50 dark:text-slate-500">— ${new Date(c.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
              <ul class="mt-1 list-inside list-disc text-sm text-dark-700/70 dark:text-slate-400">${c.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
            </li>`).join('')}
          </ol>
        </div>

        <aside class="space-y-6">
          <div class="card-glass space-y-3 p-6">
            <h3 class="font-display text-sm font-bold uppercase tracking-wide text-dark-900 dark:text-white">Download</h3>
            ${downloadButtons(app.downloads) || '<p class="text-sm text-dark-700/60 dark:text-slate-400">Coming soon.</p>'}
          </div>
          <div class="card-glass space-y-3 p-6">
            <h3 class="font-display text-sm font-bold uppercase tracking-wide text-dark-900 dark:text-white">Links</h3>
            ${linkButtons(app.links) || '<p class="text-sm text-dark-700/60 dark:text-slate-400">No external links yet.</p>'}
          </div>
          <div class="card-glass space-y-2 p-6">
            <h3 class="font-display text-sm font-bold uppercase tracking-wide text-dark-900 dark:text-white">Legal</h3>
            ${legalLinks(app.legal)}
          </div>
        </aside>
      </div>
    </section>
  `;

  createIcons({ icons });
  refreshAOS();
}

async function bootstrap() {
  const slug = document.getElementById('app-detail-root')?.dataset.slug;
  if (!slug) return;
  try {
    const app = await fetchJson(`/data/apps/${slug}.json`);
    renderDetail(app);
  } catch (err) {
    document.getElementById('app-detail-root').innerHTML = `<div class="container-page py-32 text-center"><p class="text-lg text-dark-700 dark:text-slate-300">App not found.</p></div>`;
    console.error(err);
  }
}

document.addEventListener('mtpcode:ready', bootstrap);
