import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Display order for variable groups.
 */
const GROUP_ORDER = [
  'Warehouse and Tracker',
  'Operation and Logic',
  'Contexts, Filters, and Logs',
  'Warehouse Specific',
]

/**
 * Map from lowercase heading text (as rendered in markdown) to schema group name.
 * The MDX uses sentence case; the schema uses title case.
 */
const HEADING_TO_GROUP = {
  'warehouse and tracker': 'Warehouse and Tracker',
  'operation and logic': 'Operation and Logic',
  'entities (contexts), filters, and logs': 'Contexts, Filters, and Logs',
  'warehouse-specific': 'Warehouse Specific',
}

/**
 * Headings for interactive-only sections that should be removed
 * from the markdown output (their content is stripped by rehype-strip-interactive).
 */
const DEAD_SECTIONS = ['config generator', 'output schemas']

/**
 * Enrich dbt configuration pages by inserting variable tables
 * under the matching headings, extracted from JSON schema files.
 *
 * Mutates pages in place.
 */
export async function enrichDbtSchemas(pages, siteDir) {
  const schemasDir = path.join(
    siteDir,
    'src/components/JsonSchemaValidator/Schemas'
  )

  // Check the schemas directory exists
  try {
    await fs.access(schemasDir)
  } catch {
    console.warn('[llms-txt] Schemas directory not found, skipping dbt enrichment')
    return
  }

  // Load all schema files and index by prefix
  const schemaFiles = (await fs.readdir(schemasDir)).filter((f) =>
    f.endsWith('.json')
  )

  // Find the latest version for each schema prefix
  const latestSchemas = new Map()
  for (const file of schemaFiles) {
    const match = file.match(/^(.+?)_(.+)\.json$/)
    if (!match) continue
    const [, prefix, version] = match
    const existing = latestSchemas.get(prefix)
    if (!existing || compareVersions(version, existing.version) > 0) {
      latestSchemas.set(prefix, { version, file })
    }
  }

  let enriched = 0

  for (const page of pages) {
    // Check if this page matches a dbt config route
    const schemaName = matchRoute(page.routePath, latestSchemas)
    if (!schemaName) continue

    const entry = latestSchemas.get(schemaName)
    if (!entry) continue

    try {
      const schemaPath = path.join(schemasDir, entry.file)
      const raw = await fs.readFile(schemaPath, 'utf8')
      const schema = JSON.parse(raw)
      const groupedTables = buildGroupedTables(schema)

      if (groupedTables.size > 0) {
        const { markdown: enrichedMarkdown, unmatchedGroups } =
          insertTablesAndClean(page.markdown, groupedTables, entry.version)
        page.markdown = enrichedMarkdown
        enriched++

        if (unmatchedGroups.length > 0) {
          console.warn(
            `[llms-txt] dbt enrichment for ${page.routePath}: schema groups [${unmatchedGroups.join(', ')}] had no matching heading in the markdown`
          )
        }
      }
    } catch (err) {
      console.warn(
        `[llms-txt] Warning: Failed to enrich ${page.routePath}: ${err.message}`
      )
    }
  }

}

/**
 * Check if a route path matches a dbt config page by deriving the schema
 * prefix from the folder name and checking if a matching schema exists.
 *
 * Convention: the leaf folder under dbt-configuration/ is converted from
 * kebab-case to PascalCase and prefixed with "dbt".
 *   unified        → dbtUnified
 *   media-player   → dbtMediaPlayer
 *   legacy/web     → dbtWeb
 *
 * Returns the schema prefix or null.
 */
function matchRoute(routePath, availableSchemas) {
  // Match routes like .../dbt-configuration/unified/ or .../dbt-configuration/legacy/web/
  // but NOT .../dbt-configuration/legacy/ itself (which is a category index)
  const match = routePath.match(/\/dbt-configuration\/(?:legacy\/)?([a-z](?:[a-z0-9-]*[a-z0-9])?)\/$/)
  if (!match) return null

  // Exclude the legacy directory index — "legacy" alone is not a config page
  if (match[1] === 'legacy') return null

  const slug = match[1]
  const prefix = 'dbt' + slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  if (!availableSchemas.has(prefix)) {
    console.warn(
      `[llms-txt] dbt-configuration page at ${routePath} derived schema prefix "${prefix}" but no matching schema file was found`
    )
    return null
  }

  return prefix
}

/**
 * Build a Map of group name → markdown table string from the schema.
 */
