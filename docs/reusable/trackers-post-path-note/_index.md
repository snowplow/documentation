:::note

Changing `postPath` is non-standard behavior that does not conform to the default collector protocol.
The collector configuration must be updated (via [Snowplow Console](/docs/using-the-snowplow-console/accessing-collector-configuration/index.md) or [Collector Configuration](/docs/pipeline-components-and-applications/stream-collector/configure/index.md#configuring-custom-paths)) to support the new path _before_ you send events to it with this setting.
Sending to an unmapped path will cause events to not be received by the collector, or in some cases, collected but fail validation during enrichment.

Care must be taken to ensure that requests are supported by your collector configuration or redirected to the collector at the correct endpoint (normally this is `/com.snowplowanalytics.snowplow/tp2`).

:::
