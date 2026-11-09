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

## AWS (Flink)

When a run finishes successfully, the Flink job logs a summary to the EMR step log:

```txt
Recovery finished: <n> recovered and written to Kinesis stream <stream> and <directory>, <n> failed (written to <path>), <n> unrecoverable (written to <path>)
```

The summary only names the outputs that you set. Each input event is counted once. Failed and unrecoverable events are written to S3, and never reach Kinesis.

While the job runs, you can follow its metrics in the Flink web UI, or through a Flink metrics reporter if you configure one on the cluster. The reference templates don't configure a reporter.

| Metric | Meaning |
|---|---|
| `events.recovered`, `events.failed`, `events.unrecoverable` | The number of events leaving the recovery step, before they're written anywhere. `events.recovered` counts events handed to the Kinesis sink, not events that Kinesis accepted. |
| `numRecordsOut` on the `kinesis: Writer` operator | The number of records sent to Kinesis, counting each retry again. |
| `numRecordsOutErrors` on the `kinesis: Writer` operator | The number of records that Kinesis rejected, and that the job will retry. |

To estimate how many records the job has written to Kinesis so far, subtract `numRecordsOutErrors` from `numRecordsOut` on the `kinesis: Writer` operator. This relies on Kinesis reporting an accurate failed record count for each `PutRecords` call.

If `numRecordsOutErrors` keeps rising and the job makes no progress, check the task logs for `AccessDeniedException` or `KMSAccessDeniedException`. See [Grant permissions](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#grant-permissions).

## GCP (Beam)

On Google Dataflow, the Beam job reports real-time metrics using Dataflow's built-in counters:

- `recovered`
- `failed`
- `unrecoverable`

You can view the metrics in the Dataflow web UI.
