import React from 'react'
import FeatureMatrix, { type MatrixColumn, type MatrixRow, type MatrixValue } from '@site/src/components/FeatureMatrix'
import { TierBadge, TIERS, type Tier } from '@site/src/components/Badge'
import { versions } from '@site/src/componentVersions'
import manifest from '@site/src/data/trackers.json'

const CATEGORIES = [
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile, TV, and games' },
  { value: 'server', label: 'Server and desktop' },
]

interface TrackerEntry {
  id: string
  name: string
  href: string
  category: string
  languages: string
  tier: Tier
  versionKey?: keyof typeof versions
  install?: string
  features: Record<string, MatrixValue>
}

/**
 * The tracker feature matrix on /docs/sources/, generated from
 * src/data/trackers.json. Static HTML, so the Markdown copy of the page lists
 * every tracker and feature. Filter with ?category=web and ?tier=maintained.
 */
export default function TrackerMatrix(): JSX.Element {
  const features = manifest.features as Record<string, { label: string; description: string; href?: string }>
  const trackers = manifest.trackers as TrackerEntry[]

  const columns: MatrixColumn[] = [
    {
      key: 'tier',
      label: 'Support tier',
      description: 'Maintenance group. See the tracker maintenance classification',
      render: (value) => <TierBadge tier={value as Tier} />,
    },
    { key: 'version', label: 'Latest version' },
    ...Object.entries(features).map(([key, f]) => ({
      key,
      label: f.label,
      description: f.description,
      href: f.href,
    })),
  ]

  const rows: MatrixRow[] = trackers.map((t) => ({
    id: `tracker-${t.id}`,
    label: t.name,
    href: t.href,
    detail: t.languages,
    values: {
      tier: t.tier,
      category: t.category,
      version: t.versionKey ? versions[t.versionKey] : '',
      ...t.features,
    },
  }))

  return (
    <FeatureMatrix
      caption="Tracker features"
      rowHeader="Tracker"
      columns={columns}
      rows={rows}
      filters={[
        { key: 'category', label: 'Platform', options: CATEGORIES },
        {
          key: 'tier',
          label: 'Support tier',
          options: (Object.keys(TIERS) as Tier[]).map((t) => ({ value: t, label: TIERS[t].label })),
        },
      ]}
    />
  )
}
