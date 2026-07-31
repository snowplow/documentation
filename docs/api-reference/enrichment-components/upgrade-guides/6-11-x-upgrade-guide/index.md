---
title: "Enrich 6.11.x upgrade guide with compression"
sidebar_label: "6.11.x upgrade guide"
sidebar_position: 0
description: "Upgrade guide for Enrich 6.11.x introducing enriched stream compression to reduce storage costs and improve throughput, requiring compatible downstream loaders."
keywords: ["enrich 6.11", "enriched stream compression", "compression feature", "cost reduction"]
date: "2026-07-31"
---

Enrich 6.11.0 introduces enriched stream compression, a new feature that significantly reduces the size (and therefore, cost) of data written to your enriched output stream.

The compression feature allows Enrich to compress enriched events before writing them to the output stream. This provides several benefits:

* **Reduced storage costs**: compressed events take up less space in your output streams
* **Improved throughput**: smaller records reduce the overhead of stream processing
* **Better performance**: downstream consumers can process data more efficiently

## Enabling compression

:::danger[Compatible downstream applications required]

Before enabling compression, you must ensure your downstream consumers support decompression. The following applications are compatible:

* [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md) (since 2.2.0)
* [Databricks Streaming Loader](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md) (since 0.5.0)
* [Elasticsearch Loader](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md) (since 3.0.0)
* [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) (since 0.10.0)
* [S3 Loader](/docs/api-reference/loaders-storage-targets/s3-loader/index.md) (since 3.2.0)
* [Snowflake Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) (since 0.6.0)
* [Snowbridge](/docs/api-reference/snowbridge/index.md) (since 5.2.0)

Do not enable this setting if your downstream consumer is not in this list.

:::

When upgrading to Enrich 6.11.0, compression is an optional feature that can be configured in your [Enrich settings](/docs/api-reference/enrichment-components/configuration-reference/index.md). If this feature is not enabled, there are no changes to the data format or size.

After upgrading your downstream consumers, compression in Enrich can be enabled by adding the following config section:

```hocon
compression {
  enabled = true
}
```

You can also configure the compression algorithm and level:

```hocon
compression {
  enabled = true
  type = "zstd"            # or "gzip"
  zstdCompressionLevel = 9 # 1–22, default 9
}
```

The default algorithm is `zstd`, which generally provides a better compression ratio than `gzip` at comparable speeds.

### Impact on metrics

When compression is enabled, there will be a big decrease in the size of messages sent to the enriched event stream, i.e. Kinesis, Pub/Sub or Kafka, depending on your cloud. You will notice this decrease if you monitor metrics on the enriched stream.

This is perfectly normal and does not indicate any drop in event volumes.
