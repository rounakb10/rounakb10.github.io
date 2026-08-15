# FolioForge Vue Portfolio Website

A personal portfolio for Rounak Biswas, built with Vue 3, Vite, Vuetify, Tailwind CSS, Vue Router, and YAML-backed content. The site presents an about section, technical skills, work experience, projects, and contact details through a static frontend hosted on GitHub Pages. Most of the original template's academic-focused sections (research interests, publications, teaching, affiliations, workshops, etc.) are turned off via feature flags in `src/config/featureFlags.ts` since they don't apply here.

For a deeper architecture and maintenance guide, see [CONTEXT.md](CONTEXT.md).

## Tech Stack

- Vue 3 with single-file components
- Vite 7 for development and production builds
- Vue Router 4 with hash-based routing
- Vuetify 3 and Material Design Icons
- Tailwind CSS 3 with custom theme colors
- Font Awesome Vue support for selected brand icons
- YAML content imports through `@modyfi/vite-plugin-yaml`
- `vite-plugin-sitemap` for sitemap generation

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run lint` | Run ESLint across the project. |
| `npm run sync:gallery-manifest` | Regenerate `src/content/galleryImageManifest.yml` from gallery content. |
| `npm run build` | Sync the gallery manifest and build static assets into `dist/`. |
| `npm run preview` | Preview the built `dist/` output locally. |

## Project Structure

```text
.
├── public/                         Static files copied directly into the build
├── scripts/                        Maintenance scripts
├── src/
│   ├── components/                 Shared layout and reusable UI components
│   ├── config/                     Feature flags and runtime display settings
│   ├── content/                    Gallery content and generated gallery manifest
│   ├── metadata/                   Link, tag, logo, and people metadata
│   ├── router/                     Vue Router setup
│   ├── views/                      Route-level pages
│   ├── App.vue                     Root app shell
│   ├── main.js                     Vue/Vuetify/router bootstrap
│   ├── profile_info.yml            Main portfolio content source
│   └── style.css                   Global styles and Tailwind directives
├── CONTEXT.md                      Detailed project context for maintainers and AI agents
├── vite.config.js                  Vite, YAML, sitemap, and path alias config
├── tailwind.config.js              Tailwind theme and content scan config
├── wrangler.jsonc                  Cloudflare static asset deployment config
└── package.json                    Dependencies and npm scripts
```

## Content Editing

Most portfolio content lives in [src/profile_info.yml](src/profile_info.yml). Update this file for profile text, contact information, socials, research interests, education, experience, projects, publications, workshops, teaching, affiliations, certifications, and other profile sections.

Gallery items live in [src/content/gallery.yml](src/content/gallery.yml). The gallery uses tag metadata from [src/metadata/galleryTags.yml](src/metadata/galleryTags.yml), hyperlink metadata from [src/metadata/hyperlinkMetadata.yml](src/metadata/hyperlinkMetadata.yml), and an auxiliary generated manifest at [src/content/galleryImageManifest.yml](src/content/galleryImageManifest.yml).

After editing gallery entries, run:

```bash
npm run sync:gallery-manifest
```

The production build runs this automatically through the `prebuild` script.

## Routes

The app uses `createWebHashHistory()` for static hosting compatibility. Main routes are:

- `/`
- `/projects-publications`
- `/affiliation-memberships`
- `/ongoing-projects`
- `/cocurricular`
- `/workshops-bootcamps-attended`
- `/teachings`
- `/internships-certifications`
- `/professional-activity`
- `/gallery`
- `/contact`

Some pages support tab deep links through query parameters, for example `/projects-publications?tab=articles`.

## Feature Flags

Section visibility is controlled in [src/config/featureFlags.ts](src/config/featureFlags.ts). Route guards, header links, footer links, page tabs, and several page sections read from these flags through `isFeatureEnabled()`.

Use feature flags when temporarily hiding content or when a section should not appear until its YAML content is ready.

## Deployment

The app builds to a static `dist/` directory. This repo deploys to GitHub Pages automatically via [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) on every push to `V1` — it builds with `npm run build` and publishes `dist/` through GitHub's Pages Actions. Enable it once under repo Settings → Pages → Source → "GitHub Actions".

Any other static host that can serve the Vite output (Cloudflare Pages, Netlify, Vercel, etc.) also works if you'd rather deploy elsewhere; `wrangler.jsonc` is left in place for Cloudflare but is unused by default.

The current Vite sitemap hostname is configured as `https://rounakb10.github.io` in [src/router/routes.ts](src/router/routes.ts) (`SITE_URL`). Update it if the production domain changes.

## License

This project is open source under the [MIT License](LICENSE).

