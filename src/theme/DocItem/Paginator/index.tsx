import React, { type ReactNode } from 'react'
import { useDoc, useDocsSidebar } from '@docusaurus/plugin-content-docs/client'
import DocPaginator from '@theme/DocPaginator'
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs'

const isHidden = (item: PropSidebarItem) =>
  (item.className ?? '').split(/\s+/).includes('hidden')

/** Every page link under an item, skipping hidden items */
function hrefsOf(item: PropSidebarItem, out: Set<string>): Set<string> {
  if (isHidden(item)) return out
  if (item.type === 'link') out.add(item.href)
  if (item.type === 'category') {
    if (item.href) out.add(item.href)
    item.items.forEach((child) => hrefsOf(child, out))
  }
  return out
}

/**
 * The pages in the same top-level sidebar group (section header, or an
 * unheaded top-level page) as the current page.
 */
function useGroupHrefs(permalink: string): Set<string> | null {
  const sidebar = useDocsSidebar()
  if (!sidebar) return null
  for (const item of sidebar.items) {
    const hrefs = hrefsOf(item, new Set())
    if (hrefs.has(permalink)) return hrefs
  }
  return null
}

/**
 * Previous and next links that stay inside the reader's current sidebar
 * group, so paging stops at the group's edge instead of jumping to an
 * unrelated topic. Hidden pages are never linked. A page that sets
 * pagination_prev or pagination_next in front matter keeps that link, even
 * across groups, as long as the target isn't hidden.
 */
export default function DocItemPaginator(): ReactNode {
  const { metadata, frontMatter } = useDoc()
  const group = useGroupHrefs(metadata.permalink)
  const sidebar = useDocsSidebar()
  const hidden = new Set<string>()
  const collectHidden = (items: PropSidebarItem[]) =>
    items.forEach((item) => {
      if (isHidden(item)) {
        if (item.type === 'link') hidden.add(item.href)
        if (item.type === 'category' && item.href) hidden.add(item.href)
      }
      if (item.type === 'category') collectHidden(item.items)
    })
  if (sidebar) collectHidden(sidebar.items)

  const keep = (
    nav: { permalink: string } | undefined,
    explicit: unknown
  ) => {
    if (!nav || hidden.has(nav.permalink)) return undefined
    if (explicit) return nav
    if (group && !group.has(nav.permalink)) return undefined
    return nav
  }

  const previous = keep(metadata.previous, frontMatter.pagination_prev)
  const next = keep(metadata.next, frontMatter.pagination_next)

  return (
    <DocPaginator
      className="docusaurus-mt-lg"
      previous={previous as typeof metadata.previous}
      next={next as typeof metadata.next}
    />
  )
}
