import React from 'react'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import { Category } from './models'
import { formatUpdateDate } from './utils'
import CategoryBadge from './CategoryBadge'

const toArray = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  return Array.isArray(value) ? value.map(String) : []
}

/**
 * Publication date and tags for a release note, shown above the article title.
 *
 * Release notes are dated announcements, so the date belongs on the page. It only lives in
 * front matter, and renders nothing on the docs and tutorials pages that share this layout.
 */
export const ReleaseNoteMeta: React.FC = () => {
  const { frontMatter } = useDoc()
  const date = typeof frontMatter.date === 'string' ? frontMatter.date : ''
  const categorys = toArray(frontMatter.category)

  if (!date || categorys.length === 0) return null

  const tags = [...toArray(frontMatter.components), ...toArray(frontMatter.platforms)]

  return (
    <div className="not-prose max-w-[740px] mx-auto mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <time dateTime={date}>{formatUpdateDate(date)}</time>
      {categorys.map((type) => (
        <CategoryBadge key={type} type={type as Category} />
      ))}
      {tags.length > 0 && <span>{tags.join(', ')}</span>}
    </div>
  )
}

export default ReleaseNoteMeta
