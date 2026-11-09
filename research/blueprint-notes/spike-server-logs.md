# Spike: server log access

The blueprint asked for "Netlify log access" to count 404s, agent fetches of `llms.txt` and `.md` files, and redirect hits. The site isn't on Netlify any more, so this note covers what the current hosting gives us.

## Current hosting

* `README.md` and `WORKFLOWS.md`: the site deploys to Cloudflare on push to `main`, using `yarn build:cf`.
* `wrangler.jsonc`: a Cloudflare Worker (`worker/index.js`) runs in front of the static assets (`run_worker_first: true`), with `observability.logs` and `traces` enabled.
* `static/_redirects` is still in the repo, but `build:cf` deletes `build/_redirects`. Redirects are served by `worker/redirects.js`. The `_redirects` file is now only a record of history; treat `worker/redirects.js` as the source of truth when adding redirects.

## What's logged already

* Every request: the Worker logs `METHOD path -> status (asset | redirect | fallback redirect)` or `-> 404`. These appear in Workers Logs in the Cloudflare dashboard, retained for a few days on the standard plan.
* Agent and Markdown traffic: the Worker sends a server-side page view to the Snowplow collector for every HTML route, `.md` file, and `llms.txt` request (app ID `docs-cloudflare`), with the user agent and HTTP message signature headers. This is the best source for how often agents read the docs, because agents don't run the browser tracker.

## Gaps

* **Retention.** Workers Logs keep a short window. For a four-week baseline, either add a Logpush job to R2 or a warehouse, or rely on the Snowplow Worker events.
* **Status codes in Snowplow.** The Worker sends the page view before it knows the status, so 404s aren't marked. Moving `ctx.waitUntil(trackRequest(...))` to after the asset fetch, and adding the status as an entity, would make 404s and redirects queryable alongside browser events. This needs a schema in the docs Iglu registry.

## Recommendation

1. Ask whoever owns the Cloudflare account for read access to Workers Logs for the docs team.
2. Add the response status to the Worker's server-side page view, behind a new entity schema.
3. Use the browser `page_not_found` event added in Phase 0 for reader-facing 404s in the meantime.

## Not done locally

Needs Cloudflare account access and a published schema. No Worker change is in this branch.
