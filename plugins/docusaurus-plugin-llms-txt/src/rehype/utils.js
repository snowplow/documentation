/**
 * Get a node's className as a single string, regardless of whether
 * it is stored as an array or a plain string.
 */
export function getClassString(node) {
  const cls = node.properties?.className
  if (!cls) return ''
  if (Array.isArray(cls)) return cls.join(' ')
  return String(cls)
}
