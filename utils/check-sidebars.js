#!/usr/bin/env node
/**
 * Check that every doc page is in exactly one of the four sidebars, and that
 * previous-versions trees only appear in the reference sidebar.
 *
 * It rebuilds the sidebars from the doc metadata that the last `yarn build`
 * or `yarn start` cached in .docusaurus/, so run one of those first.
 *
 *   yarn check:sidebars
 */
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const { loadSidebars } = require('@docusaurus/plugin-content-docs/lib/sidebars/index.js')
const { DefaultNumberPrefixParser } = require('@docusaurus/plugin-content-docs/lib/numberPrefix.js')
const { createSlugger } = require('@docusaurus/utils')
const { sidebarItemsGenerator, LEGACY_DIRS, docPath } = require('./sidebar-items-generator')

const metaDir = path.join(root, '.docusaurus/docusaurus-plugin-content-docs/default')
if (!fs.existsSync(metaDir)) {
  console.error('No cached doc metadata. Run `yarn build` first.')
  process.exit(2)
}
const docs = fs
  .readdirSync(metaDir)
  .filter((f) => f.startsWith('site-docs-') && f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(metaDir, f), 'utf8')))

;(async () => {
  const sidebars = await loadSidebars(path.join(root, 'sidebars.js'), {
    sidebarItemsGenerator,
    numberPrefixParser: DefaultNumberPrefixParser,
    docs,
    drafts: [],
    version: { contentPath: path.join(root, 'docs'), versionName: 'current', path: '/docs' },
    sidebarOptions: { sidebarCollapsible: true, sidebarCollapsed: true },
    categoryLabelSlugger: createSlugger(),
  })

  const where = {}
  const add = (id, sidebar) => (where[id] = [...(where[id] || []), sidebar])
  const walk = (items, sidebar) =>
    items.forEach((item) => {
      if (item.type === 'doc' || item.type === 'ref') add(item.id, sidebar)
      if (item.type === 'category') {
        if (item.link?.type === 'doc') add(item.link.id, sidebar)
        walk(item.items, sidebar)
      }
    })
  Object.entries(sidebars).forEach(([id, items]) => walk(items, id))

  const problems = []
  for (const doc of docs) {
    // type: link pages are rendered as link items, not docs
    if (doc.frontMatter.type === 'link') continue
    const found = where[doc.id] || []
    if (found.length === 0) problems.push(`not in any sidebar: ${doc.id}`)
    if (found.length > 1) problems.push(`in ${found.length} places (${found.join(', ')}): ${doc.id}`)
    const p = docPath(doc)
    const legacy = LEGACY_DIRS.some((dir) => p === dir || p.startsWith(dir + '/'))
    if (legacy && found.some((s) => s !== 'reference')) {
      problems.push(`previous version outside Reference: ${doc.id}`)
    }
  }

  const counts = Object.fromEntries(
    Object.keys(sidebars).map((s) => [s, Object.values(where).filter((w) => w.includes(s)).length])
  )
  console.log(`Pages per sidebar: ${JSON.stringify(counts)}`)
  if (problems.length) {
    console.error(problems.join('\n'))
    process.exit(1)
  }
  console.log(`All ${Object.keys(where).length} sidebar pages appear exactly once.`)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
