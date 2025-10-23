---
title: Introduction
position: 1
---

[Shaped.ai](https://shaped.ai) is a ML-based solution to provide personalization, recommendations, and search optimization capabilities to end-users. It can use Snowplow data [to build different use cases](https://docs.shaped.ai/docs/use_cases/overview/).

Shaped.ai offers a [REST API](https://docs.shaped.ai/docs/api), as well as [SDKs for Python and JavaScript](https://docs.shaped.ai/docs/overview/install-sdk), a [CLI in Python](https://docs.shaped.ai/docs/overview/installing-shaped-cli), and a [UI/UX interface (the dashboard)](https://dashboard.shaped.ai/).

This accelerator demonstrates how Snowplow data can be used to feed Shaped.ai models. Any version of Snowplow that supports Snowbridge can be used, such as [Snowplow Local](https://github.com/snowplow-incubator/snowplow-local). For testing purposes, we recommend generating events using one of our examples that work with our out-of-the-box ecommerce events, like our [**Snowplow ecommerce store**](https://github.com/snowplow-industry-solutions/ecommerce-nextjs-example-store).

## Key technologies

* Snowplow: event tracking pipeline (Collector, Enrich, Kinesis sink)
* [Snowbridge](/docs/api-reference/snowbridge/): event forwarding module, part of Snowplow
* AWS Kinesis: message broker, set by Shaped.ai team, to receive events from Snowbridge

### Event capture and ingestion with Snowplow

- E-store front-end and Snowplow JavaScript tracker: user activity is captured as Snowplow ecommerce events
- Snowplow to Shaped.ai: the Snowplow pipeline validates the events, enriches them with device and geolocation data, then forwards them into Shaped.ai AWS Kinesis instance

## Acknowledgements

Thank you to the [Shaped.ai](https://shaped.ai) team for all the support while building this accelerator.
