---
title: "3.6.x upgrade guide"
sidebar_position: 10
---

Collector 3.6.0 introduces payload compression, a new feature that significantly reduces the size (and therefore, cost) of data written to your raw output stream.

The compression feature allows the collector to batch multiple individual collector payloads into a single compressed stream record. This provides several benefits:

* **Reduced storage costs**: compressed payloads take up less space in your output streams
* **Improved throughput**: fewer, larger records reduce the overhead of stream processing
* **Better performance**: downstream consumers can process batches more efficiently

## Enabling compression

:::warning Enrich 6.1.x required
Before enabling compression, you must upgrade to Enrich 6.1.x first. The reason for this is that support for processing compressed payloads is added to Enrich starting with Enrich 6.1.0. Enrich 6.1.0 can process both compressed and uncompressed payloads.

Enrich is currently the only application compatible with compression. Setups with an [S3 loader](/docs/api-reference/loaders-storage-targets/s3-loader/index.md) reading off the raw stream will not be supported.
:::

When upgrading to Collector 3.6.0, compression is an optional feature that can be configured in your [collector settings](/docs/api-reference/stream-collector/configure/index.md). If this feature is not enabled, there will be no changes to the data format or size.

After upgrading Enrich, compression in Collector can be enabled by adding the following config section:

```hocon
compression {
  enabled = true
}
```

:::tip

Take note of the `streams.buffer.timeLimit` Collector configuration parameter, which already existed in previous versions. This controls how many events are batched (or, technically, for how long) before appling compression. Bigger values lead to higher compression rates (lower infrastructure costs), but also higher latency. We recommend starting with a value around 300ms and fine-tuning it from there.

:::

### Impact on metrics

When compression is enabled, there will be a big decrease in the number of messages sent to the `raw` event stream, i.e. Kinesis, Pub/Sub or Event Hubs, depending on your cloud. You will notice this decrease if you monitor metrics on messages in the `raw` stream.

This is perfectly normal and does not indicate any drop in event volumes. It happens because the compression feature batches together many Snowplow events into a single message sent to the `raw` stream.
