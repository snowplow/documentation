import React from 'react'

import { Card, CardContent, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CodeBlock from '@theme/CodeBlock'
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker'

import {
  getAppIdError,
  getCollectorEndpointError
} from './utils'
import { sampleTrackingCode } from './sampleTrackingCode'
import styles from './styles.module.css'

type EventComponentState = {
  collectorUrl: string,
  appId: string,
  collectorUrlError: string,
  appIdError: string,
  sending: boolean
}

const SnowplowSandbox = (props) =>
  <iframe name={props.name} srcDoc={`
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
  `}/>

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
      collectorUrl: window.localStorage.getItem('collectorUrl') || 'https://',
      appId: window.localStorage.getItem('appId') || 'test'
    }))
  }, [])

  async function sendEvents(e) {
    e.preventDefault()

    setState((prev) => ({
      ...prev,
      collectorUrlError: '',
      appIdError: '',
      sending: false
    }))

    const collectorUrlError = await getCollectorEndpointError(state.collectorUrl)
    const appIdError = getAppIdError(state.appId)

    if (collectorUrlError !== '' || appIdError !== '') {
      setState((prev) => ({...prev, collectorUrlError, appIdError}))
      return
    }

    window.localStorage.setItem('collectorUrl', state.collectorUrl)
    window.localStorage.setItem('appId', state.appId)

    setState((prev) => ({...prev, sending: true}))

    window.frames['sandbox'].run()

    // Prevent the user from spamming the button
    setTimeout(
      () => setState((prev) => ({...prev, sending: false})),
      1000 * (Math.random() + 1 * 0.5)
    )

    const collectorUrl = new URL(state.collectorUrl)
    trackSelfDescribingEvent({
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
    })
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
          <details>
            <summary>The tracking code for the events</summary>
            <CodeBlock language="javascript">{sampleTrackingCode}</CodeBlock>
          </details>
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
  )
}
