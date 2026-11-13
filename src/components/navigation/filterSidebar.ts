import type { PropSidebarItem } from '@docusaurus/plugin-content-docs'

/** Lowercase words of a filter query */
export function queryWords(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean)
}

const matches = (label: string, words: string[]) => {
  const text = label.toLowerCase()
  return words.every((w) => text.includes(w))
}

const isHidden = (item: PropSidebarItem) =>
  (item.className ?? '').split(' ').includes('hidden')

/**
 * Keep the sidebar items whose label matches every word of the query, plus
 * the categories that lead to them. Categories with a matching descendant are
 * expanded; a category whose own label matches keeps all its children.
 */
export function filterSidebar(
  items: PropSidebarItem[],
  words: string[]
): PropSidebarItem[] {
  if (words.length === 0) return items
  return items.flatMap((item): PropSidebarItem[] => {
    if (isHidden(item) || item.type === 'html') return []
    if (item.type === 'category') {
      const children = filterSidebar(item.items, words)
      if (children.length > 0) {
        return [{ ...item, collapsed: false, items: children }]
      }
      return matches(item.label, words) ? [{ ...item, collapsed: true }] : []
    }
    return matches(item.label, words) ? [item] : []
  })
}

export function countLinks(items: PropSidebarItem[]): number {
  return items.reduce(
    (n, item) =>
      n +
      (item.type === 'category'
        ? (item.href ? 1 : 0) + countLinks(item.items)
        : item.type === 'link'
          ? 1
          : 0),
    0
  )
}
