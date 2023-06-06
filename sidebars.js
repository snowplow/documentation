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
  const result = allItems.flatMap((item) => {
    const header = item.customProps?.header ? [{
      type: 'html',
      value: item.customProps.header,
      defaultStyle: true,
      className: 'header',
    }] : []

    const className = item.customProps?.offerings ?
      [item.className || '', ...item.customProps.offerings].join(' ') :
      item.className

    if (item.type === 'category') {
      if (item.items.length > 0) return [...header, {
        ...item,
        className,
        items: swap(item.items, linkItems)
      }]
      // a workaround for empty category pages not respecting className
      // see https://discord.com/channels/398180168688074762/867060369087922187/1068508121091293264
      return [...header, {
        type: 'doc',
        id: item.link.id,
        label: item.label,
        className,
        customProps: item.customProps,
      }]
    }

    if (linkItems[item.id]) {
      return [
        {
          type: 'link',
          label: linkItems[item.id].sidebar_label ?? linkItems[item.id].title,
          href: linkItems[item.id].href,
          className,
          customProps: linkItems[item.id].sidebar_custom_props,
        },
      ]
    }

    return [{...item, className}]
  })

  return result
}

// Switch out doc items for external links where required
const swapDocItemsToLinkItems = (generatedDocs, originalDocs) => {
  const linkItems = {}

  for (const docItem of originalDocs) {
    if (docItem.frontMatter.type === 'link') {
      linkItems[docItem.id] = docItem.frontMatter
    }
  }

  return swap(generatedDocs, linkItems)
}

module.exports = { swapDocItemsToLinkItems }
