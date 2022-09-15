import React from 'react'
import MDXContent from '@theme-original/MDXContent'
import Admonition from '@theme-original/Admonition'
import { useLocation } from '@docusaurus/router'

// yeah, we need to standardize things!
const previousVersionPattern = new RegExp(
  '[^/]*(previous-|older-)(versions?|releases?)/.'
)

export default function MDXContentWrapper(props) {
  const location = useLocation()
  return (
    <>
      {previousVersionPattern.test(location.pathname) && (
        <Admonition type="caution">
          You are reading documentation for an outdated version. Here’s the{' '}
          <a href={location.pathname.split(previousVersionPattern)[0]}>
            latest one
          </a>
          !
        </Admonition>
      )}
      <MDXContent {...props} />
    </>
  )
}
