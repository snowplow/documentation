---
title: Introduction
position: 1
---

[AWS Personalize](https://aws.amazon.com/personalize/) is a ML-based solution to provide personalization and recommendations capabilities to end-users. It can use Snowplow data to build different use cases. It may be used with AWS SDKs, and it includes a UI/UX interface with AWS Console.

Some other examples supported by AWS Personalize include:
* Email personalization
* Next best action
* Search personalization
* Media/content recommendations

This accelerator demonstrates how Snowplow data can be used to feed AWS Personalize models. Any version of Snowplow that supports Snowbridge can be used, such as [Snowplow Local](https://github.com/snowplow-incubator/snowplow-local). For testing purposes, we recommend generating events using one of our examples that work with our out-of-the-box ecommerce events, like our [**Snowplow ecommerce store**](https://github.com/snowplow-industry-solutions/ecommerce-nextjs-example-store).

## Key technologies

* Snowplow: event tracking pipeline (Collector, Enrich, Kinesis sink)
* [Snowbridge](/docs/api-reference/snowbridge): event forwarding module, part of Snowplow
* AWS Personalize: the recommender technology
* AWS Lambda: a public endpoint to receive Snowplow events and serve user recommendations, properly disclosing AWS credentials
* Terraform: an Infrastructure-as-Code library, to configure AWS Personalize and its dependent components

Optionally, the following technologies are recommended to complete this tutorial:

* Python: general purpose programming language

### Event capture and ingestion with Snowplow

- E-store front-end and Snowplow JavaScript tracker: user activity is captured as Snowplow ecommerce events
- Snowplow to AWS Lambda to AWS Personalize: the Snowplow pipeline validates the events, enriches them with device and geolocation data, then forwards them into the proper AWS lambda instance, that will feed AWS Personalize
