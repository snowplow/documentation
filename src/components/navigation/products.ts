/**
 * The two products, and the sidebars (see sidebars.js) that belong to them.
 * Pages in the reference and platform sidebars are shared by both products.
 */
export type ProductId = 'cdi' | 'signals'

export interface Product {
  id: ProductId
  label: string
  /** Landing page, in that product's sidebar */
  href: string
}

export const PRODUCTS: Product[] = [
  { id: 'cdi', label: 'Snowplow CDI', href: '/docs/cdi/' },
  { id: 'signals', label: 'Signals', href: '/docs/signals/introduction/' },
]

export const SHARED_SIDEBARS = ['reference', 'platform']

export function productForSidebar(sidebar?: string | null): Product | undefined {
  return PRODUCTS.find((p) => p.id === sidebar)
}

const STORAGE_KEY = 'snowplow-docs:last-product'

export interface LastProduct {
  product: ProductId
  /** The last product page the reader was on */
  path: string
}

/**
 * Remember the product the reader was last reading about, for the "Back to"
 * link on shared pages. Session storage can be unavailable (private windows,
 * blocked storage), so failures are ignored.
 */
export function rememberProduct(sidebar: string | undefined, path: string): void {
  const product = productForSidebar(sidebar)
  if (!product) return
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ product: product.id, path })
    )
  } catch {
    // Storage unavailable: the "Back to" link stays hidden
  }
}

export function readLastProduct(): LastProduct | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (productForSidebar(parsed?.product) && typeof parsed.path === 'string') {
      return parsed as LastProduct
    }
  } catch {
    // Storage unavailable or malformed
  }
  return null
}

const ORIGIN_KEY = 'snowplow-docs:cross-product-origin'

function readOrigin(): LastProduct | null {
  try {
    const raw = window.sessionStorage.getItem(ORIGIN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (productForSidebar(parsed?.product) && typeof parsed.path === 'string') {
      return parsed as LastProduct
    }
  } catch {
    // Storage unavailable or malformed
  }
  return null
}

function writeOrigin(origin: LastProduct | null): void {
  try {
    if (origin) window.sessionStorage.setItem(ORIGIN_KEY, JSON.stringify(origin))
    else window.sessionStorage.removeItem(ORIGIN_KEY)
  } catch {
    // Storage unavailable: the "Back to" link stays hidden
  }
}

/**
 * Work out where the "Back to" link on this page should go, then remember
 * this page. Call once per page view, in the browser.
 *
 * - On shared pages (Reference, Platform & AI): back to the last product page.
 * - On a product page reached from the other product (for example a tracker
 *   page linked from the Signals docs): back to the page the reader came
 *   from. The link stays while the reader browses the other product, and
 *   clears when they return to the original product or open a product's
 *   landing page from the switcher.
 */
export function resolveBackLink(
  sidebar: string | undefined,
  path: string
): LastProduct | null {
  const last = readLastProduct()
  if (sidebar && SHARED_SIDEBARS.includes(sidebar)) return last

  const current = productForSidebar(sidebar)
  if (!current) return null

  let origin = readOrigin()
  const isLanding = PRODUCTS.some((p) => p.href === path)
  if ((origin && origin.product === current.id) || isLanding) {
    origin = null
  } else if (!origin && last && last.product !== current.id) {
    origin = last
  }
  writeOrigin(origin)
  rememberProduct(sidebar, path)
  return origin
}
