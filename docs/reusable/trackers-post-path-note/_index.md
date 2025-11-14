:::warning

While modifying `postPath` is generally recommended as a way to help avoid various ad-blocking tools when capturing events, it is also non-standard behavior that does not conform to the default Collector protocol.

You must update the [Collector configuration](/docs/pipeline/collector/index.md) to support the new path _before_ you send events to it with this setting. Otherwise, events will not be received by the Collector, or in some cases will be collected but will fail validation.

Make sure that requests are supported by your Collector configuration or redirected to the Collector at the correct endpoint (normally this is `/com.snowplowanalytics.snowplow/tp2`).

:::
