import React from 'react'
import { Redirect } from '@docusaurus/router'
import Head from '@docusaurus/Head'

const Home = () => {
  return (
    <>
      <Head>
        <meta name="zd-site-verification" content="fly2zzu1qcv51s1ma9jds" />
      </Head>
      <Redirect to="/docs" />
    </>
  )
}

export default Home
