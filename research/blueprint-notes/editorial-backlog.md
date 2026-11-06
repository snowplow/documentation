# Editorial track: done on this branch, and what's left

The blueprint's editorial track runs for two to three quarters, alongside the front-end work. This branch does a representative slice of each kind of change so that reviewers can judge the end state. This note lists what remains, in the order it would be worth doing.

## Done on this branch

| Change | Pages | Pattern to reuse |
| --- | --- | --- |
| `content_type` front matter | Signals, get started, Fundamentals, tracker landing pages, destination pages, and new or merged pages (about 110) | Build warning from `docusaurus-plugin-content-type-check`, CI check in `validate-frontmatter.yml` |
| Templates in CLAUDE.md and both style guides | Not applicable | "Content types and page templates" sections |
| Merge: user and session identifiers | `events/ootb-data/user-and-session-identification` into `events/identifiers` | `type: link` stub plus forced redirect (CONTRIBUTING.md, "Merge duplicate pages") |
| Merge: cross-domain tracking | `sources/web-trackers/cross-domain-tracking` and `identities/concepts/cross-domain-tracking` into `events/cross-navigation` | Same |
| Merge: querying | `get-started/querying` and `event-studio/query-sql` into `destinations/warehouses-lakes/querying-data` | Same |
| Signals quickstart into the Signals docs | `/tutorials/signals-quickstart/` (5 steps) to `/docs/signals/get-started/quickstart-tutorial/` | Fallback redirects per step, to the matching `<Steps>` anchor |
| Split mixed pages | `pipeline/collector`, `signals/connection` | How-to page plus a `reference/` or `configuration-reference/` child page |
| Failed events hub | New `/docs/failed-events/` | Landing page with a task table |
| Snowbridge standalone files | 20 `name.md` files to `name/index.md` | URLs unchanged, no redirects |
| Support tier labels | 22 tracker pages, 24 destination pages | `<TrackerTier id>`, `<IntegrationBadges id>` |

The `llms-full.txt` page count went from 1,002 to 996. The difference is intentional: five merged pages became sidebar stubs (−5), five tutorial steps became one docs page (−4), and the hub plus two new reference pages are new (+3).

## Left to do

1. **Finish `content_type`.** About 650 current docs pages have no value. The build lists the directories with the most missing pages; the largest are `modeling-your-data/modeling-your-data-with-dbt` (100), `sources/web-trackers` (60), `api-reference/loaders-storage-targets` (58), and `api-reference/snowbridge` (41). Do one directory per PR, and fix the template while setting the value.
2. **Remaining duplicate merges named in the blueprint.** Tracking plans (`fundamentals/tracking-plans` and `event-studio/tracking-plans`) and schema versioning (`fundamentals/schemas/versioning` and `event-studio/data-structures/versioning`) need an owner to pick the canonical page.
3. **More mixed how-to and reference pages.** Candidates: the enrichment pages (configuration tables inside how-to text), `api-reference/stream-collector/configure`, the Snowbridge target pages, and `signals/attributes/attributes` ("All attribute options" is reference).
4. **File moves into the new sidebar groups.** One group per PR, with redirects in `worker/redirects.js`, updated `pick()` paths, `yarn check:sidebars`, and the `llms-full.txt` count check.
5. **Rename the Snowbridge transformation directories to kebab-case.** The 20 converted directories keep their camelCase names (`spEnrichedFilter/`) so their URLs don't change. Renaming them needs fallback redirects.
6. **Support tiers for webhooks, dbt packages, and Signals SDKs.** The maintenance classification page covers dbt packages and Signals SDKs, but there's no manifest for them yet. Webhooks have no tier data at all.
7. **Decide the tier names.** The blueprint suggests Flagship, Maintained, and Community. The pages use the existing four maintenance groups. Changing the names is one edit to `TIERS` in `src/components/Badge` plus `trackers.json`.
8. **Check the out-of-the-box page view table.** The page and screen view table under `events/ootb-data` disagrees with the tracker docs for several server-side trackers (see the Phase 3 notes).
