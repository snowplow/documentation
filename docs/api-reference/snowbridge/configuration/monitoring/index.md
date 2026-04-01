---
title: "Snowbridge monitoring configuration"
sidebar_label: "Monitoring"
date: "2022-10-20"
sidebar_position: 400
description: "Monitor Snowbridge with configurable logging, pprof profiling, StatsD metrics, and Sentry error reporting for observability."
keywords: ["snowbridge config", "monitoring", "statsd metrics", "sentry", "logging", "snowbridge observability"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Snowbridge comes with configurable logging, [pprof](https://github.com/google/pprof) profiling, [statsD](https://www.datadoghq.com/statsd-monitoring) statistics and [Sentry](https://sentry.io/welcome/) integrations to ensure that you know what's going on.

## Logging

Use the `log_level` parameter to specify the log level.

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/monitoring/log-level-example.hcl
`}</CodeBlock>

## Sentry Configuration

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/monitoring/sentry-example.hcl
`}</CodeBlock>

## StatsD stats receiver configuration

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/monitoring/statsd-example.hcl
`}</CodeBlock>

## End-to-end latency configuration

Snowplow Enriched data only:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/metrics/e2e-latency-example.hcl
`}</CodeBlock>

## Metric definitions

Snowbridge sends the following metrics to StatsD:

| Metric | Description |
|---|---|
| `target_success` | Events successfully sent to the target. |
| `target_failed` | Events that failed to reach the target and will be retried. |
| `target_request_count` | Number of requests successfully sent to the target. |
| `message_filtered` | Events filtered out via transformation. |
| `failure_target_success` | Invalid events (not retryable) successfully sent to the failure target. |
| `failure_target_failed` | Invalid events that failed to reach the failure target. Snowbridge crashes in this scenario. |
| `min_processing_latency` | Minimum time between entering Snowbridge and writing to the target. |
| `max_processing_latency` | Maximum time between entering Snowbridge and writing to the target. |
| `min_message_latency` | Minimum time between entering the source stream and writing to the target. |
| `max_message_latency` | Maximum time between entering the source stream and writing to the target. |
| `min_transform_latency` | Minimum time for a transformation to complete. |
| `max_transform_latency` | Maximum time for a transformation to complete. |
| `min_filter_latency` | Minimum time between entering Snowbridge and being filtered out. |
| `max_filter_latency` | Maximum time between entering Snowbridge and being filtered out. |
| `min_request_latency` | Minimum time for a target write request to complete. |
| `max_request_latency` | Maximum time for a target write request to complete. |
| `min_e2e_latency` | Minimum time between Snowplow collector timestamp and completing the target write. Enabled via configuration — Snowplow enriched data only. |
| `max_e2e_latency` | Maximum time between Snowplow collector timestamp and completing the target write. Enabled via configuration — Snowplow enriched data only. |
