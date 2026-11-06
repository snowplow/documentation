import React, { useEffect, type ReactNode } from 'react'
import Content from '@theme-original/DocSidebar/Desktop/Content'
import type ContentType from '@theme/DocSidebar/Desktop/Content'
import type { WrapperProps } from '@docusaurus/types'
import SidebarFilter, {
  SidebarFilterEmpty,
} from '@site/src/components/navigation/SidebarFilter'
import { useSidebarFilter } from '@site/src/components/navigation/useSidebarFilter'

type Props = WrapperProps<typeof ContentType>

/** The nearest ancestor of an element that scrolls vertically */
function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = window.getComputedStyle(node)
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node
    }
  }
  return null
}

/**
 * Scroll the sidebar (not the page) so the current page's link is visible,
 * on load and after each navigation. Long sidebars otherwise open scrolled
 * to the top, with the active item out of sight.
 */
function useActiveItemInView(path: string) {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const link = document.querySelector<HTMLElement>(
        '.theme-doc-sidebar-container .menu__link[aria-current="page"]'
      )
      if (!link) return
      const container = scrollParent(link)
      if (!container) return
      const box = container.getBoundingClientRect()
      const item = link.getBoundingClientRect()
      if (item.top >= box.top && item.bottom <= box.bottom) return
      container.scrollTop += item.top - box.top - (box.height - item.height) / 2
    })
    return () => window.cancelAnimationFrame(frame)
  }, [path])
}

/** Desktop sidebar with a "Filter navigation" field above the items */
export default function ContentWrapper(props: Props): ReactNode {
  const filter = useSidebarFilter(props.sidebar)
  useActiveItemInView(props.path)
  return (
    <>
      <SidebarFilter
        value={filter.query}
        onChange={filter.setQuery}
        resultCount={filter.count}
      />
      {filter.filtering && filter.items.length === 0 ? (
        <SidebarFilterEmpty query={filter.query} />
      ) : (
        <Content key={filter.treeKey} {...props} sidebar={filter.items} />
      )}
    </>
  )
}
