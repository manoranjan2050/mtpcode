import './main.js';
import { renderIcons } from './icons.js';
import { fetchJson } from './renderers.js';
import { refreshAOS } from './animations.js';

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const COMING_SOON = 'coming-soon';

function isComingSoon(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === COMING_SOON;
}

function playStoreBadge({ href, comingSoon = false, appName = 'This app' } = {}) {
  const icon = `
    <svg class="h-7 w-7 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M3.6 2.2 13.3 12 3.6 21.8c-.5-.3-.8-.9-.8-1.5V3.7c0-.6.3-1.2.8-1.5z"/>
      <path fill="#FBBC04" d="M17.5 8.3 14.4 11l-1.1-1 3.3-3.4c.4.2.8.5.9.9z"/>
      <path fill="#4285F4" d="m13.3 12 1.1 1.1 3.1 2.6c.4-.3.7-.8.7-1.4 0-.5-.2-1-.6-1.4L13.3 12z"/>
      <path fill="#34A853" d="M3.6 21.8 13.3 12l1.1 1.1-9.4 9.5c-.5-.2-1-.6-1.4-.8z"/>
    </svg>`;
  if (comingSoon) {
    return `
      <div class="relative overflow-hidden rounded-2xl bg-[#01875f] p-4 text-white shadow-lg ring-1 ring-black/5">
        <div class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
        <div class="flex items-center gap-3">
          ${icon}
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">Get it on</p>
            <p class="font-display text-lg font-bold leading-tight">Google Play</p>
          </div>
          <span class="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">Coming soon</span>
        </div>
        <p class="mt-3 text-xs text-white/85">${esc(appName)} is preparing for Play Store launch. Check back shortly.</p>
      </div>`;
  }
  return `
    <a href="${esc(href)}" target="_blank" rel="noopener noreferrer"
      class="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[#01875f] p-4 text-white shadow-lg ring-1 ring-black/5 transition hover:brightness-110">
      ${icon}
      <div class="min-w-0">
        <p class="text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">Get it on</p>
        <p class="font-display text-lg font-bold leading-tight">Google Play</p>
      </div>
    </a>`;
}

function downloadButtons(downloads = {}) {
  const labels = {
    apk: 'Download App',
    zip: 'Download ZIP',
    pdf: 'Download PDF',
    firmware: 'Download Firmware',
  };
  return Object.entries(downloads)
    .filter(([, url]) => url)
    .map(([key, url]) => {
      if (isComingSoon(url)) {
        return `
          <button type="button" disabled
            class="btn-primary w-full cursor-not-allowed opacity-80 !shadow-none hover:!scale-100">
            <i data-lucide="download" class="h-4 w-4"></i>
            ${labels[key] ?? 'Download App'}
            <span class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Coming soon</span>
          </button>
          <p class="text-center text-xs text-dark-700/60 dark:text-slate-400">APK download will be available with the Play Store release.</p>`;
      }
      return `<a href="${esc(url)}" class="btn-primary w-full" download><i data-lucide="download" class="h-4 w-4"></i> ${labels[key] ?? 'Download'}</a>`;
    })
    .join('');
}

function linkButtons(links = {}, appName = 'This app') {
  const meta = {
    website: { label: 'Website', icon: 'globe' },
    docs: { label: 'Documentation', icon: 'book-open' },
  };
  const parts = [];

  if (links.playstore) {
    parts.push(
      playStoreBadge({
        href: isComingSoon(links.playstore) ? '' : links.playstore,
        comingSoon: isComingSoon(links.playstore),
        appName,
      })
    );
  }

  Object.entries(links)
    .filter(([key, url]) => url && key !== 'playstore' && key !== 'github' && !isComingSoon(url))
    .forEach(([key, url]) => {
      parts.push(
        `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="btn-outline w-full !justify-start"><i data-lucide="${meta[key]?.icon ?? 'link'}" class="h-4 w-4"></i> ${meta[key]?.label ?? key}</a>`
      );
    });

  return parts.join('');
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
  const linksHtml = linkButtons(app.links || {}, app.name);
  const downloadsHtml = downloadButtons(app.downloads || {});
  const underConstruction = app.status === 'under-construction';
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
              ${underConstruction
                ? `<span class="badge bg-amber-500 text-white ring-1 ring-inset ring-white/20">Under construction</span>`
                : `<span class="badge bg-white/10 text-white ring-1 ring-inset ring-white/20">v${esc(app.version)}</span>`}
            </div>
          </div>
        </div>
      </div>
    </section>

    ${underConstruction ? `
    <section class="border-b border-amber-500/20 bg-amber-500/10">
      <div class="container-page flex flex-wrap items-center gap-3 py-4 text-sm text-amber-900 dark:text-amber-200">
        <i data-lucide="construction" class="h-4 w-4 shrink-0"></i>
        <p><strong>${esc(app.name)}</strong> is under construction. Download and Google Play will unlock at launch.</p>
      </div>
    </section>` : ''}

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
            ${downloadsHtml || '<p class="text-sm text-dark-700/60 dark:text-slate-400">Coming soon.</p>'}
          </div>
          ${linksHtml ? `
          <div class="card-glass space-y-3 p-6">
            <h3 class="font-display text-sm font-bold uppercase tracking-wide text-dark-900 dark:text-white">Get the app</h3>
            ${linksHtml}
          </div>` : ''}
          <div class="card-glass space-y-2 p-6">
            <h3 class="font-display text-sm font-bold uppercase tracking-wide text-dark-900 dark:text-white">Legal</h3>
            ${legalLinks(app.legal)}
          </div>
        </aside>
      </div>
    </section>
  `;

  renderIcons();
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
