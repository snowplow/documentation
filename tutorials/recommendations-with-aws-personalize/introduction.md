---
title: Introduction
position: 1
---

[AWS Personalize](https://shaped.ai) is a ML-based solution to provide personalization and recommendations capabilities to end-users. It can use Snowplow data to build different use cases. It may be used with AWS SDKs, and it counts with a UI/UX interface with AWS Console.

This accelerator demonstrates how Snowplow data can be used to feed AWS Personalize models. Any version of Snowplow that supports Snowbridge can be used, such as [Snowplow Local](https://github.com/snowplow-incubator/snowplow-local). For testing purposes, we recommend generating events using one of our examples that work with our out-of-the-box ecommerce events, like our [**Snowplow ecommerce store**](https://github.com/snowplow-industry-solutions/ecommerce-nextjs-example-store). 

## Key technologies

* Snowplow: event tracking pipeline (Collector, Enrich, Kinesis sink)
* Snowbridge: event forwarding module, part of Snowplow
* AWS Lambda: a public endpoint to receive Snowplow events and serve user recommendations, properly disclosing AWS credentials

### Event capture and ingestion with Snowplow

- E-store front-end and Snowplow JavaScript tracker: user activity is captured as Snowplow ecommerce events
- Snowplow to Shaped.ai: the Snowplow pipeline validates the events, enriches them with device and geolocation data, then forwards them into AWS instance
