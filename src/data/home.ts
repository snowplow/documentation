/**
 * Content for the docs home (docs/introduction.md): the quickstarts and the
 * lifecycle strip. Every href must be a real page; the build fails on a broken
 * link.
 */
export type ProductKey = 'cdi' | 'signals'

export interface Quickstart {
  product: ProductKey
  title: string
  description: string
  href: string
  /**
   * Time to complete, for someone who has the prerequisites. These are
   * editorial estimates: the page owner should confirm them when the page
   * changes.
   */
  time: string
}

export const QUICKSTARTS: Quickstart[] = [
  {
    product: 'cdi',
    title: 'Quickstart with your coding agent',
    description: 'Get a hosted environment, connect your coding agent, and send validated events from your app.',
    href: '/docs/get-started/quickstart/',
    time: '30 min',
  },
  {
    product: 'cdi',
    title: 'Track your first events',
    description: 'Send page views and other events from a website with the JavaScript tracker.',
    href: '/docs/get-started/tracking/',
    time: '10 min',
  },
  {
    product: 'cdi',
    title: 'Create your first custom events',
    description: 'Define a self-describing event and an entity, and track them.',
    href: '/docs/get-started/custom-events/',
    time: '15 min',
  },
  {
    product: 'cdi',
    title: 'Run your first data models',
    description: 'Turn raw events into sessions, views, and users with a dbt package.',
    href: '/docs/get-started/modeling/',
    time: '20 min',
  },
  {
    product: 'signals',
    title: 'Signals quickstart with your coding agent',
    description: 'Describe what you want to build, and let your agent add the tracking and Signals configuration.',
    href: '/docs/signals/quickstart/',
    time: '20 min',
  },
  {
    product: 'signals',
    title: 'Calculate attributes in real time',
    description: 'Define attributes, publish them, and read them back with the Python SDK or Console.',
    href: '/tutorials/signals-quickstart/start/',
    time: '10 min',
  },
]

export interface Stage {
  title: string
  summary: string
  href: string
  links: { label: string; href: string }[]
}

export const LIFECYCLE: Record<ProductKey, { label: string; stages: Stage[] }> = {
  cdi: {
    label: 'Snowplow CDI',
    stages: [
      {
        title: 'Design',
        summary: 'Plan events and entities, and publish their schemas.',
        href: '/docs/event-studio/',
        links: [
          { label: 'Tracking plans', href: '/docs/event-studio/tracking-plans/' },
          { label: 'Data structures', href: '/docs/event-studio/data-structures/' },
        ],
      },
      {
        title: 'Collect',
        summary: 'Send events from web, mobile, server, and webhooks.',
        href: '/docs/sources/',
        links: [
          { label: 'Web trackers', href: '/docs/sources/web-trackers/' },
          { label: 'Mobile trackers', href: '/docs/sources/mobile-trackers/' },
        ],
      },
      {
        title: 'Validate',
        summary: 'Check every event against its schema and enrich it.',
        href: '/docs/pipeline/',
        links: [
          { label: 'Enrichments', href: '/docs/pipeline/enrichments/' },
          { label: 'Failed events', href: '/docs/fundamentals/failed-events/' },
        ],
      },
      {
        title: 'Load',
        summary: 'Load events into your warehouse, lake, or stream.',
        href: '/docs/destinations/',
        links: [
          { label: 'Warehouses and lakes', href: '/docs/destinations/warehouses-lakes/' },
          { label: 'Event forwarding', href: '/docs/destinations/forwarding-events/' },
        ],
      },
      {
        title: 'Model',
        summary: 'Turn events into tables for analytics and identities.',
        href: '/docs/modeling-your-data/',
        links: [
          { label: 'dbt packages', href: '/docs/modeling-your-data/modeling-your-data-with-dbt/' },
          { label: 'Identities', href: '/docs/identities/' },
        ],
      },
    ],
  },
  signals: {
    label: 'Signals',
    stages: [
      {
        title: 'Define',
        summary: 'Describe the attributes to calculate from events or warehouse tables.',
        href: '/docs/signals/attributes/',
        links: [
          { label: 'Attribute groups', href: '/docs/signals/attributes/attribute-groups/' },
          { label: 'Attribute keys', href: '/docs/signals/attributes/attribute-keys/' },
        ],
      },
      {
        title: 'Serve',
        summary: 'Read attributes from your application or AI agent.',
        href: '/docs/signals/applications/',
        links: [
          { label: 'Services', href: '/docs/signals/applications/services/' },
          { label: 'Retrieve attributes', href: '/docs/signals/applications/retrieve-attributes/' },
        ],
      },
      {
        title: 'Intervene',
        summary: 'Trigger actions in real time when a user meets your criteria.',
        href: '/docs/signals/interventions/',
        links: [
          { label: 'Define interventions', href: '/docs/signals/interventions/' },
          { label: 'Subscribe to interventions', href: '/docs/signals/applications/subscribe/' },
        ],
      },
    ],
  },
}
