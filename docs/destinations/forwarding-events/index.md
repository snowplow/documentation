---
title: "Event forwarding"
description: "Send Snowplow events to third-party platforms in real-time using Snowplows's managed event forwarding solution with built-in filtering, field mapping, and JavaScript transformations."
sidebar_position: 2
---

Event forwarders let you filter, transform, and send Snowplow events to third-party platforms in real-time. They're separately deployed, fully managed apps that sit alongside warehouse and lake loaders and have a self-serve setup process through BDP Console.

![](./images/event-forwarding-diagram.drawio.svg)

Event forwarding uses [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) under the hood, deployed within your existing Snowplow cloud account, to transform and deliver events reliably. For detailed setup guides and field mappings, check out the list of [available integrations](/docs/destinations/forwarding-events/integrations/index.md). For complex requirements or unsupported destinations, [advanced alternatives](#alternative-approaches) are also available.

## Use cases

Event forwarding works best for use cases where you need low-latency event delivery and don't require complex aggregations across multiple events. For more complex transformations or batch processing, consider using [reverse ETL](/docs/destinations/reverse-etl/) instead.

Event forwarding is a good fit for use cases such as:

- **Real-time personalization**: send events to marketing automation or customer engagement platforms for immediate campaign triggers
- **Product analytics**: forward user actions to analytics tools for real-time product insights
- **A/B testing**: send experiment events to testing platforms for real-time optimization and analytics
- **Fraud detection**: forward security-relevant events to monitoring systems
- **Customer support**: stream events to support platforms for context-aware assistance

## How it works

Event forwarders are deployed as managed Snowbridge apps that consume events from your enriched stream in near real-time. Below is the lifecycle of an event flowing through the system:

1. **Stream consumption**: the event forwarder reads enriched events from your cloud message queue (Kinesis, Pub/Sub, or EventHub) as they're produced by your Snowplow pipeline
2. **Filter evaluation**: each event is evaluated against your configured JavaScript filter expressions to determine if it should be forwarded
3. **Data transformation**: matching events undergo field mapping and any custom JavaScript transformations you've configured, converting Snowplow event data into the format required by your destination API
4. **Delivery attempt**: transformed events are sent to the destination via HTTP API calls with appropriate authentication and headers
5. **Success handling**: successfully delivered events are acknowledged and processing continues to the next event
6. **Failure handling**: failed events follow the configured retry policy, and unrecoverable failures are saved to cloud storage for troubleshooting

The end-to-end latency from event collection to destination delivery is on the order of seconds. Latency depends on overall pipeline event volume, complexity of transformation logic, and destination rate limits.

## Getting started

The following describes the workflow for configuring a new event forwarder.

1. **Create a connection**: configure credentials and endpoint details for your destination
2. **Create a forwarder**: select your pipeline, connection, and event types to forward
    a. **Configure filtering**: define which events to send using JavaScript expressions
    b. **Set up field mapping**: map Snowplow event data to destination API fields
5. **Deploy**: launch the forwarder to begin sending events
6. **Monitor**: track delivery metrics and troubleshoot issues

:::note
Each destination has specific requirements for API credentials, field mappings, and setup steps. See the [supported destinations](#supported-destinations) section below for destination-specific guides.

For detailed information on JavaScript expressions, field transformations, and mapping syntax, see the [filter and mapping reference](/docs/destinations/forwarding-events/reference/index.md).
:::

## Alternative approaches

Event forwarders are the recommended starting point for most real-time delivery use cases. For more complex requirements or unsupported destinations, consider these alternatives:

- **[Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md)**: flexible event routing with custom transformations and destinations (Kafka, Kinesis, HTTP APIs). Use when you need destinations not yet supported by Event Forwarding, complex custom transformations, non-HTTP destinations, or advanced batching and retry configurations.
- **[Google Tag Manager Server Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md)**: use GTM SS to relay enriched events to destinations using rich libraries of tags. Best if your organization is heavily invested in GTM or if you need destinations not yet supported by event forwarders, but supported by GTM SS, such as Google Analytics.
- **[Custom Integrations](/docs/destinations/forwarding-events/custom-integrations/index.md)**: build your own solutions using AWS Lambda, GCP Cloud Functions, or other stream processing systems for fully bespoke requirements.
