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
    {
        from: '/docs/collecting-data/collecting-from-own-applications/scala-tracker/setup-2',
        to: '/docs/collecting-data/collecting-from-own-applications/scala-tracker/setup',
    }
]


const redirectsRuleFn = (srcPath) => {
    // This build redirects from "to" to "from". So filter by the destination page, and replace "to" with "from".
    //
    // Docs will feed all rendered pages into this function.
    if (srcPath.includes('pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader'))
        return srcPath.replace(
            'pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader',
            'pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0'
        )
    else
        return undefined
}

module.exports = {
    redirects: redirects,
    redirectsRuleFn: redirectsRuleFn
}

