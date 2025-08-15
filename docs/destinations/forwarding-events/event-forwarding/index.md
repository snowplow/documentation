---
title: "Event Forwarding"
sidebar_position: 0
---

Event Forwarding lets you send Snowplow events in real-time to third-party SaaS tools via HTTP APIs directly from the Snowplow Console.

Rather than deploying and managing separate infrastructure for each destination, you can configure event forwarding with filters, field mappings, and custom JavaScript transformations through a simple interface. Event Forwarding uses [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) under the hood, deployed within your existing Snowplow cloud account, to transform and deliver events reliably.

## Use cases

Event Forwarding is ideal for:

- **Real-time personalization**: Send events to marketing tools like Braze or customer engagement platforms for immediate campaign triggers
- **Product analytics**: Forward specific user actions to analytics tools like Amplitude for product insights
- **Customer support**: Stream events to support platforms for context-aware assistance
- **A/B testing**: Send experiment events to testing platforms for real-time optimization
- **Fraud detection**: Forward security-relevant events to monitoring systems

Event Forwarding works best for use cases where you need low-latency event delivery and don't require complex aggregations across multiple events. For more complex transformations or batch processing, consider using [reverse ETL](/docs/destinations/reverse-etl/) instead.

## How it works

Event Forwarding operates on your enriched event stream through the following steps:

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

## Error handling and troubleshooting

### Failure types and retry logic

Event Forwarding uses the same retry logic and failure handling as the underlying [Snowbridge failure model](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md). The system handles different failure types:

- **Invalid data failures**: Events that fail transformation or violate destination API requirements are treated as unrecoverable. These create [event forwarding error failed events](https://iglucentral.com/?q=event_forwarding_error) and are sent to your  failure destination without retry.

- **Transformation failures**: JavaScript transformation errors are treated as invalid data and create failed events without retry.

- **Destination failures**: When API requests fail (e.g., HTTP 4xx/5xx responses), the system retries based on the destination-specific retry policy. See the [destinations overview](destinations/) for destination-specific details.

- **Oversized data failures**: Events exceeding destination size limits create [size violation failed events](docs/api-reference/failed-events/index.md) and are sent to the failure destination without retry.

Failed events are automatically routed to your configured failure destination (typically your cloud storage bucket) where they can be inspected. For how to query these metrics, see [Inspecing and debugging failures](#inspecting-and-debugging-failures).

### Monitoring and metrics

TODO: add details on how to find these metrics in cloudwatch

You can monitor your Event Forwarding deployment using these tools:

- **Console metrics**: View high-level delivery statistics in the Snowplow Console
- **Cloud monitoring metrics**: Track detailed performance metrics in your cloud platform
- **Failed event logs**: Review detailed errors in your cloud storage bucket

Event Forwarding produces detailed metrics in your cloud account:

- **AWS**: CloudWatch metrics under `snowplow/event-forwarding` namespace
- **GCP**: Cloud Monitoring metrics with `snowplow_event_forwarding` prefix

**Key metrics to monitor:**

- `target_success`: Events successfully delivered to destinations
- `target_failed`: Events that failed delivery and were retried
- `message_filtered`: Events filtered out by your criteria
- `failure_target_success`: Events routed to failure destination after unrecoverable errors

### Inspecting and debugging failures

Failed events are automatically stored in your Snowplow cloud storage bucket under the prefix:
`/{pipeline_name}/partitioned/com.snowplowanalytics.snowplow.badrows.event_forwarding_errors/`

Failed event follow [event_forwarding_error schema](https://iglucentral.com/?q=event_forwarding_error) and contain:

- **Original event data**: The complete Snowplow event that failed
- **Error details**: Specific error type and message
- **Failure timestamp**: When the error occurred
- **Transformation state**: Data state at the point of failure

TODO: add link to athena queries https://snplow.atlassian.net/browse/PDP-1939?focusedCommentId=125579

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

Event Forwarding currently supports:

- **[Braze](destinations/braze.md)**: User tracking, custom events, and purchases
- **Amplitude**: Event analytics and user behavior tracking

For destinations not yet supported, use [Snowbridge](/docs/destinations/forwarding-events/snowbridge/) or [custom integrations](/docs/destinations/forwarding-events/custom-integrations/).