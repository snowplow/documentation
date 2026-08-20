# docusaurus-plugin-release-notes

Builds the index that powers the `/release-notes/` listing page.

The release notes live in `release-notes/<slug>/index.md` and are rendered as
pages by a `@docusaurus/plugin-content-docs` instance. This plugin reads the front matter of
those same files at build time and publishes it as global data, so the listing page can
search, filter, and sort without pulling every article into the client bundle.

Each entry contributes one row:

| Field         | Source                                              |
| ------------- | --------------------------------------------------- |
| `slug`        | the article directory name                          |
| `permalink`   | `<routeBasePath>/<slug>/`                           |
| `title`       | `title` front matter                                |
| `description` | `description` front matter                          |
| `date`        | `date` front matter (`YYYY-MM-DD`)                  |
| `updateType`  | `update_type` front matter                          |
| `components`  | `components` front matter                           |
| `platforms`   | `platforms` front matter                            |

Options:

* `path` — directory holding the article folders, relative to the site directory. Defaults to `release-notes`.
* `routeBasePath` — URL prefix the permalinks are built from. Defaults to `release-notes`.

The build fails if a note is missing `title`, `date`, or `update_type`, so a badly
migrated note cannot silently disappear from the listing.
