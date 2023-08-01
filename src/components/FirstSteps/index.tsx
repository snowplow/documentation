import React, { useState } from 'react'

import { Card, CardContent, MenuItem, Select, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker'

import { ModalTextField, createModalInput } from './ModalTextField'
import {
  DocsTrackerField,
  checkCollectorEndpoint,
  docsTrackerFieldsSet,
  getAppIdError,
  getCollectorEndpointError,
  getDocsTrackerNamespace,
  newDocsTrackerFromAppIdAndCollectorUrl,
  newDocsTrackerFromLocalStorage,
} from './utils'
import { EventWithNamespace, eventsToTrack } from './eventsToTrack'

export default function EventComponent() {
  const [isSending, setIsSending] = useState(false)
  const [protocol, setProtocol] = useState('http://')

  const collector = createModalInput(DocsTrackerField.COLLECTOR_ENDPOINT)

  const appId = createModalInput(DocsTrackerField.APP_ID, 'test')

  return (
    <Card
      raised={false}
      sx={{
        p: 3,
        pb: 0,
        // Styling to match the alert component
        borderRadius: 'var(--ifm-alert-border-radius)',
        boxShadow: 'var(--ifm-alert-shadow)',
      }}
    >
      <CardContent sx={{ p: 0, pb: 0 }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            // Clear any previous errors
            collector.setState((prev) => ({
              ...prev,
              error: '',
            }))

            appId.setState((prev) => ({
              ...prev,
              error: '',
            }))

            const statusCode = await checkCollectorEndpoint(
              protocol + collector.state.value
            )

            const collectorEndpointError = getCollectorEndpointError(
              protocol + collector.state.value,
              statusCode
            )

            const appIdError = getAppIdError(appId.state.value)

            if (collectorEndpointError === '' && appIdError === '') {
              // If collectorUrl, appId, and the tracker ID are set in localStorage, make a tracker from them
              if (docsTrackerFieldsSet()) {
                newDocsTrackerFromLocalStorage()
              } else {
                newDocsTrackerFromAppIdAndCollectorUrl(
                  appId.state.value,
                  collector.state.value
                )
                collector.setState((prev) => ({
                  ...prev,
                  disabled: true,
                }))

                appId.setState((prev) => ({
                  ...prev,
                  disabled: true,
                }))
              }

              setIsSending(true)

              const namespace = getDocsTrackerNamespace()
              eventsToTrack.forEach((e: EventWithNamespace) => e(namespace))

              // Prevent the user from spamming the button
              setTimeout(
                () => setIsSending(false),
                1000 * (Math.random() + 1 * 0.5)
              )

              const collectorUrl = new URL(collector.state.value)

              trackSelfDescribingEvent(
                {
                  event: {
                    schema:
                      'iglu:com.snowplowanalytics.telemetry/collector_telemetry/jsonschema/1-0-0',
                    data: {
                      method: 'POST',
                      appId: appId.state.value,
                      pageHost: window.location.host,
                      statusCode,
                      collectorHost: collectorUrl.host,
                      collectorPath: collectorUrl.pathname,
                    },
                  },
                },
                ['biz1']
              )
            } else {
              collector.setState((prev) => ({
                ...prev,
                error: collectorEndpointError,
              }))

              appId.setState((prev) => ({
                ...prev,
                error: appIdError,
              }))
            }
          }}
        >
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            Test Events
          </Typography>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <Select
              defaultValue={'http://'}
              sx={{ mr: 1 }}
              value={protocol}
              onChange={(e) => {
                setProtocol(e.target.value)
              }}
            >
              <MenuItem value="http://">http://</MenuItem>
              <MenuItem value="https://">https://</MenuItem>
            </Select>
            <ModalTextField label="Collector Endpoint" modalInput={collector} />
          </div>

          <ModalTextField label="App ID" modalInput={appId} />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <LoadingButton
              sx={{ ml: 1, mt: 1 }}
              variant="contained"
              type="submit"
              loading={isSending}
              loadingIndicator="Sending..."
            >
              Send me some events!
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
