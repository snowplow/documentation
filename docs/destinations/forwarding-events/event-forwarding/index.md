---
title: "Event Forwarding"
sidebar_position: 0
---

## Overview

Event Forwarding lets you send Snowplow events in real-time to third-party platforms. 

You can configure event forwarding with filters, field mappings, and custom JavaScript transformations through BDP Console. Event Forwarding uses [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) under the hood, deployed within your existing Snowplow cloud account, to transform and deliver events reliably.

## Use cases

Event Forwarding is ideal for:

- **Real-time personalization**: Send events to marketing automation or customer engagement platforms for immediate campaign triggers
- **Product analytics**: Forward specific user actions to analytics tools for real-time product insights
- **A/B testing**: Send experiment events to testing platforms for real-time optimization and analytics
- **Fraud detection**: Forward security-relevant events to monitoring systems
- **Customer support**: Stream events to support platforms for context-aware assistance

Event Forwarding works best for use cases where you need low-latency event delivery and don't require complex aggregations across multiple events. For more complex transformations or batch processing, consider using [reverse ETL](/docs/destinations/reverse-etl/) instead.

## How it works

Event Forwarding reads data from your enriched event stream and does the following:

1. **Event filtering**: Define which events to forward using JavaScript expressions
2. **Field mapping**: Configure how Snowplow data maps to destination API fields
3. **Transformation**: Apply custom JavaScript functions for complex data transformations
4. **Delivery**: Send events via HTTP API calls with built-in retry logic
5. **Monitoring**: Track delivery success and failures through metrics

The system processes events in near real-time, typically with latency on the order of seconds from event collection to delivery.

## Setup overview

To set up Event Forwarding, complete these steps:

1. **Create a connection**: Configure credentials and endpoint details for your destination
2. **Create a forwarder**: Select your pipeline, connection, and event types to forward
3. **Configure filtering**: Define which events to send using JavaScript expressions
4. **Set up field mapping**: Map Snowplow event data to destination API fields
5. **Deploy**: Launch the forwarder to begin sending events
6. **Monitor**: Track delivery metrics and troubleshoot issues

Each destination has specific requirements for API credentials, field mappings, and setup steps. See the [destinations overview](destinations/) for destination-specific guides.



## Event Forwarding vs alternatives

### When to use Event Forwarding

Choose Event Forwarding when you need:
- Low-latency event delivery (under 30 seconds)
- Simple event filtering and field mapping
- Pre-built integrations with supported destinations
- Minimal infrastructure management

### When to use Snowbridge

Consider [Snowbridge](/docs/destinations/forwarding-events/snowbridge/) for:
- Destinations not yet supported by Event Forwarding
- Complex custom transformations
- Non-HTTP destinations (Kafka, Kinesis, PubSub)
- Advanced batching and retry configurations

### When to use GTM Server-Side

Consider [Google Tag Manager Server-Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/) for:
- Organizations heavily invested in GTM workflows
- Complex tag management requirements
- Custom GTM server-side tags

## Supported destinations

TODO