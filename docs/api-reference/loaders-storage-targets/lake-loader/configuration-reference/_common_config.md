```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>windowing</code></td>
    <td>Optional. Default value <code>5 minutes</code>. Controls how often the loader writes/commits pending events to the lake.</td>
</tr>
<tr>
    <td><code>spark.taskRetries</code></td>
    <td>Optional. Default value 3.  How many times the internal spark context should be retry a task in case of failure</td>
</tr>
<tr>
    <td><code>spark.conf.*</code></td>
    <td>Optional. A map of key/value strings which are passed to the internal spark context.</td>
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
