# Roadmap

Planned work for this site, ordered by visitor impact. Phase 0 fixes things that
are wrong for people using the site today; Phase 3 is the largest but is
invisible to visitors.

This site is a fork of the FolioForge **academic** template being converted into
a **software developer** portfolio. That conversion is roughly half done: the
feature flags are set correctly and the live pages are clean, but the template's
content, components, docs and tooling are still present underneath.

Live surface today is four routes — `/`, `/projects-publications`, `/contact`,
`/privacy-policy` — out of ~1,400 live lines of Vue in a ~11,200-line tree.

Status key: `[x]` done · `[ ]` planned

---

## Phase 0 — Broken or wrong for visitors — **complete** (`551c82b`)

- [x] **0.1 CV button was broken for every visitor.** `profile.yml` pointed at a
  Google Doc export whose link sharing was off; anonymous requests redirected to
  `accounts.google.com` and returned HTML, not a PDF. Now points at the hosted
  `Rounak_Biswas_SDE_Resume.pdf` on Drive, verified to open anonymously.
- [x] **0.2 Privacy policy described things the site no longer does.** It claimed
  links to Google Scholar and ResearchGate and the use of visitor-statistics
  tools, all removed in `a94aa89`. Rewritten to name what actually happens:
  outbound links to GitHub/LinkedIn/Drive, Google Fonts and the GitHub-hosted
  avatar receiving visitor IPs, no analytics, no cookies, GitHub Pages server
  logs.
- [x] **0.3 Quote pane showed the template author's picks** — a Robespierre quote
  on Contact/Privacy/404, Kung Fu Panda on Home. `showPageQuotePane` set to
  `false` until the quotes are rewritten.
- [x] **0.4 Footer institute map listed the wrong person's schools** (SNU, IITM,
  IDEAS-ISI, Calcutta University). Emptied.
- [x] **0.5 Nine dead page-description flags removed.** They sat `true` under a
  `false` master switch, which read as if Contact and Projects showed subtitles.
  Behavior unchanged — a missing entry resolves to `false` either way.

Known leftover: the inherited quote text still ships in the JS bundle, because
`page_quotes.yml` is still merged by the content aggregator. Nothing renders it.
Phase 3.1 deletes the file.

---

## Phase 1 — Content depth

Where the portfolio actually gains value. The engineering is fine; the content
is thin.

- [ ] **1.1 The best work is invisible.** `/projects-publications` is the target
  of the "See my work" button and shows five personal repos, four dated `2023`
  and one `2022`. Nothing from Feb 2024 onward appears as a project. Meanwhile
  `experience.yml` describes — in bullets only — a drag-and-drop pipeline builder
  that cut configuration time ~60%, an Apache Iceberg + MinIO migration that cut
  storage >70%, and an offline-first Flutter + FastAPI CPI system running as a
  live field pilot across 8 districts. Add these as project entries using the
  existing schema (`title`, `description`, `tech_stack`, `time_period`,
  `affiliation`, `cred_link`); omit `cred_link` where the code isn't public — the
  card renders fine without it.
- [ ] **1.2 Experience renders as an undifferentiated wall.** One role with 15
  bullets, where the three-project grouping exists only as a text prefix on
  bullets 1, 7 and 11. `TimelineComponent.vue` renders every line identically, so
  the grouping is invisible. Either nest bullets under each project in the YAML
  and render subheadings, or split the role into three timeline entries.
- [ ] **1.3 Smaller content gaps:**
  - `gpa: 8.93 CGPA` is authored in `education.yml` but no component reads it —
    re-author as `extra:` (renders with a star icon) or add the prop.
  - Education has a single entry, so the timeline rail never draws.
  - Skills grid omits what the bio itself claims: SQL, Iceberg/MinIO, Tailwind,
    Dart, Redis, CI/CD. New keys need icons in `researchInterests/index.vue`.
  - Contact has no Location tile though `contacts.location` exists.
  - Jun 2023 → Feb 2024 is an unexplained gap on the timeline.
  - `TechnicalProjects.vue` uses `:key="project.id"`, but no entry defines `id` —
    every key is `undefined`. Use `project.title`.

---

## Phase 2 — Performance

Measured from a local production build.

- [ ] **2.1 Delete Font Awesome — pure win.** Three `@fortawesome/*` packages are
  imported and globally registered in `main.ts`, and `<font-awesome-icon>` appears
  in **zero** templates across all 92 SFCs. Dead code shipping in the entry bundle
  to every visitor.
