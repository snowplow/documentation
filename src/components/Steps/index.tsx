import React from 'react'
import clsx from 'clsx'

/**
 * A numbered rail for a sequence of steps. Write each step as a Markdown H3
 * inside the component, so every step is a real heading: anchorable, listed
 * in the table of contents, and kept in the Markdown copy of the page.
 *
 * ```mdx
 * <Steps>
 *
 * ### Install the tracker
 *
 * Run `npm install @snowplow/browser-tracker`.
 *
 * ### Create a tracker
 *
 * ...
 *
 * </Steps>
 * ```
 *
 * The numbers come from a CSS counter on the H3s, so steps can be added or
 * reordered without renumbering.
 */
export default function Steps({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('sp-steps', className)}>{children}</div>
}
