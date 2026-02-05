import React from 'react'
import Link from '@docusaurus/Link'

// Shared grid wrapper for card layouts
interface CardGridProps {
  children: React.ReactNode
  cols?: 2 | 3
  breakout?: boolean
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  cols = 3,
  breakout = false,
}) => {
  const colsClass = cols === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'

  return (
    <div className={`${breakout ? 'breakout ' : ''}grid ${colsClass} gap-4 my-6`}>
      {children}
    </div>
  )
}

// Featured Section - card with subpage links and "Learn more" button
interface FeaturedSectionProps {
  title: string
  description: string
  href?: string
  children?: React.ReactNode
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  title,
  description,
  href,
  children,
}) => {
  return (
    <div
      className="rounded-lg bg-card p-6 transition-all duration-200 hover:shadow-md"
      style={{ border: '1px solid hsl(var(--border))' }}
    >
      <p className="mb-3 text-xl font-semibold text-foreground">{title}</p>
      <p className="text-base text-muted-foreground mb-5">{description}</p>
      {children && (
        <div className="featured-section-links text-sm mb-5">{children}</div>
      )}
      {href && (
        <Link
          to={href}
          className="featured-section-button inline-block text-base font-medium px-4 py-2 rounded-md transition-colors"
        >
          Learn more →
        </Link>
      )}
    </div>
  )
}

// Call to Action Card - clickable card with subtle background, no subpage links
interface CallToActionCardProps {
  title: string
  description: string
  href: string
}

export const CallToActionCard: React.FC<CallToActionCardProps> = ({
  title,
  description,
  href,
}) => {
  return (
    <Link
      to={href}
      className="cta-card block rounded-lg p-6 transition-all duration-200"
    >
      <p className="mb-3 text-xl font-extrabold text-foreground">{title}</p>
      <p className="text-base text-muted-foreground">{description}</p>
    </Link>
  )
}

// Link Card - clickable card with same styling as FeaturedSection
interface LinkCardProps {
  title: string
  description: string
  href: string
}

export const LinkCard: React.FC<LinkCardProps> = ({
  title,
  description,
  href,
}) => {
  return (
    <Link
      to={href}
      className="link-card block rounded-lg bg-card p-6 transition-all duration-200 hover:shadow-md"
      style={{ border: '1px solid hsl(var(--border))' }}
    >
      <p className="mb-3 text-xl font-semibold text-foreground">{title}</p>
      <p className="text-base text-muted-foreground mb-0">{description}</p>
    </Link>
  )
}

