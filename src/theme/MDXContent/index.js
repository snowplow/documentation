import React from 'react'
import MDXContent from '@theme-original/MDXContent'
import Admonition from '@theme-original/Admonition'
import Head from '@docusaurus/Head'
import { useSidebarBreadcrumbs } from '@docusaurus/plugin-content-docs/client'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import _ from 'lodash'

export default function MDXContentWrapper(props) {
  let breadcrumbs
  let docMetadata

  try {
    breadcrumbs = useSidebarBreadcrumbs()
    docMetadata = useDoc()
  } catch {
    // non-docs page, nothing to do here
    return <MDXContent {...props} />
  }

  const admonitions = []

  const legacy = _.some(
    _.initial(breadcrumbs),
    (item) => item.customProps?.legacy
  )
  const outdated =
    !legacy &&
    _.some(_.initial(breadcrumbs), (item) => item.customProps?.outdated)
  const hidden = _.some(
    _.initial(breadcrumbs),
    (item) => item.customProps?.hidden
  )
  const noindex =
    _.last(breadcrumbs)?.customProps?.noindex ??
    docMetadata?.metadata?.frontMatter.sidebar_custom_props?.noindex

  if (outdated) {
    const latest = _.last(
      _.takeWhile(breadcrumbs, (item) => !item.customProps?.outdated)
    ).href
    admonitions.push(
      <Admonition type="caution" key="outdated">
        You are reading documentation for an outdated version. Here's the{' '}
        <a href={latest}>latest one</a>!
      </Admonition>
    )
  }

  return (
    <>
      {(legacy || outdated || hidden || noindex) && (
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
      )}
      {admonitions}
      <MDXContent {...props} />
    </>
  )
}
