# Spike: docs MCP server hosting

The blueprint recommends a hosted docs MCP server with `search_docs` and `get_page` tools, separate from the Snowplow MCP server that acts on a customer's account. This note compares hosting options.

## What the server needs

* `get_page(path)`: return the `.md` copy of a page. These already exist in the build output (`build/docs/**.md`), written by `plugins/docusaurus-plugin-llms-txt`.
* `search_docs(query, product?)`: return the top pages for a query, with titles, URLs, and snippets. Either call Algolia with the existing search-only key, or ship a small index built at build time.
* Optional `list_pages(product)`: the `llms.txt` sections, filtered to CDI, Signals, or Reference.
* Streamable HTTP transport, no authentication, read-only, and rate limited.

## Options

| Option | How it works | Pros | Cons |
| --- | --- | --- | --- |
| Route on the existing Cloudflare Worker | Add an `/mcp` route to `worker/index.js`, using the Cloudflare Agents SDK or the MCP TypeScript SDK. `get_page` reads from the `ASSETS` binding; `search_docs` calls Algolia | Same deployment as the docs, no new infrastructure, pages always match the deployed build | Adds code to the Worker that serves every page view; a bug affects the whole site. Needs care with CPU limits |
| Separate Cloudflare Worker | A second Worker at `mcp.docs.snowplow.io` or `docs.snowplow.io/mcp` via a route, fetching `.md` files over HTTPS | Isolated from the site, still free-tier friendly, deploys independently | One more deployment to own; pages fetched over the network |
| Hosted docs MCP from a vendor | For example a managed "docs MCP" product pointed at the site or `llms-full.txt` | No code | Another vendor, less control over tools and results, cost |
| Static `llms.txt` only | No server; agents fetch `llms.txt` and `.md` files directly | Already shipped | Agents only use it when told to; no search |

## Recommendation

A separate Cloudflare Worker. Cloudflare already hosts the site, the team already deploys a Worker, and Cloudflare supports remote MCP servers on Workers directly. Keeping it separate from `worker/index.js` means an MCP bug can't take down page serving.

Search can start with Algolia's search-only key, which is already public in `docusaurus.config.ts`. If Ask AI is adopted (see `spike-algolia-askai.md`), the same assistant could back an `ask_docs` tool later.

## Next steps

1. Decide the URL: `https://docs.snowplow.io/mcp` reads best in setup instructions.
2. Prototype `get_page` and `search_docs` in a new Worker, using the MCP TypeScript SDK.
3. Add install instructions to `/docs/ai/` and an AGENTS.md snippet to the home page.
4. Track tool calls with the same server-side Snowplow page view the docs Worker sends, with `aid: docs-mcp`.

## Not done locally

Needs a Cloudflare deployment, a DNS or route decision, and sign-off on a second public endpoint.
