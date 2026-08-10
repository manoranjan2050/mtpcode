# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Changed
- IDPhotoCraft marketing page now uses real store PNG assets (logo, banner, card, gallery) matching the Denomiq app-page pattern, with docs hub link and updated OG/JSON-LD

### Added
- IDPhotoCraft app page (`/apps/idphotocraft.html`), data JSON, SVG assets, and legal suite (`/legal/idphotocraft/`) for Play Store privacy/terms URLs
- DocZest legal page suite (`/legal/doczest/`: privacy, terms, disclaimer, cookie-policy, data-deletion, support) — 5th app to get the standard 6-doc set from Phase 9, generated for the app's Play Store submission
- Phase 1: Project structure, planning docs (CLAUDE.md, TODO.md, ARCHITECTURE.md, README.md)
- Phase 2: Design system — Tailwind theme, Google Fonts, dark mode, base components, page loader, skeletons
- Phase 3: Navigation — header/footer partials, client-side include system, active-link + scroll behavior
- Phase 4: Home page — hero with typing effect, animated stats, featured apps/projects, tech stack, GitHub projects, blog, testimonials, newsletter CTA; realistic JSON content for 4 apps, 5 projects, 3 blog posts
- Phase 5: Apps showcase (listing + detail pages)
- Phase 6: Projects showcase (listing + detail pages)
- Phase 7: Blog (listing, search, detail, related articles)
- Phase 8: Download center
- Phase 9: Legal pages (site-wide + per-app suite of 6 docs x 4 apps)
- Phase 10: SEO (meta/OG/Twitter, JSON-LD, robots.txt, sitemap.xml, manifest, favicons) + about/contact/docs pages
- Phase 11: Performance — lucide icon tree-shaking (JS bundle 685KB → 110KB); moved
  runtime-fetched assets (components, data, downloads, images, icons, manifest) into
  Vite's `public/` dir after a production build revealed they were missing entirely
- Phase 12: GitHub Pages deployment — GitHub Actions workflow, switched Pages source to
  Actions-based build, custom domain configured (mtpcode.com), verified a full
  build+deploy run end-to-end. DNS still needs to be pointed at GitHub by the domain owner.
