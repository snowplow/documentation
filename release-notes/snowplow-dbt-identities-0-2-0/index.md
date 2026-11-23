---
title: "Snowplow dbt Identities 0.2.0 released"
sidebar_label: "dbt Identities 0.2.0"
description: "Up to 6× lower warehouse compute costs with a more performant and simpler model."
keywords: ["dbt identities", "identity resolution", "0.2.0"]
date: "2026-11-23"
category:
  - "Release notes"
components:
  - "Data models"
  - "Identities"
---

The dbt data model for Snowplow Identities transforms the raw identity data and merges events in your warehouse into a set of tables for identity resolution and identifier lookup.

The [0.2.0 release](https://github.com/snowplow-incubator/dbt-snowplow-identities/releases/tag/0.2.0) improves the performance and reduces the complexity of the model. As a result, we estimate up to 6× lower compute costs when running the new model.

To achieve this, we removed outputs that were not useful in practice, along with the respective processing steps. Also, the new model only reads the columns it needs, as opposed to the entire atomic table. Overall, it is easier to understand, extend, and maintain, and more resilient.

## Upgrading

This release includes breaking changes. For example, the `id_changes` and `id_mapping_scd` tables are removed, `new_identities` is renamed to `identities`, etc.

To upgrade from version `0.1.0` to `0.2.0`, you will need to run the new model with a full refresh and adapt any downstream models. Follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/) for the complete procedure and rollback requirements.
