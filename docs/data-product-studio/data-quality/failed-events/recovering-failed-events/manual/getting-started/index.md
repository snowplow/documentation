---
title: "Getting Started"
date: "2020-07-22"
sidebar_position: 0
---

Event recovery at its core, is the ability to fix events that have failed and replay them through your pipeline.

After inspecting failed events either in [Snowplow Console](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md), or in the [partitioned failure buckets](/docs/data-product-studio/data-quality/failed-events/exploring-failed-events/file-storage/index.md), you can determine which events are possible to recover based on what the fix entails.

With recovery it is possible to:

- replace values - e.g. correct a typo in a schema name for validation
- remove values - e.g. remove improperly encoded values from a URL string
- cast JSON types - e.g. change a property's type from `string` to `integer`

If your failed events would not be fixed by applying the above, they currently would be considered unrecoverable. Due to the fact that there might be a mix of recoverable and unrecoverable data in your storage, event recovery uses configuration in order to process only a subset of the failed events.

### What you'll need to get started

The typical flow for recovery and some prerequisites to consider would be:
**Understanding the failure issue**

- Familiarity with the [failed event types](/docs/fundamentals/failed-events/index.md)
- Access to S3 or GCS buckets with failed events

**Configuring a recovery**

- Understanding the [configuration structure](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/manual/configuration/index.md)
- Comfort with using Regular Expressions (RegEx)

**Testing the configuration**

- Ability to edit/run a Scala script locally

**Run the recovery**

- AWS sub account or GCP project admin access in order to create a recovery user

**Monitor the recovery**

- Access to DataFlow UI (GCP) or EMR reporting (AWS)
