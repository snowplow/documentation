---
title: "Snowplow reference"
sidebar_label: "Reference overview"
date: "2020-03-24"
sidebar_position: 9
description: "Look up Snowplow APIs, SDKs, component configuration, schemas, and version compatibility, including configuration details for self-hosted deployments."
keywords: ["API reference", "technical documentation", "Snowplow components", "self-hosted configuration"]
---

Use the reference to look up APIs, SDKs, component configuration, and schemas. For task-based guides, start from [Snowplow CDI](/docs/introduction.md) or [Signals](/docs/signals/introduction/index.md) instead.

## APIs and SDKs

These pages describe the interfaces you call from your own code or scripts:

* [Console API](https://console.snowplowanalytics.com/api/msc/v1/docs/): manage your Snowplow account and pipeline programmatically
* [Snowplow Micro REST API](/docs/api-reference/snowplow-micro/api/index.md): query the events that Micro has received
* [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md): manage data structures and tracking plans from the command line
* [Tracker API documentation](/docs/api-reference/trackers/index.md): generated API reference for each tracker SDK
* [Analytics SDKs](/docs/api-reference/analytics-sdk/index.md): parse enriched events in Scala, JavaScript, Go, Python, or .NET

## Component configuration

These pages cover setup and configuration for each pipeline component, for self-hosted deployments and for reference on Snowplow CDI:

* [Collector](/docs/api-reference/stream-collector/index.md)
* [Enrich](/docs/api-reference/enrichment-components/index.md)
* [Warehouse and lake loaders](/docs/api-reference/loaders-storage-targets/index.md)
* [Snowbridge](/docs/api-reference/snowbridge/index.md)
* [Iglu schema registry](/docs/api-reference/iglu/index.md)
* [Snowplow Mini](/docs/api-reference/snowplow-mini/index.md)
* [Dataflow Runner](/docs/api-reference/dataflow-runner/index.md)

## Schemas, versions, and legacy versions

* [JSON Schema reference](/docs/api-reference/json-schema-reference/index.md): the JSON Schema features that Snowplow schemas support
* [Failed event types](/docs/api-reference/failed-events/index.md): the structure of each failed event type
* [Versions and compatibility](/docs/api-reference/versions/index.md): the latest version of each component, and which versions work together

Documentation for previous versions of trackers and components is under **Legacy** in the reference sidebar. Each page links to the latest version.
