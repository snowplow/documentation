import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { Tag } from 'lucide-react'
import { versions } from '@site/src/componentVersions'
import { componentInfo } from '@site/src/data/components'
import manifest from '@site/src/data/feature-versions.json'

type ComponentKey = keyof typeof versions

interface FeatureVersion {
  label: string
  component: ComponentKey
  since: string
  href?: string
}

const FEATURES = manifest.features as Record<string, FeatureVersion>

function parse(version: string): number[] {
  return version.split('.').map((part) => parseInt(part, 10) || 0)
}

/** -1 if a < b, 0 if equal, 1 if a > b */
export function compareVersions(a: string, b: string): number {
  const pa = parse(a)
  const pb = parse(b)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (diff !== 0) return diff < 0 ? -1 : 1
  }
  return 0
}

/**
 * Resolve a marker to a component and minimum version, and check it against
 * the version manifest. Throws during the build if the marker names an
 * unknown feature or component, or a version newer than the latest release,
 * so markers can't drift from src/componentVersions.js.
 */
export function resolveAppliesTo({
  feature,
  component,
  since,
}: {
  feature?: string
  component?: ComponentKey
  since?: string
}): { component: ComponentKey; since: string; latest: string; label: string } {
  let key = component
  let min = since
  if (feature) {
    const entry = FEATURES[feature]
    if (!entry) throw new Error(`<AppliesTo>: unknown feature "${feature}" in src/data/feature-versions.json`)
    key = entry.component
    min = entry.since
  }
  if (!key || !min) throw new Error('<AppliesTo>: pass `feature`, or `component` and `since`')
  const latest = versions[key]
  if (!latest) throw new Error(`<AppliesTo>: unknown component "${key}" in src/componentVersions.js`)
  if (compareVersions(min, latest) > 0) {
    throw new Error(`<AppliesTo>: ${key} ${min} is newer than the latest version in src/componentVersions.js (${latest})`)
  }
  const label = componentInfo[key as string]?.label ?? key
  return { component: key, since: min, latest, label }
}

/**
 * An inline "Applies to Enrich 6.9.0+" marker. Use it instead of writing
 * "available since version X" in prose, so the versions page and the marker
 * come from the same manifest.
 *
 * ```mdx
 * <AppliesTo feature="asn-lookup-enrichment" />
 * <AppliesTo component="snowbridge" since="6.0.0" />
 * ```
 */
export default function AppliesTo({
  feature,
  component,
  since,
  className,
}: {
  feature?: string
  component?: ComponentKey
  since?: string
  className?: string
}): JSX.Element {
  const resolved = resolveAppliesTo({ feature, component, since })
  return (
    <span className={clsx("sp-applies-to", "not-prose", className)}>
      <Tag size={14} aria-hidden="true" />
      <span>
        Applies to{' '}
        <strong>
          {resolved.label} {resolved.since}+
        </strong>
      </span>
      <Link
        to="/docs/api-reference/versions/#feature-availability-by-version"
        className="sp-applies-to__latest"
        title={`The latest ${resolved.label} version is ${resolved.latest}`}
      >
        Latest: {resolved.latest}
      </Link>
    </span>
  )
}

/** The full manifest as a table, for the versions and compatibility page */
export function FeatureVersionTable(): JSX.Element {
  const rows = Object.entries(FEATURES)
    .map(([id, entry]) => ({ id, entry, resolved: resolveAppliesTo({ feature: id }) }))
    .sort(
      (a, b) =>
        a.resolved.label.localeCompare(b.resolved.label) ||
        compareVersions(a.entry.since, b.entry.since) ||
        a.entry.label.localeCompare(b.entry.label)
    )

  return (
    <table className="sp-feature-versions">
      <thead>
        <tr>
          <th scope="col">Feature</th>
          <th scope="col">Component</th>
          <th scope="col">Minimum version</th>
          <th scope="col">Latest version</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ id, entry, resolved }) => (
          <tr key={id} id={`feature-${id}`}>
            <td>{entry.href ? <Link to={entry.href}>{entry.label}</Link> : entry.label}</td>
            <td>{resolved.label}</td>
            <td>{resolved.since}</td>
            <td>{resolved.latest}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
