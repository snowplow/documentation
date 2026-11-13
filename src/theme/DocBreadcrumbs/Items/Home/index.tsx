import React, { type ReactNode } from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { translate } from '@docusaurus/Translate'
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client'
import IconHome from '@theme/Icon/Home'

import styles from './styles.module.css'

/** The first crumb after Home: the section of the docs the page is in */
const SIDEBAR_CRUMBS: Record<string, { label: string; href: string }> = {
  cdi: { label: 'Snowplow CDI', href: '/docs/cdi/' },
  signals: { label: 'Signals', href: '/docs/signals/introduction/' },
  reference: { label: 'Reference', href: '/docs/api-reference/' },
  platform: { label: 'Platform', href: '/docs/platform/' },
}

export default function HomeBreadcrumbItem(): ReactNode {
  const homeHref = useBaseUrl('/')
  const sidebar = useDocsSidebar()
  const section = sidebar?.name ? SIDEBAR_CRUMBS[sidebar.name] : undefined

  return (
    <>
      <li className="breadcrumbs__item">
        <Link
          aria-label={translate({
            id: 'theme.docs.breadcrumbs.home',
            message: 'Home page',
            description: 'The ARIA label for the home page in the breadcrumbs',
          })}
          className="breadcrumbs__link"
          href={homeHref}>
          <IconHome className={styles.breadcrumbHomeIcon} />
        </Link>
      </li>
      {section && (
        <li className="breadcrumbs__item">
          <Link className="breadcrumbs__link" href={section.href}>
            {section.label}
          </Link>
        </li>
      )}
    </>
  )
}
