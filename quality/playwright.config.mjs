// Playwright config for the docs quality checks: accessibility (axe) and
// visual regression screenshots. Both run against a production build served
// by `yarn serve`, so run `yarn build` first.
//
//   yarn qa:a11y                      axe checks, 4 projects x every URL
//   yarn qa:visual:capture            write baseline screenshots to VR_DIR
//   yarn qa:visual                    compare against the baselines in VR_DIR
//
// Environment variables:
//   BASE_URL   site to test (default http://localhost:3000)
//   VR_DIR     where baseline screenshots live (default quality/.baselines)
import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

const baseURL = process.env.BASE_URL || 'http://localhost:3000'
const vrDir = process.env.VR_DIR
  ? path.resolve(process.env.VR_DIR)
  : path.join(here, '.baselines')

const variants = [
  { name: 'light-1440', theme: 'light', width: 1440, height: 900 },
  { name: 'dark-1440', theme: 'dark', width: 1440, height: 900 },
  { name: 'light-390', theme: 'light', width: 390, height: 844 },
  { name: 'dark-390', theme: 'dark', width: 390, height: 844 },
]

export default defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.mjs$/,
  outputDir: 'test-results',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  snapshotPathTemplate: `${vrDir}/{projectName}/{arg}{ext}`,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  use: {
    baseURL,
    browserName: 'chromium',
  },
  projects: variants.map((v) => ({
    name: v.name,
    use: {
      viewport: { width: v.width, height: v.height },
      colorScheme: v.theme,
      theme: v.theme,
    },
  })),
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'yarn serve --port 3000 --no-open',
        cwd: path.join(here, '..'),
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
