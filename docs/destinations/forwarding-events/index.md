---
title: "Event forwarding"
sidebar_position: 2
---

Snowplow supports multiple approaches to forward events to third-party platforms in real-time. Choose the approach that best fits your use case and technical requirements.

## Event Forwarding (Recommended)

[Event Forwarding](event-forwarding/index.md) provides a simple, managed solution for sending events to popular SaaS platforms directly from the Snowplow Console.

- **Pre-built integrations**: Braze, Amplitude, and more coming soon
- **Easy configuration**: Set up through Console with filtering and field mapping
- **Reliable delivery**: Built-in retries and error handling
- **Low latency**: Near real-time event delivery

Event Forwarding is best for most real-time forwarding use cases, especially when sending to supported destinations.

## Advanced options

For more complex requirements or unsupported destinations, choose from these advanced options:

- **[Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md)**: Flexible event forwarding with custom transformations and destinations (Kafka, Kinesis, HTTP APIs)
- **[Google Tag Manager Server Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md)**: Tag-based event forwarding for GTM workflows (Amplitude, Braze, Iterable)
- **[Custom Integrations](/docs/destinations/forwarding-events/custom-integrations/index.md)**: Build your own solutions using AWS Lambda, GCP Cloud Functions, or stream processing
