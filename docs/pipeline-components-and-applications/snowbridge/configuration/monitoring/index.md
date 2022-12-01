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
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/monitoring/log-level-example.hcl
```

### Sentry Configuration

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/monitoring/sentry-example.hcl
```
### StatsD stats reciever 

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/monitoring/statsd-example.hcl
```
