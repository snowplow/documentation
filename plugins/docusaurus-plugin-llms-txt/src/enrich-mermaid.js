import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Regex to extract ```mermaid code blocks from MDX source.
 */
const MERMAID_BLOCK_RE = /```mermaid\n([\s\S]*?)```/g

/**
 * Regex to find named imports from relative paths or @site/.
 * Captures: [1] component name, [2] prefix, [3] relative path
 */
const NAMED_IMPORT_RE =
  /import\s+(\w+)\s+from\s+['"](@site\/|\.\.?\/)([^'"]+)['"]/g

/**
 * Enrich pages by extracting mermaid diagrams from MDX source files
 * and appending them to the converted markdown.
 *
 * Handles:
 * - ```mermaid code blocks (static)
 * - Inline <Mermaid value={`...`}/> components (no props)
 * - <Mermaid value={`...${props.x}...`}/> in imported partials (with prop resolution)
 * - Two-level import chains (page → intermediate partial → diagram partial)
 *
 * Mutates pages in place.
 */
export async function enrichMermaid(pages, siteDir) {
  const docsDir = path.join(siteDir, 'docs')
  const tutorialsDir = path.join(siteDir, 'tutorials')

  let enriched = 0

  for (const page of pages) {
    const mdxPath = await routeToMdxPath(page.routePath, docsDir, tutorialsDir)
    if (!mdxPath) continue

    try {
      const diagrams = await extractMermaidFromFile(mdxPath, siteDir)
      if (diagrams.length === 0) continue

      const section = formatMermaidSection(diagrams)
      page.markdown = page.markdown.trimEnd() + '\n\n' + section
      enriched++
    } catch {
      // File not found or unreadable — skip silently
    }
  }

  if (enriched > 0) {
    console.log(
      `[llms-txt] Enriched ${enriched} pages with mermaid diagrams`
    )
  }
}

/**
 * Convert a route path to the most likely MDX source file path (without extension).
 * Tries both directory style (foo/index) and flat file style (foo).
 * Returns the first path where a .md or .mdx file exists, or null.
 */
async function routeToMdxPath(routePath, docsDir, tutorialsDir) {
  const parts = routePath.split('/').filter(Boolean)
  const root = parts[0]

  let baseDir
  if (root === 'docs') {
    baseDir = docsDir
  } else if (root === 'tutorials') {
    baseDir = tutorialsDir
  } else {
    return null
  }

  const rest = parts.slice(1).join('/')

  // Try directory style first: rest/index.md(x)
  const dirPath = path.join(baseDir, rest, 'index')
  for (const ext of ['.md', '.mdx']) {
    try {
      await fs.access(dirPath + ext)
      return dirPath
    } catch {
      // Try next
    }
  }

  // Try flat file style: rest.md(x)
  const flatPath = path.join(baseDir, rest)
  for (const ext of ['.md', '.mdx']) {
    try {
      await fs.access(flatPath + ext)
      return flatPath
    } catch {
      // Try next
    }
  }

  return null
}

/**
 * Extract mermaid diagrams from an MDX file and its imported partials.
 * Handles ```mermaid code blocks, inline <Mermaid> components, and
 * <Mermaid> components in partials with prop resolution up to 2 levels deep.
 *
 * Returns array of { mermaid: string, label?: string }
 */
