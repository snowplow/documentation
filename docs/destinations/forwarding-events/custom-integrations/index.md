---
title: "Custom integrations"
description: "Build custom consumers for Snowplow event streams using AWS Lambda, GCP Cloud Functions, KCL applications, or Pub/Sub client libraries to integrate with any third-party platform."
sidebar_position: 60
---

Snowplow is underpinned by Event Streams, either AWS Kinesis, GCP PubSub or Apache Kafka. Before a Snowplow pipeline loads the events to a Data Warehouse, the enriched events are available on a stream and a custom consumer can be built to consume these events. Below we describe some high level concepts which can be used to consume the enriched event streams.

## Transforming the Enriched Stream to JSON

The Snowplow events in the Enriched stream are in a tab separated format (TSV) by default. Many downstream consumers will prefer this data in JSON format, and the Snowplow Analytics SDKs have been built to help with this.

- [Snowplow Analytics SDKs](/docs/api-reference/analytics-sdk/index.md)

## AWS Lambda and GCP Cloud Functions

[AWS Lambdas](https://aws.amazon.com/lambda/) and [GCP Cloud Functions](https://cloud.google.com/functions/) are server-less platforms that allow you to write applications that can be triggered by events from Kinesis and PubSub respectively. By configuring a function to be triggered by an event, it is possible to write applications that take the Snowplow events, perform transformations and other processing, then relay that event into another system.

Server-less functions are an easy way to approach building real time consumers of the event stream for those use cases which require fast action or decisioning based on incoming events (For example, Ad Bidding, Paywall Optimization, Real-time reporting, etc).

## Kinesis Client Library (KCL) applications

The KCL (Kinesis Consumer Library) allows for applications to be built to consume from AWS Kinesis. It makes use of AWS DynamoDB to keep track of shards in the data stream, and makes it far easier to consume from Kinesis than would otherwise be possible.

There is comprehensive documentation on building Amazon KCL apps within the [AWS Documentation](https://docs.aws.amazon.com/streams/latest/dev/shared-throughput-kcl-consumers.html).

## Pub/Sub client library applications

The Pub/Sub client libraries allow for applications to be built to consume from GCP Pub/Sub. It makes it easy to build against and consume events in Pub/Sub streams, ultimately making it far easier to consume from Pub/Sub than would otherwise be possible.

There is comprehensive documentation on building GCP Pub/Sub client library apps within the [GCP Documentation](https://cloud.google.com/pubsub/docs/reference/libraries).
