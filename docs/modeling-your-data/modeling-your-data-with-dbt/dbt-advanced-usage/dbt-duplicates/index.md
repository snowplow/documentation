---
title: "Duplicates"
date: "2022-10-05"
sidebar_position: 200
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```


The e-commerce, web, and mobile packages perform de-duplication on both `event_id`'s and `page/screen_view_id`'s, in the base and page/screen views modules respectively. The normalize package only de-dupes on `event_id`. The de-duplication method for Redshift & Postgres is different to BigQuery, Snowflake, & Databricks due to their federated table design. See below for a detailed explanation.

## Redshift & Postgres
Using `event_id` de-duplication as an example, for duplicates we:

- Keep the first row per `event_id` ordered by `collector_tstamp` i.e. the earliest occurring row.

- If there are multiple rows with the same `collector_tstamp`, we remove the duplicate in an arbitrary fashion using row_number() window function (this has been handled differently in the past, please check the Changelog for details).
- It is important to highlight that this poses a duplication risk on joining any context and self-describing event tables downstream. Please make sure you always remove duplicates when joining such tables do avoid one-to-many joins. We have provided a macro - `get_sde_or_context()` - for you to use for this purpose in the v0.14.0 snowplow-utils package. Check out the [package documentation](https://snowplow.github.io/dbt-snowplow-utils/#!/overview/snowplow_utils) on how to use it.

The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`.

## BigQuery, Snowflake, & Databricks

Using `event_id` de-duplication as an example, for duplicates we:

- Keep the first row per `event_id` ordered by `collector_tstamp` i.e. the earliest occurring row.

The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`.
