import AxeBuilder from '@axe-core/playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test, expect, gotoAndSettle } from './fixtures.mjs'
import { urls, slug } from './urls.mjs'

// Impacts that fail a test. Everything else is still written to the report.
// Override with A11Y_FAIL_ON=critical,serious,moderate
const failOn = (process.env.A11Y_FAIL_ON || 'critical,serious').split(',')
const reportDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'a11y-report'
)

for (const url of urls) {
  test(`a11y ${url}`, async ({ page }, testInfo) => {
    await gotoAndSettle(page, url)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    fs.mkdirSync(reportDir, { recursive: true })
    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
    }))
    fs.writeFileSync(
      path.join(reportDir, `${testInfo.project.name}--${slug(url)}.json`),
      JSON.stringify({ url, project: testInfo.project.name, violations: summary }, null, 2)
    )

    const blocking = summary.filter((v) => failOn.includes(v.impact))
    expect(
      blocking,
      blocking.map((v) => `${v.impact}: ${v.id} (${v.nodes}) ${v.help}`).join('\n')
    ).toEqual([])
  })
}
