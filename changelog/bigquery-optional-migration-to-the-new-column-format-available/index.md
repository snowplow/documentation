---
title: "[BigQuery] Optional migration to the new column format available"
description: "Earlier this year we released a new version of the BigQuery loader which supports a better approach to schema management in BigQuery."
date: "2025-09-16"
update_type:
  - "Maintenance notification"
components:
  - "Loaders"
  - "BigQuery"
---
> This notice only applies to BigQuery customers

Earlier this year [we released a new version of the BigQuery loader](/changelog/announcing-bigquery-loader-version-2/) which supports a better approach to schema management in BigQuery. Quoting from the release:

> All Snowplow loaders automatically manage columns in the warehouse or lake to match your event schemas (data structures). When you create a new version of your schema, it’s often necessary to create a new column, so that the old and the new data formats can coexist.

> The new loader only creates new columns for each _major_ schema version. The old loader would create a new column for _each_ schema version. The new behavior keeps the atomic events table more compact and easier to query or write data models for. Plus, it reduces the chances of hitting the 10k column limit in BigQuery.

You can now request a migration to the new format by reaching out to the Support team.

Please note:

* **The new format will only apply to new schemas and new major versions of existing schemas.** Already present BigQuery columns will keep their current naming.
* For the new-style columns, **you will need to follow schema evolution rules more strictly**. For example, you can’t change a schema field from a string to a number within the same major schema version. This is because incompatible types can’t coexist in the same column. See [the documentation](/docs/api-reference/loaders-storage-targets/bigquery-loader/upgrade-guides/2-0-0-upgrade-guide/#recovery-columns) for more details.
