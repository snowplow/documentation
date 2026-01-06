```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>windowing</code></td>
    <td>Optional. Default value <code>5 minutes</code>. Controls how often the loader writes/commits pending events to the lake.</td>
</tr>
<tr>
    <td><code>exitOnMissingIgluSchema</code></td>
    <td>
      Optional. Default value <code>true</code>.
      Whether the loader should crash and exit if it fails to resolve an Iglu Schema.
      We recommend <code>true</code> because Snowplow enriched events have already passed validation, so a missing schema normally indicates an error that needs addressing.
      Change to <code>false</code> so events go the failed events stream instead of crashing the loader.
    </td>
</tr>
<tr>
    <td><code>respectIgluNullability</code></td>
    <td>
      Optional. Default value <code>true</code>.
      Whether the output parquet files should declare nested fields as non-nullable according to the Iglu schema.
      When <code>true</code>, nested fields are nullable only if they are not required fields according to the Iglu schema.
      When <code>false</code>, all nested fields are defined as nullable in the output table's schemas.
      Set this to <code>false</code> if you use a query engine that dislikes non-nullable nested fields of a nullable struct.
    </td>
</tr>
<tr>
    <td><code>skipSchemas</code></td>
    <td>
      Optional, e.g. <code>["iglu:com.example/skipped1/jsonschema/1-0-0"]</code> or with wildcards <code>["iglu:com.example/skipped2/jsonschema/1-*-*"]</code>.
      A list of schemas that won't be loaded to the lake.
      This feature could be helpful when recovering from edge-case schemas which for some reason cannot be loaded.
    </td>
</tr>
<tr>
    <td><code>spark.conf.*</code></td>
    <td>Optional. A map of key/value strings which are passed to the internal spark context.</td>
</tr>
<tr>
    <td><code>spark.taskRetries</code></td>
    <td>Optional. Default value 3.  How many times the internal spark context should be retry a task in case of failure</td>
</tr>
<tr>
    <td><code>retries.setupErrors.delay</code></td>
    <td>
      Optional. Default value <code>30 seconds</code>.
      Configures exponential backoff on errors related to how the lake is set up for this loader.
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
    <td>Optional. Default <code>snowplow.lakeloader</code>. Prefix used for the metric name when sending to statsd.</td>
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
    <td><code>monitoring.healthProbe.port</code></td>
    <td>Optional. Default value <code>8000</code>. Open a HTTP server that returns OK only if the app is healthy.</td>
</tr>
<tr>
    <td><code>monitoring.healthProbe.unhealthyLatency</code></td>
    <td>Optional. Default value <code>15 minutes</code>. Health probe becomes unhealthy if any received event is still not fully processed before this cutoff time.</td>
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
    <td><code>inMemBatchBytes</code></td>
    <td>Optional. Default value 50000000. Controls how many events are buffered in memory before saving the batch to local disk. The default value works well for reasonably sized VMs. For smaller VMs (e.g. less than 2 cpu core, 8 GG memory) consider decreasing this value.</td>
</tr>
<tr>
    <td><code>cpuParallelismFraction</code></td>
    <td>
    Optional. Default value 0.75.
    Controls how the app splits the workload into concurrent batches which can be run in parallel.
    E.g. If there are 4 available processors, and cpuParallelismFraction = 0.75, then we process 3 batches concurrently.
    The default value works well for most workloads.
    </td>
</tr>
<tr>
    <td><code>numEagerWindows</code></td>
    <td>
    Optional. Default value 1.
    Controls how eagerly the loader starts processing the next timed window even when the previous timed window is still finalizing (committing into the lake).
    By default, we start processing a timed windows if the previous 1 window is still finalizing, but we do not start processing a timed window if any more older windows are still finalizing.
    The default value works well for most workloads.
    </td>
</tr>
<tr>
    <td><code>http.client.maxConnectionsPerServer</code></td>
    <td>
      Optional. Default value 4.
      Configures the internal HTTP client used for Iglu resolver, alerts and telemetry.
      The maximum number of open HTTP requests to any single server at any one time.
      For Iglu Server in particular, this avoids overwhelming the server with multiple concurrent requests.
    </td>
</tr>
