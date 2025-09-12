---
title: "Collector"
description: "Snowplow Stream Collector API reference for behavioral event collection and real-time data ingestion."
schema: "TechArticle"
keywords: ["Stream Collector", "Event Collection", "Data Ingestion", "Collection Pipeline", "Event Ingestion", "Collector Component"]
date: "2020-11-02"
sidebar_position: 20
---

The collector receives raw Snowplow events sent over HTTP by [trackers](/docs/sources/trackers/index.md) or [webhooks](/docs/sources/webhooks/index.md). It serializes them, and then writes them to a sink. Currently supported sinks are:

1. [Amazon Kinesis](http://aws.amazon.com/kinesis/)
2. [Google PubSub](https://cloud.google.com/pubsub/)
3. [Apache Kafka](http://kafka.apache.org/)
4. [NSQ](http://nsq.io/)
5. [Amazon SQS](https://aws.amazon.com/sqs/)
6. `stdout` for a custom stream collection process

The collector supports cross-domain Snowplow deployments, setting a `user_id` (used to identify unique visitors) server side to reliably identify the same user across domains.

## How it works

### User identification

The collector allows the use of a third-party cookie, making user tracking across domains possible.

In a nutshell: the collector receives events from a tracker, sets/updates a third-party user tracking cookie, and returns the pixel to the client. The ID in this third-party user tracking cookie is stored in the `network_userid` field in Snowplow events.

In pseudocode terms:

```text
if (request contains an "sp" cookie) {
    Record that cookie as the user identifier
    Set that cookie with a now+1 year cookie expiry
    Add the headers and payload to the output array
} else {
    Set the "sp" cookie with a now+1 year cookie expiry
    Add the headers and payload to the output array
}
```

## Technical architecture

The collector is written in scala and built on top of [http4s](https://http4s.org).

[GitHub repository](https://github.com/snowplow/stream-collector)
