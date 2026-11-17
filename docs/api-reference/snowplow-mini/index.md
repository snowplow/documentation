---
title: "Introduction to Snowplow Mini"
sidebar_label: "Snowplow Mini"
date: "2021-08-14"
sidebar_position: 120
description: "Snowplow Mini was a single-instance development environment for testing tracker updates and schema changes. It reached End of Life on November 11, 2026."
keywords: ["snowplow mini", "development environment", "testing environment", "mini setup"]
sidebar_custom_props:
  legacy: true
content_type: concept
---

import SunsetCallout from "/docs/reusable/snowplow-mini-sunset/_callout.md"

<SunsetCallout />

Snowplow Mini was a single-instance version of Snowplow that served as a development environment. It gave you a quick way to debug tracker updates and changes to your schema and pipeline configuration, for example:

- Sending test events against a schema updated in your Development environment, before promoting it to Production
- Enabling an enrichment in a test environment before enabling it on Production

## Conceptual diagram

![Architecture diagram showing Snowplow Mini (dev sandbox) alongside the Production Pipeline. Both receive events from Snowplow SDKs and webhooks via separate dev and prod tracker endpoints. Each pipeline runs Collector, Validate, and Enrich stages; events failing validation are separated out. Mini stores results in Elasticsearch good and bad indexes backed by a dev schema registry, while Production stores results in a data warehouse and bad logs backed by a prod schema registry.](images/image.png)

The diagram above illustrates how Snowplow Mini (top) works alongside your Production pipeline (bottom).

By pointing your tracker(s) to the Collector on your Snowplow Mini you can send events from your applications development and QA environments to Snowplow Mini for testing.

Once you are happy with the changes you have made you would then change the trackers in your application to point to the Collector on your Production pipeline.[](https://github.com/snowplow/snowplow-mini#features)

## Features of Snowplow Mini

- Data is tracked and processed in real time
- Your Snowplow Mini speaks to your [Schema registries](/docs/fundamentals/schemas/index.md#iglu-schema-repository) to allow events to be sent against your custom schemas
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
