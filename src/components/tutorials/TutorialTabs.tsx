import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Tab, Tabs } from '@mui/material'
import { useHistory, useLocation } from '@docusaurus/router'

enum DocsTab {
  Docs = '/docs',
  Signals = '/docs/signals',
  Tutorials = '/tutorials',
}

function getCurrentTab(pathname: string): DocsTab {
  if (pathname.startsWith(DocsTab.Signals)) {
    return DocsTab.Signals
  }
  if (pathname.startsWith(DocsTab.Tutorials)) {
    return DocsTab.Tutorials
  }
  return DocsTab.Docs
}

export const DocsTutorialsTabsMobile: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  const [tab, setTab] = useState<DocsTab>(DocsTab.Docs)

  useEffect(() => {
    setTab(getCurrentTab(location.pathname))
  }, [location.pathname])

  const handleChange = (_e: SyntheticEvent, newValue: DocsTab) => {
    history.push(newValue)
    setTab(newValue)
  }

  return (
    <Tabs
      className="mobile-only"
      sx={{ overflow: 'visible', overflowX: 'visible' }}
      onChange={handleChange}
      orientation="vertical"
      value={tab}
      TabScrollButtonProps={{
        sx: { overflow: 'visible', overflowX: 'visible' },
      }}
      TabIndicatorProps={{
        sx: {
          height: '4px',
          transition: 'none',
          transform: 'translateY(4px)',
        },
      }}
    >
      <Tab
        value={DocsTab.Docs}
        label="Customer Data Infrastructure"
        sx={{ textTransform: 'none' }}
      />
      <Tab
        value={DocsTab.Signals}
        label="Signals"
        sx={{ textTransform: 'none' }}
      />
      <Tab
        value={DocsTab.Tutorials}
        label="Tutorials"
        sx={{ textTransform: 'none' }}
      />
    </Tabs>
  )
}

export const DocsTutorialsTabsDesktop: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  const [tab, setTab] = useState<DocsTab>(DocsTab.Docs)

  useEffect(() => {
    setTab(getCurrentTab(location.pathname))
  }, [location.pathname])

  const changeTab = (tab: DocsTab) => {
    history.push(tab)
    setTab(tab)
  }

  return (
    <Tabs
      className="desktop-only docs-tutorial-tabs"
      value={tab}
      TabScrollButtonProps={{
        className: 'docs-tutorial-tab-scroll-button',
      }}
      TabIndicatorProps={{
        className: 'docs-tutorial-tab-indicator',
      }}
    >
      <Tab
        onClick={() => changeTab(DocsTab.Docs)}
        value={DocsTab.Docs}
        label="Customer Data Infrastructure"
        sx={{ textTransform: 'none' }}
      />
      <Tab
        onClick={() => changeTab(DocsTab.Signals)}
        value={DocsTab.Signals}
        label="Signals"
        sx={{ textTransform: 'none' }}
      />
      <Tab
        onClick={() => changeTab(DocsTab.Tutorials)}
        value={DocsTab.Tutorials}
        label="Tutorials"
        sx={{ textTransform: 'none' }}
      />
    </Tabs>
  )
}
