import React from 'react'
import MDXContent from '@theme-original/MDXContent'
import Admonition from '@theme-original/Admonition'
import Head from '@docusaurus/Head'
import { useLocation } from '@docusaurus/router'

// yeah, we need to standardize things!
const previousVersionPattern = new RegExp(
  '[^/]*(?:previous-|older-)(?:versions?|releases?)/'
)

const legacyPattern = new RegExp('/legacy')

export default function MDXContentWrapper(props) {
  const location = useLocation()
  const legacy = legacyPattern.test(location.pathname)
  if (legacy)
    return (
      <>
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
        <MDXContent {...props} />
      </>
    )
  const outdated = previousVersionPattern.test(location.pathname)
  if (!outdated) return <MDXContent {...props} />
  const [latest, subpage] = location.pathname.split(previousVersionPattern)
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      {subpage.length > 0 && (
        <Admonition type="caution">
          You are reading documentation for an outdated version. Here’s the{' '}
          <a href={latest}>latest one</a>!
        </Admonition>
      )}
      <MDXContent {...props} />
    </>
  )
}
