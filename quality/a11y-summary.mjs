// Summarize the per-page axe reports written by `yarn qa:a11y`.
//   node quality/a11y-summary.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'a11y-report')
if (!fs.existsSync(dir)) {
  console.error(`No reports in ${dir}. Run yarn qa:a11y first.`)
  process.exit(1)
}

const byRule = new Map()
let pages = 0
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  pages++
  const { url, project, violations } = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
  for (const v of violations) {
    const entry = byRule.get(v.id) || { impact: v.impact, help: v.help, nodes: 0, pages: new Set() }
    entry.nodes += v.nodes
    entry.pages.add(`${project} ${url}`)
    byRule.set(v.id, entry)
  }
}

const order = { critical: 0, serious: 1, moderate: 2, minor: 3 }
const rows = [...byRule.entries()].sort(
  ([, a], [, b]) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9) || b.nodes - a.nodes
)

console.log(`${pages} page/variant reports, ${rows.length} distinct rules violated\n`)
console.log('impact     rule                              nodes  page-variants  help')
for (const [id, e] of rows) {
  console.log(
    `${e.impact.padEnd(10)} ${id.padEnd(33)} ${String(e.nodes).padStart(5)}  ${String(e.pages.size).padStart(13)}  ${e.help}`
  )
}
