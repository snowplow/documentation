---
title: "Event recovery 0.8.0"
sidebar_label: "Event recovery 0.8.0"
description: "The Flink job is the supported way to recover failed events on AWS, running on EMR 7.13. The Spark job is removed, and event recovery moves to the Snowplow Limited Use License."
keywords: ["event recovery", "failed events", "Flink", "EMR", "upgrade"]
date: "2026-11-09"
category:
  - "Release notes"
components:
  - "Monitoring"
---

Snowplow Event Recovery 0.8.0 makes the Flink job the supported way to recover failed events on AWS, and removes the Spark job. This release includes breaking changes. To upgrade, see the [0.8.0 upgrade guide](/docs/monitoring/recovering-failed-events/manual/upgrade-guides/0-8-0-upgrade-guide/).

## Flink job on EMR 7.13

The Flink job runs on Flink 1.20, on EMR 7.13 with Java 11. The [dataflow-runner templates](https://github.com/snowplow-incubator/snowplow-event-recovery/tree/0.8.0/.dataflow-runner) are updated for the new EMR release, and no longer need a bootstrap action.

The job retries records that Kinesis throttles until they're written. When a run finishes, it logs a summary of how many events it recovered, how many failed, and how many were unrecoverable.

Before a run starts, the job checks that it can access the output Kinesis stream, and fails immediately if it can't.

The Flink job can write recovered events to files with the `--directory-output` argument, instead of or as well as Kinesis. You can use it for a dry run before sending events to your pipeline.

See [Run event recovery on AWS with Flink](/docs/monitoring/recovering-failed-events/manual/running/flink/) for details.

## Spark job removed

The Spark job, deprecated since 0.6.0, is removed. Version 0.7.2 is the last release that includes it. The Flink job accepts the Spark job's argument names, `--failedOutput`, `--unrecoverableOutput`, `--batchSize`, and `--directoryOutput`, so existing command lines need fewer changes.

Documentation for the Spark job and for earlier Flink releases is available under [Previous versions](/docs/monitoring/recovering-failed-events/manual/previous-versions/).

## Other changes

This release also includes these changes:

- Event recovery is licensed under the [Snowplow Limited Use License](/limited-use-license-1.1/) ([FAQ](/docs/licensing/limited-use-license-faq/))
- The command line tool's `run` command needs Java 21 or later
- The Beam job's Docker image runs on Java 11
- Dependencies are updated
