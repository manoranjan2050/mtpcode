import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

const root = resolve(__dirname);

function collectHtmlInputs(dir, baseKeyPrefix = '') {
  const entries = {};
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    if (statSync(full).isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(name)) continue;
      Object.assign(entries, collectHtmlInputs(full, `${baseKeyPrefix}${name}/`));
    } else if (name.endsWith('.html')) {
      const key = `${baseKeyPrefix}${name.replace(/\.html$/, '')}`;
      entries[key] = full;
    }
  }
  return entries;
}

const rootHtml = {};
for (const name of readdirSync(root)) {
  if (name.endsWith('.html')) {
    rootHtml[name.replace(/\.html$/, '')] = resolve(root, name);
  }
}

const input = {
  ...rootHtml,
  ...collectHtmlInputs(resolve(root, 'apps'), 'apps/'),
  ...collectHtmlInputs(resolve(root, 'projects'), 'projects/'),
  ...collectHtmlInputs(resolve(root, 'blog'), 'blog/'),
  ...collectHtmlInputs(resolve(root, 'legal'), 'legal/'),
  ...collectHtmlInputs(resolve(root, 'docs'), 'docs/'),
};

export default defineConfig({
  root,
  build: {
    outDir: 'dist',
    rollupOptions: { input },
  },
  server: {
    port: 5173,
  },
});
