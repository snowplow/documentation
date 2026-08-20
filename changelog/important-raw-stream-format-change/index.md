---
title: "IMPORTANT: raw stream format change"
description: "Starting in September 2025, we are planning to introduce data compression in the raw stream."
date: "2025-08-04"
update_type:
  - "Maintenance notification"
components:
  - "Pipeline components"
---
> This notice applies to all Private Managed Cloud (PMC) customers.

Starting in September 2025, we are planning to introduce data compression in the `raw` stream. This should reduce the costs associated with the streaming service (Kinesis on AWS, Pub/Sub on GCP, Event Hubs on Azure), especially for pipelines processing more than 1B events per month.

**Compression will change the data format in the** `raw` **stream. If you are reading data directly from it, please let us know as soon as possible by contacting the Support Team (support\@snowplow\.io).**

Note that unlike the `enriched` stream, the `raw` stream is not considered a stable “API”, and with a very few exceptions we are not aware of its usage outside of the Snowplow-internal components.
