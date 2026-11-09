import React from 'react'
import Link from '@docusaurus/Link'

/**
 * A clickable map of the Snowplow pipeline for the docs home: the CDI stages
 * from design to modeling, and the Signals stages fed by the enriched event
 * stream and the warehouse. Every box is a plain link, so the map works
 * without JavaScript and appears as a list of links in the Markdown export.
 */

interface Node {
  label: string
  href: string
  description: string
}

interface Stage {
  title: string
  nodes: Node[]
}

const CDI: Stage[] = [
  {
    title: 'Design',
    nodes: [
      { label: 'Tracking plans', href: '/docs/event-studio/tracking-plans/', description: 'Plan what to track' },
      { label: 'Data structures', href: '/docs/event-studio/data-structures/', description: 'Schemas for events and entities' },
    ],
  },
  {
    title: 'Collect',
    nodes: [
      { label: 'Web trackers', href: '/docs/sources/web-trackers/', description: 'JavaScript and browser' },
      { label: 'Mobile trackers', href: '/docs/sources/mobile-trackers/', description: 'iOS and Android' },
      { label: 'All trackers', href: '/docs/sources/', description: 'Server, games, webhooks' },
      { label: 'Snowtype', href: '/docs/event-studio/implement-tracking/', description: 'Generate tracking code' },
    ],
  },
  {
    title: 'Validate and enrich',
    nodes: [
      { label: 'Enrichments', href: '/docs/pipeline/enrichments/', description: 'Add data to each event' },
      { label: 'Failed events', href: '/docs/failed-events/', description: 'Find and fix invalid events' },
      { label: 'Test locally', href: '/docs/testing/snowplow-micro/', description: 'Snowplow Micro' },
    ],
  },
  {
    title: 'Load',
    nodes: [
      { label: 'Warehouses and lakes', href: '/docs/destinations/warehouses-lakes/', description: 'Snowflake, BigQuery, Databricks' },
      { label: 'Event forwarding', href: '/docs/destinations/forwarding-events/', description: 'Send to third-party tools' },
      { label: 'Streams', href: '/docs/destinations/custom-streaming/', description: 'Consume events in real time' },
    ],
  },
  {
    title: 'Model',
    nodes: [
      { label: 'Query your data', href: '/docs/destinations/warehouses-lakes/querying-data/', description: 'SQL on the events table' },
      { label: 'dbt packages', href: '/docs/modeling-your-data/modeling-your-data-with-dbt/', description: 'Sessions, users, and more' },
      { label: 'Identities', href: '/docs/identities/', description: 'Stitch users across devices' },
    ],
  },
]

const SIGNALS: Stage[] = [
  {
    title: 'Data sources',
    nodes: [
      { label: 'Events', href: '/docs/signals/data-sources/events/', description: 'Real-time stream' },
      { label: 'Warehouse tables', href: '/docs/signals/attributes/warehouse-config/', description: 'Pre-calculated values' },
    ],
  },
  {
    title: 'Define',
    nodes: [
      { label: 'Attributes', href: '/docs/signals/attributes/', description: 'Facts about each user' },
    ],
  },
  {
    title: 'Serve',
    nodes: [
      { label: 'Services', href: '/docs/signals/applications/services/', description: 'Read attributes from your app' },
      { label: 'Agentic contexts', href: '/docs/signals/agentic-contexts/', description: 'Ground AI agents' },
    ],
  },
  {
    title: 'Act',
    nodes: [
      { label: 'Interventions', href: '/docs/signals/interventions/', description: 'Push actions in real time' },
    ],
  },
]

function Lane({ name, href, stages, modifier }: { name: string; href: string; stages: Stage[]; modifier: string }) {
  return (
    <div className={`pipeline-map__lane pipeline-map__lane--${modifier}`}>
      <Link to={href} className="pipeline-map__lane-name">
        {name}
      </Link>
      <ol className="pipeline-map__stages" style={{ '--stages': stages.length } as React.CSSProperties}>
        {stages.map((stage) => (
          <li key={stage.title} className="pipeline-map__stage">
            <p className="pipeline-map__stage-title">{stage.title}</p>
            <ul className="pipeline-map__nodes">
              {stage.nodes.map((node) => (
                <li key={node.href}>
                  <Link to={node.href} className="pipeline-map__node">
                    <span className="pipeline-map__node-label">{node.label}</span>
                    <span className="pipeline-map__node-description">{node.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function PipelineMap(): JSX.Element {
  return (
    <div className="pipeline-map breakout">
      <Lane name="Snowplow CDI" href="/docs/cdi/" stages={CDI} modifier="cdi" />
      <p className="pipeline-map__bridge">
        Signals reads the enriched event stream, and optionally your warehouse
      </p>
      <Lane name="Signals" href="/docs/signals/introduction/" stages={SIGNALS} modifier="signals" />
    </div>
  )
}
