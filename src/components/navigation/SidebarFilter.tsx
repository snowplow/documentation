import React, { useId } from 'react'
import { Search, X } from 'lucide-react'

/**
 * "Filter navigation" field at the top of the docs sidebar. Filtering is
 * client-side over the sidebar labels; see filterSidebar.ts.
 */
export default function SidebarFilter({
  value,
  onChange,
  resultCount,
}: {
  value: string
  onChange: (value: string) => void
  resultCount: number
}) {
  const id = useId()
  return (
    <div className="sidebar-filter" role="search">
      <label htmlFor={id} className="sr-only">
        Filter navigation
      </label>
      <Search className="sidebar-filter__icon" size={16} aria-hidden="true" />
      <input
        id={id}
        className="sidebar-filter__input"
        type="search"
        placeholder="Filter navigation"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.preventDefault()
            onChange('')
          }
        }}
      />
      {value && (
        <button
          type="button"
          className="sidebar-filter__clear"
          onClick={() => onChange('')}
          aria-label="Clear filter"
          title="Clear filter"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {value ? `${resultCount} matching pages` : ''}
      </span>
    </div>
  )
}

export function SidebarFilterEmpty({ query }: { query: string }) {
  return <p className="sidebar-filter__empty">No pages match “{query}”.</p>
}
