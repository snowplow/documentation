---
title: "Event Recovery for Community Edition"
sidebar_label: "Manual recovery"
sidebar_position: 40
sidebar_custom_props:
  offerings:
    - community
description: "Manual workflows for recovering failed behavioral events and restoring data quality in your Snowplow pipeline."
schema: "TechArticle"
keywords: ["Manual Recovery", "Event Recovery", "Failed Events", "Data Recovery", "Manual Process", "Event Repair"]
---

Snowplow pipelines are "non-lossy", this means if something is wrong with an event during any part of the pipeline, the event is stored in a separate storage environment rather than just discarded. See the [failed events section](/docs/fundamentals/failed-events/index.md) for more information on the types of failures that may occur.

Besides allowing for the inspection of failed events to fix the root cause of the problem, you have the option to recover data by running a recovery process to correct an issue and "re-play" the events through your pipeline again.

Snowplow Event Recovery is available for pipelines running on AWS and GCP.
