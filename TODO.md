# TODO — MTPCode Build Roadmap

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Phase 1 — Project Structure
- [x] Clone empty repo, create folder structure (`assets`, `data`, `components`, `apps`, `projects`, `blog`, `downloads`, `legal`, `docs`)
- [x] CLAUDE.md, TODO.md, ARCHITECTURE.md, README.md
- [ ] package.json, vite.config.js, tailwind.config.js, postcss.config.js
- [ ] .gitignore, LICENSE, CONTRIBUTING.md, CHANGELOG.md
- [ ] Initial commit + push

## Phase 2 — Design System
- [ ] Tailwind theme: color palette, typography scale, spacing, glassmorphism utilities
- [ ] Google Fonts integration
- [ ] Dark mode toggle (class strategy + localStorage persistence)
- [ ] Base component styles: buttons, cards, badges, inputs
- [ ] Animation utilities (AOS init, GSAP helpers)
- [ ] Loading animation + skeleton loaders

## Phase 3 — Navigation
- [ ] Header partial (logo, nav links, dark mode toggle, mobile menu)
- [ ] Footer partial (links, social, newsletter signup, copyright)
- [ ] Partial include system (`assets/js/partials.js`)
- [ ] Active-link highlighting, smooth scroll, sticky/glass header on scroll

## Phase 4 — Home Page
- [ ] Hero (animated gradient background, typing effect, CTA buttons)
- [ ] Animated stats counters
- [ ] Featured Apps section (from JSON)
- [ ] Featured Projects section (from JSON)
- [ ] Technology stack section
- [ ] Latest blog posts section
- [ ] Latest GitHub projects (static JSON snapshot)
- [ ] Testimonials carousel
- [ ] Newsletter signup (static form, no backend — mailto or 3rd-party form action)
- [ ] Footer

## Phase 5 — Apps
- [ ] `data/apps/*.json` for each real app (Calc2Pay, ThermalDesk, MTP Pharma ERP, smart_sip_calculator, etc.)
- [ ] `apps.html` listing/grid page with filters
- [ ] App detail template + per-app JS renderer (logo, banner, gallery, features, version, platform, download links, changelog)
- [ ] Per-app changelog data

## Phase 6 — Projects
- [ ] `data/projects/*.json` for real projects (MTPDeploy, CryptoAlphaScanner, MTPsuite, Kavach, IndiaResultsHub, Helishield, etc.)
- [ ] `projects.html` listing/grid + filter by tech/status
- [ ] Project detail sections (screenshots, tech badges, GitHub/demo links, status)

## Phase 7 — Blog
- [ ] Markdown-based post pipeline (author in `/data/blog/*.md` or `.json` + rendered HTML)
- [ ] `blog.html` listing with categories/tags/search
- [ ] Post detail page template
- [ ] Related articles logic

## Phase 8 — Downloads
- [ ] `downloads.html` central download center (APK/ZIP/PDF/firmware)
- [ ] Release notes per item

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
