# portfolio

Jaemin Cheun's personal portfolio site — a near-zero-JS static build made
with [Astro](https://astro.build), matching the approved Figma design
(dark theme, JetBrains Mono + Inter). Two pages: Home (`/`) and
Projects (`/projects`), the latter populated from a content collection
synced from GitHub.

## Development

```sh
npm install
npm run dev
```

Dev server runs at `http://localhost:4321`.

## Commands

| Command                | Action                                              |
| :---------------------- | :--------------------------------------------------- |
| `npm run dev`           | Start local dev server                                |
| `npm run build`         | Build the static site to `./dist/`                    |
| `npm run preview`       | Preview the production build locally                  |
| `npm run check`         | Type-check the project with `astro check`              |
| `npm run sync-projects` | Sync `src/content/projects/` from `gh repo list`       |

## Syncing projects

`npm run sync-projects` shells out to `gh repo list cheunjm` and writes one
Markdown file per repo into `src/content/projects/`, matching the schema in
`src/content/config.ts`.

It's **non-destructive by default** — any file that already exists is left
alone, so hand-edits (description tweaks, `featured: true`, `hidden: true`,
etc.) survive re-runs. To overwrite everything with fresh data from GitHub:

```sh
npm run sync-projects -- --force
```

Requires the `gh` CLI to be installed and authenticated.
