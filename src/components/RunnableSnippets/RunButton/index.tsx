import React, { useState, useRef, useEffect } from 'react'

import type { Props } from '@theme/CodeBlock/CopyButton'
import BrowserOnly from '@docusaurus/BrowserOnly'
import RunIcon from '@mui/icons-material/PlayArrowRounded'
import { Alert, AlertTitle, CircularProgress, Snackbar } from '@mui/material'
import clsx from 'clsx'

import { trackSelfDescribingEvent } from '@snowplow/browser-tracker'

import {
  getDocsTrackerFields,
  getHost,
  getDocsTrackerCollectorUrl,
  docsTrackerEnabled,
  dispatchOpenDrawerEvent,
  TrackerSandboxChangeEvent,
  DocsTrackerEvent,
} from '../docsTrackerUtils'
import alertStyles from '../styles.module.css'

import styles from './styles.module.css'

enum RunState {
  IDLE,
  SENDING,
  SENT,
}

const ButtonIcon = {
  [RunState.IDLE]: <RunIcon className={styles.runButtonIcon} />,
  [RunState.SENDING]: <CircularProgress size="1.125rem" thickness={5} />,
  [RunState.SENT]: (
    <RunIcon className={clsx(styles.runButtonIcon, styles.runButtonDisabled)} />
  ),
}

/*
 * This component is a modified version of the CopyButton component from Docusaurus.
 * It shows as a "Play" button in the top left corner of code blocks when the `runnable` metatag is set.
 */
export default function RunButton({ code, className }: Props): JSX.Element {
  const [runState, setRunState] = useState(RunState.IDLE)
  const [showSentAlert, setShowSentAlert] = useState(false)
  const [sandboxedTracker, setSandboxedTracker] = useState<HTMLIFrameElement>()

  const updateSandboxedTracker = (event: TrackerSandboxChangeEvent) => {
    setSandboxedTracker(event.detail?.iframe)
  }

  useEffect(() => {
    window.addEventListener(
      DocsTrackerEvent.TRACKER_SANDBOX_CHANGE,
      updateSandboxedTracker
    )

    return () => {
      window.removeEventListener(
        DocsTrackerEvent.TRACKER_SANDBOX_CHANGE,
        updateSandboxedTracker
      )
    }
  }, [])

  const handleRunCode = () => {
    if (!docsTrackerEnabled()) {
      dispatchOpenDrawerEvent()
      return
    }

    const { appId, collectorUrl } = getDocsTrackerFields()
    if (!collectorUrl || !appId) {
      return
    }

    trackSelfDescribingEvent({
      event: {
        schema:
          'iglu:com.snowplowanalytics.docs/docs_snippet_run/jsonschema/1-0-0',
        data: {
          collectorHost: new URL(collectorUrl).hostname,
          appId,
        },
      },
    })

    // The sandbox may have changed since the last time the button was clicked

    sandboxedTracker?.contentWindow?.postMessage(code, getHost())

    setRunState(RunState.SENDING)

    // Add a delay to the button to prevent spamming
    window.setTimeout(() => {
      setRunState(RunState.SENT)
      setShowSentAlert(true)
    }, 300 * (Math.random() + 1))

    window.setTimeout(() => {
      setRunState(RunState.IDLE)
      setShowSentAlert(false)
    }, 5000)
  }

  return (
    <BrowserOnly>
      {() => (
        <>
          <button
            type="button"
            title="Run"
            disabled={runState !== RunState.IDLE}
            className={clsx(
              'clean-btn',
              className,
              styles.runButton,
              styles.showRunButton
            )}
            onClick={handleRunCode}
          >
            <div className={styles.runButtonContainer}>
              {ButtonIcon[runState]}
            </div>
          </button>

          <Snackbar open={showSentAlert}>
            <Alert
              variant="filled"
              severity="success"
              className={alertStyles.notification}
            >
              <AlertTitle>
                Event Sent to{' '}
                <span className={alertStyles.notificationTextHighlight}>
                  {getDocsTrackerCollectorUrl()}
                </span>
              </AlertTitle>
            </Alert>
          </Snackbar>
        </>
      )}
    </BrowserOnly>
  )
}
