import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import type { Props } from '@theme/PaginatorNavLink'

// This adds the `onClick` prop to the `PaginatorNavLink` component
export default function PaginatorNavLink(
  props: Props & { onClick?: () => void }
): JSX.Element {
  const { permalink, title, subLabel, isNext, onClick } = props
  return (
    <Link
      onClick={onClick}
      className={clsx(
        'pagination-nav__link',
        isNext ? 'pagination-nav__link--next' : 'pagination-nav__link--prev'
      )}
      to={permalink}
    >
      {subLabel && <div className="pagination-nav__sublabel">{subLabel}</div>}
      <div className="pagination-nav__label">{title}</div>
    </Link>
  )
}
