---
title: "Event forwarding"
sidebar_position: 2
---

## Overview 

Event Forwarding is the recommended approach for sending Snowplow events to third-party platforms in real-time. It provides a simple, managed solution through BDP Console with built-in filtering, field mapping, and JavaScript transformations.

Event Forwarding uses [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) under the hood, deployed within your existing Snowplow cloud account, to transform and deliver events reliably. For complex requirements or unsupported destinations, [advanced alternatives](#alternative-approaches) are available.

## Use cases

Event Forwarding is ideal for:

- **Real-time personalization**: Send events to marketing automation or customer engagement platforms for immediate campaign triggers
- **Product analytics**: Forward specific user actions to analytics tools for real-time product insights
- **A/B testing**: Send experiment events to testing platforms for real-time optimization and analytics
- **Fraud detection**: Forward security-relevant events to monitoring systems
- **Customer support**: Stream events to support platforms for context-aware assistance

Event Forwarding works best for use cases where you need low-latency event delivery and don't require complex aggregations across multiple events. For more complex transformations or batch processing, consider using [reverse ETL](/docs/destinations/reverse-etl/) instead.

## How it works

Event Forwarding operates as a managed Snowbridge deployment that consumes your enriched event stream in near real-time. Here's the lifecycle of an event flowing through the system:

1. **Stream consumption**: Event Forwarding reads enriched events from your cloud message queue (Kinesis, Pub/Sub, or EventHub) as they're produced by your Snowplow pipeline
2. **Filter evaluation**: Each event is evaluated against your configured JavaScript filter expressions to determine if it should be forwarded
3. **Data transformation**: Matching events undergo field mapping and any custom JavaScript transformations you've configured, converting Snowplow event data into the format required by your destination API
4. **Delivery attempt**: Transformed events are sent to the destination via HTTP API calls with appropriate authentication and headers
5. **Success handling**: Successfully delivered events are acknowledged and processing continues to the next event
6. **Failure handling**: Failed events follow the configured retry policy, and unrecoverable failures are routed to your failure destination for inspection

The entire process typically completes within seconds of the original event collection, enabling near real-time use cases.

## Getting Started

To set up Event Forwarding, complete these steps:

1. **Create a connection**: Configure credentials and endpoint details for your destination
2. **Create a forwarder**: Select your pipeline, connection, and event types to forward
3. **Configure filtering**: Define which events to send using JavaScript expressions
4. **Set up field mapping**: Map Snowplow event data to destination API fields
5. **Deploy**: Launch the forwarder to begin sending events
6. **Monitor**: Track delivery metrics and troubleshoot issues

:::note
Each destination has specific requirements for API credentials, field mappings, and setup steps. See the [supported destinations](#supported-destinations) section below for destination-specific guides.

For detailed information on JavaScript expressions, field transformations, and mapping syntax, see the [filter and mapping reference](/docs/destinations/forwarding-events/reference/index.md).
:::



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

You can monitor your Event Forwarding deployment in a few ways:

- **Console metrics**: View high-level delivery statistics in the Snowplow Console.You can see filtered, failed, and successfuly delivered events over the last 7 days
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

<!-- TODO: add link to athena queries https://snplow.atlassian.net/browse/PDP-1939?focusedCommentId=125579 -->

## Supported destinations

Event Forwarding supports third-party destinations through pre-built integrations that handle authentication, field mapping, and API-specific requirements. For detailed setup guides and field mappings, see [native integrations](/docs/destinations/forwarding-events/integrations/index.md).

## Alternative approaches

Event Forwarding is the recommended starting point for most real-time forwarding use cases. For more complex requirements or unsupported destinations, consider these alternatives:

- **[Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md)**: Flexible event forwarding with custom transformations and destinations (Kafka, Kinesis, HTTP APIs). Use when you need destinations not yet supported by Event Forwarding, complex custom transformations, non-HTTP destinations, or advanced batching and retry configurations.

- **[Google Tag Manager Server Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md)**: Use GTM SS to relay enriched events to destinations using rich libraries of tags. Best if your organization is heavily invested in GTM or if you need destinations not yet supported by Event Forwarding, but supported by GTM SS, such as Google Analytics.

- **[Custom Integrations](/docs/destinations/forwarding-events/custom-integrations/index.md)**: Build your own solutions using AWS Lambda, GCP Cloud Functions, or other stream processing systems for fully bespoke requirements.
