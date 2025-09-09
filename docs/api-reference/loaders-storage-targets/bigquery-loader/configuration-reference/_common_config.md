import Link from '@docusaurus/Link';

<table>
<tbody>
<tr>
    <td><code>batching.maxBytes</code></td>
    <td>Optional. Default value <code>10000000</code>. Events are emitted to BigQuery when the batch reaches this size in bytes</td>
</tr>
<tr>
    <td><code>batching.maxDelay</code></td>
    <td>Optional. Default value <code>1 second</code>.  Events are emitted to BigQuery after a maximum of this duration, even if the <code>maxBytes</code> size has not been reached</td>
</tr>
<tr>
    <td><code>batching.writeBatchConcurrency</code></td>
    <td>Optional. Default value 2.  How many batches can we send simultaneously over the network to BigQuery</td>
</tr>
<tr>
    <td><code>cpuParallelism.parseBytesFactor</code></td>
    <td>
      Optional. Default value <code>0.1</code>.
      Controls how many batches of bytes we can parse into enriched events simultaneously.
      E.g. If there are 2 cores and <code>parseBytesFactor = 0.1</code> then only one batch gets processed at a time.
      Adjusting this value can cause the app to use more or less of the available CPU.
    </td>
</tr>
<tr>
    <td><code>cpuParallelism.transformFactor</code></td>
    <td>
      Optional. Default value <code>0.75</code>.
      Controls how many batches of enriched events we can transform into BigQuery format simultaneously.
      E.g. If there are 4 cores and <code>transformFactor = 0.75</code> then 3 batches gets processed in parallel.
      Adjusting this value can cause the app to use more or less of the available CPU.
    </td>
</tr>
<tr>
    <td><code>retries.setupErrors.delay</code></td>
    <td>
      Optional. Default value <code>30 seconds</code>.
      Configures exponential backoff on errors related to how BigQuery is set up for this loader.
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
    <td><code>skipSchemas</code></td>
    <td>
      Optional, e.g. <code>\["iglu:com.example/skipped1/jsonschema/1-0-0"]</code> or with wildcards <code>\["iglu:com.example/skipped2/jsonschema/1-*-*"]</code>.
      A list of schemas that won't be loaded to BigQuery.
      This feature could be helpful when recovering from edge-case schemas which for some reason cannot be loaded to the table.
    </td>
</tr>
<tr>
    <td><code>legacyColumnMode</code></td>
    <td>Optional. Default value <code>false</code>.
      When this mode is enabled, the loader uses the legacy column style used by the v1 BigQuery loader.
      For example, an entity for a <code>1-0-0</code> schema is loaded into a column ending in <code>_1_0_0</code>, instead of a column ending in <code>_1</code>.
      This feature could be helpful when migrating from the v1 loader to the v2 loader.
    </td>
</tr>
<tr>
    <td><code>legacyColumns</code></td>
    <td>
      Optional, e.g. <code>\["iglu:com.example/legacy/jsonschema/1-0-0"]</code> or with wildcards <code>\["iglu:com.example/legacy/jsonschema/1-*-*"]</code>.
      Schemas for which to use the legacy column style used by the v1 BigQuery loader, even when <code>legacyColumnMode</code> is disabled.
    </td>
</tr>
<tr>
    <td><code>exitOnMissingIgluSchema</code></td>
    <td>
      Optional. Default value <code>true</code>.
      Whether the loader should crash and exit if it fails to resolve an Iglu Schema.
      We recommend `true` because Snowplow enriched events have already passed validation, so a missing schema normally indicates an error that needs addressing.
      Change to <code>false</code> so events go the failed events stream instead of crashing the loader.
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
    <td>Optional. Default <code>snowplow.bigquery-loader</code>. Prefix used for the metric name when sending to statsd.</td>
</tr>
<tr>
    <td><code>monitoring.webhook.endpoint</code></td>
    <td>Optional, e.g. <code>https://webhook.example.com</code>.  The loader will send to the webhook a payload containing details of any error related to how BigQuery is set up for this loader.</td>
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
    <td>Optional. Set to <code>true</code> to disable <Link to="/docs/getting-started-on-community-edition/telemetry/">telemetry</Link>.</td>
</tr>
<tr>
    <td><code>telemetry.userProvidedId</code></td>
    <td>Optional. See <Link to="/docs/getting-started-on-community-edition/telemetry/#how-can-i-help">here</Link> for more information.</td>
</tr>
<tr>
    <td><code>http.client.maxConnectionsPerServer</code></td>
    <td> Optional. Default value 4. Configures the internal HTTP client used for iglu resolver, alerts and telemetry. The maximum number of open HTTP requests to any single server at any one time.</td>
</tr>
</tbody>
</table>
