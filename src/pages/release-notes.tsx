import React from 'react'
import Layout from '@theme/Layout'
import ReleaseNotesList from '../components/release-notes/ReleaseNotesList'

export default function ReleaseNotesPage(): JSX.Element {
  return (
    <Layout
      title="Releases"
      description="Product news and component release notes for Snowplow"
      wrapperClassName="min-h-screen"
    >
      <div className="min-h-screen w-full">
        <ReleaseNotesList />
      </div>
    </Layout>
  )
}
