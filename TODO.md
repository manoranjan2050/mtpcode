# TODO — MTPCode Build Roadmap

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Phase 1 — Project Structure
- [x] Clone empty repo, create folder structure (`assets`, `data`, `components`, `apps`, `projects`, `blog`, `downloads`, `legal`, `docs`)
- [x] CLAUDE.md, TODO.md, ARCHITECTURE.md, README.md
- [ ] package.json, vite.config.js, tailwind.config.js, postcss.config.js
- [ ] .gitignore, LICENSE, CONTRIBUTING.md, CHANGELOG.md
- [ ] Initial commit + push

## Phase 2 — Design System ✅
- [x] Tailwind theme: color palette, typography scale, spacing, glassmorphism utilities
- [x] Google Fonts integration
- [x] Dark mode toggle (class strategy + localStorage persistence)
- [x] Base component styles: buttons, cards, badges, inputs
- [x] Animation utilities (AOS init, GSAP helpers)
- [x] Loading animation + skeleton loaders

## Phase 3 — Navigation ✅
- [x] Header partial (logo, nav links, dark mode toggle, mobile menu)
- [x] Footer partial (links, social, newsletter signup, copyright)
- [x] Partial include system (`assets/js/partials.js`)
- [x] Active-link highlighting, smooth scroll, sticky/glass header on scroll

## Phase 4 — Home Page ✅
- [x] Hero (animated gradient background, typing effect, CTA buttons)
- [x] Animated stats counters
- [x] Featured Apps section (from JSON)
- [x] Featured Projects section (from JSON)
- [x] Technology stack section
- [x] Latest blog posts section
- [x] Latest GitHub projects (static JSON snapshot)
- [x] Testimonials carousel
- [x] Newsletter signup (static form, no backend — mailto or 3rd-party form action)
- [x] Footer
- [x] Verified in browser: dark mode toggle, all data-driven sections, no console/network errors

## Phase 5 — Apps ✅
- [x] `data/apps/*.json` for each real app (Calc2Pay, ThermalDesk, MTP Pharma ERP, Smart SIP Calculator)
- [x] `apps.html` listing/grid page with category filters
- [x] App detail template + per-app JS renderer (logo, banner, gallery, features, version, platform, download links, changelog)
- [x] Per-app changelog data
- [x] Verified in browser: listing filters and a detail page render with no console errors

## Phase 6 — Projects ✅
- [x] `data/projects/*.json` for real projects (MTPDeploy, CryptoAlphaScanner, MTPsuite, Helishield, Ferroload)
- [x] `projects.html` listing/grid + filter by status
- [x] Project detail sections (screenshots, tech badges, GitHub/demo links, status)
- [x] Verified in browser: listing filters and a detail page render with no console errors

## Phase 7 — Blog ✅
- [x] Post content pipeline (`/data/blog/*.json` with pre-rendered `bodyHtml`)
- [x] `blog.html` listing with category filter + live search
- [x] Post detail page template (`assets/js/blog-detail.js`) with tags
- [x] Related articles logic (same-category, falls back to latest others)
- [x] Verified in browser: search filtering and a detail page with related articles render with no console errors

## Phase 8 — Downloads ✅
- [x] `downloads.html` central download center (APK/ZIP/PDF/firmware) with type filters
- [x] Release notes per item (expandable), `data/downloads.json`
- [x] Placeholder release assets under `/downloads/**` (clearly marked dev-only; swap for real signed builds before launch)
- [x] Verified in browser: filters and release-notes disclosure render with no console errors

## Phase 9 — Legal Pages
- [ ] Site-wide privacy.html / terms.html / 404.html
- [ ] Per-app legal pages under `/legal/<slug>/` (privacy, terms, disclaimer, cookie-policy, data-deletion, support)

## Phase 10 — SEO
- [ ] Meta tags, Open Graph, Twitter Cards per page
- [ ] JSON-LD structured data (Organization, Person, SoftwareApplication, BlogPosting)
- [ ] robots.txt, sitemap.xml
- [ ] Web manifest + favicons

## Phase 11 — Performance
- [ ] Image lazy-loading, asset optimization
- [ ] Lighthouse pass (target 90+ across categories)
- [ ] Bundle/code-split check via Vite build output

## Phase 12 — GitHub Pages Deployment
- [ ] GitHub Actions workflow to build + deploy to Pages
- [ ] Custom domain (CNAME for mtpcode.com)
- [ ] Final push + verify live site

---
Last updated: 2026-08-07
