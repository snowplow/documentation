---
title: "[BigQuery] Migration to BigQuery Loader version 2"
description: "As per our announcement, BigQuery Loader version 2 is out."
date: "2025-02-27"
update_type:
  - "Maintenance notification"
components:
  - "Destinations"
platforms:
  - "BigQuery"
---
As per [our announcement](/changelog/announcing-bigquery-loader-version-2/), BigQuery Loader version 2 is out.

**In March and April 2025, we will be gradually migrating all BigQuery customers to the new version.**

The loader will be configured to run in the compatibility mode, so **there will be no changes to the format of your data** in BigQuery.

Once the migration is complete, you will have the option to switch to the new data format. As explained in the announcement, the advantage is that the loader would create much fewer BigQuery columns, which makes it easier to work with the data. The new format can be activated either for all schemas (data structures) and columns, or just for new ones. In the meantime, please refer to the [migration guide](/docs/api-reference/loaders-storage-targets/bigquery-loader/upgrade-guides/2-0-0-upgrade-guide/#events-table-format) to make this choice.
