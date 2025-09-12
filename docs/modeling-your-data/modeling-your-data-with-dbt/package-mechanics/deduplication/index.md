---
title: "Duplicates"
description: "Implement deduplication logic in dbt packages for clean behavioral data processing."
schema: "TechArticle"
keywords: ["Data Deduplication", "Duplicate Removal", "DBT Dedup", "Data Cleaning", "Unique Records", "Data Quality"]
sidebar_position: 60
---

Duplicates in your data can happen, because of Snowplow's _At Least Once_ delivery approach. However, it's important for analysis and reporting that these duplicates are removed when doing any kind of data modeling. As part of our packages, we make sure to remove duplicate events at the very start to ensure any downstream data is correct.

All our packages perform de-duplication on both `event_id`'s as part of the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run), and then ensure distinct counts and records are used for any higher level tables in the packages e.g. page views. The de-duplication method for Redshift & Postgres is different to BigQuery, Snowflake, & Databricks due to their shredded table design. 

## BigQuery, Snowflake, & Databricks

Any duplicate `event_id`s are removed by taking the earliest `collector_tstamp` record. In the case of multiple rows with this timestamp, we take one at random (as they will all be the same). The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`. 

There should be no need to further de-duplicate the base [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table or any contexts for each row.

## Redshift & Postgres

### Single-valued entities
When events are expected to only have at most a single entity in the attached context, any duplicate `event_id`s are removed from the atomic events table, and any context/self-describing event tables, by taking the earliest `collector_tstamp` record. In the case of multiple rows with this timestamp, we take one at random (as they will all be the same).

Any custom entities or self-describing events are able to be added to the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table, and are de-duped on by taking the earliest `collector_tstamp` record, by using the `snowplow__entities_or_sdes` variable in our package. See [modeling entities](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md) for more information and examples.


### Multi-valued entities
In the case where it may be possible for a entity to contain multiple instances (e.g. products returned in a search result) a more complex approach is taken to ensure that all of the instances in the attached entity are still in the table before the join, even in the case where some of these entities may be identical. 

When we de-duplicate the events this run table we keep the number of duplicates there were. In the de-duplication of the entity table we generate a row number per unique combination of **all** fields in the record. A join is then made on `root_id` and `root_tstamp` as before, but with an **additional** clause that the row number is a multiple of the number of duplicates to support the 1-to-many join. This ensures all duplicates are removed while retaining all original instances of the entity. Because this leads to multiple rows per event, this is only ever done in downstream models in our packages.

If you need to make use of a multi-valued entity in a custom model, see the [using multi-valued entities](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/examples/using-mulit-valued-entities/index.md) custom model example page.
