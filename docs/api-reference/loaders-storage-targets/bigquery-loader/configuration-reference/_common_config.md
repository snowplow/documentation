```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>batching.maxBytes</code></td>
    <td>Optional. Default value <code>16000000</code>. Events are emitted to BigQuery when the batch reaches this size in bytes</td>
</tr>
<tr>
    <td><code>batching.maxDelay</code></td>
    <td>Optional. Default value <code>1 second</code>.  Events are emitted to BigQuery after a maximum of this duration, even if the <code>maxBytes</code> size has not been reached</td>
</tr>
<tr>
    <td><code>batching.uploadConcurrency</code></td>
    <td>Optional. Default value 3.  How many batches can we send simultaneously over the network to BigQuery</td>
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
    <td>Optional, e.g. <code>["iglu:com.example/skipped1/jsonschema/1-0-0"]</code> or with wildcards <code>["iglu:com.example/skipped2/jsonschema/1-*-*"]</code>. A list of schemas that won't be loaded to BigQuery. This feature could be helpful when recovering from edge-case schemas which for some reason cannot be loaded to the table.</td>
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
