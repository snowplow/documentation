import React from 'react'
import Layout from '@theme/Layout'
import TutorialList from '../components/tutorials/TutorialList'
import '../components/tutorials/tutorials-page.css'

export default function TutorialsPage(): JSX.Element {
  return (
    <Layout
      title="Tutorials"
      description="Browse Snowplow tutorials and guides"
      wrapperClassName="min-h-screen"
    >
      <div className="min-h-screen w-full">
        <TutorialList />
      </div>
    </Layout>
  )
}