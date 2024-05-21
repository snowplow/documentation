<tr>
    <td><code>input.topicName</code></td>
    <td>Required.  Name of the Kafka topic for the source of enriched events.</td>
</tr>
<tr>
    <td><code>input.bootstrapServers</code></td>
    <td>Required. Hostname and port of Kafka bootstrap servers hosting the source of enriched events.</td>
</tr>
<tr>
    <td><code>input.consumerConf.*</code></td>
    <td>Optional. A map of key/value pairs for <a href="https://docs.confluent.io/platform/current/installation/configuration/consumer-configs.html" target="_blank">any standard Kafka consumer configuration option</a>.</td>
</tr>
<tr>
    <td><code>output.bad.topicName</code></td>
    <td>Required. Name of the Kafka topic that will receive failed events.</td>
</tr>
<tr>
    <td><code>output.bad.bootstrapServers</code></td>
    <td>Required. Hostname and port of Kafka bootstrap servers hosting the bad topic</td>
</tr>
<tr>
    <td><code>output.bad.producerConf.*</code></td>
    <td>Optional. A map of key/value pairs for <a href="https://docs.confluent.io/platform/current/installation/configuration/producer-configs.html" target="_blank">any standard Kafka producer configuration option</a>.</td>
</tr>
<tr>
    <td><code>output.bad.maxRecordSize.*</code></td>
    <td>Optional.  Default value 1000000.  Any single failed event sent to Kafka should not exceed this size in bytes</td>
</tr>