function buildGroupedTables(schema) {
  const properties = schema.properties
  if (!properties) return new Map()

  // Group variables
  const groups = new Map()
  for (const [key, prop] of Object.entries(properties)) {
    const group = prop.group || 'Other'
    if (!groups.has(group)) groups.set(group, [])

    const varName = key.startsWith('snowplow__')
      ? key.slice('snowplow__'.length)
      : key

    groups.get(group).push({
      name: varName,
      description: cleanDescription(prop.longDescription || prop.description || ''),
      defaultValue: formatDefault(prop.packageDefault),
      warehouse: prop.warehouse ? String(prop.warehouse) : null,
      order: prop.order ?? 999,
    })
  }

  // Sort variables within each group by order
  for (const vars of groups.values()) {
    vars.sort((a, b) => a.order - b.order)
  }

  // Render each group as a markdown table
  const result = new Map()
  for (const [groupName, vars] of groups) {
    if (!vars || vars.length === 0) continue

    const lines = []
    const hasWarehouse = vars.some((v) => v.warehouse)

    if (hasWarehouse) {
      lines.push('| Variable | Description | Default | Warehouse |')
      lines.push('| --- | --- | --- | --- |')
    } else {
      lines.push('| Variable | Description | Default |')
      lines.push('| --- | --- | --- |')
    }

    for (const v of vars) {
      const desc = escapeTableCell(v.description)
      const def = escapeTableCell(v.defaultValue)
      if (hasWarehouse) {
        const wh = v.warehouse || 'All'
        lines.push(`| \`${v.name}\` | ${desc} | ${def} | ${wh} |`)
      } else {
        lines.push(`| \`${v.name}\` | ${desc} | ${def} |`)
      }
    }

    result.set(groupName, lines.join('\n'))
  }

  return result
}

/**
 * Insert tables under matching headings and remove dead sections.
 * Returns { markdown, unmatchedGroups } where unmatchedGroups lists
 * schema group names that had no corresponding heading in the page.
 */
function insertTablesAndClean(markdown, groupedTables, version) {
  const lines = markdown.split('\n')
  const output = []
  const matchedGroups = new Set()
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/)

    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim().toLowerCase()

      // Check if this is a dead section to remove
      if (level === 2 && DEAD_SECTIONS.includes(text)) {
        // Skip this heading and everything until the next H2 or end of file
        i++
        while (i < lines.length) {
          const nextMatch = lines[i].match(/^#{2}\s/)
          if (nextMatch) break
          i++
        }
        continue
      }

      // Check if this heading matches a group for table insertion
      const groupName = HEADING_TO_GROUP[text]
      if (groupName && groupedTables.has(groupName)) {
        matchedGroups.add(groupName)
        output.push(line)
        output.push('')
        output.push(groupedTables.get(groupName))
        output.push('')
        // Skip any empty lines after the heading (before the next heading)
        i++
        while (i < lines.length && lines[i].trim() === '') {
          i++
        }
        continue
      }

      // Check if this is the "Package configuration variables" heading — add version note
      if (level === 2 && text.startsWith('package configuration variables')) {
        output.push(`## Package configuration variables (v${version})`)
        i++
        continue
      }
    }

    output.push(line)
    i++
  }

  const unmatchedGroups = [...groupedTables.keys()].filter(
    (g) => !matchedGroups.has(g)
  )

  return { markdown: output.join('\n'), unmatchedGroups }
}

/**
 * Format a default value for display in a table cell.
 */
function formatDefault(value) {
  if (value === undefined || value === null) return ''
  if (value === '') return '`""`'
  if (value === '[]') return '`[]`'
  if (typeof value === 'string') {
    if (value.length <= 60) return `\`${value}\``
    return `\`${value.slice(0, 57)}...\``
  }
  return `\`${String(value)}\``
}

/**
 * Remove UI-only placeholder text from descriptions.
 */
function cleanDescription(text) {
  return text
    .replace(/^>\s*Click the plus sign to add a new entry\s*$/, '')
    .replace(/^>\s*/, '') // strip leading blockquote markers
    .trim()
}

/**
 * Escape pipe characters and newlines for markdown table cells.
 */
function escapeTableCell(text) {
  if (!text) return ''
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

/**
 * Compare two semver-like version strings.
 * Returns positive if a > b, negative if a < b, 0 if equal.
 */
function compareVersions(a, b) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0
    const nb = pb[i] || 0
    if (na !== nb) return na - nb
  }
  return 0
}
