import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import { ReleaseNote } from './models'
import { formatUpdateDateShort } from './utils'
import CategoryBadge from './CategoryBadge'

const gridColumns =
  'lg:grid lg:grid-cols-[minmax(0,3.9fr)_minmax(0,1fr)_minmax(0,0.9fr)_7rem] lg:gap-5 lg:items-center'

const ReleaseNoteRow: React.FC<{ entry: ReleaseNote }> = ({ entry }) => (
  <Link
    to={entry.permalink}
    className="group block text-inherit hover:text-inherit hover:no-underline"
  >
    <div
      className={cn(
        'px-4 py-4 transition-colors duration-150 group-hover:bg-muted',
        gridColumns
      )}
    >
      {/* Title and summary */}
      <div className="mb-2 lg:mb-0 lg:pr-2">
        <div className="text-base font-semibold text-foreground leading-snug">
          {entry.title}
        </div>
        <p className="text-muted-foreground text-sm leading-normal mt-1 mb-0 lg:truncate">
          {entry.description}
        </p>
      </div>

      {/* Update type */}
      <div className="mb-1 lg:mb-0 flex flex-wrap items-center gap-1">
        <span className="lg:hidden text-sm text-muted-foreground mr-1.5">
          Category:
        </span>
        {entry.category.map((type) => (
          <CategoryBadge key={type} type={type} />
        ))}
      </div>

      {/* Components, with any platform the entry is scoped to */}
      <div className="mb-1 lg:mb-0 text-sm text-foreground">
        <span className="lg:hidden text-muted-foreground mr-1.5">
          Components:
        </span>
        {[...entry.components, ...entry.platforms].join(', ')}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 lg:justify-end">
        <span className="lg:hidden text-sm text-muted-foreground">Date:</span>
        <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
          {formatUpdateDateShort(entry.date)}
        </span>
      </div>
    </div>
  </Link>
)

interface ReleaseNotesTableProps {
  entries: ReleaseNote[]
  className?: string
}

export const ReleaseNotesTable: React.FC<ReleaseNotesTableProps> = ({
  entries,
  className,
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No releases found matching your criteria.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Column headers - desktop only */}
      <div
        className={cn(
          'hidden px-4 pb-2 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide',
          gridColumns
        )}
      >
        <div>Release</div>
        <div>Category</div>
        <div>Components</div>
        <div className="lg:text-right">Date</div>
      </div>

      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <ReleaseNoteRow key={entry.slug} entry={entry} />
        ))}
      </div>
    </div>
  )
}

export default ReleaseNotesTable
