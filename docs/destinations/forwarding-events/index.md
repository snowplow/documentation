---
title: "Real-time event forwarding to third-party platforms"
sidebar_label: "Event forwarding"
sidebar_position: 2
description: "Send Snowplow events to third-party platforms in real-time using Snowplow's managed event forwarding solution with built-in filtering, field mapping, and JavaScript transformations."
keywords: ["event forwarding", "real-time delivery", "Snowbridge", "event transformations", "destination APIs"]
---

Event forwarders let you filter, transform, and send Snowplow events to third-party platforms in real-time. They're deployed as fully managed apps that sit alongside warehouse and lake loaders in your Snowplow cloud account. You can configure forwarders through Snowplow Console.

![Event forwarding architecture showing data flow from Snowplow pipeline through forwarders to destination APIs](./images/event-forwarding-diagram.drawio.svg)

Event forwarding uses [Snowbridge](/docs/api-reference/snowbridge/index.md) under the hood, deployed within your existing Snowplow cloud account, to transform and deliver events reliably. For detailed setup guides and field mappings, check out the list of [available integrations](/docs/destinations/forwarding-events/integrations/index.md). For complex requirements or unsupported destinations, [advanced alternatives](#alternative-approaches) are also available.

## Use cases

Event forwarding works best for use cases where you need low-latency event delivery and don't require complex aggregations across multiple events. For more complex transformations or batch processing, consider using [reverse ETL](/docs/destinations/reverse-etl/) instead.

Event forwarding is a good fit for use cases such as:

- **Real-time personalization**: send events to marketing automation or customer engagement platforms for immediate campaign triggers
- **Product analytics**: forward user actions to analytics tools for real-time product insights
- **A/B testing**: send experiment events to testing platforms for real-time optimization and analytics
- **Fraud detection**: forward security-relevant events to monitoring systems
- **Customer support**: stream events to support platforms for context-aware assistance

## How it works

Event forwarders are deployed as managed [Snowbridge](/docs/api-reference/snowbridge/index.md) apps that consume events from your enriched event stream in near real-time. It uses a [JavaScript transformation function](/docs/api-reference/snowbridge/configuration/transformations/custom-scripts/javascript-configuration/index.md) generated from your configuration to filter and transform events.

Here's how forwarders process events:

1. **Read events**: reads enriched events from your stream (Kinesis, Pub/Sub, or EventHub) as the Snowplow pipeline produces them
2. **Apply filters**: checks each event against your configured [JavaScript filters](/docs/destinations/forwarding-events/reference/index.md#event-filtering) to decide whether to forward it
3. **Transform data**: transforms matching events using [field mapping expressions](/docs/destinations/forwarding-events/reference/index.md#field-mapping) and custom JavaScript to convert Snowplow event data into your destination's API format
4. **Delivery handling**: sends transformed events to the destination via HTTP API calls. Retries failures depending on the [failure type](/docs/destinations/forwarding-events/event-forwarding-monitoring-and-troubleshooting/index.md#failure-types-and-handling) and [logs non-retryable failures](/docs/destinations/forwarding-events/event-forwarding-monitoring-and-troubleshooting/index.md#what-happens-when-events-fail) to cloud storage

The end-to-end latency from event collection to destination delivery is on the order of seconds. Latency depends on overall pipeline event volume, complexity of transformation logic, and destination rate limits.

## Getting started

To set up a new event forwarder, you must first create a **connection**, which stores the credentials and endpoint details needed to send events to your destination, and then a **event forwarder** configuration, which defines which pipeline to read events from and the transformations to apply to your events. For a step-by-step guide, see [creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md).

Each destination has its own requirements for API credentials, configuration, and field mappings. See the [available integrations](/docs/destinations/forwarding-events/integrations/index.md) for destination-specific guides.

For detailed information on supported JavaScript expressions, field transformations, and mapping syntax, see the [filter and mapping reference](/docs/destinations/forwarding-events/reference/index.md).

## Alternative approaches

Using event forwarders is the recommended starting point for most real-time delivery use cases. For more complex requirements or unsupported destinations, consider these alternatives:

- **[Snowbridge](/docs/api-reference/snowbridge/index.md)**: flexible event routing with custom transformations and destinations (Kafka, Kinesis, HTTP APIs). Use when you need destinations not yet supported by event forwarders, complex custom transformations, non-HTTP destinations, or advanced batching and retry configurations.
- **[Google Tag Manager Server Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md)**: use GTM SS to relay enriched events to destinations using rich libraries of tags. Best if your organization is heavily invested in GTM or if you need destinations not yet supported by event forwarders, but supported by GTM SS, such as Google Analytics.
- **[Custom integrations](/docs/destinations/forwarding-events/custom-integrations/index.md)**: build your own solutions using AWS Lambda, GCP Cloud Functions, or other stream processing systems for fully bespoke requirements.
