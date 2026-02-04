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
      <Link
        to={href}
        className="block mb-2 text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200"
      >
        {title}
      </Link>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children && (
        <div className="featured-section-links text-sm">{children}</div>
      )}
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
