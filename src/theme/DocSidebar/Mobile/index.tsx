/**
 * Mobile docs sidebar, with the same "Filter navigation" field as desktop.
 * Based on the theme-classic component (Docusaurus 3.10).
 */
import React, { type ReactNode } from 'react'
import clsx from 'clsx'
import {
  NavbarSecondaryMenuFiller,
  ThemeClassNames,
} from '@docusaurus/theme-common'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import DocSidebarItems from '@theme/DocSidebarItems'
import type { Props } from '@theme/DocSidebar/Mobile'
import SidebarFilter, {
  SidebarFilterEmpty,
} from '@site/src/components/navigation/SidebarFilter'
import { useSidebarFilter } from '@site/src/components/navigation/useSidebarFilter'

function DocSidebarMobileSecondaryMenu({ sidebar, path }: Props): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar()
  const filter = useSidebarFilter(sidebar)
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
        <ul
          key={filter.treeKey}
          className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}
        >
          <DocSidebarItems
            items={filter.items}
            activePath={path}
            onItemClick={(item) => {
              // Close the menu only for items that navigate
              if (item.type === 'category' && item.href) mobileSidebar.toggle()
              if (item.type === 'link') mobileSidebar.toggle()
            }}
            level={1}
          />
        </ul>
      )}
    </>
  )
}

function DocSidebarMobile(props: Props): ReactNode {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  )
}

export default React.memo(DocSidebarMobile)
