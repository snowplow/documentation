# Docs-usage baselines

Phase 0 of the docs redesign blueprint. Capture these metrics before the navigation and design changes ship, so each later phase can be judged against a baseline rather than opinion. Capture at least four weeks of data before Phase 2 (navigation) goes live.

All metrics come from our own Snowplow tracking. The docs site already sends events through two trackers, `snplow5` and `biz1`, set up in `snowplow.js`, plus server-side page views from the Cloudflare Worker (`worker/index.js`, app ID `docs-cloudflare`) for `.md` and `llms.txt` requests.

## What already exists

| Source | What it gives us |
| --- | --- |
| Page views and page pings (`snowplow.js`) | Page paths, referrers, engaged time. Activity tracking uses a 10 second heartbeat |
| Link click tracking | Clicks on internal and outbound links, including sidebar, cards, and next/previous links |
| Button click tracking | Clicks on Copy Markdown, Download, theme toggle, and other buttons |
| Form tracking | Inputs on the tutorial and first-steps forms |
| `selected_tabs` entity | The cloud and warehouse tabs the reader picked |
| Worker page views (`docs-cloudflare`) | Requests for `.md` files and `llms.txt`, with user agent and HTTP message signature headers, so agent traffic can be separated from browsers |
| Product Fruits (`src/theme/Root.js`) | Feedback widget responses, linked to the `_sp_biz1_id` user and session IDs |
| Algolia Insights (`insights: true`) | Search queries, clicks, and positions, in the Algolia dashboard |

## Added in Phase 0

* **404 event.** `src/theme/NotFound/Content/index.tsx` sends a structured event when the 404 page renders: category `docs`, action `page_not_found`, label set to the requested path and query string, property set to `document.referrer`. A structured event avoids publishing a new schema for one counter.
* **Global context fix.** `snowplow.js` called `_.isEmpty` without importing `_`, so the `selected_tabs` entity generator threw whenever a reader had picked a tab. It now calls the imported `isEmpty`.

## Metrics

### Search refinement rate

The share of search sessions where the reader runs a second, different query within 60 seconds without clicking a result. A high rate means the first results didn't answer the query.

* **Source today:** Algolia Insights has queries and clicks, but not tied to our sessions. Use the Algolia dashboard's "searches without results" and "click-through rate" as the interim baseline.
* **To add:** a self-describing event `com.snowplowanalytics.docs/search/jsonschema/1-0-0` with `query`, `results_count`, and `clicked_position`, sent from a `transformItems` and `navigator` override in `themeConfig.algolia`. That needs a schema published to the docs Iglu registry first, so it isn't in this branch. The swizzled SearchBar was deleted in this phase, so add it through config, not a new eject.
* **Query:** sessions with two or more search events and no click event in between, divided by sessions with at least one search event.

### Quickstart completion

The share of readers who start a quickstart and reach its last step.

* **Pages:** `/docs/get-started/quickstart/`, `/docs/signals/quickstart/`, and the tutorial quickstarts under `/tutorials/`.
* **Source today:** page views. For single-page quickstarts, use scroll depth from page pings (`pp_yoffset_max` against `doc_height`) to count readers who reached the final section. For multi-step tutorials, count sessions that view the first and last step.
* **Better signal:** a click on the final "next step" link, or on a copy button inside the final code block, from link and button click tracking.

### Signals discovery from the home page

The share of sessions that land on `/docs/` and then view any `/docs/signals/` page in the same session.

* **Source today:** page views with `page_referrer` and `domain_sessionid`. The home page now has an Explore Snowplow Signals section, so measure a few weeks before and after that commit reaches production.
* **Split by:** which home page element was clicked, from link click events with `element_target` under the Signals cards versus the sidebar.

### 404s

* **Source today:** the new `page_not_found` structured event, plus Worker logs. The Worker logs every request with its status code (`console.log` in `worker/index.js`, observability enabled in `wrangler.jsonc`), which also catches 404s from agents and crawlers that don't run JavaScript.
* **Report:** top 50 missing paths by count, with their top referrers. Each one is either a missing redirect or a broken inbound link to fix.

### Feedback

* **Source today:** Product Fruits feedback responses. They carry the `_sp_biz1_id` user and session IDs, so they can be joined to the pages viewed in that session.
* **Gap:** there's no per-page "Was this page helpful?" control. Adding one is a Phase 3 component decision; when it ships, send it as a self-describing event with the page path and a yes or no value.

## Capture plan

1. Merge the Phase 0 tracking changes and let them run for four weeks.
2. Build one dashboard with the five metrics, split by CDI and Signals pages, desktop and mobile, and browser versus agent traffic (Worker events).
3. Snapshot the dashboard before each later phase ships.
