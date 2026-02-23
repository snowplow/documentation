/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

const swap = (allItems, linkItems, descriptions) => {
  const result = allItems.flatMap((item) => {
    // Preserve header property for later section wrapping (don't create HTML here)
    const className = [
      item.className || '',
      item.customProps?.hidden ? 'hidden' : '',
    ].join(' ')

    if (item.type === 'category') {
      // a workaround for category pages not picking up the description in index.md
      // see https://docusaurus.io/feature-requests/p/allow-customizing-category-description-in-generated-index-cards
      const customProps = descriptions[item.link?.id]
        ? { ...item.customProps, description: descriptions[item.link.id] }
        : item.customProps

      if (item.items.length > 0)
        return [
          {
            ...item,
            className,
            customProps,
            items: swap(item.items, linkItems, descriptions),
          },
        ]
      // a workaround for empty category pages not respecting className
      // see https://discord.com/channels/398180168688074762/867060369087922187/1068508121091293264
      return [
        {
          type: 'doc',
          id: item.link.id,
          label: item.label,
          className,
          customProps,
        },
      ]
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

    return [{ ...item, className }]
  })

  return result
}

// Wrap items into collapsible sections based on header markers in customProps
/** @param {any[]} items */
const wrapInSections = (items) => {
  const result = []
  let currentSection = null
  let sectionItems = []
  let sectionLink = null

  for (const item of items) {
    const header = item.customProps?.header

    if (header) {
      // Close previous section if exists
      if (currentSection) {
        result.push({
          type: 'category',
          label: currentSection,
          collapsible: true,
          collapsed: currentSection === 'Components',
          className: 'section-header',
          link: sectionLink,
          items: sectionItems,
        })
      }

      // Start new section
      currentSection = header
      sectionLink = item.link || (item.type === 'doc' ? { type: 'doc', id: item.id } : null)

      // Add the item itself (without the header prop to avoid recursion issues)
      const { header: _, ...restCustomProps } = item.customProps || {}
      const itemWithoutHeader = {
        ...item,
        customProps: Object.keys(restCustomProps).length > 0 ? restCustomProps : undefined,
      }
      if ((header === 'Signals' || header === 'Components') && itemWithoutHeader.type === 'category' && itemWithoutHeader.items?.length) {
        sectionItems = itemWithoutHeader.items.map((child) => ({
          ...child,
          className: [child.className, 'section-child'].filter(Boolean).join(' '),
        }))
        sectionLink = null
      } else {
        sectionItems = [itemWithoutHeader]
      }
    } else if (currentSection) {
      // Add to current section
      sectionItems.push(item)
    } else {
      // No section yet, add directly to result
      result.push(item)
    }
  }

  // Close last section
  if (currentSection && sectionItems.length > 0) {
    result.push({
      type: 'category',
      label: currentSection,
      collapsible: true,
      collapsed: currentSection === 'Components',
      className: 'section-header',
      link: sectionLink,
      items: sectionItems,
    })
  }

  return result
}

// Switch out doc items for external links where required
const swapDocItemsToLinkItems = (generatedDocs, originalDocs) => {
  const linkItems = {}
  const descriptions = {}

  for (const docItem of originalDocs) {
    if (docItem.frontMatter.description) {
      descriptions[docItem.id] = docItem.frontMatter.description
    }
    if (docItem.frontMatter.type === 'link') {
      // Adding the noindex flag
      docItem.frontMatter.sidebar_custom_props = {
        ...(docItem.frontMatter.sidebar_custom_props || {}),
        noindex: true,
      }

      linkItems[docItem.id] = docItem.frontMatter
    }
  }

  const swapped = swap(generatedDocs, linkItems, descriptions)
  return wrapInSections(swapped)
}

module.exports = { swapDocItemsToLinkItems }
