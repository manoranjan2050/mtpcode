import './main.js';
import { renderIcons } from './icons.js';
import { fetchCollection, blogCard } from './renderers.js';
import { refreshAOS } from './animations.js';

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderDetail(post, related) {
  const root = document.getElementById('blog-detail-root');
  root.innerHTML = `
    <section class="relative overflow-hidden bg-gradient-hero pb-16 pt-40 sm:pt-48">
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="bg-blob left-[-10%] top-0 h-96 w-96 bg-primary-600"></div>
      </div>
      <div class="container-page max-w-3xl">
        <a href="/blog.html" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"><i data-lucide="arrow-left" class="h-4 w-4"></i> All Articles</a>
        <div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span class="badge-secondary">${esc(post.category)}</span>
          <span>${new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>&middot;</span>
          <span>${post.readMinutes} min read</span>
        </div>
        <h1 class="mt-4 text-balance font-display text-3xl font-extrabold text-white sm:text-4xl">${esc(post.title)}</h1>
        <p class="mt-4 text-lg text-slate-300">${esc(post.excerpt)}</p>
        <p class="mt-4 text-sm text-slate-400">By ${esc(post.author)}</p>
      </div>
    </section>

    <section class="section !pt-16">
      <div class="container-page max-w-3xl">
        <img src="${esc(post.coverImage)}" alt="${esc(post.title)}" loading="lazy" class="w-full rounded-2xl shadow-glass" />
        <article class="prose-article mt-10">${post.bodyHtml}</article>

        <div class="mt-10 flex flex-wrap gap-2 border-t border-dark-900/10 pt-8 dark:border-white/10">
          ${post.tags.map((t) => `<span class="badge-neutral">#${esc(t)}</span>`).join('')}
        </div>
      </div>
    </section>

    ${related.length ? `
    <section class="section bg-dark-50 dark:bg-white/[0.02]">
      <div class="container-page">
        <h2 class="text-center font-display text-2xl font-bold text-dark-900 dark:text-white">Related Articles</h2>
        <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">${related.map(blogCard).join('')}</div>
      </div>
    </section>` : ''}
  `;
  renderIcons();
  refreshAOS();
}

async function bootstrap() {
  const slug = document.getElementById('blog-detail-root')?.dataset.slug;
  if (!slug) return;
  try {
    const posts = await fetchCollection('/data/blog');
    const post = posts.find((p) => p.slug === slug);
    if (!post) throw new Error('Post not found');
    const related = posts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
    renderDetail(post, related.length ? related : posts.filter((p) => p.slug !== slug).slice(0, 3));
  } catch (err) {
    document.getElementById('blog-detail-root').innerHTML = `<div class="container-page py-32 text-center"><p class="text-lg text-dark-700 dark:text-slate-300">Article not found.</p></div>`;
    console.error(err);
  }
}

document.addEventListener('mtpcode:ready', bootstrap);
