---
title: "Recover failed events"
sidebar_position: 4
sidebar_label: "Recover failed events"
description: "Fix and reprocess failed events using SQL recovery, manual recovery from buckets, or Console data recovery requests."
keywords: ["event recovery", "failed event recovery", "reprocess failed events"]
---

Event recovery allows you to fix [failed events](/docs/fundamentals/failed-events/index.md) in some scenarios, so that you can ensure your data is complete and accurate.

A typical recovery process runs a script over a set of failed events to solve the issues (e.g. misspelled attribute name), and then attempts to re-process these events if necessary.

The best way to recover failed events is to [set up loading failed events into a separate table in your warehouse or lake](/docs/monitoring/exploring-failed-events/index.md). [Use SQL to recover](/docs/monitoring/recovering-failed-events/recover-with-sql/index.md) the events.

If you don't have a Failed Events Loader, you can [manually recover](/docs/monitoring/recovering-failed-events/manual/index.md) failed events from their S3 or GCS buckets.

Finally, you can also use Snowplow Console to [submit a data recovery request](https://console.snowplowanalytics.com/recovery) to our Support team.
