import React, { useState, useEffect, useRef } from 'react'
import { useWindowSize } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import { useLocation } from '@docusaurus/router'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import DocItemPaginator from '@theme/DocItem/Paginator'
import DocVersionBanner from '@theme/DocVersionBanner'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocItemFooter from '@theme/DocItem/Footer'
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile'
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop'
import DocItemContent from '@theme/DocItem/Content'
import DocBreadcrumbs from '@theme/DocBreadcrumbs'
import type { Props } from '@theme/DocItem/Layout'

import { Paper } from '@mui/material'

import { useTutorial, TutorialKind } from '@site/src/components/tutorials/hooks'
import {
  AlignLeft,
  Download,
  Copy,
  Check,
  FileText,
  MessageSquare,
} from 'lucide-react'
import HeadJSONLD from '../../../components/SchemaPlugin'

import ReleaseNoteMeta from '@site/src/components/release-notes/ReleaseNoteMeta'

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

function assistantPrompt(markdownUrl: string): string {
  return `Read ${markdownUrl} so I can ask you questions about it. It's a page from the Snowplow documentation.`
}

function MarkdownActions() {
  const markdown = useMarkdownCopy()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

  if (!markdown) return null
  const markdownUrl = markdown.path

  function handleDownload() {
    const a = document.createElement('a')
    a.href = markdownUrl
    a.download = ''
    a.click()
  }

  async function handleCopy() {
    try {
      const res = await fetch(markdownUrl)
      if (!res.ok) throw new Error(`Failed to fetch Markdown: ${res.status}`)
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timeoutRef.current ?? undefined)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('Failed to copy Markdown to clipboard:', err)
    }
  }

  const prompt = encodeURIComponent(assistantPrompt(markdown.url))
  const claudeUrl = `https://claude.ai/new?q=${prompt}`
  const chatGptUrl = `https://chatgpt.com/?q=${prompt}`

  const buttonClass = 'page-action'

  return (
    <div className="page-actions">
      <button
        onClick={handleCopy}
        className={buttonClass}
        title="Copy page as Markdown (for LLM)"
        type="button"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
      </button>
      <a
        href={markdownUrl}
        className={buttonClass}
        title="View this page as Markdown"
        target="_blank"
        rel="noopener"
      >
        <FileText size={16} />
        <span>View as Markdown</span>
      </a>
      <button
        onClick={handleDownload}
        className={buttonClass}
        title="Download page as a Markdown file"
        type="button"
      >
        <Download size={16} />
        <span>Download</span>
      </button>
      <a
        href={claudeUrl}
        className={buttonClass}
        title="Open this page in Claude"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageSquare size={16} />
        <span>Open in Claude</span>
      </a>
      <a
        href={chatGptUrl}
        className={buttonClass}
        title="Open this page in ChatGPT"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageSquare size={16} />
        <span>Open in ChatGPT</span>
      </a>
    </div>
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

  const mobile = canRender ? <DocItemTOCMobile /> : undefined

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

  return (
    <>
      <HeadJSONLD />
      <MarkdownAlternateLink />
      <div className="doc-layout">
        <div className="doc-layout__main">
          <DocVersionBanner />
          <article className="doc-article">
            <DocBreadcrumbs />
            <MarkdownActions />
            <DocVersionBadge />
            <ReleaseNoteMeta />
            {docTOC.mobile}
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