- [ ] **2.2 The icon font is the largest payload.** `@mdi/font` ships a 403 KB
  woff2 that every visitor downloads, plus a 649 KB raw / 96 KB gzipped CSS file
  that is mostly ~7,000 icon classes — for about 96 icons actually referenced.
  `dist/` also carries unused `.ttf` (1.3 MB), `.eot` (1.3 MB) and `.woff`
  (588 KB). Either subset the font, or move to `@mdi/js` SVG paths (already a
  dependency, currently unused) — the latter needs a name→path map because some
  icon names come from YAML data. Do this after Phase 3, when the icon set is
  final.
- [ ] **2.3 The HTML body ships empty.** `scripts/seo-build.ts` stamps an
  excellent per-route `<head>` (canonical, OG, Twitter, JSON-LD
  `Person`/`WebSite`/`ProfilePage`), but the body is `<div id="app"></div>`.
  No crawlable body text, and LCP waits on the JS bundle. Real prerendering
  (e.g. `vite-ssg`) on top of the existing head-stamping would fix both. Biggest
  item here — measure before committing to it.
- [ ] **2.4 Drop unused dependencies.** Verified zero imports: `@lucide/vue`,
  `class-variance-authority`, `yaml-loader`. Also `clsx` + `tailwind-merge`,
  whose only consumer is `src/lib/utils.ts`, which nothing imports — delete it,
  `components.json` and both packages together. Move `yaml` to `devDependencies`.

---

## Phase 3 — Codebase health

The bulk of the work; touches nothing a visitor sees.

- [ ] **3.1 Delete the dead template code.** ~8,350 of ~11,190 lines of SFC code
  (75%) is unreachable. Whole directories under `src/views/`:
  `WorkshopsAttended/` (1,632), `Gallery/` (944), `Resources/` (757),
  `Teachings/` (740), `ProfessionalAcitivity/` (718),
  `InternshipCertification/` (508), `Affilications/` (475), `Cocurricular/`
  (283), `OngoingProjects/` (152), `Facts/` (67) — 6,276 lines. Plus, inside live
  routes: `Home/components/awards/` (401), the seven disabled tab components
  under `ProjectsPublications/` (1,134 — 81% of that page), and dead shared
  components `InfoRibbon.vue` (335), `CaptionContent.vue` (123),
  `RibbonToggle.vue` (53), `Footer/Logos.vue` (28).

  Follow the cascades or you leave orphans:
  - **Gallery** also retires `scripts/sync-gallery-image-manifest.js`, the
    `prebuild` step, `scripts/hooks/pre-commit`, `metadata/galleryTags.yml` and
    `content/galleryImageManifest.yml`.
  - **Resources** is the only consumer of `src/utils/resolveHyperlink.ts`.
  - **Affiliations** is the only consumer of `src/metadata/logo/society/`.

  Then prune `featureFlags.ts`, `router/routes.ts`, the view map in
  `router/index.ts`, the 11 key-only YAML stubs, `description.yml`,
  `page_quotes.yml`, and the ~55 unused academic entries in
  `researchInterests/index.vue`.

  Note this is a *maintenance* win, not a bundle win — routes are already
  lazy-imported, so visitors never download dead routes. The exceptions are the
  `src/components/` items and `awards/`, which do ship.

- [ ] **3.2 Make CI actually gate.** `deploy-pages.yml` runs `npm ci` and
  `npm run build` only. `vite build` uses esbuild and does **not** typecheck, so
  a type error would ship, and the lint errors are invisible to CI. Add
  `typecheck` and `lint` steps; bump `node-version` 20 → 22 (Node 20 is EOL and
  the runner warns); add an `engines` field and `.nvmrc` (nothing pins Node, so
  local and CI silently diverge); add a Dependabot config.

- [ ] **3.3 Get lint to zero.** 20 `vue/multi-word-component-names` errors make
  the `CONTRIBUTING.md` PR checklist unsatisfiable as written. Fourteen are the
  `index.vue`-per-folder convention the router is built on — don't add `name`
  fields to fight it. Scope the rule off for `**/index.vue` in
  `eslint.config.js`; most of the six remaining single-word names disappear with
  3.1, so rename or ignore-list whatever survives.

- [ ] **3.4 Fix the docs — they actively mislead.** `CONTEXT.md` and `README.md`
  were never updated after the JS→TS migration and the `profile_info.yml` split.
  Both reference `src/main.js`, `src/router/index.js`, `src/profile_info.yml`,
  `src/content/gallery.yml` and `vite.config.js` — none exist. Both state the app
  uses `createWebHashHistory()`; it uses `createWebHistory()`, which the whole
  prerender strategy depends on. `CONTEXT.md` claims all Vuetify components are
  globally registered — the exact opposite of what `main.ts` does and warns
  against since `3eb3f79`. It also documents `CNAME` files that don't exist and a
  route-adding procedure that no longer applies. `CONTRIBUTING.md` tells you to
  run `npm run deploy`, which isn't a script. Do this **after** 3.1 so the tree
  is documented once, not twice.

