import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { useHistory, useLocation } from '@docusaurus/router'
import { Check, Minus, CircleDot } from 'lucide-react'

/** A cell: true/false, 'partial', a string, or a value with a note */
export type MatrixValue =
  | boolean
  | 'partial'
  | string
  | string[]
  | null
  | undefined
  | { value: boolean | 'partial' | string; note?: string; href?: string }

export interface MatrixColumn {
  key: string
  label: string
  /** Short explanation, shown under the table as a key */
  description?: string
  /** Link for the column header, such as the feature's docs page */
  href?: string
  /** Render the cell with a custom component (for example a tier badge) */
  render?: (value: MatrixValue, row: MatrixRow) => React.ReactNode
}

export interface MatrixRow {
  id: string
  label: string
  href?: string
  /** Secondary text under the row label */
  detail?: string
  values: Record<string, MatrixValue>
}

export interface MatrixFilter {
  /** Key in row.values to filter on. Rows match if the value equals, or contains, the option */
  key: string
  label: string
  options: { value: string; label: string }[]
}

function unwrap(value: MatrixValue): { value: unknown; note?: string; href?: string } {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  return { value }
}

function Cell({ value }: { value: MatrixValue }): JSX.Element {
  const { value: v, note, href } = unwrap(value)
  let content: React.ReactNode
  if (v === true) {
    content = (
      <span className="sp-matrix__yes">
        <Check size={16} aria-hidden="true" />
        <span className="sr-only">Yes</span>
      </span>
    )
  } else if (v === false || v === null || v === undefined) {
    content = (
      <span className="sp-matrix__no">
        <Minus size={16} aria-hidden="true" />
        <span className="sr-only">No</span>
      </span>
    )
  } else if (v === 'partial') {
    content = (
      <span className="sp-matrix__partial">
        <CircleDot size={14} aria-hidden="true" />
        <span>Partial</span>
      </span>
    )
  } else if (Array.isArray(v)) {
    content = v.join(', ')
  } else {
    content = String(v)
  }
  return (
    <>
      {href ? <Link to={href}>{content}</Link> : content}
      {note && (
        <span className="sp-matrix__note">
          <span className="sr-only">: </span>
          {note}
        </span>
      )}
    </>
  )
}

function rowMatches(row: MatrixRow, key: string, selected: string): boolean {
  const { value } = unwrap(row.values[key])
  if (Array.isArray(value)) return value.includes(selected)
  return String(value) === selected
}

/**
 * Read the filter state from the query string, so every filtered view can be
 * linked. Filters only apply after hydration: the server-rendered HTML, and so
 * the Markdown copy of the page, always lists every row.
 */
function useQueryFilters(filters: MatrixFilter[]) {
  const location = useLocation()
  const history = useHistory()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const selected: Record<string, string> = {}
  if (mounted) {
    for (const f of filters) {
      const v = params.get(f.key)
      if (v && f.options.some((o) => o.value === v)) selected[f.key] = v
    }
  }

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(location.search)
    if (value) next.set(key, value)
    else next.delete(key)
    const search = next.toString()
    history.replace({ ...location, search: search ? `?${search}` : '' })
  }

  return { selected, setFilter, mounted }
}

/**
 * A comparison table for catalog hubs (trackers, destinations). Rendered as a
 * plain HTML table with text values, so the Markdown copy lists every row.
 * Filters write to the query string.
 */
export default function FeatureMatrix({
  columns,
  rows,
  filters = [],
  caption,
  rowHeader = 'Name',
  className,
}: {
  columns: MatrixColumn[]
  rows: MatrixRow[]
  filters?: MatrixFilter[]
  caption?: string
  rowHeader?: string
  className?: string
}): JSX.Element {
  const { selected, setFilter, mounted } = useQueryFilters(filters)
  const visible = rows.filter((row) =>
    Object.entries(selected).every(([key, value]) => rowMatches(row, key, value))
  )
  const keyed = columns.filter((c) => c.description)

  return (
    <div className={clsx('sp-matrix', 'breakout', 'not-prose', className)}>
      {filters.length > 0 && (
        <div className="sp-matrix__filters" role="group" aria-label="Filter the table">
          {filters.map((f) => (
            <label key={f.key} className="sp-matrix__filter">
              <span>{f.label}</span>
              <select
                value={selected[f.key] ?? ''}
                onChange={(e) => setFilter(f.key, e.target.value)}
                disabled={!mounted}
              >
                <option value="">All</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <span className="sp-matrix__count" aria-live="polite">
            {visible.length === rows.length ? `${rows.length} items` : `${visible.length} of ${rows.length} items`}
          </span>
        </div>
      )}
      <div className="sp-matrix__scroll" tabIndex={0} role="region" aria-label={caption ?? 'Comparison table'}>
        <table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              <th scope="col">{rowHeader}</th>
              {columns.map((c) => (
                <th scope="col" key={c.key}>
                  {c.href ? <Link to={c.href}>{c.label}</Link> : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} id={row.id}>
                <th scope="row">
                  {row.href ? <Link to={row.href}>{row.label}</Link> : row.label}
                  {row.detail && (
                    <span className="sp-matrix__detail">
                      <span className="sr-only">, </span>
                      {row.detail}
                    </span>
                  )}
                </th>
                {columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row.values[c.key], row) : <Cell value={row.values[c.key]} />}</td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="sp-matrix__empty">
                  Nothing matches these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {keyed.length > 0 && (
        <dl className="sp-matrix__key">
          {keyed.map((c) => (
            <div key={c.key}>
              <dt>{c.label}</dt>
              <dd>{c.description}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
