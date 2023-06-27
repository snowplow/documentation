---
title: "Event Recovery for Open Source"
date: "2020-07-02"
sidebar_label: "Using Flink/Spark"
sidebar_position: 40
sidebar_custom_props:
  offerings:
    - opensource
---

Snowplow pipelines are "non-lossy", this means if something is wrong with an event during any part of the pipeline, the event is stored in a separate storage environment rather than just discarded. See the [failed events section](/docs/understanding-your-pipeline/failed-events/index.md) for more information on the types of failures that may occur.

Besides allowing for the inspection of failed events to fix the root cause of the problem, you have the option to recover data by running a recovery process to correct an issue and "re-play" the events through your pipeline again.

Snowplow Event Recovery is available for pipelines running on AWS and GCP.
