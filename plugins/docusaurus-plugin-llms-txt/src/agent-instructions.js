import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Instructions for coding agents, written at the top of llms.txt and
 * llms-full.txt.
 *
 * Agents read llms.txt top to bottom and often stop early, so the facts they
 * get wrong most often go first: which tracker major is current, which Signals
 * packages exist, what's deprecated, and which terms to use. Current versions
 * come from src/componentVersions.js, the same file the docs pages render
 * versions from, so the two can't drift.
 */

// Trackers to list, in the order agents most often need them. `key` is the
// entry in src/componentVersions.js. `registry` is where to check for the
// latest release.
const TRACKERS = [
  {
    key: 'javaScriptTracker',
    name: 'JavaScript tracker (tag) and Browser tracker (`@snowplow/browser-tracker`)',
    registry: 'npm',
  },
  { key: 'javaScriptTracker', name: 'Node.js tracker (`@snowplow/node-tracker`)', registry: 'npm' },
  { key: 'iosTracker', name: 'iOS tracker (`SnowplowTracker`)', registry: 'Swift Package Manager or CocoaPods' },
  {
    key: 'androidTracker',
    name: 'Android tracker (`com.snowplowanalytics:snowplow-android-tracker`)',
    registry: 'Maven Central',
  },
  { key: 'flutterTracker', name: 'Flutter tracker (`snowplow_tracker`)', registry: 'pub.dev' },
  { key: 'pythonTracker', name: 'Python tracker (`snowplow-tracker`)', registry: 'PyPI' },
  { key: 'javaTracker', name: 'Java tracker (`com.snowplowanalytics:snowplow-java-tracker`)', registry: 'Maven Central' },
  { key: 'golangTracker', name: 'Golang tracker (`github.com/snowplow/snowplow-golang-tracker/v3`)', registry: 'pkg.go.dev' },
  { key: 'dotNetTracker', name: '.NET tracker (`Snowplow.Tracker`)', registry: 'NuGet' },
  { key: 'phpTracker', name: 'PHP tracker (`snowplow/snowplow-tracker`)', registry: 'Packagist' },
  { key: 'rubyTracker', name: 'Ruby tracker (`snowplow-tracker`)', registry: 'RubyGems' },
  { key: 'scalaTracker', name: 'Scala tracker', registry: 'Maven Central' },
  { key: 'cppTracker', name: 'C++ tracker', registry: 'GitHub releases' },
  { key: 'rustTracker', name: 'Rust tracker (`snowplow_tracker`)', registry: 'crates.io' },
  { key: 'unityTracker', name: 'Unity tracker', registry: 'GitHub releases' },
  { key: 'rokuTracker', name: 'Roku tracker', registry: 'GitHub releases' },
  { key: 'luaTracker', name: 'Lua tracker (`snowplowtracker`)', registry: 'LuaRocks' },
]

const SIGNALS_PACKAGES = [
  { pkg: '`snowplow-signals`', registry: 'PyPI', use: 'Python SDK: define attribute groups, services, and interventions, and retrieve attributes' },
  { pkg: '`@snowplow/signals-node`', registry: 'npm', use: 'Node.js SDK: retrieve attributes from server-side code' },
  { pkg: '`@snowplow/signals-browser-plugin`', registry: 'npm', use: 'Browser tracker plugin: subscribe to interventions in the browser' },
]

const DEPRECATIONS = [
  'Tracker pages under `previous-version` and `previous-versions` paths describe old majors, such as JavaScript tracker v2 and v3. Use them only to maintain existing code; write new code against the current major listed above.',
  'The Snowplow Web and Snowplow Mobile dbt packages are superseded by Unified Digital, and Fractribution by Attribution.',
  'SQL Runner data models are legacy. Use the dbt packages for new work.',
  'The User Agent Utils enrichment is deprecated. Use the YAUAA enrichment.',
  'The Snowplow Tracking CLI is deprecated. Use `snowplow-cli` to send events.',
]

const TERMINOLOGY = [
  'Say "self-describing event", never "unstructured event". Column and API names such as `unstruct_event` and `ue_pr` keep the old name.',
  'Say "entity" or "entities", never "context" or "custom context". Column names such as `contexts_*` and tracker options such as `contexts` keep the old name.',
  'Every self-describing event and entity needs a JSON schema, addressed by an Iglu URI such as `iglu:com.acme/checkout/jsonschema/1-0-0`. Events that fail validation become failed events; they are not dropped silently.',
  'Product names: Snowplow CDI, Signals, Event Studio, Snowtype, Snowplow Micro.',
]

/**
 * Read `key: '1.2.3'` pairs from src/componentVersions.js without executing it.
 */
export async function readComponentVersions(siteDir, file = 'src/componentVersions.js') {
  try {
    const source = await fs.readFile(path.join(siteDir, file), 'utf8')
    const versions = {}
    for (const match of source.matchAll(/^\s*(\w+):\s*['"]([^'"]+)['"]/gm)) {
      versions[match[1]] = match[2]
    }
    return versions
  } catch {
    return {}
  }
}

/**
 * Build the agent instructions as markdown lines.
 */
export async function buildAgentInstructions({ siteDir, siteUrl }) {
  const versions = await readComponentVersions(siteDir)
  const lines = []

  lines.push('## Instructions for AI agents')
  lines.push('')
  lines.push(
    'Read this section before writing Snowplow code. Each link below points to a Markdown copy of the page: append `.md` to any docs URL, without the trailing slash, to fetch the Markdown version of that page.'
  )
  lines.push('')

  lines.push('### Current versions')
  lines.push('')
  lines.push(
    'These are the versions documented on this site at build time. Check the package registry for the latest release before you pin a version, and never copy a version number from a code sample without checking it.'
  )
  lines.push('')
  for (const tracker of TRACKERS) {
    const version = versions[tracker.key]
    if (!version) continue
    const major = version.split('.')[0]
    const majorLabel = major === '0' ? `${version} (pre-1.0)` : `v${major} (${version})`
    lines.push(`- ${tracker.name}: ${majorLabel}, check ${tracker.registry}`)
  }
  lines.push('')

  lines.push('### Signals SDKs')
  lines.push('')
  for (const p of SIGNALS_PACKAGES) {
    lines.push(`- ${p.pkg} on ${p.registry}: ${p.use}`)
  }
  lines.push(
    `- Signals overview: ${siteUrl}/docs/signals/introduction.md. Signals quickstart: ${siteUrl}/docs/signals/quickstart.md`
  )
  lines.push('')

  lines.push('### Deprecated')
  lines.push('')
  for (const d of DEPRECATIONS) lines.push(`- ${d}`)
  lines.push('')

  lines.push('### Terminology')
  lines.push('')
  for (const t of TERMINOLOGY) lines.push(`- ${t}`)
  lines.push('')

  lines.push('### Tools for agents')
  lines.push('')
  lines.push(
    `- The Snowplow MCP server and skills let a coding agent create schemas, tracking plans, and Signals configuration in a Snowplow account: ${siteUrl}/docs/ai/snowplow-mcp.md`
  )
  lines.push(`- Every page in full, in one file: ${siteUrl}/llms-full.txt`)
  lines.push('')

  return lines
}
