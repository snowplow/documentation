import React, { type ReactNode } from 'react'
import Content from '@theme-original/DocSidebar/Desktop/Content'
import type ContentType from '@theme/DocSidebar/Desktop/Content'
import type { WrapperProps } from '@docusaurus/types'
import SidebarFilter, {
  SidebarFilterEmpty,
} from '@site/src/components/navigation/SidebarFilter'
import { useSidebarFilter } from '@site/src/components/navigation/useSidebarFilter'

type Props = WrapperProps<typeof ContentType>

/** Desktop sidebar with a "Filter navigation" field above the items */
export default function ContentWrapper(props: Props): ReactNode {
  const filter = useSidebarFilter(props.sidebar)
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
