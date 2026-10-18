# Seniors for Climate — British Columbia

Website for the BC chapter of the national nonprofit Seniors for Climate
(seniorsforclimate.org). Lives at **bc.seniorsforclimate.org**.

Hugo static site. Markdown in `site/content/` + Go templates in `site/layouts/`
→ compiled HTML in `dist/`.

## Which branch is live — read this first

The live site is built from **`claude/nonprofit-document-hub-avi8e3`**. Not
`main`, and not `redesign/sfc-bc`.

- `main` is still the untouched upstream coffee-shop template. The repo's
  default view on GitHub opens here, which is misleading — it is not this site.
- `redesign/sfc-bc` is an abandoned parallel line with a **green** palette and
  single-column resource lists. It is not this site. Do not take anything from
  it without checking against the rules below.

Local clone is at `~/Sites/sfc-bc`. It was moved from `~/one-click-hugo-cms`;
older notes and tooling may still reference the old path.

## Build and deploy

```bash
npm install
npm run build      # → ./dist
npm start          # local preview, live reload
```

Hosting is **plain FTP shared hosting**, not Netlify. Build locally, upload the
**contents** of `dist/` to the web root.

**Never edit files on the server.** They are build output; the next build
overwrites them. Changes go in `site/content/` or `site/layouts/`, then rebuild,
then upload.

### Deploy traps that have already cost a day

- **Check you are uploading to the real web root.** A second folder with the
  same name was once created *inside* `public_html`, and uploads went there for
  days while the live site never changed.
- **`site/static/favicon.ico` must exist.** Browsers request `/favicon.ico` at
  the site root on their own, regardless of the `<link rel="icon">` tags. When
  it is missing they fall back to whatever they cached — which is how the
  upstream template's red coffee cup survived every icon replacement. Icons also
  live in `site/static/img/`; both are needed.
- **`site/static/.htaccess` stops SiteGround serving stale HTML.** Do not delete
  it. Hashed CSS/JS/image filenames still cache normally.
- **Browser favicon cache ignores reloads.** After an icon change, verify with
  `curl -I https://bc.seniorsforclimate.org/favicon.ico` or an incognito window.
  A normal hard-refresh will keep showing the old icon and prove nothing.

## Audience

Seniors across British Columbia, most over 65. This drives real constraints,
not preferences:

