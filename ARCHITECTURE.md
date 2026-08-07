# ARCHITECTURE — MTPCode

## Overview

Static multi-page site built with Vite. No server, no database. Content lives in JSON, rendered client-side by vanilla JS modules. Designed so a future Laravel migration can lift the JSON shapes almost directly into Eloquent models/migrations, and the partials map to Blade components.

## Folder structure

```
/                     Page entry points (index.html, apps.html, projects.html, blog.html,
                       downloads.html, about.html, contact.html, privacy.html, terms.html, 404.html)
/assets
  /css                Tailwind entry (input.css) + compiled output
  /js                 ES modules: partials.js, theme.js, apps-renderer.js, projects-renderer.js,
                       blog-renderer.js, stats.js, animations.js, main.js (per-page entry glue)
  /images             Site imagery, app screenshots, project screenshots
  /icons              Favicons, app icons, manifest icons
  /fonts              Self-hosted font fallbacks (if any; primary via Google Fonts CDN)
/data
  site.json           Global site metadata, stats, tech stack, social links
  testimonials.json   Testimonials list
  /apps/<slug>.json   One file per app (see schema below)
  /projects/<slug>.json  One file per project
  /blog/<slug>.json   One file per blog post (frontmatter-style JSON + HTML body or markdown body)
/components           HTML partials: header.html, footer.html, seo-meta.html (reference), etc.
/apps/<slug>.html     App detail pages (or single template + query param — TBD in Phase 5)
/projects/<slug>.html Project detail pages
/blog/<slug>.html     Blog post pages
/legal/<app-slug>/    Per-app privacy.html, terms.html, disclaimer.html, cookie-policy.html,
                       data-deletion.html, support.html
/downloads            Download center assets/index
/docs                 Public documentation pages
```

## Data schemas

### `data/apps/<slug>.json`
```json
{
  "slug": "calc2pay",
  "name": "Calc2Pay",
  "tagline": "Billing calculator + payment QR generator",
  "logo": "/assets/images/apps/calc2pay/logo.png",
  "banner": "/assets/images/apps/calc2pay/banner.png",
  "gallery": ["/assets/images/apps/calc2pay/1.png"],
  "description": "...",
  "features": ["..."],
  "version": "1.0.0",
  "platform": ["Android"],
  "downloads": { "apk": "/downloads/calc2pay/calc2pay-1.0.0.apk" },
  "links": { "github": "", "playstore": "", "website": "", "docs": "" },
  "legal": { "privacy": "/legal/calc2pay/privacy.html", "terms": "/legal/calc2pay/terms.html", "support": "/legal/calc2pay/support.html" },
  "changelog": [{ "version": "1.0.0", "date": "2026-08-06", "notes": ["..."] }],
  "featured": true,
  "category": "android"
}
```

### `data/projects/<slug>.json`
```json
{
  "slug": "mtpdeploy",
  "name": "MTP Deploy",
  "description": "...",
  "technology": ["Laravel 12", "Filament v5.7"],
  "features": ["..."],
  "images": ["..."],
  "links": { "github": "", "demo": "" },
  "status": "live",
  "featured": true
}
```

### `data/blog/<slug>.json`
```json
{
  "slug": "post-slug",
  "title": "...",
  "excerpt": "...",
  "date": "2026-08-07",
  "category": "...",
  "tags": ["..."],
  "coverImage": "/assets/images/blog/...",
  "bodyHtml": "<p>...</p>"
}
```

## Rendering pattern

Each listing page (`apps.html`, `projects.html`, `blog.html`, home sections) has a small renderer module in `assets/js/` that:
1. `fetch()`s the relevant JSON (index file or directory manifest)
2. Maps records to card templates (JS template literals, escaped)
3. Injects into a `<div data-cards-root>` container

Detail pages read a manifest to find the matching JSON by slug (from filename or a `?slug=` param during static v1) and render full detail markup client-side. When migrated to Laravel, this becomes server-rendered Blade views reading the same JSON-shaped data from the DB.

## Partial include system

`assets/js/partials.js` scans for `[data-include]` elements on `DOMContentLoaded`, fetches the referenced partial, and injects its `innerHTML`. Keeps header/footer DRY across all static pages without a build-time templating step, while remaining plain fetchable HTML (works on GitHub Pages).

## Theming

Tailwind `darkMode: 'class'`. `assets/js/theme.js` toggles a `dark` class on `<html>`, persists preference to `localStorage`, and respects `prefers-color-scheme` on first visit.

## Build & deploy

Vite multi-page config (`vite.config.js`) lists every root HTML file as a Rollup input. `npm run build` outputs to `/dist`. GitHub Actions (Phase 12) builds and publishes `/dist` to the `gh-pages` branch / GitHub Pages, with a `CNAME` file for `mtpcode.com`.
