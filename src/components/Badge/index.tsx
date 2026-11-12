import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { CircleHelp } from 'lucide-react'
import { versions } from '@site/src/componentVersions'
import { componentInfo } from '@site/src/data/components'
import { useDisclosure } from '@site/src/components/navigation/useDisclosure'

export type BadgeVariant = 'availability' | 'lifecycle' | 'tier' | 'version' | 'neutral'
export type BadgeTone = 'accent' | 'neutral' | 'info' | 'tip' | 'warning' | 'danger' | 'muted'

export interface BadgeProps {
  variant?: BadgeVariant
  /** Color. Each variant has a default; set this to override it */
  tone?: BadgeTone
  /** Make the badge a link */
  href?: string
  /** Longer text shown on hover, and read by screen readers after the label */
  title?: string
  className?: string
  children: React.ReactNode
}

const DEFAULT_TONE: Record<BadgeVariant, BadgeTone> = {
  availability: 'accent',
  lifecycle: 'info',
  tier: 'accent',
  version: 'neutral',
  neutral: 'neutral',
}

/**
 * A small text label. Badges are plain text, not images, so they work in dark
 * mode, read correctly in the Markdown copy of the page, and don't call out to
 * shields.io on every page view.
 */
export function Badge({ variant = 'neutral', tone, href, title, className, children }: BadgeProps): JSX.Element {
  const classes = clsx('sp-badge', `sp-badge--${variant}`, `sp-badge--${tone ?? DEFAULT_TONE[variant]}`, className)
  if (href) {
    return (
      <Link to={href} className={clsx(classes, 'sp-badge--link')} title={title}>
        {children}
      </Link>
    )
  }
  return (
    <span className={classes} title={title}>
      {children}
    </span>
  )
}

/** A row of badges, such as the tier and version at the top of a tracker page */
export function BadgeGroup({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return <div className={clsx('sp-badge-group', 'not-prose', className)}>{children}</div>
}

// --- Support tier -----------------------------------------------------------

export type Tier = 'actively-maintained' | 'maintained' | 'early-release' | 'unsupported'

export const TIERS: Record<Tier, { label: string; tone: BadgeTone; description: string }> = {
  'actively-maintained': {
    label: 'Actively maintained',
    tone: 'accent',
    description: 'Production ready, frequent releases, dependencies kept up to date',
  },
  maintained: {
    label: 'Maintained',
    tone: 'info',
    description: 'Production ready, released less often',
  },
  'early-release': {
    label: 'Early release',
    tone: 'warning',
    description: 'Before version 1.0.0, may be missing core features',
  },
  unsupported: {
    label: 'Unsupported',
    tone: 'muted',
    description: 'Deprecated and not maintained',
  },
}

const TIER_PAGE = '/docs/sources/tracker-maintenance-classification/'

/** The maintenance group of a tracker, dbt package, or SDK */
export function TierBadge({ tier }: { tier: Tier }): JSX.Element {
  const info = TIERS[tier]
  if (!info) throw new Error(`<TierBadge>: unknown tier "${tier}"`)
  return (
    <Badge variant="tier" tone={info.tone} href={TIER_PAGE} title={info.description}>
      {info.label}
    </Badge>
  )
}

// --- Lifecycle --------------------------------------------------------------

export type Lifecycle = 'preview' | 'beta' | 'early-access' | 'ga' | 'deprecated' | 'legacy'

const LIFECYCLE: Record<Lifecycle, { label: string; tone: BadgeTone }> = {
  preview: { label: 'Preview', tone: 'info' },
  beta: { label: 'Beta', tone: 'info' },
  'early-access': { label: 'Early access', tone: 'info' },
  ga: { label: 'Generally available', tone: 'tip' },
  deprecated: { label: 'Deprecated', tone: 'danger' },
  legacy: { label: 'Legacy', tone: 'muted' },
}

/** Where a feature is in its lifecycle */
export function LifecycleBadge({ stage, href }: { stage: Lifecycle; href?: string }): JSX.Element {
  const info = LIFECYCLE[stage]
  if (!info) throw new Error(`<LifecycleBadge>: unknown stage "${stage}"`)
  return (
    <Badge variant="lifecycle" tone={info.tone} href={href}>
      {info.label}
    </Badge>
  )
}

// --- Version ----------------------------------------------------------------

/**
 * The latest version of a component, read from src/componentVersions.js.
 * Pass `version` instead of `component` for a fixed version.
 */
export function VersionBadge({
  component,
  version,
  href,
  label,
}: {
  component?: keyof typeof versions
  version?: string
  href?: string
  label?: string
}): JSX.Element {
  const resolved = version ?? (component ? versions[component] : undefined)
  if (!resolved) {
    throw new Error(`<VersionBadge>: no version for component "${String(component)}" in src/componentVersions.js`)
  }
  const info = component ? componentInfo[component as string] : undefined
  const target = href ?? info?.repo
  return (
    <Badge variant="version" href={target} title={info ? `Latest ${info.label} version` : undefined}>
      {label ? `${label} ` : ''}v{resolved}
    </Badge>
  )
}

// --- License ----------------------------------------------------------------

const LICENSES = {
  scl: { label: 'Snowplow Community License', href: '/community-license-1.0/' },
  spal: { label: 'Personal and Academic License', href: '/personal-and-academic-license-1.0/' },
  slul: { label: 'Limited Use License', href: '/limited-use-license-1.0/' },
}

export function LicenseBadge({ license }: { license: keyof typeof LICENSES }): JSX.Element {
  const info = LICENSES[license]
  if (!info) throw new Error(`<LicenseBadge>: unknown license "${license}"`)
  return (
    <Badge variant="neutral" href={info.href}>
      {info.label}
    </Badge>
  )
}

// --- Availability -----------------------------------------------------------

export type Platform = 'cloud' | 'pmc' | 'selfHosted' | 'addon'

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'cloud', label: 'Cloud' },
  { id: 'pmc', label: 'Private Managed Cloud' },
  { id: 'selfHosted', label: 'Self-Hosted' },
  { id: 'addon', label: 'Add-on' },
]

