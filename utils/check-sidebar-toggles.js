#!/usr/bin/env node
/**
 * Check that every collapsible sidebar category without its own page opens
 * and closes when clicked, in all four sidebars.
 *
 * Needs a running site (yarn serve, or a static server on build/) and
 * Playwright. Requests to other hosts are blocked.
 *
 *   node utils/check-sidebar-toggles.js [baseUrl]
 *
 * baseUrl defaults to http://localhost:3100.
 */
const { chromium } = require('playwright')

const base = (process.argv[2] || 'http://localhost:3100').replace(/\/$/, '')
// One page per sidebar
const PAGES = ['/docs/cdi/', '/docs/signals/introduction/', '/docs/api-reference/', '/docs/platform/']

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  const host = new URL(base).host
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    return url.host === host ? route.continue() : route.abort()
  })

  const failures = []
  let checked = 0
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    const toggles = page.locator('.theme-doc-sidebar-container .menu__link--sublist-caret')
    const count = await toggles.count()
    for (let i = 0; i < count; i++) {
      const toggle = toggles.nth(i)
      if (!(await toggle.isVisible())) continue
      const label = (await toggle.innerText()).trim()
      const before = await toggle.getAttribute('aria-expanded')
      await toggle.click()
      const after = await toggle.getAttribute('aria-expanded')
      await toggle.click()
      const back = await toggle.getAttribute('aria-expanded')
      checked++
      if (before === after || back !== before || new URL(page.url()).pathname !== path) {
        failures.push(`${path} "${label}": aria-expanded ${before} -> ${after} -> ${back}, url ${page.url()}`)
        await page.goto(base + path, { waitUntil: 'networkidle' })
      }
    }
  }
  await browser.close()

  console.log(`Checked ${checked} category toggles on ${PAGES.length} pages`)
  if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
  }
})()
