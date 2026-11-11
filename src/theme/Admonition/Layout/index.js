/**
 * Ejected from @docusaurus/theme-classic (a "safe" swizzle) to give the
 * callout parts stable class names. The styles live in src/css/components.css
 * and read the callout colors from the design tokens.
 */
import React from 'react'
import clsx from 'clsx'
import { ThemeClassNames } from '@docusaurus/theme-common'

export default function AdmonitionLayout({ type, icon, title, children, className, id }) {
  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        'callout',
        className
      )}
      id={id}
    >
      {title || icon ? (
        <div className="callout__heading">
          {icon ? (
            <span className="callout__icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          {title ? <span className="callout__title">{title}</span> : null}
        </div>
      ) : null}
      {children ? <div className="callout__content">{children}</div> : null}
    </div>
  )
}
