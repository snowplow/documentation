import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

const STRIP_TAGS = new Set(['form', 'iframe', 'video', 'audio', 'button'])

const STRIP_CLASS_PATTERNS = [
  'MuiTextField',
  'MuiAutocomplete',
  'MuiFormControl',
  'MuiDataGrid',
  'MuiSelect',
  'MuiInput',
  'JsonValidator',
  'jsonschema-validator',
]

/**
 * Strip interactive elements: MUI widgets, forms, iframes, video/audio, buttons.
 */
export default function rehypeStripInteractive() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Strip by tag name
      if (STRIP_TAGS.has(node.tagName)) {
        parent.children.splice(index, 1)
        return index
      }

      // Strip by class patterns
      const className = getClassString(node)
      if (
        className &&
        STRIP_CLASS_PATTERNS.some((p) => className.includes(p))
      ) {
        parent.children.splice(index, 1)
        return index
      }
    })
  }
}
