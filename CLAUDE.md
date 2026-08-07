# CLAUDE.md — MTPCode

This file orients any future Claude session working on this repo. Read this first, then [TODO.md](TODO.md) for current status, then [ARCHITECTURE.md](ARCHITECTURE.md) for technical structure.

## What this is

MTPCode (`mtpcode.com`) is Manoranjan Das's official developer platform — a premium, Apple/Vercel/Stripe/Linear-style static website showcasing his Android apps, desktop software, ERP systems, web apps, IoT projects, APIs and open-source work. It also hosts a blog, docs, download center, and legal pages for all his apps.

**Owner:** Manoranjan Das
**Repo:** https://github.com/manoranjan2050/mtpcode
**Domain:** https://mtpcode.com

## Hard constraints (do not violate)

- **Version 1 is 100% static.** No PHP, no Laravel, no backend, no database. Plain HTML5 + Tailwind CSS + vanilla JS + Vite build. Must deploy cleanly to GitHub Pages.
- **All content-driven UI (apps, projects, blogs, testimonials, tech stack, stats) is generated from JSON files in `/data`** at runtime via vanilla JS — never hardcode card markup for content that belongs in JSON.
- **No lorem ipsum / placeholder content.** Every app, project, and blog entry must be realistic and represent Manoranjan's actual work (cross-reference his other projects in memory: Calc2Pay, ThermalDesk, OpenPharma/MTP Pharma ERP, MTPsuite, MTPDeploy, CryptoAlphaScanner, smart_sip_calculator, Helishield, IndiaResultsHub, etc.)
- **Architecture must make a future Laravel migration easy** — keep data/content separated from presentation, keep partials modular, avoid static-only tricks that don't map to server-rendered views/blade components later.
- **Build incrementally, one phase at a time** (see TODO.md phase list). Never leave a phase half-finished before starting the next. Commit after every major milestone.

## Tech stack

- HTML5, Tailwind CSS, Vanilla JS (ES modules), Vite (multi-page build)
- GSAP (scroll/hero animations), AOS (scroll-reveal), Lucide (icons), Chart.js (stats/skill charts)
- Google Fonts, dark mode (class-based, persisted to localStorage), fully responsive 320px→4K

## Conventions

- **Pages** live at repo root as multi-entry Vite HTML files: `index.html`, `apps.html`, `projects.html`, `blog.html`, `downloads.html`, `about.html`, `contact.html`, `privacy.html`, `terms.html`, `404.html`.
- **Partials/components** (`/components/*.html`) are injected client-side via `assets/js/partials.js` using a `data-include="/components/xyz.html"` attribute — keeps nav/footer DRY without a server. Header and footer are the primary partials.
- **Data** (`/data/*.json`, `/data/apps/*.json`, `/data/projects/*.json`, `/data/blog/*.json`) is fetched client-side and rendered into cards by small renderer modules in `assets/js/`. Each JSON record's shape is documented in ARCHITECTURE.md — keep it stable since Laravel migration will map these fields to Eloquent models.
- **Per-app legal pages** live under `/legal/<app-slug>/` (privacy, terms, disclaimer, cookie-policy, data-deletion, support) — generated per app that needs them, not one generic page.
- **Styling**: only the palette defined in `tailwind.config.js` (Primary `#2563EB`, Secondary `#7C3AED`, Accent `#06B6D4`, Dark `#0F172A`) plus Tailwind's neutral grays. No ad-hoc hex colors in markup.
- **Icons**: Lucide only, loaded via the JS package, not inline SVG duplication.
- **Commits**: one commit per completed phase/module, descriptive messages, never mid-phase.

## Where things stand

See [TODO.md](TODO.md) for the live phase checklist and [CHANGELOG.md](CHANGELOG.md) for what's shipped.

## Related projects (for realistic content)

Manoranjan has many live/production apps documented in his global Claude memory (Calc2Pay, ThermalDesk, OpenPharma/MTP Pharma ERP, MTPDeploy, MTPsuite, CryptoAlphaScanner, smart_sip_calculator, Helishield, IndiaResultsHub, AmazingLoot, TradingBlog, OptionWiki, Kavach, Flin/FlinEdge, OpenVyapar/OpenRetail ERP, Manoranjan.dev). Use these as the real content source for the Apps/Projects sections — do not invent unrelated fictional products.
