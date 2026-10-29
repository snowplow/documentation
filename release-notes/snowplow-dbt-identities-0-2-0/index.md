---
title: "Snowplow dbt Identities 0.2.0 released"
sidebar_label: "dbt Identities 0.2.0"
description: "Immutable identifier mappings, preferred-owner flags, and a guarded migration for the Snowplow Identities dbt package."
keywords: ["dbt identities", "identity resolution", "0.2.0"]
date: "2026-10-23"
category:
  - "Release notes"
components:
  - "Data models"
  - "Identities"
---

[Snowplow Identities 0.2.0](https://github.com/snowplow-incubator/dbt-snowplow-identities/releases/tag/0.2.0)
simplifies current identity resolution on Snowflake, BigQuery, and Databricks. Immutable
identifier rows resolve through a view, so merges no longer rewrite those rows. Install
the package from Git with `revision: "0.2.0"`, following the
[quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/).

The mapping view adds `mapping_state` and `is_preferred`. The optional merge-limit heuristic
retains every owner and marks an unambiguous preferred owner; it also covers identifiers
that reappear after TTL expiry. Enable it only when the service has no configured unique
identifiers.

Incremental readers advance across empty periods. Delayed merge events retain the
current root, and stored children follow subsequent root changes.

## Breaking upgrade

This release removes `id_changes` and `id_mapping_scd`, renames `new_identities` to
`identities`, lowercases `id_type`, and converts `identifier_mapping` to a view. Derived
identifier keys can change with the normalized type.

Upgrading from 0.1.0 requires a full refresh, adequate retained source history, and a backup.
Prefer a separate output schema, finish backfilling, validate the models and downstream
queries, then switch consumers. Retain old history tables until their consumers have a
validated replacement. Follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/)
for the full procedure and rollback requirements.
