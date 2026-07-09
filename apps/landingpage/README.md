# OpenFlashcards — Landing Page

Marketing landing page for [OpenFlashcards](https://github.com/HelioFernandes404/openflashcards),
a free, self-hosted flashcard app with FSRS spaced repetition and text-to-speech.

Built with [Astro](https://astro.build) + React islands, Tailwind CSS 4, and static
i18n for 9 locales. Deployed to GitHub Pages at
https://heliofernandes404.github.io/openflashcards/.

## Stack

- **Framework**: Astro 5 + React islands
- **Styling**: Tailwind CSS 4
- **i18n**: custom dot-notation translations in `src/i18n/locales/` (en, pt, es, fr, de, it, ja, zh, ko)
- **Deploy**: GitHub Pages via `.github/workflows/pages.yml` at the repo root

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server (localhost:4321)
npm run check     # astro check (type-check)
npm run build     # astro check && astro build -> dist/
npm run preview   # preview the production build
npm run lint      # eslint
```

## Structure

```
src/
├── components/     # Astro components + React islands
├── i18n/           # translation utilities + locale JSON files
├── layouts/        # Layout.astro (head, SEO, structured data)
├── pages/          # index.astro (default locale) + [lang]/index.astro
├── global.css      # Tailwind entry
public/             # static assets, robots.txt
```

## Notes

- `astro.config.mjs` sets `site` and `base` for GitHub Pages
  (`https://heliofernandes404.github.io` + `/openflashcards`). Any internal link or
  asset path must go through `withBase()` / `getLocalizedPath()` from
  `src/i18n/utils.ts` so it resolves under the `/openflashcards/` base path.
- `@astrojs/sitemap` generates `sitemap-index.xml` at build time.
- No analytics, waitlist form, or backend calls — this is a static page only.
