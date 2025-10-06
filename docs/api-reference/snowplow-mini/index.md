---
title: "Snowplow Mini"
date: "2021-08-14"
sidebar_position: 120
---

[Snowplow Mini](/docs/api-reference/snowplow-mini/index.md) is a single-instance version of Snowplow that primarily serves as a development sandbox, giving you a quick way to debug tracker updates and changes to your schema and pipeline configuration.

:::tip

Snowplow Mini is similar to [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md), with the following differences:
* Micro is more portable and can easily run on your machine or in automated tests.
* Mini has more features, mainly an OpenSearch Dashboards UI, and is better integrated with Snowplow.

:::

You might use Snowplow Mini when:

- You've updated a schema in your Development environment and wish to send some test events against it before promoting it to Production
- You want to enable an Enrichment in a test environment before enabling it on Production

## Getting started

Snowplow users can request a Snowplow Mini instance through Console (go to `“Environments” → “Sandboxes” → “Setup a sandbox”`).

For Community Edition, see the setup guides for [AWS](/docs/api-reference/snowplow-mini/setup-guide-for-aws/index.md) and [GCP](/docs/api-reference/snowplow-mini/setup-guide-for-gcp/index.md).

## Conceptual diagram

![](images/image.png)

The diagram above illustrates how Snowplow Mini (top) works alongside your Production pipeline (bottom).

By pointing your tracker(s) to the Collector on your Snowplow Mini you can send events from your applications development and QA environments to Snowplow Mini for testing.

Once you are happy with the changes you have made you would then change the trackers in your application to point to the Collector on your Production pipeline.[](https://github.com/snowplow/snowplow-mini#features)

## Features of Snowplow Mini

- Data is tracked and processed in real time
- Your Snowplow Mini speaks to your [Schema registries](/docs/fundamentals/schemas/index.md#iglu) to allow events to be sent against your custom schemas
- Data is validated during processing
- Data is loaded into OpenSearch and can be queried directly or through the OpenSearch Dashboard
- Successfully processed events and failed events are in distinct good and bad indexes

## Topology

Snowplow-Mini runs several distinct applications on the same box which are all linked by NSQ topics. In a production deployment each instance could be an Autoscaling Group and each NSQ topic would be a distinct Kinesis Stream.

- Scala Stream Collector:
    - Starts server listening on `http://< sp mini public ip>/` which events can be sent to.
    - Sends "good" events to the `RawEvents` NSQ topic
    - Sends "bad" events to the `BadEvents` NSQ topic
- Stream Enrich:
    - Reads events in from the `RawEvents` NSQ topic
    - Sends events which passed the enrichment process to the `EnrichedEvents` NSQ topic
    - Sends events which failed the enrichment process to the `BadEvents` NSQ topic
- OpenSearch Sink Good:
    - Reads events from the `EnrichedEvents` NSQ topic
    - Sends those events to the `good` OpenSearch index
    - On failure to insert, writes errors to `BadElasticsearchEvents` NSQ topic
- OpenSearch Sink Bad:
    - Reads events from the `BadEvents` NSQ topic
    - Sends those events to the `bad` OpenSearch index
    - On failure to insert, writes errors to `BadElasticsearchEvents` NSQ topic

These events can then be viewed in Kibana at `http://< sp mini public ip>/kibana`.
