import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { useActiveDocContext } from '@docusaurus/plugin-content-docs/client'
import { PRODUCTS } from './products'

/**
 * Navbar product switcher: Snowplow CDI | Signals. Each product is a link to
 * its landing page, and the one whose sidebar holds the current page is
 * marked as current.
 */
export default function ProductSwitcher({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const { activeDoc } = useActiveDocContext(undefined)
  const activeSidebar = activeDoc?.sidebar

  if (mobile) {
    return (
      <>
        {PRODUCTS.map((product) => {
          const active = activeSidebar === product.id
          return (
            <li key={product.id} className="menu__list-item">
              <Link
                to={product.href}
                className={clsx('menu__link', active && 'menu__link--active')}
                aria-current={active ? 'page' : undefined}
              >
                {product.label}
              </Link>
            </li>
          )
        })}
      </>
    )
  }

  return (
    <nav className={clsx('product-switcher', className)} aria-label="Products">
      {PRODUCTS.map((product) => {
        const active = activeSidebar === product.id
        return (
          <Link
            key={product.id}
            to={product.href}
            className={clsx(
              'product-switcher__link',
              active && 'product-switcher__link--active'
            )}
            aria-current={active ? 'true' : undefined}
            title={active ? undefined : `Switch to the ${product.label} docs`}
          >
            {product.label}
          </Link>
        )
      })}
    </nav>
  )
}
