# Seniors for Climate — British Columbia

Website for the British Columbia chapter of [Seniors for Climate](https://seniorsforclimate.org).
Lives at **bc.seniorsforclimate.org**.

Built with [Hugo](https://gohugo.io), a static site generator: it reads Markdown
from `site/content/`, runs it through Go templates in `site/layouts/`, and writes
finished HTML to `dist/`. There is no database and no server-side code.

## Build

```bash
npm install
npm run build      # outputs to ./dist
```

Local preview with live reload:

```bash
npm start
```

## Deploy

Hosting is plain FTP shared hosting. Build locally, then upload the **contents**
of `dist/` to the web root.

**Never edit the files on the server.** They are build output — the next build
overwrites them. All changes go in `site/content/` or `site/layouts/`, then
rebuild, then upload.

## Editing content

| What | Where |
|---|---|
| Homepage copy | `site/content/_index.md` (front matter) |
| Page text | `site/content/<section>/` Markdown body |
| Resource link lists | `resources:` front matter — see `site/layouts/partials/resources.html` |
| Styles | `src/css/imports/_sfc.scss`, tokens in `_variables.scss` |

Content editing requires Markdown and a local build. There is no web-based CMS —
see "History" below.

## Preserving links

Every external, PDF, and Drive URL in this site was supplied by the client and
must stay **byte-identical**. Some look like mistakes and are not to be "fixed":
a Sierra Club link carries a long `mkt_tok` token, and a Snopes link points at
the site root. Both are deliberate, and flagged as open questions.

After any content change, confirm no URL was dropped or altered.

## Accessibility

The audience is seniors. This is load-bearing, not a checkbox:

- 20px base font size, held across breakpoints
- Every colour pair passes WCAG AA
- Tap targets 44–48px minimum
- Visible underlines on links in content; visible focus ring

Don't make a change that drops contrast below AA.

## History

Started from `decaporg/one-click-hugo-cms`. The Decap/Netlify CMS and all Netlify
build configuration have been removed, since hosting moved to FTP where Netlify
Identity and git-gateway cannot run. Removing them also fixed an `npm install`
failure caused by an unresolvable `decap-cms-widget-date` version.

`LICENSE` is retained from the upstream MIT-licensed template.
