import React, { useEffect } from 'react'
import { useWindowSize } from '@docusaurus/theme-common'
import { useDoc, useDocsSidebar } from '@docusaurus/plugin-content-docs/client'
import { useLocation } from '@docusaurus/router'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import DocItemPaginator from '@theme/DocItem/Paginator'
import DocVersionBanner from '@theme/DocVersionBanner'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocItemFooter from '@theme/DocItem/Footer'
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop'
import DocItemContent from '@theme/DocItem/Content'
import DocBreadcrumbs from '@theme/DocBreadcrumbs'
import type { Props } from '@theme/DocItem/Layout'

import { Paper } from '@mui/material'

import { useTutorial, TutorialKind } from '@site/src/components/tutorials/hooks'
import { AlignLeft } from 'lucide-react'
import HeadJSONLD from '../../../components/SchemaPlugin'

import ReleaseNoteMeta from '@site/src/components/release-notes/ReleaseNoteMeta'
import BackToProduct from '@site/src/components/navigation/BackToProduct'
import {
  SHARED_SIDEBARS,
  rememberProduct,
} from '@site/src/components/navigation/products'
import PageActions from './PageActions'
import MobileToc from './MobileToc'

/**
 * Path and absolute URL of the current page's Markdown copy, written by
 * plugins/docusaurus-plugin-llms-txt. Null when the plugin skips this route.
 */
function useMarkdownCopy(): { path: string; url: string } | null {
  const { pathname } = useLocation()
  const { siteConfig } = useDocusaurusContext()
  const llms = usePluginData('docusaurus-plugin-llms-txt') as
    | { enableMarkdownFiles?: boolean; excludeRoutes?: string[] }
    | undefined

  if (!llms?.enableMarkdownFiles) return null
  const route = pathname.endsWith('/') ? pathname : `${pathname}/`
  if (llms.excludeRoutes?.includes(route)) return null

  const path = route.replace(/\/$/, '') + '.md'
  return { path, url: siteConfig.url.replace(/\/$/, '') + path }
}

/**
 * Point browsers, crawlers, and agents at the Markdown copy of the page.
 */
function MarkdownAlternateLink() {
  const markdown = useMarkdownCopy()
  if (!markdown) return null
  return (
    <Head>
      <link rel="alternate" type="text/markdown" href={markdown.url} />
    </Head>
  )
}

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const { frontMatter, toc } = useDoc()
  const windowSize = useWindowSize()

  const hidden = frontMatter.hide_table_of_contents
  const canRender = !hidden && toc.length > 0

  const mobile = canRender ? <MobileToc /> : undefined

  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined

  return {
    hidden,
    mobile,
    desktop,
  }
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC()
  const tutorial = useTutorial()
  const markdown = useMarkdownCopy()
  const sidebarName = useDocsSidebar()?.name
  const { pathname } = useLocation()
  const sharedPage = !!sidebarName && SHARED_SIDEBARS.includes(sidebarName)

  // Remember the product (CDI or Signals) for the "Back to" link on shared pages
  useEffect(() => {
    rememberProduct(sidebarName, pathname)
  }, [sidebarName, pathname])

  return (
    <>
      <HeadJSONLD />
      <MarkdownAlternateLink />
      <div className="doc-layout">
        <div className="doc-layout__main">
          <DocVersionBanner />
          <article className="doc-article">
            <div className="doc-header">
              {sharedPage && <BackToProduct />}
              <DocBreadcrumbs />
              {docTOC.mobile}
              {markdown && <PageActions markdown={markdown} />}
            </div>
            <DocVersionBadge />
            <ReleaseNoteMeta />
            {tutorial === TutorialKind.Tutorial ? (
              <Paper sx={{ p: 2, pt: 2 }}>
                <DocItemContent>{children}</DocItemContent>
              </Paper>
            ) : (
              <DocItemContent>{children}</DocItemContent>
            )}
            <DocItemFooter />
          </article>
          <div className="doc-article__paginator">
            <DocItemPaginator />
          </div>
        </div>
        {docTOC.desktop && (
          <aside className="doc-layout__toc">
            <p className="doc-layout__toc-title">
              <AlignLeft size={16} aria-hidden="true" />
              On this page
            </p>
            {docTOC.desktop}
          </aside>
        )}
      </div>
    </>
  )
}
