---
title: "Monitor event recovery jobs"
sidebar_label: "Monitoring"
date: "2020-08-26"
sidebar_position: 40
description: "Track recovery job progress using the Flink job's run summary and metrics on EMR, or the Beam job's metrics in Google Dataflow."
keywords: ["recovery job monitoring", "EMR recovery metrics", "Flink recovery metrics", "Dataflow monitoring"]
---

When you run a recovery job against your production pipeline, you can track its progress in two ways.

The first is the job's outputs: the `failed` and `unrecoverable` paths in S3 or GCS, and the Kinesis stream or Pub/Sub topic that receives recovered events. The second is the job's own counts of how many failed events it recovered, couldn't recover, or found to be unrecoverable.

## Monitor the Flink job on AWS

When a run finishes successfully, the Flink job logs a summary to the EMR step log:

```txt
Recovery finished: <n> recovered and written to Kinesis stream <stream> and <directory>, <n> failed (written to <path>), <n> unrecoverable (written to <path>)
```

The summary only names the outputs that you set. Each input event is counted once. Failed and unrecoverable events are written to S3, and never reach Kinesis.

While the job runs, you can follow its metrics in the Flink web UI, or through a Flink metrics reporter if you configure one on the cluster. The reference templates don't configure a reporter.

| Metric | Meaning |
|---|---|
| `events.recovered` | The number of events recovered so far. |
| `events.failed` | The number of events the recovery configuration couldn't fix so far. |
| `events.unrecoverable` | The number of unrecoverable events so far. |

If `numRecordsOutErrors` on the `kinesis: Writer` operator keeps rising and the job makes no progress, check the task logs for `AccessDeniedException` or `KMSAccessDeniedException`. See [Grant permissions](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#grant-permissions).

## Monitor the Beam job on GCP

On Google Dataflow, the Beam job reports real-time metrics using Dataflow's built-in counters:

- `recovered`
- `failed`
- `unrecoverable`

You can view the metrics in the Dataflow web UI.
