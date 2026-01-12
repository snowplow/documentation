---
title: "How to override macros in the Unified Digital package"
sidebar_label: "Overridable macros"
sidebar_position: 100
description: "Override macros in the Unified Digital dbt package to customize channel classification, conversion definitions, and event processing."
keywords: ["override macros", "custom macros", "macro customization", "channel classification", "dbt dispatch"]
---

The Unified Digital package includes several macros you can override to customize the package behavior for your specific requirements. This page documents the available macros and their purposes.

:::tip

For information about overriding our macros, see [here](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/overridable-macros/index.md#overriding-macros)

:::

## Unify fields query

The `unify_fields_query` macro is used to populate the `snowplow_unified_events_this_run` table; groups together fields that come from multiple entities or SDEs depending on whether the platform is mobile or web. Should be overwritten if there is other grouping or complex SQL you wish to run on the `events this run` table.

The macro code is on [GitHub](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/unify_fields_query.sql).

## Filter bots

The `filter_bots` macro defines the filter to remove bot events from events processed by the package. The filter is of the form `and <condition>` and is used throughout the package to filter out bots from all models.

The macro takes an optional `table_alias` argument, which is the table alias to prefix the column name with, if any. Default `none`.

The macro code is on [GitHub](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/filter_bots.sql).

## Channel group query

The `channel_group_query` macro defines the channel a user arrived at using various fields and populates the `default_channel_group` field in the `views` and `sessions` tables. Must be a valid SQL `select` object, such as a complete `case when` statement. Used as part of the `platform_independent_fields` macro.

The defaults can be altered by overriding the macro in your project to generate your expected channels. Default values will not consider any custom marketing parameters you may have. Your override will most likely be a long list of case statements where `mkt_source` and `mkt_medium` fields are used for the classification. You can also rely on the `source_category` field that you will get as the package automatically joins the seed file generated table `snowplow_unified_dim_ga4_source_categories` where this macro gets used.

If you enable the `snowplow__use_refr_if_mkt_null` variable, the `src_field` will become a `coalesce(mkt_source, refr_source)`, and it will become `coalesce(mkt_medium, refr_medium)` for the `medium_field` used as a reference throughout the original definition.

The macro code is on [GitHub](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/field_definitions/channel_group_query.sql).


## Engaged session

The `engaged_session` macro defines whether a session was engaged and populates the `is_engaged` field. Must return `true` or `false` and be a valid SQL `select` object, such as a complete `case when` statement. Used in the `sessions_this_run` table.

The default definition considers a session engaged if it has at least 2 views, or at least 2 heartbeats of engaged time, or had a conversion event.

The macro code is on [GitHub](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/field_definitions/engaged_session.sql).

## Content group query

The `content_group_query` macro defines the content groups by classifying the page URLs for views. Must be a valid SQL `select` object, such as a complete `case when` statement. Used in the `views_this_run` table.

The macro code is on [GitHub](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/field_definitions/content_group_query.sql).
