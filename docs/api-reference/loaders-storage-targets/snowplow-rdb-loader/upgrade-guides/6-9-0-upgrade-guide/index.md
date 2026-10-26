---
title: "RDB Loader 6.9.0 upgrade guide"
sidebar_label: "6.9.0 upgrade guide"
sidebar_position: -30
description: "Upgrade RDB Loader to 6.9.0, which renames Databricks recovery columns, and update the queries that read them."
keywords: ["rdb loader 6.9 upgrade", "recovery columns", "databricks", "parquet", "schema evolution"]
date: "2026-10-20"
---

```mdx-code-block
import License from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/reusable/license/_index.mdx"

<License/>
```

RDB Loader 6.9.0 changes how the transformer names recovery columns in Parquet output. After you upgrade, events that previously went to a recovery column go to a new recovery column with a different name. No data is lost, but queries that read the old column by name will stop seeing new data.

## Check whether this change affects you

This change only affects pipelines that load into Databricks, because only the Parquet wide row output has recovery columns. Pipelines that load into Redshift or Snowflake are not affected.

Within Databricks pipelines, it only matters if your `events` table already has recovery columns. A recovery column is created when an event arrives with a schema version that can't be merged into the existing column, for example because a field changed type without a new major [schema](/docs/fundamentals/schemas/index.md) version. See [schemas in the warehouse](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md?warehouse=databricks#versioning) for details.

To check, look for column names that contain `_recovered_`:

```sql
SHOW COLUMNS IN <catalog>.<schema>.events
```

If there are none, you can upgrade without taking any further action.

## Understand how recovery column names change

A recovery column name has the form `<column>_recovered_<version>_<hash>`, where `<column>` is the original column, `<version>` is the schema version that couldn't be merged, and `<hash>` identifies that version of the schema. For example:

| Version        | Recovery column name                                                       |
| -------------- | -------------------------------------------------------------------------- |
| Before 6.9.0   | `contexts_com_acme_button_press_1_recovered_1_0_1_1837344102`              |
| 6.9.0 onwards  | `contexts_com_acme_button_press_1_recovered_1_0_1_ecd8e4b9`                |

From 6.9.0, the hash is always 8 hexadecimal characters, calculated from the content of the JSON schema. The previous hash depended on internal details of the transformer build, so it could differ between transformer builds even for the same schema. The new hash doesn't, which means this is a one-off rename: future transformer releases won't rename recovery columns again.

The transformer creates the new column when it first processes an event with the affected schema version after the upgrade. From then on, new data goes to the new column, and the old column only holds data loaded before the upgrade. The loader never drops or modifies the old column.

## Upgrade the loader before the transformer

Upgrade the loader to 6.9.0 first, then upgrade the transformer.

Since 6.8.0, the transformer tells the loader the names of the Parquet columns it wrote. A loader older than 6.8.0 ignores these names and calculates them itself using the old hash. If that loader receives a batch from a 6.9.0 transformer that contains a recovery column, the column names won't match the data, and the load fails.

A 6.9.0 loader handles batches from both old and new transformers, so it's safe to upgrade the loader first and the transformer afterwards.

## Update queries that read recovery columns

Any query, view, or data model that reads a recovery column by name needs to read both the old and the new column after the upgrade. Because both columns hold data for the same schema version, they have the same type, so you can combine them with `COALESCE`:

```sql
SELECT
  event_id,
  COALESCE(
    contexts_com_acme_button_press_1_recovered_1_0_1_ecd8e4b9,
    contexts_com_acme_button_press_1_recovered_1_0_1_1837344102
  ) AS button_press_1_0_1
FROM <catalog>.<schema>.events
```

You can only write this query after the new column exists, that is, after the transformer has processed at least one event with the affected schema version.

If you plan to resolve the underlying schema problem by creating a new schema version that is compatible with the original column, this is a good time to do it. Data for the new version goes to the original column, so you don't need to track recovery columns for it.
