---
title: "Event forwarding"
description: "Send Snowplow events to third-party platforms in real-time using Snowplows's managed event forwarding solution with built-in filtering, field mapping, and JavaScript transformations."
sidebar_position: 2
---

Event Forwarding is the recommended approach for sending Snowplow events to third-party platforms in real-time. It provides a simple, managed solution through BDP Console with built-in filtering, field mapping, and JavaScript transformations. For detailed setup guides and field mappings, check out the list of [available integrations](/docs/destinations/forwarding-events/integrations/index.md).

Event Forwarding uses [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) under the hood, deployed within your existing Snowplow cloud account, to transform and deliver events reliably. For complex requirements or unsupported destinations, [advanced alternatives](#alternative-approaches) are available.

## Use cases

Event Forwarding works best for use cases where you need low-latency event delivery and don't require complex aggregations across multiple events. For more complex transformations or batch processing, consider using [reverse ETL](/docs/destinations/reverse-etl/) instead. 

Event Forwarding is a good fit for use cases such as:

- **Real-time personalization**: send events to marketing automation or customer engagement platforms for immediate campaign triggers
- **Product analytics**: forward specific user actions to analytics tools for real-time product insights
- **A/B testing**: send experiment events to testing platforms for real-time optimization and analytics
- **Fraud detection**: forward security-relevant events to monitoring systems
- **Customer support**: stream events to support platforms for context-aware assistance

## How it works

Event Forwarders are deployed as managed Snowbridge apps that consume events from your your enriched stream in near real-time. Below is the lifecycle of an event flowing through the system:

1. **Stream consumption**: the event forwarder reads enriched events from your cloud message queue (Kinesis, Pub/Sub, or EventHub) as they're produced by your Snowplow pipeline
2. **Filter evaluation**: each event is evaluated against your configured JavaScript filter expressions to determine if it should be forwarded
3. **Data transformation**: matching events undergo field mapping and any custom JavaScript transformations you've configured, converting Snowplow event data into the format required by your destination API
4. **Delivery attempt**: transformed events are sent to the destination via HTTP API calls with appropriate authentication and headers
5. **Success handling**: successfully delivered events are acknowledged and processing continues to the next event
6. **Failure handling**: failed events follow the configured retry policy, and unrecoverable failures are routed to your failure destination for inspection

The entire process typically completes within seconds of the original event collection, enabling near real-time use cases.

## Getting started

The following describes the workflow for configuring a new Event Forwarder.

1. **Create a connection**: configure credentials and endpoint details for your destination
2. **Create a forwarder**: select your pipeline, connection, and event types to forward
3. **Configure filtering**: define which events to send using JavaScript expressions
4. **Set up field mapping**: map Snowplow event data to destination API fields
5. **Deploy**: launch the forwarder to begin sending events
6. **Monitor**: track delivery metrics and troubleshoot issues

:::note
Each destination has specific requirements for API credentials, field mappings, and setup steps. See the [supported destinations](#supported-destinations) section below for destination-specific guides.

For detailed information on JavaScript expressions, field transformations, and mapping syntax, see the [filter and mapping reference](/docs/destinations/forwarding-events/reference/index.md).
:::

## Error handling and troubleshooting

### Failure types and retry logic

Event Forwarding uses the same retry logic and failure handling as the underlying [Snowbridge failure model](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md). The system handles different failure types:

- **Invalid data failures**: events that fail transformation or violate destination API requirements are treated as unrecoverable. These create [event forwarding error failed events](https://iglucentral.com/?q=event_forwarding_error) and are sent to your  failure destination without retry.

- **Transformation failures**: JavaScript transformation errors are treated as invalid data and create failed events without retry.

- **Destination failures**: when API requests fail (e.g., HTTP 4xx/5xx responses), the system retries based on the destination-specific retry policy. See the list of [available destinations](/docs/destinations/forwarding-events/integrations/index.md) for destination-specific details.

- **Oversized data failures**: events exceeding destination size limits create [size violation failed events](docs/api-reference/failed-events/index.md) and are sent to the failure destination without retry.

Failed events are automatically routed to your configured failure destination (typically your cloud storage bucket) where they can be inspected. For how to query these metrics, see [Inspecing and debugging failures](#inspecting-and-debugging-failures).

### Monitoring and metrics

<!-- TODO: add details on how to find these metrics in cloudwatch -->

You can monitor your Event Forwarding deployment in a few ways:

- **Console metrics**: view high-level delivery statistics in the Snowplow Console. You can see filtered, failed, and successfuly delivered events over the last 7 days.
- **Cloud monitoring metrics**: track detailed performance metrics in your cloud platform.
- **Failed event logs**: review detailed errors in your cloud storage bucket.

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

- **Original event data**: the complete Snowplow event that failed
- **Error details**: specific error type and message
- **Failure timestamp**: when the error occurred
- **Transformation state**: data state at the point of failure

<!-- TODO: add link to athena queries https://snplow.atlassian.net/browse/PDP-1939?focusedCommentId=125579 -->

## Alternative approaches

Event Forwarding is the recommended starting point for most real-time forwarding use cases. For more complex requirements or unsupported destinations, consider these alternatives:

- **[Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md)**: flexible event forwarding with custom transformations and destinations (Kafka, Kinesis, HTTP APIs). Use when you need destinations not yet supported by Event Forwarding, complex custom transformations, non-HTTP destinations, or advanced batching and retry configurations.
- **[Google Tag Manager Server Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md)**: use GTM SS to relay enriched events to destinations using rich libraries of tags. Best if your organization is heavily invested in GTM or if you need destinations not yet supported by Event Forwarding, but supported by GTM SS, such as Google Analytics.
- **[Custom Integrations](/docs/destinations/forwarding-events/custom-integrations/index.md)**: build your own solutions using AWS Lambda, GCP Cloud Functions, or other stream processing systems for fully bespoke requirements.
