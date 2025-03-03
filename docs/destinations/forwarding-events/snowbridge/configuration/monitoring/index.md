---
title: "Monitoring"
date: "2022-10-20"
sidebar_position: 400
---

# Monitoring Configuration

## Stats and metrics

Snowbridge comes with configurable logging, [pprof](https://github.com/google/pprof) profiling, [statsD](https://www.datadoghq.com/statsd-monitoring) statistics and [Sentry](https://sentry.io/welcome/) integrations to ensure that you know what’s going on.

### Logging

Use the log_level parameter to specify the log level.

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/monitoring/log-level-example.hcl
```

### Sentry Configuration

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/monitoring/sentry-example.hcl
```

### StatsD stats receiver configuration

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/monitoring/statsd-example.hcl
```

### End-to-end latency configuration

Snowplow Enriched data only:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/metrics/e2e-latency-example.hcl
```

Snowbridge sends the following metrics to statsd:

| Metric                   | Definitions                                                                                                                                             |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `target_success`         | Events successfully sent to the target.                                                                                                                 |
| `target_failed`          | Events which failed to reach the target, and will be handled by the retry config. Retries which fail are also counted.                                   |
| `message_filtered`       | Events filtered out via transformation.                                                                                                                 |
| `failure_target_success` | Events we could not send to the target, which are not retryable, successfully sent to the failure target.                                               |
| `failure_target_failed`  | Events we could not send to the target, which are not retryable, which we failed to send to the failure target. In this scenario, Snowbridge will crash. |
| `min_processing_latency` | Min time between entering Snowbridge and write to target/failure target.                                                                                |
| `max_processing_latency` | Max time between entering Snowbridge and write to target/failure target.                                                                                |
| `avg_processing_latency` | Avg time between entering Snowbridge and write to target/failure target.                                                                                |
| `min_message_latency`    | Min time between entering the source stream and write to target/failure target.                                                                         |
| `max_message_latency`    | Max time between entering the source stream and write to target/failure target.                                                                         |
| `avg_message_latency`    | Avg time between entering the source stream and write to target/failure target.                                                                         |
| `min_transform_latency`  | Min time between entering Snowbridge and completion of transformation.                                                                                   |
| `max_transform_latency`  | Max time between entering Snowbridge and completion of transformation.                                                                                   |
| `avg_transform_latency`  | Avg time between entering Snowbridge and completion of transformation.                                                                                   |
| `min_filter_latency`     | Min time between entering Snowbridge and being filtered out.                                                                                             |
| `max_filter_latency`     | Max time between entering Snowbridge and being filtered out.                                                                                             |
| `avg_filter_latency`     | Avg time between entering Snowbridge and being filtered out.                                                                                             |
| `min_request_latency`    | Min time between starting request to target and finishing request to target.                                                                             |
| `max_request_latency`    | Max time between starting request to target and finishing request to target.                                                                             |
| `avg_request_latency`    | Avg time between starting request to target and finishing request to target.                                                                             |
| `min_e2e_latency`    | Min time between Snowplow collector tstamp and finishing request to target. Enabled via configuration - Snowplow enriched data only.                                                                           |
| `max_e2e_latency`    | Max time between Snowplow collector tstamp and finishing request to target. Enabled via configuration - Snowplow enriched data only.                                                                             |
| `avg_e2e_latency`    | Avg time between Snowplow collector tstamp and finishing request to target. Enabled via configuration - Snowplow enriched data only.    |
