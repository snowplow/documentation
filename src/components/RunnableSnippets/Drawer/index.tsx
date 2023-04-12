import React, { FormEvent, useEffect } from 'react'

import {
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  Box,
  Alert,
  AlertTitle,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker'

import SnippetRunButton from '@site/static/img/snippet-run-button.svg'

import {
  getAppIdError,
  getCollectorEndpointError,
} from '../../FirstSteps/utils'
import {
  dispatchTrackerSandboxChangeEvent,
  DocsTrackerEvent,
  DocsTrackerField,
  getDocsTrackerFields,
  setDocsTrackerFields,
} from '../docsTrackerUtils'
import { NavbarIconStyle } from '../NavbarButton'

import { SnowplowSandbox } from '../sandbox'
import styles from './styles.module.css'

type DocsTrackerInputState = {
  collectorUrl: string
  collectorUrlBuffer: string
  appId: string
  appIdBuffer: string
  collectorUrlError: string
  appIdError: string
  validating: boolean
}

type DocsTrackerDrawerProps = {
  showDrawer: boolean
  setShowDrawer: (show: boolean) => void
  setShowEnabledAlert: (show: boolean) => void
  setNavbarIconStyle: (style: NavbarIconStyle) => void
  navbarIconStyle: NavbarIconStyle
}

async function handleFormSubmit(
  e: FormEvent,
  inputState: DocsTrackerInputState,
  setInputState: React.Dispatch<React.SetStateAction<DocsTrackerInputState>>,
  props: DocsTrackerDrawerProps
) {
  e.preventDefault()
  setInputState((prev) => ({ ...prev, validating: true }))

  let { collectorUrlBuffer, appIdBuffer } = inputState

  const appIdError = getAppIdError(appIdBuffer)
  if (appIdError) {
    // Prevents the error message from flashing
    if (appIdError !== inputState.appIdError) {
      setInputState((prev) => ({ ...prev, appIdError }))
    }
    setInputState((prev) => ({
      ...prev,
      validating: false,
    }))
    return
  }
  setInputState((prev) => ({ ...prev, appIdError: '' }))

  // Remove any trailing slash from collector URL buffer
  if (collectorUrlBuffer.endsWith('/')) {
    collectorUrlBuffer = collectorUrlBuffer.slice(0, -1)
    setInputState((prev) => ({
      ...prev,
      collectorUrlBuffer: collectorUrlBuffer,
    }))
  }

  const { collectorUrlError, statusCode } = await getCollectorEndpointError(
    collectorUrlBuffer,
    appIdBuffer,
    true
  )

  if (statusCode > 0) {
    // as long as the URL is valid, we log it — even if the collector does not respond
    const parsedCollectorUrl = new URL(collectorUrlBuffer)
    trackSelfDescribingEvent({
      event: {
        schema:
          'iglu:com.snowplowanalytics.telemetry/collector_telemetry/jsonschema/1-0-0',
        data: {
          method: 'POST',
          appId: appIdBuffer,
          statusCode,
          collectorHost: parsedCollectorUrl.host,
          collectorPath: parsedCollectorUrl.pathname,
        },
      },
    })
  }

  if (collectorUrlError) {
    // Prevents the error message from flashing
    if (collectorUrlError !== inputState.collectorUrlError) {
      setInputState((prev) => ({
        ...prev,
        collectorUrlError,
      }))
    }
    setInputState((prev) => ({
      ...prev,
      validating: false,
    }))
    return
  }

  setInputState((prev) => ({
    ...prev,
    collectorUrlError: '',
  }))

  setDocsTrackerFields(appIdBuffer, collectorUrlBuffer)

  // Set main fields and clear buffer fields on save
  setInputState((prev) => ({
    ...prev,
    collectorUrl: prev.collectorUrlBuffer,
    appId: prev.appIdBuffer,
    collectorUrlBuffer: '',
    appIdBuffer: '',
    validating: false,
  }))

  props.setNavbarIconStyle(NavbarIconStyle.ACTIVE_ANIMATED)
  props.setShowEnabledAlert(true)
  props.setShowDrawer(false)

  window.setTimeout(() => {
    props.setShowEnabledAlert(false)
  }, 4000)
}

export function DocsTrackerDrawer(props: DocsTrackerDrawerProps): JSX.Element {
  const drawerRef = React.useRef<HTMLIFrameElement>(null)
  const [inputState, setInputState] = React.useState<DocsTrackerInputState>({
    collectorUrl: '',
    collectorUrlBuffer: '',
    appId: '',
    appIdBuffer: '',
    collectorUrlError: '',
    appIdError: '',
    validating: false,
  })

  // Set initial values of inputs, or load from local storage
  useEffect(() => {
    const { appId, collectorUrl } = getDocsTrackerFields()
    setInputState((prev) => ({
      ...prev,
      collectorUrl: collectorUrl || 'https://',
      appId: appId || 'test',
    }))
  }, [])

  // Set buffer fields to current fields on drawer open
  useEffect(() => {
    if (props.showDrawer) {
      setInputState((prev) => ({
        ...prev,
        collectorUrlBuffer: prev.collectorUrl,
        appIdBuffer: prev.appId,
      }))
    }
  }, [props.showDrawer])

  // Listen for open drawer event
  useEffect(() => {
    const openDrawer = () => props.setShowDrawer(true)
    window.addEventListener(DocsTrackerEvent.OPEN_DRAWER, openDrawer)

    return () => {
      window.removeEventListener(DocsTrackerEvent.OPEN_DRAWER, openDrawer)
    }
  }, [])

  // Update sandboxed tracker ref for "run" buttons when collector URL or app ID change
  useEffect(() => {
    drawerRef.current && dispatchTrackerSandboxChangeEvent(drawerRef.current)
  }, [inputState.collectorUrl, inputState.appId])

  return (
    <>
      <Drawer
        PaperProps={{
          elevation: 0,
          className: styles.drawerPaper,
        }}
        anchor="right"
        open={props.showDrawer}
        ModalProps={{
          onBackdropClick: () => props.setShowDrawer(false),
        }}
      >
        <Box className={styles.drawerHeader}>
          <Typography variant="body1" fontWeight="500">
            Runnable Snippet Settings
          </Typography>
        </Box>
        <Divider />
        <Box className={styles.drawerBody}>
          <form
            className={styles.drawerForm}
            onSubmit={async (e) =>
              await handleFormSubmit(e, inputState, setInputState, props)
            }
          >
            <div>
              <TextField
                margin="normal"
                fullWidth
                value={inputState.collectorUrlBuffer}
                onChange={(e) => {
                  setInputState((prev) => ({
                    ...prev,
                    collectorUrlBuffer: e.target.value,
                  }))
                }}
                label="Collector URL"
                error={Boolean(inputState.collectorUrlError)}
                helperText={inputState.collectorUrlError}
              ></TextField>

              <TextField
                margin="normal"
                fullWidth
                value={inputState.appIdBuffer}
                onChange={(e) => {
                  setInputState((prev) => ({
                    ...prev,
                    appIdBuffer: e.target.value,
                  }))
                }}
                label="Application ID"
                error={Boolean(inputState.appIdError)}
                helperText={inputState.appIdError}
              ></TextField>

              <details className={styles.whatIsThisDetails}>
                <summary className={styles.whatIsThisSummary}>
                  What is this?
                </summary>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Snowplow's runnable snippets allow you to run specific example
                  code snippets, allowing you to explore both how to structure
                  your code, and explore the rich data that Snowplow produces.
                </Typography>
                <Typography variant="body2">
                  Enter your Collector URL and an Application ID above to enable
                  this feature, then look out for the Run button in code
                  snippets:
                </Typography>
                <SnippetRunButton className={styles.runButtonExample} />
                <Typography variant="body2">
                  New to Snowplow? Get set up quickly with{' '}
                  <a
                    className={styles.microLink}
                    href="/docs/getting-started-with-micro"
                  >
                    Snowplow Micro
                  </a>
                </Typography>
              </details>

              {navigator.userAgent.includes('Safari') &&
                inputState.collectorUrlBuffer.includes('localhost') && (
                  <Alert sx={{ mt: 2 }} severity="warning">
                    <AlertTitle>
                      Localhost is not supported on Safari.
                    </AlertTitle>
                    <Typography variant="body2">
                      Safari does not support localhost as a collector URL. To
                      use Snowplow Micro with Safari, you can use{' '}
                      <a href="https://ngrok.com/">ngrok</a> to expose your
                      local collector via https.
                    </Typography>
                  </Alert>
                )}
            </div>
            <div className={styles.saveButtonContainer}>
              <Button
                variant="outlined"
                className={styles.clearButton}
                onClick={() => {
                  setInputState(() => ({
                    collectorUrlError: '',
                    appIdError: '',
                    collectorUrl: 'https://',
                    collectorUrlBuffer: '',
                    appId: 'test',
                    appIdBuffer: '',
                    validating: false,
                  }))

                  window.localStorage.removeItem(DocsTrackerField.APP_ID)
                  window.localStorage.removeItem(DocsTrackerField.COLLECTOR_URL)
                  props.setShowDrawer(false)

                  // Do nothing if the icon is already inactive
                  if (
                    props.navbarIconStyle ===
                      NavbarIconStyle.INACTIVE_ANIMATED ||
                    props.navbarIconStyle === NavbarIconStyle.INACTIVE_STATIC
                  ) {
                    return
                  }

                  props.setNavbarIconStyle(NavbarIconStyle.INACTIVE_ANIMATED)
                }}
              >
                Clear
              </Button>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={inputState.validating}
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </Box>
      </Drawer>
      <SnowplowSandbox
        ref={drawerRef}
        name="sandbox"
        collectorUrl={inputState.collectorUrl}
        appId={inputState.appId}
      />
    </>
  )
}
