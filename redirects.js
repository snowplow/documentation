// Redirection rules for the `@docusaurus/plugin-client-redirects` plugin.
const redirects = [
  // Mobile tracker v3 redirects
  {
    from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0',
    to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers',
  },
  {
    from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/introduction',
    to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up',
  },
  {
    from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/quick-start-guide',
    to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up',
  },
  {
    from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/remote-configuration',
    to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/remote-configuration',
  },
  {
    from: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/tracking-events',
    to: '/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events',
  },
  {
    from: '/docs/pipeline-components-and-applications/enrichment-components/enrich-pubsub',
    to: '/docs/pipeline-components-and-applications/enrichment-components/enrich',
  },
]

module.exports = {
  redirects,
}
