import React from 'react'
import Sidebar from '@theme-original/DocPage/Layout/Sidebar'
import { useRefreshTrackingOnMenuToggle } from '../../../../helpers/useRefreshTrackinOnMenuToggle'

export default function SidebarWrapper(props) {
  useRefreshTrackingOnMenuToggle()
  return <Sidebar {...props} />
}
