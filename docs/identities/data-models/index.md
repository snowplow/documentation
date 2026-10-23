---
title: "Snowplow Identities dbt package"
sidebar_label: "Data models"
sidebar_position: 3
description: "The Snowplow Identities dbt package provides incremental models for identity resolution, mapping, and audit."
keywords: ["identities", "dbt", "identity resolution", "data model"]
date: "2026-03-05"
---

Identities includes a [dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md) to help you get value from your [Identities data](/docs/identities/concepts/index.md#data-types). It transforms the raw identity entities and merge events in your warehouse into a set of derived tables for current identity resolution and identifier lookup, with a retained merge-event log.

The Identities dbt package is currently standalone from our other dbt packages.

Check out the [Identities dbt package overview](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md) for more information.

Version 0.2.0 removes the earlier change-history and SCD outputs. Existing users should follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md) before upgrading.
