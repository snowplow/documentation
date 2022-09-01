---
title: "Beam"
date: "2020-04-14"
sidebar_position: 0
---

The Beam job reads data from a GCS location specified through a pattern and stores the recovered payloads in a PubSub topic, unrecovered and unrecoverable in other GCS buckets.

#### Building

To build the docker image, run:

```
sbt beam/docker:publishLocal
```

#### Running

To run on Apache Beam in GCP Dataflow run it through a docker-deployment like so:

```
docker run \
  snowplow-event-recovery-beam:0.2.0 \
   --runner=DataFlowRunner \
   --job-name=${JOB_NAME} \
   --project=${PROJECT_ID} \
   --zone=${ZONE} \
   --gcpTempLocation=gs://${TEMP_BUCKET_PATH} \
   --inputDirectory=gs://${SOURCE_BUCKET_PATH}/** \
   --outputTopic=${OUTPUT_PUBSUB} \
   --failedOutput=gs://${UNRECOVERED_BUCKET_PATH} \
   --unrecoverableOutput=gs://${UNRECOVERABLE_BUCKET_PATH} \
   --config=${JOB_CONFIG} \
   --resolver=${RESOLVER_CONFIG}
```
