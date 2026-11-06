import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { ChevronDown, Copy, Check, Download, FileText, MessageSquare, Plug } from 'lucide-react'
import { useDisclosure } from '@site/src/components/navigation/useDisclosure'

export interface MarkdownCopy {
  /** Site-relative path of the page's .md copy */
  path: string
  /** Absolute URL of the page's .md copy */
  url: string
}

function assistantPrompt(markdownUrl: string): string {
  return `Read ${markdownUrl} so I can ask you questions about it. It's a page from the Snowplow documentation.`
}

type Copied = 'page' | 'mcp' | null

/**
 * The page actions menu: "Copy page" as the main button, and a menu with View
 * as Markdown, Download Markdown, Open in Claude, Open in ChatGPT, and Copy
 * MCP URL.
 *
 * Copy MCP URL only appears when `customFields.docsMcpUrl` is set in
 * docusaurus.config.ts, because the docs MCP server isn't deployed yet (see
 * research/blueprint-notes/spike-docs-mcp-hosting.md).
 */
export default function PageActions({ markdown }: { markdown: MarkdownCopy }): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  const mcpUrl = siteConfig.customFields?.docsMcpUrl as string | undefined
  const [copied, setCopied] = useState<Copied>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menu = useDisclosure()

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

  function flash(which: Copied) {
    setCopied(which)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(null), 2000)
  }

  async function copyPage() {
    try {
      const res = await fetch(markdown.path)
      if (!res.ok) throw new Error(`Failed to fetch Markdown: ${res.status}`)
      await navigator.clipboard.writeText(await res.text())
      flash('page')
    } catch (err) {
      console.warn('Failed to copy Markdown to clipboard:', err)
    }
  }

  async function copyMcpUrl() {
    if (!mcpUrl) return
    try {
      await navigator.clipboard.writeText(mcpUrl)
      flash('mcp')
    } catch (err) {
      console.warn('Failed to copy the MCP URL:', err)
    }
  }

  const prompt = encodeURIComponent(assistantPrompt(markdown.url))

  return (
    <div className="page-actions" ref={menu.rootRef}>
      <button
        type="button"
        className="page-actions__copy"
        onClick={copyPage}
        title="Copy this page as Markdown, for pasting into an LLM"
      >
        {copied === 'page' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span aria-live="polite">{copied === 'page' ? 'Copied' : 'Copy page'}</span>
      </button>
      <button type="button" className="page-actions__toggle" {...menu.buttonProps} title="More page actions">
        <ChevronDown size={16} aria-hidden="true" />
        <span className="sr-only">More page actions</span>
      </button>
      <ul
        id={menu.panelId}
        className={clsx('page-actions__menu', menu.open && 'page-actions__menu--open')}
        hidden={!menu.open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) menu.close()
        }}
      >
        <li>
          <a href={markdown.path} className="page-action" target="_blank" rel="noopener">
            <FileText size={16} aria-hidden="true" />
            <span>View as Markdown</span>
          </a>
        </li>
        <li>
          <a href={markdown.path} className="page-action" download="">
            <Download size={16} aria-hidden="true" />
            <span>Download Markdown</span>
          </a>
        </li>
        <li>
          <a
            href={`https://claude.ai/new?q=${prompt}`}
            className="page-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare size={16} aria-hidden="true" />
            <span>Open in Claude</span>
          </a>
        </li>
        <li>
          <a href={`https://chatgpt.com/?q=${prompt}`} className="page-action" target="_blank" rel="noopener noreferrer">
            <MessageSquare size={16} aria-hidden="true" />
            <span>Open in ChatGPT</span>
          </a>
        </li>
        {mcpUrl && (
          <li>
            <button type="button" className="page-action" onClick={copyMcpUrl}>
              {copied === 'mcp' ? <Check size={16} aria-hidden="true" /> : <Plug size={16} aria-hidden="true" />}
              <span aria-live="polite">{copied === 'mcp' ? 'Copied MCP URL' : 'Copy MCP URL'}</span>
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}