- 18px base font, held flat across breakpoints (`--font-size`, `-m`, `-l` are
  all 18px — the upstream 18/20/22 ramp made Tachyons' `f1` render at 66px)
- Every colour pair passes WCAG AA
- Tap targets 44–48px minimum
- Visible underlines on content links; visible focus ring
- Plain language, no jargon, no startup-speak

Do not make a change that drops contrast below AA.

## Hard rules

**Never alter a URL.** Every external/PDF/Drive link was supplied by the client
and must stay byte-identical. Some look like mistakes and are not to be "fixed":

- A Sierra Club BC link carries a long `mkt_tok` token — keep it
  (`site/content/take-action/_index.md`)
- A Snopes link points at the site root while its text says "Climate Change
  Articles" — keep it (`site/content/about/what-is-climate-change/index.md`)
- Two near-identical Re.Climate URLs appear on the Canadians' Thoughts page —
  keep both

After any content change, verify no URL was dropped or altered. HTML-unescape
first: Hugo encodes `+` as `&#43;` in one Squarespace PDF link.

**Never invent facts about the organization** — legal status, charitable
registration, tax receipts, partnerships, or its relationship with National.

**The Donate page is placeholder copy, not cleared for publication.** It says
only that BC is not separately registered and that donations route through
National. It deliberately makes no claim about tax receipts or charitable
status. There is an HTML comment in the file saying so — don't remove it, don't
"finish" the page, don't add donation mechanics. Needs sign-off from the BC
group and National.

**Never use the name "BC Hub" anywhere a visitor can see.** Internal working
name only. Note that source documents from the client *do* use it — strip it
when adapting their copy. (`bc-hub@seniorsforclimate.org` is the real contact
address and is fine.)

## Architecture

```
site/content/        Markdown + front matter
  _index.md          homepage (copy lives in front matter)
  about/             About Us + 4 background pages
  take-action/       Take Action + Meet With Elected Officials + Join Us
  blog/ news/ contact/ donate/
site/layouts/
  index.html         homepage template
  blog/single.html   single blog post
  section/blog.html  blog index
  partials/
    resources.html   renders the resource lists  ← the important one
    nav.html  head.html  page-head.html  footer.html
src/css/imports/
  _variables.scss    design tokens
  _sfc.scss          component styles for this site
src/js/app.js        mobile nav toggle (35 lines)
```

Most files in `src/css/imports/` are stock Tachyons modules. Only
`_variables.scss` and `_sfc.scss` are this site's own.

### `resources` front matter

The seven resource pages are structured data, not Markdown bullet lists.
Rendered by `partials/resources.html`.

```yaml
resources:
  - heading: "Section or group name"
    intro: ["paragraph"]                       # optional
    entries:                                   # optional
      - title: "Link text"
        url: "https://example.com/exact-url"
        publisher: "Who published it"          # optional
        date: "May 2026"                       # optional
        format: "PDF"                          # optional: PDF or Video
        description: "One line on why it's useful."
        children: [...]                        # optional, one level
    notes: ["Markdown line that isn't a link"] # optional
    groups: [...]                              # optional, one level
```

A block **with** `groups` renders as a section band; **without**, as a plain
group. `description`, `intro` and `notes` run through `markdownify`.

`format` renders a small flag badge. It exists to warn that clicking does
something unexpected — downloads a file, opens a video. Information, not
decoration. Don't add it to ordinary links.

## Design decisions — deliberate, don't undo in passing

- **Palette is the confirmed National brand**: navy `--primary: #385080`, lime
  `--accent: #D0E870`. This was confirmed with National in October 2026 and is
  settled. The `--green` / `--green-deep` tokens are legacy names that now hold
  navy; the names are historical, the values are correct. **Do not "restore" the
  green `#4E7A1E` palette** — it came from sampling the logo artwork on the
  abandoned `redesign/sfc-bc` branch and is not the brand.
- **Type**: Montserrat throughout (`--font-serif` and `--font-sans` both resolve
  to it), flat 18px base.
- **Resource entries are cards**, in a two-column grid (`.res-list` is
  `display: grid`, `repeat(2, minmax(0, 1fr))`). Each carries title, publisher,
  optional format badge, description. This is the most-used surface on the site.
- **Homepage uses rows** (`.dir-row`), not cards. The homepage is an index of
  reading; the resource pages are the browsable surface.
- **Section headings and their lists share `--measure-resources`.** A heading
  without that cap stretches to the full container and its rule overhangs the
  cards beneath it. If you add a new section heading, cap it.

Layout tokens: `--page: 72rem`, `--measure: 40rem`, `--measure-resources: 64rem`.

## History — don't reintroduce

Built from `decaporg/one-click-hugo-cms`, a Netlify starter that shipped with a
coffee-shop demo. The demo blog posts under `site/content/post/` have been
removed.

Template bugs already fixed — don't let them back in:

- black page backdrop (`html { background-color: var(--black) }`)
- global `p { max-width: 32rem }` inside wider containers
- an 18/20/22px font ramp making `f1` render at 66px
- `--grey-3: #9B9B9B` at 2.8:1 contrast; a footer at ~2.4:1
- a mobile hamburger with no JS behind it
- a leftover `#ff4400` theme colour in `browserconfig.xml` and `head.html`
- the upstream coffee-cup favicon set

Tachyons is a utility framework — it only styles elements carrying its classes.
Markdown from `{{ .Content }}` has none, which is why resource pages originally
fell back to browser defaults. `.prose` in `_sfc.scss` styles that output.

`LICENSE` is retained for upstream MIT attribution.

**There is no web-based CMS in the built site.** Content changes require
editing Markdown and running a build. Note that `decap-cms-app` is still an
installed dependency and `site/static/admin/` still ships — see below. The CMS
is not wired into any template, but the files are still there.

### Still present from the template, pending cleanup

These were *not* removed, despite earlier notes claiming otherwise.

Files: `netlify.toml`, `cypress/`, `cypress.config.js`, `src/js/cms.js`,
`site/static/admin/` (including `config.yml` with its git-gateway TODO).

`package.json` dependencies: `decap-cms-app`, `react`, `react-dom`, `cypress`,
`netlify-plugin-cypress`, `@babel/preset-react`, plus `eslint-plugin-react` and
`eslint-plugin-cypress` in devDependencies.

They are inert but misleading — `netlify.toml` suggests a Netlify deploy that
does not exist, and the Decap/React dependencies suggest a CMS that is not
wired up. Removing them is pending; until then, do not write documentation
claiming they are gone.

## Current state

Live and deployed at bc.seniorsforclimate.org, built from
`claude/nonprofit-document-hub-avi8e3` and uploaded by FTP.

`.DS_Store` is not in `.gitignore` and repeatedly tries to stage. Add it.

## Open and unresolved — flag, don't guess

1. **Volunteer needs** — the "Ways to help" list on Join Us is inferred, never
   confirmed by the client.
2. **Meeting schedule** — "monthly online meetings", no day, time or platform.
3. **Donation mechanism** — still being negotiated with National. See the
   Donate-page rule above.
4. **Join Us placement** — a sub-page under Take Action, two clicks deep. It is
   the main conversion page for a volunteer-run group. A persistent header
   button is in place; worth revisiting.
5. **Stale content** — the Seniors' Climate Witness week (Sept 19–26, 2026) has
   passed and should be removed or updated. The "2025 BC Climate Action Report"
   section will date too.
6. **Unverified statistic** — the Protect Our Winters entry claims "more than
   21,000 signatures" to the IOC, uncited. Confirm or cut.
7. **"News" page naming** — it is a curated static link list, not dated posts.
   A separate `blog/` section now also exists; the two overlap conceptually and
   nobody has decided which is which.
8. **AI-generated imagery** — any hero or section image that is AI-generated
   rather than a photograph of the group should be flagged to the client, not
   wired in as though it were documentary. For an organization whose value is
   trust, invented photographs of British Columbians are a real risk.
9. **BC-PCRB section** — a large new section is planned under Take Action
   (BC Provincial Climate Risk Briefing). Copy drafted separately; depends on
   eleven linked documents not yet supplied.

## Verify before any deploy

```bash
npm run build
# then check:
#  - every external URL present and byte-identical (HTML-unescape first;
#    currently 58 unique URLs under site/content/)
#  - mobile nav opens and closes at 390px
#  - no contrast regressions
#  - /favicon.ico resolves at the site root, not just /img/favicon.ico
```
