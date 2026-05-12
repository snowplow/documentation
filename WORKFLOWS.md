# Workflows

CI, deploys, and repo scripts. For writing guidelines see [`CONTRIBUTING.md`](CONTRIBUTING.md); for site architecture see [`ARCHITECTURE.md`](ARCHITECTURE.md).

- [Local checks before opening a PR](#local-checks-before-opening-a-pr)
- [GitHub Actions](#github-actions)
- [Build and deploy](#build-and-deploy)
- [Repo scripts](#repo-scripts)
- [dbt reference automation](#dbt-reference-automation)

## Local checks before opening a PR

Run these locally. None of them are enforced by a single CI job, so it's faster to catch issues before pushing.

- **`yarn format`** — applies Prettier. CI enforces formatting.
- **`yarn build`** — runs the production build. This is the link and anchor check: the build is configured with `onBrokenLinks: 'throw'` and `onBrokenAnchors: 'throw'`, so it fails on any broken internal link or missing anchor. `yarn start` does not catch these.
- **Vale** — via the VS Code extension or the CLI (`brew install vale`, then `vale <path>`). Vale is not currently run in CI; running it locally is the only enforcement.

## GitHub Actions

Six workflows live in `.github/workflows/`.

### `claude-code-review.yml`

Runs on every opened PR. Uses the Anthropic Claude Code Action to review writing quality against the style guide in [`CLAUDE.md`](CLAUDE.md) and leaves the review as a PR comment. Has restricted tool access (`gh pr comment`, `gh pr view`, `gh pr diff`).

### `claude.yml`

Triggered by `@claude` mentions in issue comments, PR review comments, and new issues. Dispatches Claude to work on the issue or PR. Gated on `author_association` (member, owner, or collaborator only). Has full repo read-write permissions.

### `validate-frontmatter.yml`

Runs on PR opened against any `.md` or `.mdx` file. Validates the frontmatter of changed files (excluding any starting with `_`) and leaves the validation results as a PR comment.

### `validate_schema.yml`

Runs on PR changes to `src/components/JsonSchemaValidator/**`, and on manual dispatch. Validates JSON Schema files in `src/components/JsonSchemaValidator/Schemas/` against `dbt-variables-meta-schema.json` using `GrantBirki/json-yaml-validate`. Files listed in `exclude_from_checks.txt` are skipped.

### `update-dbt-docs.yml`

Runs weekly (Monday at 08:00 UTC) and on manual dispatch. Executes `utils/dbt_docs/get_dbt_package_versions.py` to refresh dbt package version metadata, writes the result to `src/dbtVersions.js`, and opens a PR if anything changed.

### `release-dbt-update.yml`

Manual dispatch only. Takes a package name and version as inputs, runs `copy_schema.sh` and `update_versions.sh` against the corresponding dbt package, and commits the result. Use this when shipping a dbt package release that needs its reference docs updated.

## Build and deploy

The site is deployed by **Cloudflare Pages** on push to `main`. Cloudflare runs the `yarn build:cf` script, which:

1. Sets `NODE_OPTIONS='--max-old-space-size=4096'` (the build needs more than the default heap).
2. Runs `docusaurus build`.
3. Deletes `build/_redirects` — this is the file Docusaurus auto-generates from any installed redirect plugin. Removing it means nothing leaks into the deployed bundle. All redirects live in the [Cloudflare Worker](ARCHITECTURE.md#cloudflare-worker-redirects-and-server-side-tracking) instead.

Other `package.json` scripts:

- `yarn start` — dev server. Does not run the broken-link check.
- `yarn build` — production build, locally. Same as Cloudflare's build minus the heap bump and the `_redirects` cleanup.
- `yarn serve` — serve a built `build/` directory locally.
- `yarn swizzle` — Docusaurus's interactive component-swizzling tool.
- `yarn clear` — clear the Docusaurus build cache.
- `yarn format` — Prettier.
- `yarn write-heading-ids` — auto-generate `{#id}` markers on every heading. Rarely needed; useful when stabilizing anchors before a big restructure.

## Repo scripts

Two scripts in the repo root.

### `move.sh`

Moves a docs folder, rewrites every internal reference to it, and appends a 301 redirect rule to `worker/redirects.js`. Requires the `sponge` command from `moreutils` (`brew install moreutils`).

```bash
./move.sh docs/old/path docs/new/path
```

Run from the repo root. Use relative paths starting with `docs/`. End paths on a directory, not on `index.md`. No trailing slashes.

### `make-links-validatable.sh`

Sweeps through markdown files and appends `/index.md` to any internal link that points at a docs page without it. Run this to fix link validation issues in bulk. Also needs `sponge`.

## dbt reference automation

dbt package reference pages are partly auto-generated. The moving parts:

- **`src/dbtVersions.js`** — generated file holding the current version of each dbt package. Do not edit manually. Refreshed weekly by `update-dbt-docs.yml`.
- **`utils/dbt_docs/get_dbt_package_versions.py`** — the script the workflow runs.
- **`copy_schema.sh`** and **`update_versions.sh`** — release-time scripts run by `release-dbt-update.yml`. They pull schema files from a released dbt package and update reference pages.
- **`src/components/JsonSchemaValidator/`** — Reusable component that renders a JSON Schema as a configuration reference inside a docs page. The schemas it reads from are validated by `validate_schema.yml`.

When a dbt package release happens, the workflow runs `release-dbt-update.yml` to refresh reference docs. Between releases, the weekly job keeps the version table accurate.
