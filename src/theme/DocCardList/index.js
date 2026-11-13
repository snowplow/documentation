// Ejected from @docusaurus/theme-classic DocCardList (a "safe" swizzle).
// Renders sidebar categories and links with the site's <Card> instead of the
// stock DocCard, so <DocCardList /> matches every other card on the site.
import React from 'react'
import clsx from 'clsx'
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
  useDocById,
} from '@docusaurus/plugin-content-docs/client'
import { Card, CardGrid } from '@site/src/components/Card'

function DocCardListForCurrentSidebarCategory({ className }) {
  const category = useCurrentSidebarCategory()
  return <DocCardList items={category.items} className={className} />
}

function LinkItemCard({ item }) {
  const doc = useDocById(item.docId ?? undefined)
  return (
    <Card
      variant="link"
      className={item.className}
      title={item.label}
      href={item.href}
      description={item.description ?? item.customProps?.description ?? doc?.description}
    />
  )
}

function CategoryItemCard({ item }) {
  const href = item.href ?? item.items?.find((i) => i.href)?.href
  if (!href) return null
  const count = filterDocCardListItems(item.items).length
  return (
    <Card
      variant="link"
      className={item.className}
      title={item.label}
      href={href}
      description={item.description ?? item.customProps?.description ?? `${count} ${count === 1 ? 'page' : 'pages'}`}
    />
  )
}

export default function DocCardList(props) {
  const { items, className } = props
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />
  }
  const filteredItems = filterDocCardListItems(items)
  return (
    <CardGrid cols={2} className={clsx('doc-card-list', className)}>
      {filteredItems.map((item, index) =>
        item.type === 'category' ? (
          <CategoryItemCard key={index} item={item} />
        ) : (
          <LinkItemCard key={index} item={item} />
        )
      )}
    </CardGrid>
  )
}
