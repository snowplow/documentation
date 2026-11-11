// Pages checked by the accessibility and visual regression suites.
// Pick pages that cover each layout: home, section indexes, long reference
// pages, tabbed tracker pages, Signals, tutorials, release notes, and the 404.
export const urls = [
  '/docs/',
  '/docs/get-started/',
  '/docs/get-started/quickstart/',
  '/docs/fundamentals/',
  '/docs/fundamentals/events/',
  '/docs/sources/',
  '/docs/sources/web-trackers/',
  '/docs/sources/web-trackers/tracking-events/',
  '/docs/sources/mobile-trackers/',
  '/docs/pipeline/enrichments/available-enrichments/',
  '/docs/destinations/',
  '/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/',
  '/docs/event-studio/',
  '/docs/signals/',
  '/docs/signals/quickstart/',
  '/docs/signals/connection/',
  '/docs/ai/',
  '/tutorials/',
  '/tutorials/abandoned-browse-ccdp/introduction/',
  '/release-notes/',
  '/this-page-does-not-exist/',
]

/** Turn a path into a file-safe name: /docs/sources/ -> docs-sources */
export function slug(path) {
  return path.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'root'
}
