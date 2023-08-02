import React from 'react'

import { Card, CardContent, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker'

import {
  prependProtocol,
  checkCollectorEndpoint,
  getAppIdError,
  getCollectorEndpointError,
  getDocsTrackerNamespace,
  getDocsTrackerCollectorUrl,
  getDocsTrackerAppId,
  newDocsTrackerFromAppIdAndCollectorUrl
} from './utils'
import { EventWithNamespace, eventsToTrack } from './eventsToTrack'
import styles from './styles.module.css'

type EventComponentState = {
  collectorUrl: string,
  appId: string,
  collectorUrlError: string,
  appIdError: string,
  sending: boolean
}

export default function EventComponent() {
  const [state, setState] = React.useState<EventComponentState>({
    collectorUrl: '',
    appId: 'test',
    collectorUrlError: '',
    appIdError: '',
    sending: false
  })

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      collectorUrl: getDocsTrackerCollectorUrl() || '',
      appId: getDocsTrackerAppId() || 'test'
    }))
  }, [])

  async function sendEvents(e) {
    e.preventDefault()
    const collectorWithProtocol = prependProtocol(state.collectorUrl)

    setState((prev) => ({
      ...prev,
      collectorUrl: collectorWithProtocol,
      collectorUrlError: '',
      appIdError: '',
      sending: false
    }))

    const statusCode = await checkCollectorEndpoint(collectorWithProtocol)
    const collectorUrlError = getCollectorEndpointError(collectorWithProtocol, statusCode)
    const appIdError = getAppIdError(state.appId)

    if (collectorUrlError !== '' || appIdError !== '') {
      setState((prev) => ({...prev, collectorUrlError, appIdError}))
      return
    }

    setState((prev) => ({...prev, sending: true}))

    newDocsTrackerFromAppIdAndCollectorUrl(state.appId, collectorWithProtocol)
    const namespace = getDocsTrackerNamespace()
    eventsToTrack.forEach((e: EventWithNamespace) => e(namespace))

    // Prevent the user from spamming the button
    setTimeout(
      () => setState((prev) => ({...prev, sending: false})),
      1000 * (Math.random() + 1 * 0.5)
    )

    const collectorUrl = new URL(collectorWithProtocol)
    trackSelfDescribingEvent(
      {
        event: {
          schema:
            'iglu:com.snowplowanalytics.telemetry/collector_telemetry/jsonschema/1-0-0',
          data: {
            method: 'POST',
            appId: state.appId,
            pageHost: window.location.host,
            statusCode,
            collectorHost: collectorUrl.host,
            collectorPath: collectorUrl.pathname,
          },
        },
      },
      ['snplow5', 'biz1']
    )
  }

  return (
    <Card raised={false} className={styles.sendEventsCard}>
      <CardContent>
        <form onSubmit={async(e) => sendEvents(e)}>
          <TextField
            value={state.collectorUrl}
            onChange={(e) => setState((prev) => ({...prev, collectorUrl: e.target.value}))}
            label="Collector URL"
            error={Boolean(state.collectorUrlError)}
            helperText={state.collectorUrlError}
          />
          <TextField
            value={state.appId}
            onChange={(e) => setState((prev) => ({...prev, appId: e.target.value}))}
            label="Application ID"
            error={Boolean(state.appIdError)}
            helperText={state.appIdError}
          />
          <LoadingButton
            variant="contained"
            type="submit"
            loading={state.sending}
            loadingIndicator="Sending..."
          >
            Send me some events!
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  )
}
