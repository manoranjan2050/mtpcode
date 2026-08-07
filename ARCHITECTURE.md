# ARCHITECTURE — MTPCode

## Overview

Static multi-page site built with Vite. No server, no database. Content lives in JSON, rendered client-side by vanilla JS modules. Designed so a future Laravel migration can lift the JSON shapes almost directly into Eloquent models/migrations, and the partials map to Blade components.

## Folder structure

```
/                     Page entry points (index.html, apps.html, projects.html, blog.html,
                       downloads.html, about.html, contact.html, privacy.html, terms.html, 404.html)
/assets
  /css                Tailwind entry (input.css) — bundled by Vite, not in public/
  /js                 ES modules: partials.js, theme.js, icons.js, renderers.js, main.js,
                       + per-page entries (home.js, apps-listing.js, app-detail.js, etc.)
                       — bundled by Vite, not in public/
/public               Vite's publicDir — copied byte-for-byte to the site root on build.
                       Anything referenced only by a runtime fetch() or a plain absolute
                       <a href>/<img src> string (never a static <script>/<link> Vite can
                       trace, and never a JS `import`) MUST live here or it silently won't
                       exist in `dist/`. See "Why /public" below.
  /components          HTML partials: header.html, footer.html — fetched at runtime by
                       assets/js/partials.js via fetch('/components/header.html')
  /data                site.json, testimonials.json, downloads.json,
                       /apps/<slug>.json, /projects/<slug>.json, /blog/<slug>.json
                       — all fetched at runtime, never statically imported
  /downloads           Release assets (APK/ZIP/firmware/PDF), linked via <a href> strings
  /assets/images       App/project/blog/testimonial imagery, referenced via JSON fields
                       and JS-generated <img src> strings
  /assets/icons        Favicons + PWA icons, referenced via absolute <link href> and from
                       inside site.webmanifest's own JSON (which Vite can't parse for assets)
  site.webmanifest, robots.txt, sitemap.xml
/apps/<slug>.html     App detail pages — explicit Vite HTML entries (see vite.config.js)
/projects/<slug>.html Project detail pages — explicit Vite HTML entries
/blog/<slug>.html     Blog post pages — explicit Vite HTML entries
/legal/<app-slug>/    Per-app privacy.html, terms.html, disclaimer.html, cookie-policy.html,
                       data-deletion.html, support.html — explicit Vite HTML entries
/docs                 Public documentation pages — explicit Vite HTML entry
```

### Why `/public`

Vite's production build only includes files that are either (a) a Rollup HTML input
(the root-level and `apps/projects/blog/legal/docs` `*.html` files, wired up in
`vite.config.js`), (b) reachable via a static `<script type="module" src>` / `import`
Vite can trace, or (c) sitting in the `public/` directory, which is copied to `dist/`
verbatim and untouched (no hashing, no rewriting).

Everything in this site that's read via `fetch()` at runtime (partials, JSON data) or
referenced only as a literal string (JSON `logo`/`banner` fields, download `<a href>`,
the icon paths *inside* `site.webmanifest`) is invisible to Vite's static analysis. A
build that leaves those files outside `public/` will look correct in `npm run dev`
(which just serves the whole project root) and then 404 everything — including the
header/footer partials — the moment you run `npm run build` + `vite preview` or deploy.
**Always verify with a production build, not just the dev server** (see Phase 11 in
TODO.md for how this was caught).

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
