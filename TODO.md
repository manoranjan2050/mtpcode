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

## Phase 9 — Legal Pages ✅
- [x] Site-wide privacy.html / terms.html / 404.html
- [x] Per-app legal pages under `/legal/<slug>/` (privacy, terms, disclaimer, cookie-policy, data-deletion, support) for all 4 apps — real, app-specific content (permissions, AdMob disclosure, finance disclaimer for Smart SIP Calculator, Kavach licensing note for MTP Pharma ERP)
- [x] App JSON `legal` field updated to link all 6 docs; app-detail.js renders them
- [x] Verified in browser: site 404 page and a per-app privacy page render with no console errors

## Phase 10 — SEO ✅
- [x] Added missing core pages first: about.html, contact.html, docs/index.html (were linked from nav but didn't exist)
- [x] Meta tags, Open Graph, Twitter Cards on all 22 top-level pages (canonical, description, og:*, twitter:card)
- [x] JSON-LD structured data: Person (home), AboutPage (about), SoftwareApplication (4 app pages), BlogPosting (3 posts)
- [x] robots.txt (disallows `/legal/`) + sitemap.xml (22 URLs)
- [x] Web manifest (site.webmanifest) + full favicon set generated from source SVG (16x16, 32x32, apple-touch-icon, 192/512 PWA icons, maskable icon)
- [x] Verified in browser: manifest, robots.txt served correctly; JSON-LD pages load with no console errors

## Phase 11 — Performance ✅
- [x] Image lazy-loading (`loading="lazy"` on all non-hero `<img>`)
- [x] lucide icon tree-shaking: switched from `import { icons } from 'lucide'` to a curated
      `assets/js/icons.js` with named PascalCase imports — shared JS bundle dropped from
      **685.83 kB → 109.80 kB** (gzip 113.55 kB → 39.25 kB), Vite's chunk-size warning gone
- [x] **Found and fixed a real production-build bug via `npm run build && vite preview`**:
      `/components`, `/data`, `/downloads`, `/assets/images`, `/assets/icons`,
      `site.webmanifest`, `robots.txt`, `sitemap.xml` were outside Vite's `public/`
      convention, so the production build silently shipped without header/footer/data —
      worked fine in `npm run dev` (which serves the whole root) but broken in prod. Moved
      them all under `/public/**`, preserving URL paths. See ARCHITECTURE.md "Why /public".
- [x] Verified via `vite preview` (production build): all sections render, 78/78 icons
      resolve, no console errors, images/downloads/manifest all serve correctly

## Phase 12 — GitHub Pages Deployment ✅
- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`): Node 20, `npm ci`, `npm run build`,
      `upload-pages-artifact` + `deploy-pages`, triggered on push to `master`
- [x] Switched repo Pages source from legacy branch-based (pointing at a nonexistent `main`
      branch) to Actions-based (`build_type: workflow`) via the GitHub API
- [x] `public/CNAME` (→ mtpcode.com) + GitHub Pages custom domain set via API (`cname: mtpcode.com`)
- [x] Pushed and watched the workflow run end-to-end: **build succeeded, deploy succeeded**
- [x] Verified live at `https://manoranjan2050.github.io/mtpcode/` — page loads and title/data
      render, but asset paths 404 there since the whole site uses **absolute root paths**
      (`/assets/...`, `/data/...`) by design for the mtpcode.com custom-domain deployment.
      This is expected, not a bug — see note below.
- [ ] **User action required (outside what I can do from here):** point mtpcode.com's DNS at
      GitHub Pages — four `A` records to `185.199.108.153`, `185.199.109.153`,
      `185.199.110.153`, `185.199.111.153` (or a `CNAME` record to `manoranjan2050.github.io`
      if using a `www`/subdomain). Once DNS resolves, GitHub auto-issues the HTTPS cert and
      the site goes live at https://mtpcode.com — no further repo changes needed.

**Note on absolute paths:** the whole site is built assuming it's served from a domain root
(`mtpcode.com/...`), matching the custom-domain deployment plan. It will **not** render
correctly at a GitHub Pages project subpath like `github.io/mtpcode/` (assets 404). Don't
"fix" this by switching to relative paths without re-checking every page — it was a deliberate
tradeoff for the real production target.

---
Last updated: 2026-08-07
