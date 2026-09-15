export const DOCS_SITE_URLS = [
  'docs.snowplowanalytics.com',
  'docs.snowplow.io',
  'snowplow.github.io',
]
export const GTM_ID = 'GTM-M24XMJD'
export const UA_ID = 'UA-159566509-1'
export const COOKIE_PREF_KEY = 'cookie-preferences'
export const SP5_COOKIE_NAME = '_sp5_'
export const BIZ1_COOKIE_NAME = '_sp_biz1_'
export const PRODUCT_FRUITS_WORKSPACE_CODE = 'x2zOSE4yyzB6ULQ8'

// The two calls to action the docs point at, both on the marketing site. The
// "Book a demo" banner and the WebMCP `book_demo` tool both read them from here
// so the two can't drift apart. The navbar's "Try for free" button is declared
// in `docusaurus.config.ts`, which loads its local modules with `require` and
// so can't read this one.
export const DEMO_BOOKING_URL =
  'https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/'
export const FREE_TRIAL_URL =
  'https://snowplow.io/get-started/snowplow-free-trial'
