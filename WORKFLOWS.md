# Workflows

CI and deployment. For writing guidelines see [`CONTRIBUTING.md`](CONTRIBUTING.md); for site architecture see [`ARCHITECTURE.md`](ARCHITECTURE.md).

- [Build and deploy](#build-and-deploy)
- [GitHub Actions](#github-actions)
  - [dbt reference automation](#dbt-reference-automation)

## Build and deploy

The site is deployed by **Cloudflare Pages** on push to `main`. Cloudflare runs the `yarn build:cf` script, which:

1. Sets `NODE_OPTIONS='--max-old-space-size=4096'` (the build needs more than the default heap).
2. Runs `docusaurus build`.
3. Deletes `build/_redirects` — this is the file Docusaurus auto-generates from any installed redirect plugin. Removing it means nothing leaks into the deployed bundle. All redirects live in the [Cloudflare Worker](ARCHITECTURE.md#cloudflare-worker) instead.

Other `package.json` scripts:

- `yarn start`: dev server. Does not run the broken-link check.
- `yarn build`: production build, locally. Same as Cloudflare's build minus the heap bump and the `_redirects` cleanup.
- `yarn serve`: serve a built `build/` directory locally.
- `yarn swizzle`: Docusaurus's interactive component-swizzling tool.
- `yarn clear`: clear the Docusaurus build cache.
- `yarn format`: Prettier.

## GitHub Actions

CI workflows live in `.github/workflows/`.

| Workflow                   | Description                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `claude-code-review.yml`   | Runs on every opened PR. Reviews writing quality against the style guide and leaves the review as a PR comment.                      |
| `claude.yml`               | Triggered by `@claude` mentions in issue comments, PR review comments, and new issues. Dispatches Claude to work on the issue or PR. |
| `validate-frontmatter.yml` | Runs on PR opened against any `.md` or `.mdx` file. Validates frontmatter of changed files and leaves results as a PR comment.       |
| `validate_schema.yml`      | Runs on PR changes to `src/components/JsonSchemaValidator/**`. Validates JSON Schema files against `dbt-variables-meta-schema.json`. |
| `update-dbt-docs.yml`      | Runs weekly and on manual dispatch. Refreshes dbt package version metadata and opens a PR if anything changed.                       |
| `release-dbt-update.yml`   | Manual dispatch only. Updates reference docs for a given dbt package name and version.                                               |

### dbt reference automation

dbt package reference pages are partly auto-generated.

The [dbt package overview page](docs/modeling-your-data/modeling-your-data-with-dbt/index.md) uses a custom `DbtVersionChecker` component to display the latest compatible package versions for a given dbt setup. The scheduled `update-dbt-docs.yml` workflow keeps the package versions fresh.

When a dbt package release happens, someone must manually dispatch the `release-dbt-update.yml` workflow to update the reference schemas in `src/components/JsonSchemaValidator/Schemas`.
