---
title: "Failed events hub"
sidebar_label: "Failed events hub"
sidebar_position: 1
description: "Find every page about Snowplow failed events in one place: what they are, how to see them in a new pipeline, how to monitor and alert on them, how to load and query them, and how to recover them."
keywords: ["failed events", "data quality", "failed event recovery", "failed events loader", "data quality dashboard", "failed event alerts"]
date: "2026-11-06"
content_type: landing
---

Failed events are events the pipeline couldn't process, for example because they didn't match their schema or an enrichment failed. The pipeline keeps them separate, so they don't affect the data in your warehouse, and you can fix and reprocess many of them. The [failed events fundamentals](/docs/fundamentals/failed-events/index.md) page explains why events fail and where they go.

The pages about failed events live in four parts of the docs: Fundamentals, Get started, Monitor and operate, and Reference. This page lists them by task. Start with the task you have now.

| I want to                                         | Go to                                                                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Understand what a failed event is                 | [Introduction to failed events](/docs/fundamentals/failed-events/index.md)                                  |
| See failed events for the first time              | [Inspecting your first failed events](/docs/get-started/failed-events/index.md)                             |
| Find out why a specific event failed              | [Failed event types](/docs/api-reference/failed-events/index.md)                                            |
| See failed event volumes in Console               | [Monitor failed events](/docs/monitoring/index.md)                                                          |
| Get notified when events start failing            | [Set up failed event alerts](/docs/monitoring/alerts/index.md)                                              |
| Query failed events with SQL                      | [Load failed events into warehouse or lake](/docs/monitoring/exploring-failed-events/index.md)              |
| Reprocess failed events                           | [Recover failed events](/docs/monitoring/recovering-failed-events/index.md)                                 |
| Catch failures before they reach production       | [Test your tracking and pipeline](/docs/testing/index.md)                                                      |

## Understand failed events

Each failed event has a type that says which pipeline stage rejected it, such as a schema violation, an enrichment failure, or a loader error. The type tells you where to look for the cause and whether you can recover the event.

* [Introduction to failed events](/docs/fundamentals/failed-events/index.md): what failed events are, and where the pipeline sends them
* [Failed event types](/docs/api-reference/failed-events/index.md): every failed event type, its cause, and whether it can be recovered
* [Inspecting your first failed events](/docs/get-started/failed-events/index.md): send an invalid event to a new pipeline and find it

## Monitor and alert

Console shows failed events in two views. The data quality dashboard reads complete failed events from your warehouse, through an API that runs in your infrastructure. The default view shows redacted aggregates and needs no extra setup. [Monitor failed events](/docs/monitoring/index.md#monitoring-dashboard-comparison) compares them.

* [Monitor failed events](/docs/monitoring/index.md): the data quality dashboard, the default view, and the Console API
* [Set up failed event alerts](/docs/monitoring/alerts/index.md): choose between warehouse-based and classic alerts
  * [Failed event alerts](/docs/monitoring/alerts/failed-event-alerts/index.md), [create alerts](/docs/monitoring/alerts/failed-event-alerts/creating-alerts/index.md), and [manage alerts](/docs/monitoring/alerts/failed-event-alerts/managing-alerts/index.md)
  * [Classic alerts](/docs/monitoring/alerts/classic-alerts/index.md): new failed event notifications and daily digests from telemetry data

## Load and query

To see complete failed events, and to recover them with SQL, load them into your warehouse or lake with a Failed Events Loader. Without a loader, the raw failed events are still in your cloud storage.

* [Load failed events into warehouse or lake](/docs/monitoring/exploring-failed-events/index.md): configure the Failed Events Loader, and query the failed events table
* [Access raw failed events from S3 or GCS buckets](/docs/monitoring/exploring-failed-events/file-storage/index.md): query the files directly with Athena or BigQuery

## Recover failed events

How you recover failed events depends on where they are. If you load them into a table, recover them with SQL. If they're only in S3 or GCS, run a manual recovery job.

* [Recover failed events](/docs/monitoring/recovering-failed-events/index.md): choose a recovery method
* [Recover loaded events from a failed events table with SQL](/docs/monitoring/recovering-failed-events/recover-with-sql/index.md): the recommended method

### Manual recovery from buckets

Manual recovery runs a job that reads failed events from your buckets, applies the fixes you configure, such as replacing or removing values or casting types, and replays the fixed events through your pipeline. Work through the pages in this order:

1. [Event recovery without Failed Events Loader](/docs/monitoring/recovering-failed-events/manual/index.md): when to use manual recovery
2. [Introduction to manual failed event recovery](/docs/monitoring/recovering-failed-events/manual/getting-started/index.md): how a recovery job works
3. [Configure an event recovery job](/docs/monitoring/recovering-failed-events/manual/configuration/index.md), with [configuration examples](/docs/monitoring/recovering-failed-events/manual/configuration/configuration-examples/index.md)
4. [Test an event recovery configuration locally](/docs/monitoring/recovering-failed-events/manual/testing/index.md)
5. [Run event recovery jobs](/docs/monitoring/recovering-failed-events/manual/running/index.md) on [Flink](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md), [GCP Dataflow with Beam](/docs/monitoring/recovering-failed-events/manual/running/gcp-beam/index.md), or [Spark (legacy)](/docs/monitoring/recovering-failed-events/manual/running/spark/index.md)
6. [Monitor event recovery jobs](/docs/monitoring/recovering-failed-events/manual/monitoring/index.md)
7. [Troubleshoot the manual event recovery process](/docs/monitoring/recovering-failed-events/manual/troubleshooting/index.md)

For common recovery scenarios, see [manual event recovery workflows](/docs/monitoring/recovering-failed-events/manual/hints-workflows/index.md). To write your own recovery steps, see [extend and customize an event recovery job](/docs/monitoring/recovering-failed-events/manual/extending/index.md).
