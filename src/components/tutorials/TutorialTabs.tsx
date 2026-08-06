import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Menu, MenuItem, Tab, Tabs } from '@mui/material'
import { useHistory, useLocation } from '@docusaurus/router'

enum DocsTab {
  Docs = '/docs',
  Tutorials = '/tutorials',
  AI = '/docs/ai',
  Support = '/support',
}

function getCurrentTab(pathname: string): DocsTab {
  if (pathname.startsWith(DocsTab.Tutorials)) {
    return DocsTab.Tutorials
  }

  if (pathname.startsWith(DocsTab.AI)) {
    return DocsTab.AI
  }

  if (pathname.startsWith(DocsTab.Support)) {
    return DocsTab.Support
  }

  return DocsTab.Docs
}

const aiMenuItems = [
  { label: 'AI Hub', href: '/docs/ai/' },
  { label: 'Skills', href: '/docs/ai/skills/' },
  { label: 'Blog', href: '/docs/ai/blog/' },
]

export const DocsTutorialsTabsMobile: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  const [tab, setTab] = useState<DocsTab>(DocsTab.Docs)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  useEffect(() => {
    setTab(getCurrentTab(location.pathname))
  }, [location.pathname])

  const handleChange = (_e: SyntheticEvent, newValue: DocsTab) => {
    if (newValue === DocsTab.AI) {
      setMenuAnchor(_e.currentTarget as HTMLElement)
      return
    }

    history.push(newValue)
    setTab(newValue)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleMenuSelect = (href: string) => {
    history.push(href)
    setTab(DocsTab.AI)
    handleMenuClose()
  }

  return (
    <>
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
        <Tab value={DocsTab.Docs} label="Docs" sx={{ textTransform: 'none' }} />
        <Tab
          value={DocsTab.Tutorials}
          label="Tutorials"
          sx={{ textTransform: 'none' }}
        />
        <Tab value={DocsTab.AI} label="AI" sx={{ textTransform: 'none' }} />
        <Tab
          value={DocsTab.Support}
          label="Support"
          sx={{ textTransform: 'none' }}
        />
      </Tabs>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'ai-tab-menu' }}
      >
        {aiMenuItems.map((item) => (
          <MenuItem key={item.href} onClick={() => handleMenuSelect(item.href)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export const DocsTutorialsTabsDesktop: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  const [tab, setTab] = useState<DocsTab>(DocsTab.Docs)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  useEffect(() => {
    setTab(getCurrentTab(location.pathname))
  }, [location.pathname])

  const changeTab = (tab: DocsTab) => {
    if (tab === DocsTab.AI) {
      return
    }

    history.push(tab)
    setTab(tab)
  }

  const handleAiClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
    setTab(DocsTab.AI)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleMenuSelect = (href: string) => {
    history.push(href)
    setTab(DocsTab.AI)
    handleMenuClose()
  }

  return (
    <>
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
          label="Docs"
          sx={{ textTransform: 'none' }}
        />
        <Tab
          onClick={() => changeTab(DocsTab.Tutorials)}
          value={DocsTab.Tutorials}
          label="Tutorials"
          sx={{ textTransform: 'none' }}
        />
        <Tab
          onClick={handleAiClick}
          value={DocsTab.AI}
          label="AI"
          sx={{ textTransform: 'none' }}
        />
        <Tab
          onClick={() => changeTab(DocsTab.Support)}
          value={DocsTab.Support}
          label="Support"
          sx={{ textTransform: 'none' }}
        />
      </Tabs>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'ai-tab-menu' }}
      >
        {aiMenuItems.map((item) => (
          <MenuItem key={item.href} onClick={() => handleMenuSelect(item.href)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
