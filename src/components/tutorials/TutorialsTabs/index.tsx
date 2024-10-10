import React, { useEffect } from 'react'

import { Tab, Tabs } from '@mui/material'
import { useHistory, useLocation } from '@docusaurus/router'

enum DocsTab {
  Docs = '/docs',
  Tutorials = '/tutorials',
}

function getCurrentTab(pathname: string): DocsTab {
  return pathname.startsWith(DocsTab.Tutorials)
    ? DocsTab.Tutorials
    : DocsTab.Docs
}

export default function DocsTutorialsTabs(): JSX.Element {
  const history = useHistory()
  const location = useLocation()
  const [tab, setTab] = React.useState<DocsTab>(() =>
    getCurrentTab(location.pathname)
  )

  useEffect(() => {
    setTab(getCurrentTab(location.pathname))
  }, [location.pathname])

  const handleChange = (_e: React.SyntheticEvent, newValue: DocsTab) => {
    history.push(newValue)
    setTab(newValue)
  }

  return (
    // All this overflow needs to be visible for the indicator to be able to
    // show against the bottom of the navbar, as it has padding surrounding it
    <Tabs
      sx={{ overflow: 'visible', overflowX: 'visible' }}
      onChange={handleChange}
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
      {/* I can't find a way to style the scroller from the API provided, so we must resort to this */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            '.MuiTabs-scroller { overflow: visible !important; overflow-x: visible !important; }',
        }}
      />
      <Tab value={DocsTab.Docs} label="Docs" sx={{ textTransform: 'none' }} />
      <Tab
        value={DocsTab.Tutorials}
        label="Tutorials & Guides"
        sx={{ textTransform: 'none' }}
      />
    </Tabs>
  )
}
