---
title: "Duplicates"
date: "2022-10-05"
sidebar_position: 200
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```


The e-commerce, web, and mobile packages perform de-duplication on both `event_id`'s and `page/screen_view_id`'s, in the base and page/screen views modules respectively. The normalize package only de-dupes on `event_id`. The de-duplication method for Redshift & Postgres is different to BigQuery, Snowflake, & Databricks due to their federated table design. The key difference between the two methodologies is that for Redshift and Postgres an `event_id` may be removed entirely during de-duplication, where as for BigQuery & Snowflake we keep all `event_id`'s. See below for a detailed explanation.

## Redshift & Postgres
Using `event_id` de-duplication as an example, for duplicates we:

- Keep the first row per `event_id` ordered by `collector_tstamp` i.e. the earliest occurring row.
- If there are multiple rows with the same `collector_tstamp`, *we discard the event all together*. This is done to avoid 1:many joins when joining on context tables such as the page view context.

The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`.

## BigQuery, Snowflake, & Databricks

Using `event_id` de-duplication as an example, for duplicates we:

- Keep the first row per `event_id` ordered by `collector_tstamp` i.e. the earliest occurring row.

The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`.
