<tr>
    <td><code>input.streamName</code></td>
    <td>Required. Name of the Kinesis stream with the enriched events</td>
</tr>
<tr>
    <td><code>input.appName</code></td>
    <td>Optional, default <code>snowplow-lake-loader</code>. Name to use for the dynamodb table, used by the underlying Kinesis Consumer Library for managing leases.</td>
</tr>
<tr>
    <td><code>input.initialPosition.type</code></td>
    <td>Optional, default <code>LATEST</code>. Allowed values are <code>LATEST</code>, <code>TRIM_HORIZON</code>, <code>AT_TIMESTAMP</code>. When the loader is deployed for the first time, this controls from where in the kinesis stream it should start consuming events.  On all subsequent deployments of the loader, the loader will resume from the offsets stored in the DynamoDB table.</td>
</tr>
<tr>
    <td><code>input.initialPosition.timestamp</code></td>
    <td>Required if <code>input.initialPosition</code> is <code>AT_TIMESTAMP</code>.  A timestamp in ISO8601 format from where the loader should start consuming events.</td>
</tr>
<tr>
    <td><code>input.retrievalMode</code></td>
    <td>Optional, default Polling.  Change to FanOut to enable the enhance fan-out feature of Kinesis.</td>
</tr>
<tr>
    <td><code>input.retrievalMode.maxRecords</code></td>
    <td>Optional. Default value 1000.  How many events the Kinesis client may fetch in a single poll.  Only used when `input.retrievalMode` is Polling.</td>
</tr>
<tr>
    <td><code>input.workerIdentifier</code></td>
    <td>Optional. Defaults to the <code>HOSTNAME</code> environment variable. The name of this KCL worker used in the dynamodb lease table.</td>
</tr>
<tr>
    <td><code>input.leaseDuration</code></td>
    <td>Optional. Default value <code>10 seconds</code>. The duration of shard leases.  KCL workers must periodically refresh leases in the dynamodb table before this duration expires.</td>
</tr>
<tr>
    <td><code>input.maxLeasesToStealAtOneTimeFactor</code></td>
    <td>Optional. Default value <code>2.0</code>. Controls how to pick the max number of shard leases to steal at one time. E.g. If there are 4 available processors, and <code>maxLeasesToStealAtOneTimeFactor = 2.0</code>, then allow the loader to steal up to 8 leases. Allows bigger instances to more quickly acquire the shard-leases they need to combat latency.</td>
</tr>
<tr>
    <td><code>input.checkpointThrottledBackoffPolicy.minBackoff</code></td>
    <td>Optional.  Default value <code>100 milliseconds</code>.  Initial backoff used to retry checkpointing if we exceed the DynamoDB provisioned write limits.</td>
</tr>
<tr>
    <td><code>input.checkpointThrottledBackoffPolicy.maxBackoff</code></td>
    <td>Optional.  Default value <code>1 second</code>.  Maximum backoff used to retry checkpointing if we exceed the DynamoDB provisioned write limits.</td>
</tr>
<tr>
    <td><code>output.bad.streamName</code></td>
    <td>Required. Name of the Kinesis stream that will receive failed events.</td>
</tr>
<tr>
    <td><code>output.bad.throttledBackoffPolicy.minBackoff</code></td>
    <td>Optional.  Default value <code>100 milliseconds</code>.  Initial backoff used to retry sending failed events if we exceed the Kinesis write throughput limits.</td>
</tr>
<tr>
    <td><code>output.bad.throttledBackoffPolicy.maxBackoff</code></td>
    <td>Optional.  Default value <code>1 second</code>.  Maximum backoff used to retry sending failed events if we exceed the Kinesis write throughput limits.</td>
</tr>
<tr>
    <td><code>output.bad.recordLimit</code></td>
    <td>Optional.  Default value 500.  The maximum number of records we are allowed to send to Kinesis in 1 PutRecords request.</td>
</tr>
<tr>
    <td><code>output.bad.byteLimit</code></td>
    <td>Optional.  Default value 5242880.  The maximum number of bytes we are allowed to send to Kinesis in 1 PutRecords request.</td>
</tr>
<tr>
    <td><code>output.bad.maxRecordSize</code></td>
    <td>Optional.  Default value 1000000.  Any single event failed event sent to Kinesis should not exceed this size in bytes</td>
</tr>
