<tr>
    <td><code>input.subscription</code></td>
    <td>Required, e.g. <code>projects/myproject/subscriptions/snowplow-enriched</code>. Name of the Pub/Sub subscription with the enriched events</td>
</tr>
<tr>
    <td><code>input.parallelPullCount</code></td>
    <td>Optional. Default value 1. Number of threads used internally by the pubsub client library for fetching events</td>
</tr>
<tr>
    <td><code>input.bufferMaxBytes</code></td>
    <td>Optional. Default value 10000000. How many bytes can be buffered by the loader app before blocking the pubsub client library from fetching more events. This is a balance between memory usage vs how efficiently the app can operate.  The default value works well.</td>
</tr>
<tr>
    <td><code>input.maxAckExtensionPeriod</code></td>
    <td>Optional. Default value 1 hour. For how long the pubsub client library will continue to re-extend the ack deadline of an unprocessed event.</td>
</tr>
<tr>
    <td><code>input.minDurationPerAckExtension</code></td>
    <td>Optional. Default value 60 seconds. Sets min boundary on the value by which an ack deadline is extended. The actual value used is guided by runtime statistics collected by the pubsub client library.</td>
</tr>
<tr>
    <td><code>input.maxDurationPerAckExtension</code></td>
    <td>Optional. Default value 600 seconds. Sets max boundary on the value by which an ack deadline is extended. The actual value used is guided by runtime statistics collected by the pubsub client library.</td>
</tr>
<tr>
    <td><code>output.bad.topic</code></td>
    <td>Required, e.g. <code>projects/myproject/topics/snowplow-bad</code>. Name of the Pub/Sub topic that will receive failed events.</td>
</tr>
<tr>
    <td><code>output.bad.batchSize</code></td>
    <td>Optional.  Default value 1000.  Bad events are sent to Pub/Sub in batches not exceeding this count.</td>
</tr>
<tr>
    <td><code>output.bad.requestByteThreshold</code></td>
    <td>Optional.  Default value 1000000.  Bad events are sent to Pub/Sub in batches with a total size not exceeding this byte threshold</td>
</tr>
<tr>
    <td><code>output.bad.maxRecordSize</code></td>
    <td>Optional.  Default value 10000000.  Any single failed event sent to Pub/Sub should not exceed this size in bytes</td>
</tr>
