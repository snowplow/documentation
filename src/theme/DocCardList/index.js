// npm run swizzle @docusaurus/theme-classic DocCardList -- --eject
// This is marked as a “safe” swizzle by Docusaurus.
// See below for the changed part.
import React from 'react'
import clsx from 'clsx'
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/theme-common'
import DocCard from '@theme/DocCard'
function DocCardListForCurrentSidebarCategory({ className }) {
  const category = useCurrentSidebarCategory()
  return <DocCardList items={category.items} className={className} />
}
export default function DocCardList(props) {
  const { items, className } = props
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />
  }
  const filteredItems = filterDocCardListItems(items)
  return (
    <section className={clsx('row', className)}>
      {filteredItems.map((item, index) => (
        // changed part:
        // * add the item class to the card
        // * propagate description for categories
        <article
          key={index}
          className={`col col--6 margin-bottom--lg ${item.className || ''}`}
        >
          <DocCard
            item={{
              ...item,
              description: item.description || item.customProps?.description,
            }}
          />
        </article>
      ))}
    </section>
  )
}
