---
title: "Set up an SQS buffer"
date: "2021-08-04"
sidebar_position: 100
---

The lack of auto-scaling in Kinesis results in throttled streams in case of traffic spikes and Stream Collector starts accumulating events to retry them later. If accumulation continues long enough, Stream Collector will run out of memory. To prevent the possibility of a broken collector, we decided to make it possible to configure an SQS buffer which can provide additional assurance during extreme traffic spikes.

SQS is used to queue any message that Stream Collector failed to send to the Kinesis and the [`sqs2kinesis` application](/docs/migrated/pipeline-components-and-applications/sqs2kinesis/) is then responsible for reading the messages from SQS and writing to Kinesis once it is ready. In the event of any AWS API glitches, there is a retry mechanism which retries sending the SQS queue 10 times.

The keys set up for the Kinesis stream are stored as SQS message attributes in order to preserve the information. Note, the SQS messages cannot be as big as Kinesis messages. The limit is 256kB per message, but we send the messages as Base64 encoded, so the limit goes down to 192kB for the original message.

#### Setting up the SQS queues

(This section only applies to the case when SQS is used as a fallback sink when Kinesis is unavailable. If you are using SQS as the primary sink, then the settings below should be ignored and the `good` and `bad` streams should be configured as normal under `streams.good` and `streams.bad` respectively.)

To start using this feature, you will first need to set up the SQS queues. Two separate queues are required for good (raw) events and bad events. The Collector then needs to be informed about the queue names, and this can be done by adding these as entries to `config.hocon:`

```
sqsGoodBuffer = {good-sqs-queue-url}
sqsBadBuffer = {bad-sqs-queue-url}
```
