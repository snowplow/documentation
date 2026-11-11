import React from 'react'
import clsx from 'clsx'

export interface ParamProps {
  name: string
  type?: string
  required?: boolean
  /** Default value, shown as code. Leave unset for no default */
  default?: string | number | boolean
  /** Version that added the parameter, such as "6.9.0" */
  since?: string
  /** Description. In MDX, write it as Markdown between the tags instead */
  description?: React.ReactNode
  children?: React.ReactNode
  /** Indent nested fields one level per depth */
  depth?: number
}

/** One parameter row. Only valid inside <ParamTable> */
export function Param(_props: ParamProps): null {
  return null
}
Param.displayName = 'Param'

function formatDefault(value: ParamProps['default']): React.ReactNode {
  if (value === undefined || value === '') return <span className="sp-param-table__none">None</span>
  return <code>{String(value)}</code>
}

/**
 * A reference table for configuration options and function arguments, with
 * name, type, required, default, and since columns. It renders a plain HTML
 * table, so the Markdown copy of the page keeps every row.
 *
 * ```mdx
 * <ParamTable>
 *   <Param name="appId" type="string" required>
 *     The application ID.
 *   </Param>
 *   <Param name="eventMethod" type="'post' | 'get'" default="post" since="3.0.0">
 *     How events are sent.
 *   </Param>
 * </ParamTable>
 * ```
 *
 * Or pass rows as data with `params={[{ name, type, ... }]}`. Columns with no
 * values in any row (for example `since`) are left out.
 */
export default function ParamTable({
  children,
  params,
  className,
  caption,
}: {
  children?: React.ReactNode
  params?: ParamProps[]
  className?: string
  caption?: string
}): JSX.Element {
  const rows: ParamProps[] =
    params ??
    (React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<ParamProps>[]).map(
      (child) => child.props
    )

  const show = {
    type: rows.some((r) => r.type),
    required: rows.some((r) => r.required !== undefined),
    default: rows.some((r) => r.default !== undefined),
    since: rows.some((r) => r.since),
  }

  return (
    <div className="sp-param-table-wrapper breakout">
      <table className={clsx('sp-param-table', 'not-prose', className)}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">Name</th>
            {show.type && <th scope="col">Type</th>}
            {show.required && <th scope="col">Required</th>}
            {show.default && <th scope="col">Default</th>}
            {show.since && <th scope="col">Since</th>}
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} id={`param-${row.name.replace(/[^A-Za-z0-9_-]/g, '-')}`}>
              <th scope="row" className="sp-param-table__name" style={row.depth ? { paddingLeft: `${row.depth * 16 + 12}px` } : undefined}>
                <code>{row.name}</code>
              </th>
              {show.type && <td className="sp-param-table__type">{row.type && <code>{row.type}</code>}</td>}
              {show.required && <td>{row.required ? 'Required' : 'Optional'}</td>}
              {show.default && <td>{formatDefault(row.default)}</td>}
              {show.since && <td>{row.since ?? ''}</td>}
              <td className="sp-param-table__description">{row.children ?? row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
