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
  { id: 'cdi', label: 'Snowplow CDI', href: '/docs/' },
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
