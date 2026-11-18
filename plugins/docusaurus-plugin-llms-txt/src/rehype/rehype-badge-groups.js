import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

/**
 * Separate the badges in a <BadgeGroup> (class sp-badge-group) with " · ",
 * so a row of badges reads "Snowplow supported · Paid add-on" in the
 * Markdown copy instead of running the labels together.
 */
export default function rehypeBadgeGroups() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (!getClassString(node).split(/\s+/).includes('sp-badge-group')) return
      const badges = node.children.filter((child) => child.type === 'element')
      if (badges.length < 2) return
      const children = []
      badges.forEach((badge, i) => {
        if (i > 0) children.push({ type: 'text', value: ' · ' })
        children.push(badge)
      })
      node.children = children
    })
  }
}