- [ ] **3.5 Retire stale tooling.**
  - Delete `toggle_branch.sh` — it force-pushes `V1` → `main`, which would break
    the CI trigger pinned to `branches: [V1]`, and calls the nonexistent
    `npm run deploy`. There is no V2 branch.
  - `scripts/hooks/pre-push` references a `blogs/` sub-app that doesn't exist
    (~15 dead lines). The same ghost limb appears in `eslint.config.js`,
    `routes.ts` (`BLOG_URL = ''`) and `vite.config.ts`. Also reconsider its
    abort-on-stale-month design: it fails the first push of each month *after*
    silently committing to your branch.
  - `wrangler.jsonc` has a `$schema` pointing at an uninstalled package; deploy
    is GitHub Pages. Delete it.
  - `.env.example` declares three variables nothing reads and omits
    `VITE_SITE_ENV`, the only one the code uses.
  - `.github/pull_request_template.md` is 0 bytes, so the checklist never
    surfaces in PRs.

- [ ] **3.6 Add tests.** There is no test setup at all. Use Vitest +
  `@vue/test-utils` + jsdom — it reuses `vite.config.ts` directly, which matters
  because content loads through `@modyfi/vite-plugin-yaml`. Start with
  `src/config/featureFlags.ts` (`isFeatureEnabled` in `all` vs `any` mode, nested
  and unknown paths, the empty-object edge — it gates every route) and
  `scripts/seo-build.ts` (272 lines, the most complex and least documented part
  of the build, currently only "tested" by whether a deploy looks right).

- [ ] **3.7 Optional: finish the TypeScript migration.** 91 of 92 SFCs have no
  `lang="ts"`, so `vue-tsc` passes almost vacuously. The escape hatches are
  already in place (`profile_info/index.ts` types config as `Record<string, any>`;
  `yml.d.ts` types all YAML as `any`). Real type safety means converting SFC
  scripts and giving the content a schema. Large, low urgency.

---

## Verified non-issues — don't spend time here

Two plausible-looking problems that were checked and found already handled:

- **`logoUrl()` / `iconUrl()` are not 404ing.** `public/logo/` and `public/icons/`
  were deleted in `ba9738f`, but all 11 call sites are unreachable under current
  flags — `projects.yml` sets no `logo` key, the education curriculum modal is
  double-guarded, and the rest sit behind dead routes. Confirmed against the
  build: no `/logo/*` or `/icons/*` request is emitted. It only matters if a
  logo-bearing section is enabled, and 3.1 deletes most of them.
- **`education/index.vue` passing `cred_link: '#'` is harmless.**
  `DocumentViewer.vue` guards with `v-if="src && src !== '#'"`, so no stray
  document icon renders.

Also fine as-is: all five project GitHub URLs, the hero avatar, and the LinkedIn
and GitHub profile links resolve. LinkedIn's `999` response is its standard
anti-bot behavior, not a broken link.

---

## Suggested sequencing

1. ~~Phase 0~~ — done.
2. **Phase 1.1** — add the ISI projects. Biggest jump in what the site is worth.
3. **Phase 3.1 → 3.2 → 3.3** — the big delete, then make CI gate it. Deleting
   first means lint and typecheck start from a much smaller surface.
4. **Phase 3.4** — rewrite the docs against the post-delete tree.
5. **Phase 2** — measure, then cut the icon font. Reassess prerendering.
6. **Phase 3.6 / 3.7** — tests and typing, as the site keeps growing.

## Verification

Per phase, before pushing:

- `npm run typecheck` and `npm run build` must pass. `npm run lint` should be
  clean from 3.3 onward; until then compare the error count against a worktree at
  `HEAD` rather than expecting zero.
- `npm run dev`, then walk all four live routes plus an unknown URL for the 404.
- After 3.1, confirm `dist/` still contains exactly `index.html`, `contact/`,
  `privacy-policy/`, `projects-publications/`, `404.html` and `sitemap.xml`, and
  that no chunk grew.
- If a build fails with `Cannot find module @rollup/rollup-darwin-arm64`, that is
  a known-bad npm optional-dependency install, not your change. Reinstall it with
  `npm i @rollup/rollup-darwin-arm64 --no-save`.
