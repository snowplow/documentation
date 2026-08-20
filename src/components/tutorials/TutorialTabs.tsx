import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Tab, Tabs } from '@mui/material'
import { useHistory, useLocation } from '@docusaurus/router'

enum DocsTab {
  Docs = '/docs',
  Tutorials = '/tutorials',
  ReleaseNotes = '/release-notes',
}

// Order matters: the first prefix that matches wins, and /docs is the fallback
const TABS: { value: DocsTab; label: string }[] = [
  { value: DocsTab.Docs, label: 'Docs' },
  { value: DocsTab.Tutorials, label: 'Tutorials' },
  { value: DocsTab.ReleaseNotes, label: 'Releases' },
]

function getCurrentTab(pathname: string): DocsTab {
  const match = TABS.find(
    ({ value }) => value !== DocsTab.Docs && pathname.startsWith(value)
  )
  return match ? match.value : DocsTab.Docs
}

function useCurrentTab(): DocsTab {
  const location = useLocation()
  const [tab, setTab] = useState<DocsTab>(DocsTab.Docs)

  useEffect(() => {
    setTab(getCurrentTab(location.pathname))
  }, [location.pathname])

  return tab
}

export const DocsTutorialsTabsMobile: React.FC = () => {
  const history = useHistory()
  const tab = useCurrentTab()

  const handleChange = (_e: SyntheticEvent, newValue: DocsTab) => {
    history.push(newValue)
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
      {TABS.map(({ value, label }) => (
        <Tab
          key={value}
          value={value}
          label={label}
          sx={{ textTransform: 'none' }}
        />
      ))}
    </Tabs>
  )
}

export const DocsTutorialsTabsDesktop: React.FC = () => {
  const history = useHistory()
  const tab = useCurrentTab()

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
      {TABS.map(({ value, label }) => (
        <Tab
          key={value}
          onClick={() => history.push(value)}
          value={value}
          label={label}
          sx={{ textTransform: 'none' }}
        />
      ))}
    </Tabs>
  )
}