/**
 * Which Snowplow platforms a feature is available on. Platforms where it isn't
 * available are listed with a dashed outline and "Not available" for screen
 * readers, so the row reads the same at a glance on every page.
 */
export function Availability({
  available,
  note,
  helpContent,
  className,
}: {
  available: Platform[]
  /** Extra detail, shown in a popover from the help button */
  note?: string
  /** @deprecated use `note` */
  helpContent?: string
  className?: string
}): JSX.Element {
  const help = note ?? helpContent
  const disclosure = useDisclosure<HTMLDivElement>()

  return (
    <div className={clsx('sp-availability', 'not-prose', className)} ref={disclosure.rootRef}>
      <ul className="sp-availability__list" aria-label="Product availability">
        {PLATFORMS.map(({ id, label }) => {
          const active = available.includes(id)
          return (
            <li key={id}>
              <span
                className={clsx(
                  'sp-badge',
                  'sp-badge--availability',
                  active ? 'sp-badge--accent' : 'sp-badge--inactive'
                )}
              >
                {label}
                <span className="sr-only">{active ? ': available' : ': not available'}</span>
              </span>
            </li>
          )
        })}
      </ul>
      {help && (
        <>
          <button type="button" className="sp-availability__help" {...disclosure.buttonProps}>
            <CircleHelp size={16} aria-hidden="true" />
            <span className="sr-only">About availability</span>
          </button>
          <div
            id={disclosure.panelId}
            className="sp-availability__popover"
            hidden={!disclosure.open}
            role="region"
            aria-label="About availability"
          >
            <p>{help}</p>
            <p className="sp-availability__more">
              Find out more about <Link to="/docs/cdi/">Snowplow CDI</Link> and{' '}
              <Link to="/docs/get-started/feature-comparison/">product availability</Link>, or contact{' '}
              <a href="https://support.snowplow.io" target="_blank" rel="noopener noreferrer">
                Support
              </a>{' '}
              to upgrade.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Badge
