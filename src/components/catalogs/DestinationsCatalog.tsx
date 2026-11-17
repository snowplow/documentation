import React from 'react'
import FeatureMatrix, { type MatrixColumn, type MatrixRow } from '@site/src/components/FeatureMatrix'
import { Badge } from '@site/src/components/Badge'
import manifest from '@site/src/data/destinations.json'

const CLOUDS: Record<string, string> = { aws: 'AWS', azure: 'Azure', gcp: 'GCP', any: 'Any' }

interface DestinationEntry {
  id: string
  name: string
  href: string
  type: string
  delivery: string[]
  cloud: string[]
  status: string
  detail?: string
}

/**
 * The destinations catalog on /docs/destinations/, generated from
 * src/data/destinations.json. Static HTML, so the Markdown copy lists every
 * destination. Filters go in the query string, for example
 * ?type=forwarder&cloud=gcp.
 */
export default function DestinationsCatalog(): JSX.Element {
  const types = manifest.types as Record<string, string>
  const delivery = manifest.delivery as Record<string, string>
  const status = manifest.status as Record<string, string>
  const destinations = manifest.destinations as DestinationEntry[]

  const columns: MatrixColumn[] = [
    { key: 'typeLabel', label: 'Type' },
    { key: 'deliveryLabel', label: 'Delivery' },
    { key: 'cloudLabel', label: 'Pipeline cloud' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant="lifecycle" tone={value === 'add-on' ? 'accent' : value === 'partner' ? 'neutral' : 'tip'}>
          {status[value as string]}
        </Badge>
      ),
    },
  ]

  const rows: MatrixRow[] = destinations.map((d) => ({
    id: `destination-${d.id}`,
    label: d.name,
    href: d.href,
    detail: d.detail,
    values: {
      type: d.type,
      typeLabel: types[d.type],
      delivery: d.delivery,
      deliveryLabel: d.delivery.map((x) => delivery[x]).join(', '),
      // Destinations that work with any cloud match every cloud filter
      cloud: d.cloud.includes('any') ? ['any', 'aws', 'azure', 'gcp'] : d.cloud,
      cloudLabel: d.cloud.map((c) => CLOUDS[c]).join(', '),
      status: d.status,
    },
  }))

  const options = (map: Record<string, string>) => Object.entries(map).map(([value, label]) => ({ value, label }))

  return (
    <FeatureMatrix
      caption="Destinations catalog"
      rowHeader="Destination"
      columns={columns}
      rows={rows}
      filters={[
        { key: 'type', label: 'Type', options: options(types) },
        { key: 'delivery', label: 'Delivery', options: options(delivery) },
        {
          key: 'cloud',
          label: 'Pipeline cloud',
          options: [
            { value: 'aws', label: 'AWS' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
          ],
        },
        { key: 'status', label: 'Status', options: options(status) },
      ]}
    />
  )
}
