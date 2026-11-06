import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
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

import styles from './styles.module.css'
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

  const buttonClass =
    'inline-flex items-center gap-1 text-sm text-[color:var(--ifm-font-color-base)] transition-colors cursor-pointer bg-transparent border-none p-0 font-normal no-underline hover:no-underline hover:text-[color:var(--ifm-color-primary)]'

  return (
    // first:mt-8 covers pages whose plugin instance has no sidebar: they render no
    // breadcrumbs, so these buttons would otherwise sit flush against the navbar
    <div className="not-prose max-w-[740px] mx-auto flex flex-wrap items-center gap-x-3 gap-y-1 -mt-1 first:mt-8 mb-8 pl-[0.3rem]">
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
        className={`page-action ${buttonClass}`}
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
        className={`page-action ${buttonClass}`}
        title="Open this page in Claude"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageSquare size={16} />
        <span>Open in Claude</span>
      </a>
      <a
        href={chatGptUrl}
        className={`page-action ${buttonClass}`}
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
      <div className="row">
        <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article className="max-w-full overflow-x-hidden leading-relaxed prose prose-headings:font-bold prose-p:mt-0 prose-table:block prose-table:rounded-lg prose-td:ps-3 prose-td:pe-3 prose-th:ps-3 prose-th:pe-3 prose-ul:mt-0 prose-ol:mt-0 prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-code:text-sm prose-img:mx-auto prose-img:block [&_nav.theme-doc-breadcrumbs]:max-w-[740px] [&_nav.theme-doc-breadcrumbs]:mx-auto [&_nav.theme-doc-breadcrumbs]:mt-8 [&_footer.theme-doc-footer]:max-w-[740px] [&_footer.theme-doc-footer]:mx-auto [&_footer.theme-doc-footer]:mt-8 [&_table_thead_tr_th_h3]:my-2 [&_table_tbody_tr_td_h3]:my-2 [&_table_thead_a]:font-semibold [&_table_thead_a]:no-underline">
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
            <div className="max-w-[740px] mx-auto mt-8">
              <DocItemPaginator />
            </div>
          </div>
        </div>
        {docTOC.desktop && (
          <div className="col col--3">
            <div className="sticky top-16">
              <div className="flex items-center gap-2 my-1">
                <AlignLeft size={16} className="opacity-70 text-foreground" />
                <p className="text-[0.825rem] font-normal opacity-70 text-foreground m-0 pl-1">
                  On this page
                </p>
              </div>
              {docTOC.desktop}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
