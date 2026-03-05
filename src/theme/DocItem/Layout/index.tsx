import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useWindowSize } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import { useLocation } from '@docusaurus/router'
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
import { AlignLeft, Download, Copy, Check } from 'lucide-react'
import HeadJSONLD from '../../../components/SchemaPlugin'

import Demo_Ad from '../../../components/ui/Demo_Ad'

function MarkdownActions() {
  const { pathname } = useLocation()
  const markdownUrl = pathname.replace(/\/$/, '') + '.md'
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

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

  const buttonClass =
    'inline-flex items-center gap-1 text-sm text-[color:var(--ifm-font-color-base)] transition-colors cursor-pointer bg-transparent border-none p-0 font-normal hover:text-[color:var(--ifm-color-primary)]'

  return (
    <div className="not-prose max-w-[740px] mx-auto flex items-center gap-3 -mt-1 mb-8 pl-[0.3rem]">
      <button
        onClick={handleDownload}
        className={buttonClass}
        title="Download page as a Markdown file"
        aria-label="Download this page as Markdown"
        type="button"
      >
        <Download size={18} />
        <span>Download</span>
      </button>
      <button
        onClick={handleCopy}
        className={buttonClass}
        title="Copy page as Markdown (for LLM)"
        aria-label="Copy this page's Markdown to clipboard"
        type="button"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
      </button>
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
      <div className="row">
        <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article className="max-w-full overflow-x-hidden leading-relaxed prose prose-headings:font-bold prose-p:mt-0 prose-table:block prose-table:rounded-lg prose-td:ps-3 prose-td:pe-3 prose-th:ps-3 prose-th:pe-3 prose-ul:mt-0 prose-ol:mt-0 prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-code:text-sm prose-img:mx-auto prose-img:block [&_nav.theme-doc-breadcrumbs]:max-w-[740px] [&_nav.theme-doc-breadcrumbs]:mx-auto [&_nav.theme-doc-breadcrumbs]:mt-8 [&_footer.theme-doc-footer]:max-w-[740px] [&_footer.theme-doc-footer]:mx-auto [&_footer.theme-doc-footer]:mt-8 [&_table_thead_tr_th_h3]:my-2 [&_table_tbody_tr_td_h3]:my-2 [&_table_thead_a]:font-semibold [&_table_thead_a]:no-underline">
              <DocBreadcrumbs />
              <MarkdownActions />
              <DocVersionBadge />
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
              <Demo_Ad />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
