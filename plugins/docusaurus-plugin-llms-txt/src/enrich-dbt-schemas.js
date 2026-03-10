import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Map from route path suffix to schema name prefix.
 * Each key is the unique tail of the dbt config page route.
 */
const ROUTE_TO_SCHEMA = {
  'dbt-configuration/unified/': 'dbtUnified',
  'dbt-configuration/ecommerce/': 'dbtEcommerce',
  'dbt-configuration/media-player/': 'dbtMediaPlayer',
  'dbt-configuration/attribution/': 'dbtAttribution',
  'dbt-configuration/normalize/': 'dbtNormalize',
  'dbt-configuration/utils/': 'dbtUtils',
  'dbt-configuration/legacy/web/': 'dbtWeb',
  'dbt-configuration/legacy/mobile/': 'dbtMobile',
  'dbt-configuration/legacy/fractribution/': 'dbtFractribution',
}

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
 * Enrich dbt configuration pages by appending variable tables
 * extracted from the JSON schema files.
 *
 * Mutates pages in place — adds markdown table content to matching pages.
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
    const schemaName = matchRoute(page.routePath)
    if (!schemaName) continue

    const entry = latestSchemas.get(schemaName)
    if (!entry) continue

    try {
      const schemaPath = path.join(schemasDir, entry.file)
      const raw = await fs.readFile(schemaPath, 'utf8')
      const schema = JSON.parse(raw)
      const tables = renderSchemaTables(schema, entry.version)

      if (tables) {
        page.markdown = page.markdown.trimEnd() + '\n\n' + tables
        enriched++
      }
    } catch (err) {
      console.warn(
        `[llms-txt] Warning: Failed to enrich ${page.routePath}: ${err.message}`
      )
    }
  }

  if (enriched > 0) {
    console.log(`[llms-txt] Enriched ${enriched} dbt config pages with variable tables`)
  }
}

/**
 * Check if a route path matches a dbt config page.
 * Returns the schema name or null.
 */
function matchRoute(routePath) {
  for (const [suffix, schemaName] of Object.entries(ROUTE_TO_SCHEMA)) {
    if (routePath.endsWith(suffix)) return schemaName
  }
  return null
}

/**
 * Render schema properties as grouped markdown tables.
 */
function renderSchemaTables(schema, version) {
  const properties = schema.properties
  if (!properties) return null

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
      title: prop.title || varName,
      description: cleanDescription(prop.description || ''),
      defaultValue: formatDefault(prop.packageDefault),
      type: prop.type || '',
      warehouse: prop.warehouse ? String(prop.warehouse) : null,
      order: prop.order ?? 999,
    })
  }

  // Sort variables within each group by order
  for (const vars of groups.values()) {
    vars.sort((a, b) => a.order - b.order)
  }

  // Render each group as a markdown table
  const sections = []
  sections.push(`## Package configuration variables (v${version})`)
  sections.push('')
  sections.push(
    'All variables in Snowplow dbt packages start with `snowplow__` (omitted from the table below for brevity).'
  )
  sections.push('')

  // Emit groups in defined order, then any extras
  const orderedGroups = [...GROUP_ORDER]
  for (const key of groups.keys()) {
    if (!orderedGroups.includes(key)) orderedGroups.push(key)
  }

  for (const groupName of orderedGroups) {
    const vars = groups.get(groupName)
    if (!vars || vars.length === 0) continue

    sections.push(`### ${groupName}`)
    sections.push('')

    const hasWarehouse = vars.some((v) => v.warehouse)

    if (hasWarehouse) {
      sections.push('| Variable | Description | Default | Warehouse |')
      sections.push('| --- | --- | --- | --- |')
    } else {
      sections.push('| Variable | Description | Default |')
      sections.push('| --- | --- | --- |')
    }

    for (const v of vars) {
      const desc = escapeTableCell(v.description)
      const def = escapeTableCell(v.defaultValue)
      if (hasWarehouse) {
        const wh = v.warehouse || 'All'
        sections.push(`| \`${v.name}\` | ${desc} | ${def} | ${wh} |`)
      } else {
        sections.push(`| \`${v.name}\` | ${desc} | ${def} |`)
      }
    }

    sections.push('')
  }

  return sections.join('\n')
}

/**
 * Format a default value for display in a table cell.
 */
function formatDefault(value) {
  if (value === undefined || value === null) return ''
  if (value === '') return '`""`'
  if (value === '[]') return '`[]`'
  if (typeof value === 'string') {
    // Short values get backticks
    if (value.length <= 60) return `\`${value}\``
    // Long values get truncated
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
