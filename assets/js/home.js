import './main.js';
import { renderIcons } from './icons.js';
import { typeEffect, heroEntrance, animateCounters, refreshAOS } from './animations.js';
import {
  fetchJson,
  fetchCollection,
  appCard,
  projectCard,
  githubProjectItem,
  blogCard,
  techBadge,
} from './renderers.js';

async function renderStats(site) {
  const root = document.getElementById('stats-root');
  if (!root) return;
  root.innerHTML = site.stats
    .map(
      (s) => `
    <div data-aos="fade-up" class="text-center">
      <p class="font-display text-4xl font-extrabold gradient-text sm:text-5xl" data-counter="${s.value}" data-suffix="${s.suffix ?? ''}">0</p>
      <p class="mt-2 text-sm font-medium text-dark-700/70 dark:text-slate-400">${s.label}</p>
    </div>`
    )
    .join('');
  animateCounters();
}

async function renderFeaturedApps() {
  const root = document.getElementById('featured-apps-root');
  if (!root) return;
  const apps = (await fetchCollection('/data/apps')).filter((a) => a.featured);
  root.innerHTML = apps.map(appCard).join('');
}

async function renderFeaturedProjects() {
  const root = document.getElementById('featured-projects-root');
  if (!root) return;
  const projects = (await fetchCollection('/data/projects')).filter((p) => p.featured);
  root.innerHTML = projects.map(projectCard).join('');
}

async function renderTechStack(site) {
  const root = document.getElementById('tech-stack-root');
  if (!root) return;
  root.innerHTML = site.techStack.map(techBadge).join('');
}

async function renderGithubProjects(site) {
  const root = document.getElementById('github-projects-root');
  if (!root) return;
  root.innerHTML = site.githubProjects.map(githubProjectItem).join('');
}

async function renderLatestBlogs() {
  const root = document.getElementById('latest-blogs-root');
  if (!root) return;
  const posts = (await fetchCollection('/data/blog')).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  root.innerHTML = posts.map(blogCard).join('');
}

function initHero() {
  const typedEl = document.getElementById('hero-typed');
  if (typedEl) {
    typeEffect(typedEl, ['Android Apps.', 'ERP Systems.', 'Web Platforms.', 'IoT Firmware.', 'Open Source Tools.']);
  }
  heroEntrance({
    eyebrow: '#hero-eyebrow',
    heading: '#hero-heading',
    sub: '#hero-sub',
    cta: '#hero-cta',
    art: '#hero-art',
  });
}

async function bootstrapHome() {
  const site = await fetchJson('/data/site.json');
  await Promise.all([
    renderStats(site),
    renderFeaturedApps(),
    // Featured Projects + Latest GitHub Projects disabled for now (re-enable with sections in index.html)
    // renderFeaturedProjects(),
    renderTechStack(site),
    // renderGithubProjects(site),
    renderLatestBlogs(),
  ]);
  renderIcons();
  refreshAOS();
  document.dispatchEvent(new CustomEvent('mtpcode:cards-ready'));
}

document.addEventListener('mtpcode:ready', () => {
  initHero();
  bootstrapHome();
});
