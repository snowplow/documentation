import { test, expect, gotoAndSettle } from './fixtures.mjs'
import { urls, slug } from './urls.mjs'

// Cap each screenshot so very long reference pages stay comparable and fast.
const MAX_HEIGHT = 4000

for (const url of urls) {
  test(`visual ${url}`, async ({ page }) => {
    await gotoAndSettle(page, url)

    // Load lazy images now, so screenshots don't depend on timing
    await page.evaluate(async () => {
      const images = [...document.images]
      images.forEach((img) => (img.loading = 'eager'))
      await Promise.all(
        images
          .filter((img) => !img.complete)
          .map((img) => new Promise((done) => { img.onload = img.onerror = done; setTimeout(done, 5000) }))
      )
    })

    // Hide things that change on every build or render
    await page.addStyleTag({
      content: `
        .theme-last-updated, time { visibility: hidden !important; }
        *, *::before, *::after { caret-color: transparent !important; }
      `,
    })

    const { width } = page.viewportSize()
    const height = await page.evaluate(() => document.documentElement.scrollHeight)

    await expect(page).toHaveScreenshot(`${slug(url)}.png`, {
      fullPage: true,
      clip: { x: 0, y: 0, width, height: Math.min(height, MAX_HEIGHT) },
    })
  })
}
