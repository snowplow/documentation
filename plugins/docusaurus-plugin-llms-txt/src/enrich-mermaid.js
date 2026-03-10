import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Regex to extract ```mermaid code blocks from MDX source.
 * Captures the diagram source between the fences.
 */
const MERMAID_BLOCK_RE = /```mermaid\n([\s\S]*?)```/g

/**
 * Regex to find partial imports that might contain mermaid diagrams.
 * Matches: import X from '@site/docs/...' or import X from '../../...'
 */
const IMPORT_RE = /import\s+\w+\s+from\s+['"](@site\/|\.\.?\/)([^'"]+)['"]/g

/**
 * Enrich pages by extracting mermaid code blocks from MDX source files
 * and appending them to the converted markdown.
 *
 * Mermaid diagrams render client-side only, so the static HTML build output
 * contains empty comments where diagrams should be. This function reads the
 * original MDX source to recover the diagram definitions.
 *
 * Mutates pages in place.
 */
export async function enrichMermaid(pages, siteDir) {
  const docsDir = path.join(siteDir, 'docs')
  const tutorialsDir = path.join(siteDir, 'tutorials')

  let enriched = 0

  for (const page of pages) {
    const mdxPath = routeToMdxPath(page.routePath, docsDir, tutorialsDir)
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
 * Convert a route path to the most likely MDX source file path.
 * /docs/fundamentals/schemas/versioning/ → <docsDir>/fundamentals/schemas/versioning/index.md
 */
function routeToMdxPath(routePath, docsDir, tutorialsDir) {
  const parts = routePath.split('/').filter(Boolean)
  const root = parts[0]

  if (root === 'docs') {
    const rest = parts.slice(1).join('/')
    return path.join(docsDir, rest, 'index')
  }
  if (root === 'tutorials') {
    const rest = parts.slice(1).join('/')
    return path.join(tutorialsDir, rest, 'index')
  }
  return null
}

/**
 * Extract mermaid code blocks from an MDX file and its imported partials.
 * Tries .md and .mdx extensions.
 */
async function extractMermaidFromFile(basePath, siteDir) {
  const source = await readMdxFile(basePath)
  if (!source) return []

  const diagrams = extractMermaidBlocks(source)

  // Also check imported partials for mermaid blocks
  const imports = findPartialImports(source, basePath, siteDir)
  for (const importPath of imports) {
    try {
      const partialSource = await readFileRaw(importPath)
      if (partialSource) {
        diagrams.push(...extractMermaidBlocks(partialSource))
      }
    } catch {
      // Partial not found — skip
    }
  }

  return diagrams
}

/**
 * Try reading a file with .md or .mdx extension.
 */
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

/**
 * Read a file, returning null on failure.
 */
async function readFileRaw(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }
}

/**
 * Extract all ```mermaid code blocks from markdown source.
 */
function extractMermaidBlocks(source) {
  const diagrams = []
  let match
  const re = new RegExp(MERMAID_BLOCK_RE.source, 'g')
  while ((match = re.exec(source)) !== null) {
    const diagram = match[1].trim()
    if (diagram) diagrams.push(diagram)
  }
  return diagrams
}

/**
 * Find partial file imports that might contain mermaid diagrams.
 * Only follows imports from docs/reusable or relative paths to _*.md files.
 */
function findPartialImports(source, basePath, siteDir) {
  const imports = []
  let match
  const re = new RegExp(IMPORT_RE.source, 'g')
  while ((match = re.exec(source)) !== null) {
    const prefix = match[1] // '@site/' or './' or '../'
    const relPath = match[2]

    let fullPath
    if (prefix === '@site/') {
      fullPath = path.join(siteDir, relPath)
    } else {
      fullPath = path.resolve(path.dirname(basePath), prefix + relPath)
    }

    // Only follow partial-like imports (typically _*.md files)
    const base = path.basename(fullPath)
    if (base.startsWith('_') || relPath.includes('reusable/')) {
      // Handle paths that may or may not include extension
      if (!fullPath.match(/\.(md|mdx)$/)) {
        // Try common patterns: path/_index.md, path.md
        imports.push(fullPath + '.md')
        imports.push(fullPath + '.mdx')
        imports.push(path.join(fullPath, '_index.md'))
        imports.push(path.join(fullPath, '_index.mdx'))
      } else {
        imports.push(fullPath)
      }
    }
  }
  return imports
}

/**
 * Format mermaid diagrams as a markdown section.
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
    if (diagrams.length > 1) {
      lines.push(`### Diagram ${i + 1}`)
      lines.push('')
    }
    lines.push('```mermaid')
    lines.push(diagrams[i])
    lines.push('```')
    lines.push('')
  }

  return lines.join('\n')
}
