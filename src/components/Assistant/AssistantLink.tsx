import React from 'react'
import Link from '@docusaurus/Link'

const INTERNAL_HOSTS = new Set([
  'docs.snowplow.io',
  'docs.snowplowanalytics.com',
])
const INTERNAL_PREFIXES = ['/docs', '/tutorials', '/release-notes']

const toInternalPath = (href: string): string | null => {
  if (href.startsWith('#')) return null
  if (INTERNAL_PREFIXES.some((prefix) => href.startsWith(prefix))) {
    return href.replace(/\.md(?=$|[#?])/, '/')
  }
  try {
    const url = new URL(href)
    const sameOrigin =
      typeof window !== 'undefined' && url.origin === window.location.origin
    if (sameOrigin || INTERNAL_HOSTS.has(url.hostname)) {
      const path = `${url.pathname}${url.search}${url.hash}`
      return INTERNAL_PREFIXES.some((prefix) => path.startsWith(prefix))
        ? path.replace(/\.md(?=$|[#?])/, '/')
        : null
    }
  } catch {
    return null
  }
  return null
}

type AssistantLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  node?: unknown
}

export const AssistantLink = ({
  href,
  children,
  node: _node,
  target: _target,
  rel: _rel,
  ...props
}: AssistantLinkProps) => {
  if (!href) {
    return <span>{children}</span>
  }
  const internalPath = toInternalPath(href)
  if (internalPath) {
    return (
      <Link to={internalPath} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
