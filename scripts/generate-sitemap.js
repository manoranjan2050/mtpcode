/**
 * Generates public/sitemap.xml from Vite HTML page entries.
 * Runs on every `npm run build` (via prebuild) so Search Console stays in sync.
 *
 * Excludes: 404.html, /legal/** (robots.txt Disallow), public/, node_modules/, dist/
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const SITE = 'https://mtpcode.com';
const OUT = resolve(root, 'public/sitemap.xml');

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'public', 'assets', 'scripts']);

function collectHtml(dir, prefix = '') {
  const pages = [];
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name) || name === 'legal') continue;
      pages.push(...collectHtml(full, `${prefix}${name}/`));
    } else if (name.endsWith('.html') && name !== '404.html') {
      pages.push({
        path: `${prefix}${name}`,
        mtime: st.mtime,
      });
    }
  }
  return pages;
}

function locFor(path) {
  if (path === 'index.html') return `${SITE}/`;
  return `${SITE}/${path}`;
}

function metaFor(path) {
  if (path === 'index.html') return { changefreq: 'weekly', priority: '1.0' };
  if (['apps.html', 'projects.html', 'blog.html', 'downloads.html'].includes(path)) {
    return { changefreq: 'weekly', priority: '0.9' };
  }
  if (path.startsWith('apps/')) return { changefreq: 'monthly', priority: '0.8' };
  if (path.startsWith('projects/')) return { changefreq: 'monthly', priority: '0.7' };
  if (path.startsWith('blog/')) return { changefreq: 'yearly', priority: '0.6' };
  if (path === 'privacy.html' || path === 'terms.html') {
    return { changefreq: 'yearly', priority: '0.3' };
  }
  return { changefreq: 'monthly', priority: '0.6' };
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

const rootPages = collectHtml(root);
rootPages.sort((a, b) => {
  if (a.path === 'index.html') return -1;
  if (b.path === 'index.html') return 1;
  return a.path.localeCompare(b.path);
});

const urls = rootPages
  .map(({ path, mtime }) => {
    const { changefreq, priority } = metaFor(path);
    return `  <url><loc>${locFor(path)}</loc><lastmod>${formatDate(mtime)}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(OUT, xml, 'utf8');
console.log(`sitemap.xml → ${relative(root, OUT)} (${rootPages.length} URLs)`);
