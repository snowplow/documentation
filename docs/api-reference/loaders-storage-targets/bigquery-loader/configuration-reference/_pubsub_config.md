<tr>
    <td><code>input.subscription</code></td>
    <td>Required, e.g. <code>projects/myproject/subscriptions/snowplow-enriched</code>. Name of the Pub/Sub subscription with the enriched events</td>
</tr>
<tr>
    <td><code>input.parallelPullFactor</code></td>
    <td>Optional. Default value 0.5. <code>parallelPullFactor * cpu count</code> will determine the number of threads used internally by the Pub/Sub client library for fetching events</td>
</tr>
<tr>
    <td><code>input.durationPerAckExtension</code></td>
    <td>Optional. Default value <code>60 seconds</code>. Pub/Sub ack deadlines are extended for this duration when needed.</td>
</tr>
<tr>
    <td><code>input.minRemainingAckDeadline</code></td>
    <td>
      Optional. Default value <code>0.1</code>.
      Controls when ack deadlines are re-extended, for a message that is close to exceeding its ack deadline.
      For example, if <code>durationPerAckExtension</code> is <code>60 seconds</code> and <code>minRemainingAckDeadline</code> is <code>0.1</code> then the loader
      will wait until there is <code>6 seconds</code> left of the remining deadline, before re-extending the message deadline.
    </td>
</tr>
<tr>
    <td><code>input.maxMessagesPerPull</code></td>
    <td>Optional. Default value 1000. How many Pub/Sub messages to pull from the server in a single request.</td>
</tr>
<tr>
    <td><code>input.debounceRequests</code></td>
    <td>
      Optional. Default value <code>100 millis</code>.
      Adds an artifical delay between consecutive requests to Pub/Sub for more messages.
      Under some circumstances, this was found to slightly alleviate a problem in which Pub/Sub might re-deliver the same messages multiple times.
    </td>
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
