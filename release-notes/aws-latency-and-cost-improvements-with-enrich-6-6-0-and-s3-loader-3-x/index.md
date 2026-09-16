---
title: "[AWS] Latency and cost improvements with Enrich 6.6.0 and S3 Loader 3.x"
description: "We have recently released Enrich 6.6.0."
date: "2026-02-06"
category:
  - "Release notes"
components:
  - "Pipeline components"
  - "Destinations"
platforms:
  - "AWS"
---
> This notice only applies to AWS customers.

### Enrich 6.6.0

We have recently released Enrich 6.6.0. On AWS, this version **reduces the** _**median**_ **latency by 25–65%**, as measured between receiving the event in the Collector and writing it to the enriched stream. This is a meaningful improvement for real-time use cases, including Event Forwarding and Signals.

Enrich 6.6.0 is already rolled out to Snowplow CDI customers. As usual, self-hosted customers can find the new version on Docker Hub.

### S3 Loader 3.x

We completely overhauled the S3 Loader in version 3.0.0 (and more recently 3.1.0). As a result, you can expect a significantly improvement performance, with an **up to 90% reduction in vCPUs** for the same load in some cases. This leads to a more efficient infrastructure and lower costs.

The newest versions of S3 Loader are already rolled out to Snowplow CDI customers. Self-hosted customers can find release on Docker Hub.
