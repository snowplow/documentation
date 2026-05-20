# Snowplow documentation

Welcome to the [Snowplow documentation](https://docs.snowplow.io/docs).

Built with [Docusaurus](https://docusaurus.io) and deployed on Cloudflare Pages.

## Quickstart

```bash
git clone https://github.com/snowplow/documentation.git
cd documentation
brew install node yarn          # one-time, Linux: use your package manager
yarn                            # install dependencies
yarn start                      # dev server at localhost:3000

# Check for broken links and anchors
yarn build
```

## Learn about this repo

- **Contribute content**: [`CONTRIBUTING.md`](CONTRIBUTING.md). Covers style, sidebars, links, frontmatter, images, formatting, and moving pages.
- **How the site is built**: [`ARCHITECTURE.md`](ARCHITECTURE.md). Covers Docusaurus configuration, the sidebar transformation logic, custom plugins, swizzled components, Tailwind and Infima, third-party scripts, the Cloudflare Worker, and LLM-friendly features.
- **Build and CI**: [`WORKFLOWS.md`](WORKFLOWS.md). Covers GitHub Actions, the Cloudflare Pages build, and the dbt reference automation.
- **Writing rules for AI assistants**: [`CLAUDE.md`](CLAUDE.md). Required frontmatter, terminology, file structure, and style.
- **Style guide**: [`src/pages/style-guide/index.md`](src/pages/style-guide/index.md), served at [`docs.snowplow.io/style-guide`](https://docs.snowplow.io/style-guide). An LLM-targeted variant lives at [`src/pages/style-guide/llm/index.md`](src/pages/style-guide/llm/index.md).

## Reporting issues

Open an [issue](https://github.com/snowplow/documentation/issues/new) on GitHub to report a problem. PRs welcome.
