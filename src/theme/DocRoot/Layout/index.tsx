import React, { type ReactNode } from 'react'
import Layout from '@theme-original/DocRoot/Layout'
import type { Props } from '@theme/DocRoot/Layout'
import { useReportActiveSidebar } from '@site/src/webmcp/pageContext'

// Wraps the stock layout purely to read the sidebar from inside `DocRoot`,
// where the docs sidebar context exists, and publish it to the WebMCP tools.
export default function DocRootLayout(props: Props): ReactNode {
  useReportActiveSidebar()
  return <Layout {...props} />
}
