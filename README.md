# MTPCode

> Building Powerful Software, Mobile Apps & Digital Solutions

Official developer platform for **Manoranjan Das** — [mtpcode.com](https://mtpcode.com)

Showcases Android apps, desktop software, ERP systems, web applications, IoT projects, APIs and open-source projects, plus a blog, documentation hub, download center, and per-app legal pages.

## Tech stack

HTML5 · Tailwind CSS · Vanilla JavaScript · Vite · GSAP · AOS · Lucide Icons · Chart.js · Google Analytics 4

Version 1 is fully static — no backend, no database. All content is data-driven from JSON files under `/public/data`. See [ARCHITECTURE.md](ARCHITECTURE.md) for how it's wired and [CLAUDE.md](CLAUDE.md) for conventions. A future version will migrate to Laravel; the architecture is designed for that migration to be straightforward.

## Getting started

```bash
npm install
npm run dev
```

Build for production (also regenerates `sitemap.xml` via `prebuild`):

```bash
npm run build
npm run preview
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run sitemap` | Regenerate `public/sitemap.xml` from HTML pages |
| `npm run build` | Auto-run sitemap, then Vite production build → `dist/` |
| `npm run preview` | Preview the production build locally |

## Analytics

Site-wide Google Analytics 4 is loaded from `assets/js/analytics.js` (imported by `main.js`, so every page gets it).

- Measurement ID: `G-N6B85V6N32`
- Realtime data appears in the [GA4 property](https://analytics.google.com/) after deploy

## SEO & Search Console

- Sitemap (auto-generated on every build): [https://mtpcode.com/sitemap.xml](https://mtpcode.com/sitemap.xml)
- Generator: `scripts/generate-sitemap.js` — scans public HTML pages, skips `404.html` and `/legal/**` (disallowed in `robots.txt`)
- Robots: [https://mtpcode.com/robots.txt](https://mtpcode.com/robots.txt) (points Search Console at the sitemap)

Submit the sitemap URL in Google Search Console if you have not already.

## Deploy

Pushes to `master` trigger GitHub Actions (`.github/workflows/deploy.yml`), which builds and publishes to GitHub Pages for **mtpcode.com**.

## Project status

See [TODO.md](TODO.md) for the phase-by-phase build roadmap and [CHANGELOG.md](CHANGELOG.md) for what has shipped.

## License

See [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
