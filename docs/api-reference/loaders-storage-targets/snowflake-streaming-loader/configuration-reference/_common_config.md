```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>batching.maxBytes</code></td>
    <td>Optional. Default value <code>16000000</code>. Events are emitted to Snowflake when the batch reaches this size in bytes</td>
</tr>
<tr>
    <td><code>batching.maxDelay</code></td>
    <td>Optional. Default value <code>1 second</code>.  Events are emitted to Snowflake after a maximum of this duration, even if the <code>maxBytes</code> size has not been reached</td>
</tr>
<tr>
    <td><code>batching.uploadParallelismFactor</code></td>
    <td>Optional. Default value 3.5.  Controls how many batches can we send simultaneously over the network to Snowflake. E.g. If there are 4 available processors, and <code>uploadParallelismFactor</code> is 3.5, then the loader sends up to 14 batches in parallel. Adjusting this value can cause the app to use more or less of the available CPU.</td>
</tr>
<tr>
    <td><code>cpuParallelismFactor</code></td>
    <td>Optional. Default value 0.75. Controls how the loaders splits the workload into concurrent batches which can be run in parallel. E.g. If there are 4 available processors, and <code>cpuParallelismFactor</code> is 0.75, then the loader processes 3 batches concurrently. Adjusting this value can cause the app to use more or less of the available CPU.</td>
</tr>
<tr>
    <td><code>retries.setupErrors.delay</code></td>
    <td>
      Optional. Default value <code>30 seconds</code>.
      Configures exponential backoff on errors related to how Snowflake is set up for this loader.
      Examples include authentication errors and permissions errors.
      This class of errors are reported periodically to the monitoring webhook.
    </td>
</tr>
<tr>
    <td><code>retries.transientErrors.delay</code></td>
    <td>
      Optional. Default value <code>1 second</code>.
      Configures exponential backoff on errors that are likely to be transient.
      Examples include server errors and network errors.
    </td>
</tr>
<tr>
    <td><code>retries.transientErrors.attempts</code></td>
    <td>Optional. Default value 5. Maximum number of attempts to make before giving up on a transient error.</td>
</tr>
<tr>
    <td><code>retries.checkCommittedOffset.delay</code></td>
    <td>
      Optional. Default value <code>100 millis</code>.
      Configures a delay in between flushing events to Snowflake and fetching the latest offset token from Snowflake to check the events are fully ingested.
    </td>
</tr>
<tr>
    <td><code>skipSchemas</code></td>
    <td>Optional, e.g. <code>["iglu:com.example/skipped1/jsonschema/1-0-0"]</code> or with wildcards <code>["iglu:com.example/skipped2/jsonschema/1-*-*"]</code>. A list of schemas that won't be loaded to Snowflake. This feature could be helpful when recovering from edge-case schemas which for some reason cannot be loaded to the table.</td>
</tr>
<tr>
    <td><code>decompression.maxBytesInBatch</code> (since 0.6.0)</td>
    <td>
      <p>Optional. Default value <code>5242880</code> (5 MB).</p>
      <p>The loader automatically detects and decompresses zstd- or gzip-compressed source messages. Uncompressed messages are unaffected.</p>
      <p>The loader uses this as a cutoff when incrementally adding decompressed events to a batch, and emits the batch as soon as it reaches this size. This protects the loader's memory because a small compressed message can expand into a much larger payload.</p>
    </td>
</tr>
<tr>
    <td><code>decompression.maxBytesSinglePayload</code> (since 0.6.0)</td>
    <td>
      <p>Optional. Default value <code>10000000</code> (10 MB).</p>
      <p>For zstd- or gzip-compressed source messages, this is the maximum size of a single payload after decompression. The loader emits a <Link to="/docs/api-reference/failed-events/#size-violation">size violation failed event</Link> for any payload that exceeds this size.</p>
    </td>
</tr>
<tr>
    <td><code>monitoring.metrics.statsd.hostname</code></td>
    <td>Optional. If set, the loader sends statsd metrics over UDP to a server on this host name.</td>
</tr>
<tr>
    <td><code>monitoring.metrics.statsd.port</code></td>
    <td>Optional. Default value 8125. If the statsd server is configured, this UDP port is used for sending  metrics.</td>
</tr>
<tr>
    <td><code>monitoring.metrics.statsd.tags.*</code></td>
    <td>Optional. A map of key/value pairs to be sent along with the statsd metric.</td>
</tr>
<tr>
    <td><code>monitoring.metrics.statsd.period</code></td>
    <td>Optional. Default <code>1 minute</code>. How often to report metrics to statsd.</td>
</tr>
<tr>
    <td><code>monitoring.metrics.statsd.prefix</code></td>
    <td>Optional. Default <code>snowplow.snowflake-loader</code>. Prefix used for the metric name when sending to statsd.</td>
</tr>
<tr>
    <td><code>monitoring.metrics.prometheus.tags.*</code> (since 0.6.0)</td>
    <td>Optional. A map of key/value pairs added as common labels on every Prometheus metric. The loader exposes these metrics at the <code>/metrics</code> endpoint on the health probe port.</td>
</tr>
<tr>
    <td><code>monitoring.webhook.endpoint</code></td>
    <td>Optional, e.g. <code>https://webhook.example.com</code>.  The loader will send to the webhook a payload containing details of any error related to how Snowflake is set up for this loader.</td>
</tr>
<tr>
    <td><code>monitoring.webhook.tags.*</code></td>
    <td>Optional. A map of key/value strings to be included in the payload content sent to the webhook.</td>
</tr>
<tr>
    <td><code>monitoring.webhook.heartbeat.*</code></td>
    <td>Optional. Default value <code>5.minutes</code>. How often to send a heartbeat event to the webhook when healthy.</td>
</tr>
<tr>
    <td><code>monitoring.sentry.dsn</code></td>
    <td>Optional. Set to a Sentry URI to report unexpected runtime exceptions.</td>
</tr>
<tr>
    <td><code>monitoring.sentry.tags.*</code></td>
    <td>Optional. A map of key/value strings which are passed as tags when reporting exceptions to Sentry.</td>
</tr>
<tr>
    <td><code>telemetry.disable</code></td>
    <td>Optional. Set to <code>true</code> to disable <Link to="/docs/get-started/self-hosted/telemetry/">telemetry</Link>.</td>
</tr>
<tr>
    <td><code>telemetry.userProvidedId</code></td>
    <td>Optional. See <Link to="/docs/get-started/self-hosted/telemetry/#how-can-i-help">here</Link> for more information.</td>
</tr>
<tr>
    <td><code>output.good.jdbcLoginTimeout</code></td>
    <td>Optional. Sets the login timeout on the JDBC driver which connects to Snowflake</td>
</tr>
<tr>
    <td><code>output.good.jdbcNetworkTimeout</code></td>
    <td>Optional. Sets the network timeout on the JDBC driver which connects to Snowflake</td>
</tr>
<tr>
    <td><code>output.good.jdbcQueryTimeout</code></td>
    <td>Optional. Sets the query timeout on the JDBC driver which connects to Snowflake</td>
</tr>
<tr>
    <td><code>http.client.maxConnectionsPerServer</code></td>
    <td> Optional. Default value 4. Configures the internal HTTP client used for alerts and telemetry. The maximum number of open HTTP requests to any single server at any one time.</td>
</tr>
