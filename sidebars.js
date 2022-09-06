/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

const swap = (allItems, linkItems) => {
  const result = allItems.map((item) => {
    if (item.type === 'category') {
      return { ...item, items: swap(item.items, linkItems) }
    }

    if (linkItems[item.id]) {
      return {
        type: 'link',
        label:
          linkItems[item.id]['sidebar_label'] ?? linkItems[item.id]['title'],
        href: linkItems[item.id]['href'],
        className: linkItems[item.id]['sidebar_class_name'],
        customProps: linkItems[item.id]['sidebar_custom_props'],
      }
    }

    return item
  })

  return result
}

// Switch out doc items for external links where required
const swapDocItemsToLinkItems = (generatedDocs, originalDocs) => {
  const linkItems = {}

  for (const docItem of originalDocs) {
    if (docItem.frontMatter['type'] === 'link') {
      linkItems[docItem.id] = docItem.frontMatter
    }
  }

  return swap(generatedDocs, linkItems)
}

module.exports = { swapDocItemsToLinkItems }
