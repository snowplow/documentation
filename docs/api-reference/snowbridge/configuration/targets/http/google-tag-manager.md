# Example: Google Tag Manager Server Side

You can use the HTTP target to send events to Google Tag Manager Server Side, where the [Snowplow Client tag](/docs/destinations/forwarding-events/google-tag-manager-server-side/snowplow-client-for-gtm-ss/index.md) is installed.

To do this, you will need to include a [transformation](/docs/api-reference/snowbridge/concepts/transformations/index.md) that converts your events to JSON — [`spEnrichedToJson`](/docs/api-reference/snowbridge/configuration/transformations/builtin/spEnrichedToJson.md).

Here’s an example configuration. Replace `<your-gtm-host>` with the hostname of your Google Tag Manager instance, and — optionally — `<preview-token>` with your preview mode token.

```hcl
target {
  use "http" {
    url                        = "https://<your-gtm-host>/com.snowplowanalytics.snowplow/enriched"
    request_timeout_in_seconds = 5
    content_type               = "application/json"

    # this line is optional, in case you want to send events to GTM Preview Mode
    headers                    = "{\"x-gtm-server-preview\": \"<preview-token>\"}"
  }
}

transform {
  use "spEnrichedToJson" {}
}
```
