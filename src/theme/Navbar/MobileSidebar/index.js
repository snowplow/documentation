import React from 'react'
import MobileSidebar from '@theme-original/Navbar/MobileSidebar'
import { useRefreshTrackingOnMenuToggle } from '../../../helpers/useRefreshTrackinOnMenuToggle'

export default function MobileSidebarWrapper(props) {
  useRefreshTrackingOnMenuToggle()
  return <MobileSidebar {...props} />
}
