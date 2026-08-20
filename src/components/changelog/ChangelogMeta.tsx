import React from 'react'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import { UpdateType } from './models'
import { formatUpdateDate } from './utils'
import UpdateTypeBadge from './UpdateTypeBadge'

const toArray = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  return Array.isArray(value) ? value.map(String) : []
}

/**
 * Publication date and tags for a changelog entry, shown above the article title.
 *
 * Changelog entries are dated announcements, so the date belongs on the page. It only lives in
 * front matter, and renders nothing on the docs and tutorials pages that share this layout.
 */
export const ChangelogMeta: React.FC = () => {
  const { frontMatter } = useDoc()
  const date = typeof frontMatter.date === 'string' ? frontMatter.date : ''
  const updateTypes = toArray(frontMatter.update_type)

  if (!date || updateTypes.length === 0) return null

  const components = toArray(frontMatter.components)

  return (
    <div className="not-prose max-w-[740px] mx-auto mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <time dateTime={date}>{formatUpdateDate(date)}</time>
      {updateTypes.map((type) => (
        <UpdateTypeBadge key={type} type={type as UpdateType} />
      ))}
      {components.length > 0 && <span>{components.join(', ')}</span>}
    </div>
  )
}

export default ChangelogMeta
