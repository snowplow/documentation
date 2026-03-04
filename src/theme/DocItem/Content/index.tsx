import React, { useState } from 'react'
import clsx from 'clsx'
import { ThemeClassNames } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import { useLocation } from '@docusaurus/router'
import Heading from '@theme/Heading'
import MDXContent from '@theme/MDXContent'
import type { Props } from '@theme/DocItem/Content'
import { Download, Copy, Check } from 'lucide-react'

function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc()
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined'
  if (!shouldRender) {
    return null
  }
  return metadata.title
}

function MarkdownActions() {
  const { pathname } = useLocation()
  const markdownUrl = pathname.replace(/\/$/, '') + '.md'
  const [copied, setCopied] = useState(false)

  function handleDownload() {
    const a = document.createElement('a')
    a.href = markdownUrl
    a.download = ''
    a.click()
  }

  async function handleCopy() {
    try {
      const res = await fetch(markdownUrl)
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail — clipboard access may be denied
    }
  }

  const buttonClass =
    'inline-flex items-center gap-1 text-s text-foreground transition-opacity cursor-pointer bg-transparent border-none p-0 font-normal opacity-70 hover:opacity-100'

  return (
    <div className="not-prose flex items-center gap-3 -mt-4 mb-8">
      <button
        onClick={handleDownload}
        className={buttonClass}
        title="Download this page as a Markdown file"
        aria-label="Download this page as Markdown"
        type="button"
      >
        <Download size={13} />
        <span>Download</span>
      </button>
      <button
        onClick={handleCopy}
        className={buttonClass}
        title="Copy the Markdown source of this page to your clipboard"
        aria-label="Copy this page's Markdown to clipboard"
        type="button"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
      </button>
    </div>
  )
}

export default function DocItemContent({ children }: Props): React.ReactNode {
  const syntheticTitle = useSyntheticTitle()
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      <MarkdownActions />
      <MDXContent>{children}</MDXContent>
    </div>
  )
}
