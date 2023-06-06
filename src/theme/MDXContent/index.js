import React from 'react'
import MDXContent from '@theme-original/MDXContent'
import Admonition from '@theme-original/Admonition'
import Head from '@docusaurus/Head'
import { useSidebarBreadcrumbs } from '@docusaurus/theme-common/internal'
import _ from 'lodash'

const offeringNames = {
  enterprise: "Snowplow BDP Enterprise",
  cloud: "Snowplow BDP Cloud",
  opensource: "Snowplow Open Source",
}

export default function MDXContentWrapper(props) {
  let breadcrumbs;
  try {
    breadcrumbs = useSidebarBreadcrumbs()
  } catch {
    // non-docs page, nothing to do here
    return <MDXContent {...props} />
  }

  const admonitions = []

  const legacy = _.some(_.initial(breadcrumbs), item => item.customProps?.legacy)
  const outdated = !legacy && _.some(_.initial(breadcrumbs), item => item.customProps?.outdated)
  const offerings = _.find(breadcrumbs, item => item.customProps?.offerings)

  if (outdated) {
    const latest = _.last(_.takeWhile(breadcrumbs, item => !item.customProps?.outdated)).href
    admonitions.push(
      <Admonition type="caution" key="outdated">
        You are reading documentation for an outdated version. Here’s the{' '}
        <a href={latest}>latest one</a>!
      </Admonition>
    )
  }

  if (offerings) {
    const names = offerings.customProps.offerings.map(o => offeringNames[o])
    admonitions.push(
      <Admonition type="info" key="offering">
        This documentation only applies to <strong>{names.join(' and ')}</strong>.
        See the <a href="/docs/feature-comparison/">feature comparison</a> page for more information about the different Snowplow offerings.
      </Admonition>
    )
  }

  return (
    <>
      {(legacy || outdated) && (
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
      )}
      {admonitions}
      <MDXContent {...props} />
    </>
  )
}