async function extractMermaidFromFile(basePath, siteDir) {
  const source = await readMdxFile(basePath)
  if (!source) return []

  const diagrams = []

  // 1. Extract ```mermaid code blocks from this file
  for (const d of extractMermaidBlocks(source)) {
    diagrams.push({ mermaid: d })
  }

  // 2. Extract inline <Mermaid value={`...`}/> with no props
  for (const t of extractMermaidComponentTemplates(source)) {
    if (!t.hasProps) {
      const trimmed = t.template.trim()
      if (trimmed) diagrams.push({ mermaid: trimmed })
    }
  }

  // 3. Process imported partials (level 1)
  const imports = await findNamedImports(source, basePath, siteDir)

  for (const imp of imports) {
    const partialSource = await readFileRaw(imp.resolvedPath)
    if (!partialSource) continue

    // 3a. ```mermaid code blocks in partial
    for (const d of extractMermaidBlocks(partialSource)) {
      diagrams.push({ mermaid: d })
    }

    // 3b. <Mermaid> component templates in partial
    const templates = extractMermaidComponentTemplates(partialSource)
    if (templates.length > 0) {
      const invocations = findComponentInvocations(source, imp.name)

      for (const template of templates) {
        if (!template.hasProps) {
          const trimmed = template.template.trim()
          if (trimmed) diagrams.push({ mermaid: trimmed })
        } else if (invocations.length > 0) {
          for (const inv of invocations) {
            const result = evaluateTemplate(template.template, inv.props)
            if (result) {
              diagrams.push({
                mermaid: result,
                label: makeDiagramLabel(inv.props),
              })
            }
          }
        }
      }
    }

    // 3c. Sub-partials (level 2) for cross-cloud diagram chains
    const subImports = await findNamedImports(
      partialSource,
      imp.resolvedPath,
      siteDir
    )

    for (const subImp of subImports) {
      const subSource = await readFileRaw(subImp.resolvedPath)
      if (!subSource) continue

      for (const d of extractMermaidBlocks(subSource)) {
        diagrams.push({ mermaid: d })
      }

      const subTemplates = extractMermaidComponentTemplates(subSource)
      if (subTemplates.length === 0) continue

      // Resolve props through 2-level chain:
      // page invokes imp.name with parentProps →
      // partial invokes subImp.name with subProps (possibly spreading parentProps)
      const parentInvocations = findComponentInvocations(source, imp.name)
      const subInvocations = findComponentInvocations(
        partialSource,
        subImp.name
      )

      for (const template of subTemplates) {
        if (!template.hasProps) {
          const trimmed = template.template.trim()
          if (trimmed) diagrams.push({ mermaid: trimmed })
          continue
        }

        for (const parentInv of parentInvocations) {
          for (const subInv of subInvocations) {
            const mergedProps = subInv.spreadsParentProps
              ? { ...parentInv.props, ...subInv.props }
              : { ...subInv.props }

            const result = evaluateTemplate(template.template, mergedProps)
            if (result) {
              diagrams.push({
                mermaid: result,
                label: makeDiagramLabel(mergedProps),
              })
            }
          }
        }
      }
    }
  }

  // Deduplicate by mermaid content
  const seen = new Set()
  return diagrams.filter((d) => {
    const key = d.mermaid.trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// --- File reading helpers ---

async function readMdxFile(basePath) {
  for (const ext of ['.md', '.mdx']) {
    try {
      return await fs.readFile(basePath + ext, 'utf8')
    } catch {
      // Try next extension
    }
  }
  return null
}

async function readFileRaw(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }
}

// --- Extraction helpers ---

/**
 * Extract all ```mermaid code blocks from markdown source.
 */
function extractMermaidBlocks(source) {
  const diagrams = []
  const re = new RegExp(MERMAID_BLOCK_RE.source, 'g')
  let match
  while ((match = re.exec(source)) !== null) {
    const diagram = match[1].trim()
    if (diagram) diagrams.push(diagram)
  }
  return diagrams
}

/**
 * Extract <Mermaid value={`...`}/> template literals from source.
 * Uses a parser (not regex) to handle nested template literals inside
 * ${} expressions correctly.
 *
 * Returns array of { template: string, hasProps: boolean }
 */
function extractMermaidComponentTemplates(source) {
  const templates = []
  const markerRe = /<Mermaid\s+value=\{`/g
  let marker

  while ((marker = markerRe.exec(source)) !== null) {
    const contentStart = marker.index + marker[0].length
    const template = parseTemplateLiteralContent(source, contentStart)
    if (template !== null) {
      templates.push({
        template,
        hasProps: /\$\{props\./.test(template),
      })
    }
  }

  return templates
}

/**
 * Parse a template literal starting just after the opening backtick.
 * Handles nested template literals inside ${} expressions.
 * Returns the content between the opening and closing backticks.
 */
function parseTemplateLiteralContent(source, startIndex) {
  let i = startIndex

  while (i < source.length) {
    const ch = source[i]

    if (ch === '\\') {
      i += 2 // Skip escaped character
      continue
    }

    if (ch === '`') {
      // Closing backtick of this template literal
      return source.substring(startIndex, i)
    }

    if (ch === '$' && source[i + 1] === '{') {
      // Template expression — skip to matching closing brace
      i = skipTemplateExpression(source, i + 2)
      continue
    }

    i++
  }

  return null // Unclosed template literal
}

/**
 * Skip past a template expression, starting just after the opening ${.
 * Tracks brace depth and handles nested template literals and string literals.
 * Returns the index just after the closing }.
 */
function skipTemplateExpression(source, startIndex) {
  let i = startIndex
  let braceDepth = 1

  while (i < source.length && braceDepth > 0) {
    const ch = source[i]

    if (ch === '\\') {
      i += 2
      continue
    }

    if (ch === '{') {
      braceDepth++
      i++
    } else if (ch === '}') {
      braceDepth--
      i++
    } else if (ch === '`') {
      // Nested template literal — recurse through it
      i++
      i = skipNestedTemplateLiteral(source, i)
    } else if (ch === "'" || ch === '"') {
      // String literal — skip to matching quote
      i = skipStringLiteral(source, i + 1, ch)
    } else {
      i++
    }
  }

  return i
}

/**
 * Skip past a nested template literal, starting just after its opening backtick.
 * Returns the index just after the closing backtick.
 */
function skipNestedTemplateLiteral(source, startIndex) {
  let i = startIndex

  while (i < source.length) {
    const ch = source[i]

    if (ch === '\\') {
      i += 2
      continue
    }

    if (ch === '`') {
      return i + 1 // Past closing backtick
    }

    if (ch === '$' && source[i + 1] === '{') {
      i = skipTemplateExpression(source, i + 2) // Recurse
      continue
    }

    i++
  }

  return i
}

/**
 * Skip past a string literal, starting just after the opening quote.
 * Returns the index just after the closing quote.
 */
function skipStringLiteral(source, startIndex, quote) {
  let i = startIndex

  while (i < source.length) {
    if (source[i] === '\\') {
      i += 2
      continue
    }
    if (source[i] === quote) {
      return i + 1
    }
    i++
  }

  return i
}

// --- Import resolution ---

/**
 * Find named imports pointing to partial files (starting with _ or in reusable/).
 * Resolves each import to an actual file path.
 * Returns array of { name: string, resolvedPath: string }
 */
async function findNamedImports(source, sourceFilePath, siteDir) {
  const imports = []
  const re = new RegExp(NAMED_IMPORT_RE.source, 'g')
  let match

  while ((match = re.exec(source)) !== null) {
    const name = match[1]
    const prefix = match[2]
    const relPath = match[3]

    let fullPath
    if (prefix === '@site/') {
      fullPath = path.join(siteDir, relPath)
    } else {
      fullPath = path.resolve(
        path.dirname(sourceFilePath),
        prefix + relPath
      )
    }

    // Only follow partial-like imports
    const base = path.basename(fullPath)
    if (!base.startsWith('_') && !relPath.includes('reusable/')) continue

    const resolvedPath = await resolveToFile(fullPath)
    if (resolvedPath) {
      imports.push({ name, resolvedPath })
    }
  }

  return imports
}

/**
 * Resolve a base path (possibly without extension) to an existing file.
 */
async function resolveToFile(basePath) {
  if (basePath.match(/\.(md|mdx)$/)) {
    try {
      await fs.access(basePath)
      return basePath
    } catch {
      return null
    }
  }

  for (const ext of ['.md', '.mdx']) {
    try {
      await fs.access(basePath + ext)
      return basePath + ext
    } catch {
      // Try next
    }
  }

  for (const idx of ['_index.md', '_index.mdx', 'index.md', 'index.mdx']) {
    const p = path.join(basePath, idx)
    try {
      await fs.access(p)
      return p
    } catch {
      // Try next
    }
  }

  return null
}

// --- JSX prop parsing ---

/**
 * Find all JSX invocations of a component in source.
 * Extracts prop values and detects {...props} spread.
 * Returns array of { props: Record<string, string>, spreadsParentProps: boolean }
 */
function findComponentInvocations(source, componentName) {
  const invocations = []
  const re = new RegExp(`<${componentName}\\s+([\\s\\S]*?)\\s*\\/?>`, 'g')
  let match

  while ((match = re.exec(source)) !== null) {
    const attrString = match[1]
    const props = {}
    const spreadsParentProps = /\{\.\.\.\s*props\s*\}/.test(attrString)

    // Extract prop="value" and prop='value'
    const propRe = /(\w+)=["']([^"']*)["']/g
    let propMatch
    while ((propMatch = propRe.exec(attrString)) !== null) {
      props[propMatch[1]] = propMatch[2]
    }

    // Also handle prop={"value"} JSX expressions with string literals
    const exprRe = /(\w+)=\{["']([^"']*?)["']\}/g
    let exprMatch
    while ((exprMatch = exprRe.exec(attrString)) !== null) {
      props[exprMatch[1]] = exprMatch[2]
    }

    invocations.push({ props, spreadsParentProps })
  }

  return invocations
}

// --- Template evaluation ---

/**
 * Evaluate a Mermaid template literal with concrete prop values.
 * Uses Function constructor to handle ${props.x} expressions,
 * ternary conditionals, and method calls like .toLowerCase().
 */
function evaluateTemplate(template, props) {
  try {
    const fn = new Function('props', 'return `' + template + '`')
    const result = fn(props || {})
    return result ? result.trim() : null
  } catch {
    return null
  }
}

/**
 * Create a human-readable label from prop values.
 * Prioritizes cloud and warehouse props.
 */
function makeDiagramLabel(props) {
  const parts = []
  if (props.cloud) parts.push(normalizeLabel(props.cloud))
  if (props.warehouse) parts.push(props.warehouse)

  if (parts.length === 0) {
    // Fall back to first 2 significant props
    for (const [key, val] of Object.entries(props)) {
      if (val && key !== 'compute' && key !== 'igludb') {
        parts.push(val)
        if (parts.length >= 2) break
      }
    }
  }

  return parts.length > 0 ? parts.join(' / ') : null
}

/**
 * Normalize cloud labels: short strings (aws, gcp) → uppercase,
 * others → title case.
 */
function normalizeLabel(s) {
  if (s.length <= 3) return s.toUpperCase()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// --- Output formatting ---

/**
 * Format mermaid diagrams as a markdown section.
 * Supports labeled diagram variants from template evaluation.
 */
function formatMermaidSection(diagrams) {
  const lines = []

  if (diagrams.length === 1) {
    lines.push('## Diagram')
  } else {
    lines.push('## Diagrams')
  }
  lines.push('')

  for (let i = 0; i < diagrams.length; i++) {
    const d = diagrams[i]
    if (diagrams.length > 1) {
      const label = d.label || `Diagram ${i + 1}`
      lines.push(`### ${label}`)
      lines.push('')
    }
    lines.push('```mermaid')
    lines.push(d.mermaid)
    lines.push('```')
    lines.push('')
  }

  return lines.join('\n')
}
