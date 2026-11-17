import React, { useEffect, useState } from 'react'
import Link from '@docusaurus/Link'
import { ArrowLeft } from 'lucide-react'
import { productForSidebar, resolveBackLink, type LastProduct } from './products'

/**
 * Link back to the product the reader came from: on pages shared by both
 * products (Reference, Platform & AI), and on product pages reached from the
 * other product. See resolveBackLink. Hidden when there's nowhere to go back
 * to, and during server rendering.
 */
export default function BackToProduct({
  sidebar,
  path,
}: {
  sidebar?: string
  path: string
}) {
  const [target, setTarget] = useState<LastProduct | null>(null)

  useEffect(() => {
    setTarget(resolveBackLink(sidebar, path))
  }, [sidebar, path])

  const product = target && productForSidebar(target.product)
  if (!target || !product) return null

  return (
    <Link to={target.path} className="back-to-product">
      <ArrowLeft size={16} aria-hidden="true" />
      Back to {product.label}
    </Link>
  )
}
