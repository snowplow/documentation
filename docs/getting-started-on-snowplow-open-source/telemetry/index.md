---
title: "Telemetry principles"
date: "2021-07-09"
sidebar_position: 200
---

Telemetry helps us better understand how our applications are used:

* Which applications, clouds and warehouses are more popular than others?
* What are the most common pipeline topologies?
* Are users successful in running our stack over long periods of time?
* And so on.

This data is important for us when deciding where to invest our efforts to build a better product for our users (including you!).

## What data is collected?

In general, we track:
* Heartbeat events that tell us Snowplow applications are alive.
* Events regarding installation, startup, shutdown, etc, of our Terraform modules and applications.
* Metadata such as application version, cloud and region.

You can always disable telemetry if you prefer.

## Our principles

### Privacy

We do not automatically collect any personally identifiable information (PII) other than the IP address of the computer where a Snowplow application or a terraform module is running. This IP address is subsequently pseudonymised using SHA-256 with the [Snowplow PII pseudonymization enrichment](/docs/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/index.md).

### Minimalism

We only ever collect what is required at any given point in time. We do not pre-empt future requirements or collect anything “just in case”. We also make sure telemetry does not affect application performance in any way.

### Transparency

Not only is our telemetry code open source (e.g. this [terraform module](https://github.com/snowplow-devops/terraform-snowplow-telemetry)), you can also inspect the schema we use for our telemetry events [here](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.oss/oss_context/jsonschema/1-0-1).

## How can I help?

It helps our product development immensely if you keep telemetry enabled. We promise to keep it anonymous and as minimal as possible!

We also appreciate if you provide your email (or just a UUID) in the `user_provided_id` (or `userProvidedId`) setting. This allows us to tie events together across resources and offers a more complete picture of how the pipeline has been orchestrated. If you do provide an email address, we will only ever contact you with exciting Product & Engineering updates and Research studies. You can always exercise your right to be forgotten by [contacting us](https://snowplow.io/contact-us/).

## Which components have telemetry?

At the moment, opt-out telemetry is present in the following:
* Terraform modules for Quick Start on [AWS](/docs/getting-started-on-snowplow-open-source/quick-start-aws/index.md) and on [GCP](/docs/getting-started-on-snowplow-open-source/quick-start-gcp/index.md).
* [Collector](/docs/pipeline-components-and-applications/stream-collector/setup/index.md).
* Enrich ([Enrich Kinesis](/docs/pipeline-components-and-applications/enrichment-components/enrich-kinesis/index.md), [Enrich PubSub](/docs/pipeline-components-and-applications/enrichment-components/enrich-pubsub/index.md), [Enrich Kafka](/docs/pipeline-components-and-applications/enrichment-components/enrich-kafka/index.md), [Enrich RabbitMQ](/docs/pipeline-components-and-applications/enrichment-components/enrich-rabbitmq/index.md)).
* RDB Loader ([Transofmer Kinesis](/docs/destinations/warehouses-and-lakes/rdb/transforming-enriched-data/stream-transformer/transformer-kinesis/index.md), [Transformer PubSub](/docs/destinations/warehouses-and-lakes/rdb/transforming-enriched-data/stream-transformer/transformer-pubsub/index.md), [Redshift Loader](/docs/destinations/warehouses-and-lakes/rdb/loading-transformed-data/redshift-loader/index.md), [Snowflake Loader](/docs/destinations/warehouses-and-lakes/rdb/loading-transformed-data/snowflake-loader/index.md), [Databricks Loader](/docs/destinations/warehouses-and-lakes/rdb/loading-transformed-data/databricks-loader/index.md)).
* Snowplow Mini for [AWS](/docs/pipeline-components-and-applications/snowplow-mini/setup-guide-for-aws/index.md) and [GCP](/docs/pipeline-components-and-applications/snowplow-mini/setup-guide-for-gcp/index.md).
* [Snowbridge](/docs/pipeline-components-and-applications/snowbridge/getting-started/distribution-and-deployment.md).


See the telemetry notice for each component linked above for more details.
