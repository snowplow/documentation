import React from 'react'
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

import { AlignLeft } from 'lucide-react'
import HeadJSONLD from '../../../components/SchemaPlugin'

import ReleaseNoteMeta from '@site/src/components/release-notes/ReleaseNoteMeta'
import BackToProduct from '@site/src/components/navigation/BackToProduct'
import PageActions from '@site/src/components/PageActions'
import Feedback from '@site/src/components/Feedback'
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

// The llms.txt index for each sidebar, written by
// plugins/docusaurus-plugin-llms-txt/src/product-indexes.js
const SIDEBAR_INDEXES: Record<string, string> = {
  cdi: '/docs/cdi/llms.txt',
  signals: '/docs/signals/llms.txt',
  reference: '/docs/api-reference/llms.txt',
  platform: '/docs/platform/llms.txt',
}

/**
 * A short pointer for AI agents that read the HTML page: where the Markdown
 * copy and the llms.txt indexes are. Hidden with CSS (not the hidden
 * attribute), so screen readers and sighted readers skip it but HTML-to-text
 * tools keep it. The llms-ignore class keeps it out of the .md export.
 */
function AgentPointer({ sidebar }: { sidebar?: string }) {
  const markdown = useMarkdownCopy()
  const { siteConfig } = useDocusaurusContext()
  if (!markdown) return null
  const site = siteConfig.url.replace(/\/$/, '')
  const productIndex = sidebar ? SIDEBAR_INDEXES[sidebar] : undefined
  return (
    <p className="agent-pointer llms-ignore">
      For AI agents: a Markdown version of this page is at {markdown.url}. The index of all
      documentation pages is at {site}/llms.txt
      {productIndex ? `, and the index for this section is at ${site}${productIndex}` : ''}.
    </p>
  )
}

/**
 * Facets for the Algolia crawler: which sidebar (product) the page is in and
 * its content type. The crawler config has to map these meta tags to record
 * attributes before search can filter or rank on them.
 */
function SearchFacets({ sidebar }: { sidebar?: string }) {
  const { frontMatter } = useDoc()
  const contentType = (frontMatter as { content_type?: string }).content_type
  return (
    <Head>
      {sidebar && <meta name="docsearch:product" content={sidebar} />}
      {contentType && <meta name="docsearch:content_type" content={contentType} />}
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

/**
 * The docs home (`layout: home` in front matter) is a landing page: no
 * breadcrumbs, page actions, table of contents, feedback, or pagination.
 */
function HomeLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <MarkdownAlternateLink />
      <div className="doc-layout doc-layout--home">
        {/* docItemContainer is kept for the Algolia crawler, whose Docusaurus
            template finds page titles and headings with [class*='docItemContainer'] */}
        <div className="doc-layout__main docItemContainer">
          <article className="doc-article">
            <AgentPointer />
            <DocItemContent>{children}</DocItemContent>
          </article>
        </div>
      </div>
    </>
  )
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const { frontMatter } = useDoc()
  if ((frontMatter as { layout?: string }).layout === 'home') {
    return <HomeLayout>{children}</HomeLayout>
  }
  return <DefaultLayout>{children}</DefaultLayout>
}

function DefaultLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC()
  const markdown = useMarkdownCopy()
  const sidebarName = useDocsSidebar()?.name
  const { pathname } = useLocation()
  return (
    <>
      <HeadJSONLD />
      <MarkdownAlternateLink />
      <SearchFacets sidebar={sidebarName} />
      <div className="doc-layout">
        {/* docItemContainer is kept for the Algolia crawler, whose Docusaurus
            template finds page titles and headings with [class*='docItemContainer'] */}
        <div className="doc-layout__main docItemContainer">
          <DocVersionBanner />
          <article className="doc-article">
            <AgentPointer sidebar={sidebarName} />
            <div className="doc-header">
              <BackToProduct sidebar={sidebarName} path={pathname} />
              <DocBreadcrumbs />
              {docTOC.mobile}
              {markdown && <PageActions markdown={markdown} />}
            </div>
            <DocVersionBadge />
            <ReleaseNoteMeta />
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
            {pathname.startsWith('/docs/') && <Feedback />}
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
