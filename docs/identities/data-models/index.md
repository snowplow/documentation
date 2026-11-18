---
title: "Identities data models"
sidebar_label: "Data models"
sidebar_position: 4
description: "The Snowplow Identities dbt package provides incremental models for identity resolution, mapping, and audit."
keywords: ["identities", "dbt", "identity resolution", "data model"]
date: "2026-03-05"
content_type: landing
---

Identities includes a [dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md) to help you get value from your [Identities data](/docs/identities/concepts/index.md#data-types). It transforms the raw identity entities and merge events in your warehouse into a set of derived tables for identity resolution, identifier lookup, and audit.

The Identities dbt package is currently standalone from our other dbt packages.

The package reads identity entities and merge events, not [correction events](/docs/identities/concepts/index.md#correction-events). It still sees each late merge, because Identities also emits a merge event for it. A correction event carries the same `snowplow_id`, `merges`, and `merged` fields as a merge event, so you can process `identity_correction` events in your own models in the same way as merge events. The merge event for the same merge carries the `correction_id` as its `triggering_event_id`, so deduplicate on that field.

Check out the [Identities dbt package overview](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md) for more information.
