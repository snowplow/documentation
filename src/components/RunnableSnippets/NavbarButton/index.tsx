import React, { useEffect } from 'react'

import FlashOnIcon from '@mui/icons-material/FlashOnRounded'
import {
  Alert,
  AlertTitle,
  IconButton,
  Paper,
  Snackbar,
  Typography,
  Zoom,
} from '@mui/material'
import clsx from 'clsx'

import { DocsTrackerDrawer } from '../Drawer'
import {
  getDocsTrackerAppId,
  getDocsTrackerCollectorUrl,
  docsTrackerEnabled,
} from '../docsTrackerUtils'
import alertStyles from '../styles.module.css'

import { StyledTooltip } from './styledTooltip'
import styles from './styles.module.css'

export const NavbarIconStyle = {
  ACTIVE_STATIC: styles.navbarIconActiveStatic,
  ACTIVE_ANIMATED: styles.navbarIconActive,
  INACTIVE_STATIC: styles.navbarIconInactiveStatic,
  INACTIVE_ANIMATED: styles.navbarIconInactive,
}

export type NavbarIconStyle =
  typeof NavbarIconStyle[keyof typeof NavbarIconStyle]

// Check if there are any snippets on the page with the `runnable` tag,
// which will have a title of "Run" on the button
const hasRunnableSnippetsOnPage = () => {
  return Boolean(document.querySelector("button[title='Run']"))
}

export default function DocsTrackerNavbarButton(): JSX.Element | null {
  const [showDrawer, setShowDrawer] = React.useState(false)
  const [showHint, setShowHint] = React.useState(false)
  const [iconStyle, setIconStyle] = React.useState<NavbarIconStyle>(
    NavbarIconStyle.INACTIVE_STATIC
  )
  const [showEnabledAlert, setShowEnabledAlert] = React.useState(false)
  const [showNavbarButton, setShowNavbarButton] = React.useState(false)

  // Set the icon style based on whether the docs tracker is enabled
  useEffect(() => {
    setIconStyle(
      docsTrackerEnabled()
        ? NavbarIconStyle.ACTIVE_ANIMATED
        : NavbarIconStyle.INACTIVE_STATIC
    )
  }, [])

  // If the drawer opens, hide the hint
  useEffect(() => {
    if (showDrawer === true) {
      setShowHint(false)
    }
  }, [showDrawer])

  // Show the tooltip hint after a slight delay
  useEffect(() => {
    if (!docsTrackerEnabled()) {
      const openDelayTimeout = window.setTimeout(() => {
        setShowHint(true)
      }, 2000)

      const closeTimeout = window.setTimeout(() => {
        setShowHint(false)
      }, 6000)

      return () => {
        window.clearTimeout(openDelayTimeout)
        window.clearTimeout(closeTimeout)
      }
    }
  }, [])

  // Only show the button if there are `runnable` tags on snippets on the page
  useEffect(() => {
    let previousUrl = ''
    const observer = new MutationObserver(() => {
      if (location.href !== previousUrl) {
        previousUrl = location.href
        setShowNavbarButton(hasRunnableSnippetsOnPage())
      }
    })

    const config = { subtree: true, childList: true }
    observer.observe(document, config)

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!showNavbarButton) {
    return null
  }

  return (
    <>
      <StyledTooltip
        title={
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography variant="body2">
              Runnable Snippets are available for this page. Click here to find
              out more!
            </Typography>
          </Paper>
        }
        arrow
        open={showHint}
        TransitionComponent={Zoom}
        className={styles.showHint}
      >
        <IconButton
          size="medium"
          className={clsx(
            iconStyle,
            styles.navbarButton,
            styles.showDocsTrackerNavbarButton
          )}
          onClick={() => {
            setShowDrawer(!showDrawer)
          }}
        >
          <FlashOnIcon fontSize="medium" className={styles.buttonIcon} />
        </IconButton>
      </StyledTooltip>

      <Snackbar open={showEnabledAlert}>
        <Alert
          variant="filled"
          severity="success"
          className={alertStyles.notification}
        >
          <AlertTitle>Runnable Snippets Enabled 🎉</AlertTitle>
          Events will be sent to{' '}
          <span className={alertStyles.notificationTextHighlight}>
            {getDocsTrackerCollectorUrl()}
          </span>{' '}
          with Application ID{' '}
          <span className={alertStyles.notificationTextHighlight}>
            {getDocsTrackerAppId()}
          </span>
        </Alert>
      </Snackbar>

      <DocsTrackerDrawer
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        setShowEnabledAlert={setShowEnabledAlert}
        setNavbarIconStyle={setIconStyle}
        navbarIconStyle={iconStyle}
      />
    </>
  )
}
