import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md'

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Optional icon, rendered before the label */
  icon?: React.ReactNode
  /** Optional icon, rendered after the label (for example an arrow) */
  iconAfter?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

type LinkButtonProps = CommonProps & {
  href: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

type NativeButtonProps = CommonProps & {
  href?: undefined
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = LinkButtonProps | NativeButtonProps

/** The class names for a button, for elements that can't use the component */
export function buttonClassName(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  className?: string
): string {
  return clsx('sp-button', `sp-button--${variant}`, size === 'sm' && 'sp-button--sm', className)
}

/**
 * One button for the whole site. Renders a link when `href` is set, otherwise
 * a native button.
 *
 * - primary: the one main action in a region
 * - secondary: other actions (default)
 * - ghost: low-emphasis actions in toolbars and menus
 * - link: an action styled as a text link
 */
export default function Button(props: ButtonProps): JSX.Element {
  const { variant = 'secondary', size = 'md', icon, iconAfter, className, children } = props
  const classes = buttonClassName(variant, size, className)
  const content = (
    <>
      {icon && (
        <span className="sp-button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {iconAfter && (
        <span className="sp-button__icon" aria-hidden="true">
          {iconAfter}
        </span>
      )}
    </>
  )

  if (props.href !== undefined) {
    const { variant: _v, size: _s, icon: _i, iconAfter: _a, className: _c, children: _ch, href, ...rest } =
      props as LinkButtonProps
    return (
      <Link to={href} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  const { variant: _v, size: _s, icon: _i, iconAfter: _a, className: _c, children: _ch, type, ...rest } =
    props as NativeButtonProps
  return (
    <button type={type ?? 'button'} className={classes} {...rest}>
      {content}
    </button>
  )
}
