import { test as base, expect } from '@playwright/test'

// Third-party scripts (consent banner, chat, product tours, analytics) change
// between runs and are not ours to audit, so block everything off-origin.
export const test = base.extend({
  theme: ['light', { option: true }],
  page: async ({ page, baseURL, theme }, use) => {
    const origin = new URL(baseURL).origin
    await page.route('**/*', (route) => {
      const url = route.request().url()
      if (url.startsWith(origin) || url.startsWith('data:')) return route.continue()
      return route.abort()
    })
    // Docusaurus reads the stored theme choice before first paint. The storage
    // key is namespaced per site (for example theme-4a1), so answer any key
    // that starts with "theme".
    await page.addInitScript((t) => {
      const getItem = Storage.prototype.getItem
      Storage.prototype.getItem = function (key) {
        if (/^theme(-|$)/.test(key)) return t
        return getItem.call(this, key)
      }
    }, theme)
    await use(page)
  },
})

export { expect }

/** Load a page and wait until it has settled enough to audit or screenshot. */
export async function gotoAndSettle(page, path) {
  await page.goto(path, { waitUntil: 'load' })
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts && document.fonts.ready)
}
