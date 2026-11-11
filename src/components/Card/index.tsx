import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { ArrowRight, Clock } from 'lucide-react'

export type CardVariant = 'link' | 'product' | 'quickstart' | 'compact'
type HeadingLevel = 2 | 3 | 4

export interface CardLink {
  label: string
  href: string
}

export interface CardProps {
  title: React.ReactNode
  /** Where the card goes. Link, quickstart, and compact cards are clickable as a whole */
  href?: string
  description?: React.ReactNode
  /**
   * - link: title, description, the whole card is a link (default)
   * - product: a product overview with a code snippet or children and a list of links
   * - quickstart: a link card with a time estimate and product label
   * - compact: a one-line link card for dense grids and sidebar-category lists
   */
  variant?: CardVariant
  /** Heading level for the title. Titles are real headings so the page outline stays correct */
  headingLevel?: HeadingLevel
  /** A small label above the title, such as the product name */
  eyebrow?: React.ReactNode
  /** Icon shown before the title */
  icon?: React.ReactNode
  /** Time estimate for quickstart cards, such as "10 min" */
  time?: string
  /** Links listed at the bottom of product cards */
  links?: CardLink[]
  /** Label for the call-to-action link on product cards */
  cta?: string
  className?: string
  children?: React.ReactNode
}

/**
 * The one card for the whole site. In MDX, put cards in a <CardGrid>.
 *
 * The title is a heading (h3 by default). On clickable cards the title link is
 * stretched over the whole card, so screen readers announce one link with the
 * title as its name instead of a card-sized link with all the text in it.
 */
export function Card({
  title,
  href,
  description,
  variant = 'link',
  headingLevel = 3,
  eyebrow,
  icon,
  time,
  links,
  cta,
  className,
  children,
}: CardProps): JSX.Element {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  const clickable = !!href && variant !== 'product'

  const titleContent =
    href && clickable ? (
      <Link to={href} className="sp-card__link">
        {title}
      </Link>
    ) : href ? (
      <Link to={href} className="sp-card__title-link">
        {title}
      </Link>
    ) : (
      title
    )

  return (
    <div
      className={clsx(
        'sp-card',
        `sp-card--${variant}`,
        clickable && 'sp-card--clickable',
        'not-prose',
        className
      )}
    >
      {(eyebrow || time) && (
        <div className="sp-card__meta">
          {eyebrow && <span className="sp-card__eyebrow">{eyebrow}</span>}
          {time && (
            <span className="sp-card__time">
              <Clock size={14} aria-hidden="true" />
              <span>{time}</span>
            </span>
          )}
        </div>
      )}
      <Heading className="sp-card__title">
        {icon && (
          <span className="sp-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {titleContent}
        {clickable && variant === 'compact' && (
          <ArrowRight className="sp-card__arrow" size={16} aria-hidden="true" />
        )}
      </Heading>
      {description && <div className="sp-card__description">{description}</div>}
      {children && <div className="sp-card__body">{children}</div>}
      {links && links.length > 0 && (
        <ul className="sp-card__links">
          {links.map((link) => (
            <li key={link.href}>
              <Link to={link.href}>
                {link.label}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {cta && href && variant === 'product' && (
        <Link to={href} className="sp-button sp-button--secondary sp-button--sm sp-card__cta">
          {cta}
        </Link>
      )}
    </div>
  )
}

export interface CardGridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  /** Widen the grid to the 896px track used by code blocks and tables */
  breakout?: boolean
  className?: string
}

/** Responsive grid for cards: one column on phones, `cols` from 997px */
export function CardGrid({ children, cols = 3, breakout = false, className }: CardGridProps): JSX.Element {
  return (
    <div className={clsx('sp-card-grid', `sp-card-grid--${cols}`, breakout && 'breakout', className)}>
      {children}
    </div>
  )
}

export default Card
