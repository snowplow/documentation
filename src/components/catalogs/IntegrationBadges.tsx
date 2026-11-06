import React from 'react'
import { Badge, BadgeGroup, TierBadge, type Tier } from '@site/src/components/Badge'
import destinations from '@site/src/data/destinations.json'
import trackers from '@site/src/data/trackers.json'

const CLOUDS: Record<string, string> = { aws: 'AWS', azure: 'Azure', gcp: 'GCP' }
const CATALOG = '/docs/destinations/#destinations-catalog'

interface DestinationEntry {
  id: string
  type: string
  delivery: string[]
  cloud: string[]
  status: string
  support?: string
}

/**
 * The badge row at the top of a destination or integration page, read from
 * src/data/destinations.json so the page and the destinations catalog can't
 * disagree. Shows who supports the integration, its status, how it delivers
 * data, and the pipeline clouds it works with.
 *
 * ```mdx
 * <IntegrationBadges id="snowflake" />
 * ```
 */
export function IntegrationBadges({ id }: { id: string }): JSX.Element {
  const entry = (destinations.destinations as DestinationEntry[]).find((d) => d.id === id)
  if (!entry) throw new Error(`<IntegrationBadges>: no destination "${id}" in src/data/destinations.json`)
  const support = destinations.support as Record<string, { label: string; description: string }>
  const status = destinations.status as Record<string, string>
  const delivery = destinations.delivery as Record<string, string>
  const types = destinations.types as Record<string, string>
  const supportInfo = support[entry.support ?? 'snowplow']
  if (!supportInfo) throw new Error(`<IntegrationBadges>: unknown support "${entry.support}" for "${id}"`)

  const clouds = entry.cloud.filter((c) => CLOUDS[c]).map((c) => CLOUDS[c])

  return (
    <BadgeGroup>
      <Badge
        variant="tier"
        tone={entry.support === 'partner' ? 'neutral' : 'accent'}
        href={CATALOG}
        title={supportInfo.description}
      >
        {supportInfo.label}
      </Badge>
      {entry.status !== 'available' && (
        <Badge variant="lifecycle" tone={entry.status === 'add-on' ? 'accent' : 'neutral'}>
          {status[entry.status]}
        </Badge>
      )}
      <Badge variant="neutral">{types[entry.type]}</Badge>
      {entry.delivery.map((d) => (
        <Badge key={d} variant="neutral">
          {delivery[d]}
        </Badge>
      ))}
      {clouds.length > 0 && <Badge variant="neutral" title="Pipeline clouds">{clouds.join(', ')}</Badge>}
    </BadgeGroup>
  )
}

interface TrackerEntry {
  id: string
  tier: Tier
}

/**
 * The support tier of a tracker, read from src/data/trackers.json, the same
 * manifest as the tracker matrix on /docs/sources/.
 *
 * ```mdx
 * <TrackerTier id="python" />
 * ```
 */
export function TrackerTier({ id }: { id: string }): JSX.Element {
  const list = ((trackers as { trackers: TrackerEntry[] }).trackers ?? []) as TrackerEntry[]
  const entry = list.find((t) => t.id === id)
  if (!entry) throw new Error(`<TrackerTier>: no tracker "${id}" in src/data/trackers.json`)
  return <TierBadge tier={entry.tier} />
}
