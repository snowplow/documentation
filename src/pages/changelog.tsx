import React from 'react'
import Layout from '@theme/Layout'
import ChangelogList from '../components/changelog/ChangelogList'

export default function ChangelogPage(): JSX.Element {
  return (
    <Layout
      title="Changelog"
      description="Product news, release notes, and maintenance notifications for Snowplow"
      wrapperClassName="min-h-screen"
    >
      <div className="min-h-screen w-full">
        <ChangelogList />
      </div>
    </Layout>
  )
}
