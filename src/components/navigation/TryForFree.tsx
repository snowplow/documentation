import React from 'react'
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem'
import { useActiveDocContext } from '@docusaurus/plugin-content-docs/client'

/** Sign-up links for the navbar call to action, per product sidebar */
const SIGNUP_LINKS: Record<string, string> = {
  signals: 'https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral',
}
const DEFAULT_SIGNUP = 'https://snowplow.io/get-started/snowplow-free-trial'

/**
 * The navbar "Try for free" link. On Signals pages it opens the Signals free
 * tier; everywhere else it opens the CDI Cloud free trial. The active sidebar
 * is read the same way as the product switcher, so the link is right in the
 * static HTML as well as after hydration.
 */
export default function TryForFree(props: Record<string, unknown>) {
  const { activeDoc } = useActiveDocContext(undefined)
  const href = SIGNUP_LINKS[activeDoc?.sidebar ?? ''] ?? DEFAULT_SIGNUP
  return <DefaultNavbarItem {...props} href={href} />
}
