import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, Copy, Check, Download, FileText, MessageSquare } from 'lucide-react'
import { useDisclosure } from '@site/src/components/navigation/useDisclosure'

function assistantPrompt(markdownUrl: string): string {
  return `Read ${markdownUrl} so I can ask you questions about it. It's a page from the Snowplow documentation.`
}

/**
 * "Copy page" button, plus a menu with the other ways to read the page's
 * Markdown copy: view, download, or open in an AI assistant.
 */
export default function PageActions({
  markdown,
}: {
  markdown: { path: string; url: string }
}) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menu = useDisclosure()

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

  const markdownPath = markdown.path

  async function handleCopy() {
    try {
      const res = await fetch(markdownPath)
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

  return (
    <div className="page-actions" ref={menu.rootRef}>
      <button
        type="button"
        className="page-actions__copy"
        onClick={handleCopy}
        title="Copy this page as Markdown, for pasting into an LLM"
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy page'}</span>
      </button>
      <button
        type="button"
        className="page-actions__toggle"
        {...menu.buttonProps}
        title="More page actions"
      >
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
          <a href={markdownPath} className="page-action" target="_blank" rel="noopener">
            <FileText size={16} aria-hidden="true" />
            <span>View as Markdown</span>
          </a>
        </li>
        <li>
          <a href={markdownPath} className="page-action" download="">
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
          <a
            href={`https://chatgpt.com/?q=${prompt}`}
            className="page-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare size={16} aria-hidden="true" />
            <span>Open in ChatGPT</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
