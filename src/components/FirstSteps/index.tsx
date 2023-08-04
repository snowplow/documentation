import React from 'react'

import {
  Alert,
  Card,
  CardContent,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker'

import { getAppIdError, getCollectorEndpointError } from './utils'
import { sampleTrackingCode } from './sampleTrackingCode'
import styles from './styles.module.css'

type EventComponentNotification = {
  collectorUrl: string,
  appId: string
}

type EventComponentState = {
  collectorUrl: string
  appId: string
  collectorUrlError: string
  appIdError: string
  sending: boolean
  sent: EventComponentNotification | null
}

const SnowplowSandbox = (props) => (
  <iframe
    name={props.name}
    srcDoc={`
    <html>
    <head>
      <script type="text/javascript">
        ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}
        (window,document,"script","/js/sandboxed-sp.js","snowplow"));
        window.snowplow('newTracker', 'sp1', '${props.collectorUrl}', {
          appId: '${props.appId}'
        })
        window.run = function() {
          ${props.code}
        }
      </script>
    </head>
    <body>
    </body>
    </html>
  `}
  />
)

export default function EventComponent() {
  const [state, setState] = React.useState<EventComponentState>({
    collectorUrl: '',
    appId: 'test',
    collectorUrlError: '',
    appIdError: '',
    sending: false,
    sent: null,
  })

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      collectorUrl: window.localStorage.getItem('collectorUrl') || 'https://',
      appId: window.localStorage.getItem('appId') || 'test',
    }))
  }, [])

  async function sendEvents(e) {
    e.preventDefault()
    const { collectorUrl, appId } = state

    setState((prev) => ({
      ...prev,
      collectorUrlError: '',
      appIdError: '',
      sending: false,
      sent: null,
    }))

    const appIdError = getAppIdError(appId)
    if (appIdError) {
      setState((prev) => ({ ...prev, appIdError }))
      return
    }

    const { collectorUrlError, statusCode } = await getCollectorEndpointError(
      collectorUrl,
      appId
    )

    if (statusCode > 0) {
      // as long as the URL is valid, we log it — even if the collector does not respond
      const parsedCollectorUrl = new URL(collectorUrl)
      trackSelfDescribingEvent({
        event: {
          schema:
            'iglu:com.snowplowanalytics.telemetry/collector_telemetry/jsonschema/1-0-0',
          data: {
            method: 'POST',
            appId,
            statusCode,
            collectorHost: parsedCollectorUrl.host,
            collectorPath: parsedCollectorUrl.pathname,
          },
        },
      })
    }

    if (collectorUrlError !== '') {
      setState((prev) => ({ ...prev, collectorUrlError }))
      return
    }

    window.localStorage.setItem('collectorUrl', collectorUrl)
    window.localStorage.setItem('appId', appId)

    setState((prev) => ({ ...prev, sending: true }))

    window.frames['sandbox'].run()

    // Prevent the user from spamming the button
    const buttonTime = 1000 * (Math.random() + 1 * 0.5)
    setTimeout(
      () =>
        setState((prev) => ({
          ...prev,
          sending: false,
          sent: { collectorUrl, appId },
        })),
      buttonTime
    )
  }

  return (
    <>
      <Card raised={false} className={styles.sendEventsCard}>
        <CardContent>
          <form onSubmit={async (e) => sendEvents(e)}>
            <TextField
              value={state.collectorUrl}
              onChange={(e) =>
                setState((prev) => ({ ...prev, collectorUrl: e.target.value }))
              }
              label="Collector URL"
              error={Boolean(state.collectorUrlError)}
              helperText={state.collectorUrlError}
            />
            <TextField
              value={state.appId}
              onChange={(e) =>
                setState((prev) => ({ ...prev, appId: e.target.value }))
              }
              label="Application ID"
              error={Boolean(state.appIdError)}
              helperText={state.appIdError}
            />
            {state.sent && (<Alert
              variant="filled"
              severity="success"
              onClose={
                () => setState((prev) => ({ ...prev, sent: null }))
              }>
                Events sent to <strong>{state.sent.collectorUrl}</strong>{' '}
                with Application ID <strong>{state.sent.appId}</strong>
            </Alert>)}
            <LoadingButton
              variant="contained"
              type="submit"
              loading={state.sending}
              loadingIndicator="Sending..."
            >
              Send me some events!
            </LoadingButton>
            <SnowplowSandbox
              name="sandbox"
              collectorUrl={state.collectorUrl}
              appId={state.appId}
              code={sampleTrackingCode}
            />
          </form>
        </CardContent>
      </Card>
    </>
  )
}
