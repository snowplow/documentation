---
title: "Event Recovery for Open Source"
date: "2020-03-02"
sidebar_position: 40
---

Snowplow pipelines are non-lossy, so if something goes fails during the processing of an event the event payload and associated failure message is stored in bad rows storage, be it a data stream or object storage.

The goal of recovery is to fix the payloads contained in these bad rows so that they are ready to be processed successfully by a Snowplow enrichment platform.

Snowplow Event Recovery lets you run data recoveries on data emitted by real-time Snowplow pipelines on AWS and GCP.
