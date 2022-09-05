/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

const swap = (items, itemsWithHref) => {
  const result = items.map((item) => {
    if (item.type === 'category') {
      return { ...item, items: swap(item.items, itemsWithHref) }
    }

    if (itemsWithHref[item.id]) {
      item = {
        type: 'link',
        label: itemsWithHref[item.id].title,
        href: itemsWithHref[item.id].href,
      }
    }

    return item
  })

  return result
}

// Switch out doc items for external links where required
const swapDocItemsToLinkItems = (items, docs) => {
  const itemsWithHref = {}

  for (const docItem of docs) {
    if (docItem.frontMatter['href']) {
      itemsWithHref[docItem.id] = docItem.frontMatter
    }
  }

  return swap(items, itemsWithHref)
}

module.exports = { swapDocItemsToLinkItems }
