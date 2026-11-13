import { useMemo, useState } from 'react'
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs'
import { countLinks, filterSidebar, queryWords } from './filterSidebar'

export function useSidebarFilter(sidebar: PropSidebarItem[]) {
  const [query, setQuery] = useState('')
  const words = useMemo(() => queryWords(query), [query])
  const items = useMemo(() => filterSidebar(sidebar, words), [sidebar, words])
  const count = useMemo(() => (words.length ? countLinks(items) : 0), [items, words])
  return {
    query,
    setQuery,
    items,
    count,
    filtering: words.length > 0,
    // Remount the tree when the query changes, so categories pick up the
    // filtered collapsed state
    treeKey: words.join(' '),
  }
}
