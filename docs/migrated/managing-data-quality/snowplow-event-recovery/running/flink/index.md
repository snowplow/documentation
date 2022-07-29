---
title: "Flink"
date: "2020-04-14"
sidebar_position: 10
---

The Flink job reads bad rows from an S3 location and stores the recovered payloads in Kinesis, unrecovered and unrecoverable in other S3 buckets.

#### Building

To build the fat jar, run:

#### [](https://github.com/snowplow-incubator/snowplow-event-recovery#running)

```
sbt flink/assembly
```

#### Running

Using flink CLI:

```
flink run \
  snowplow-event-recovery-flink-0.2.0.jar \
  --input s3://bad-rows-location/** \
  --output recovered-kinesis-topic \  
  --failedOutput s3://unrecovered-collector-payloads-location/ \
  --unrecoverableOutput s3://unrecoverable-collector-payloads-location/ \
  --config $JOB_CONFIG \
  --resolver $RESOLVER_CONFIG
```
