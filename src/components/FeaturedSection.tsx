import React from 'react'
import Link from '@docusaurus/Link'

interface FeaturedSectionProps {
  title: string
  description: string
  href: string
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
      className="rounded-lg bg-card p-5 transition-all duration-200 hover:shadow-md"
      style={{ border: '1px solid #e5e7eb' }}
    >
      <p className="mb-2 text-lg font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children && (
        <div className="featured-section-links text-sm mb-4">{children}</div>
      )}
      <Link
        to={href}
        className="featured-section-button inline-block text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
      >
        Learn more →
      </Link>
    </div>
  )
}

interface FeaturedSectionsProps {
  children: React.ReactNode
}

export const FeaturedSections: React.FC<FeaturedSectionsProps> = ({ children }) => {
  return (
    <div className="breakout grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 my-6">
      {children}
    </div>
  )
}
