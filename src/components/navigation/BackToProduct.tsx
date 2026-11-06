import React, { useEffect, useState } from 'react'
import Link from '@docusaurus/Link'
import { ArrowLeft } from 'lucide-react'
import { productForSidebar, readLastProduct, type LastProduct } from './products'

/**
 * On pages shared by both products (Reference, Platform & AI), link back to
 * the product page the reader came from. Hidden when there's no product in
 * this session, and during server rendering.
 */
export default function BackToProduct() {
  const [last, setLast] = useState<LastProduct | null>(null)

  useEffect(() => {
    setLast(readLastProduct())
  }, [])

  const product = last && productForSidebar(last.product)
  if (!last || !product) return null

  return (
    <Link to={last.path} className="back-to-product">
      <ArrowLeft size={16} aria-hidden="true" />
      Back to {product.label}
    </Link>
  )
}
