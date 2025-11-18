---
title: "Overridable Macros in the Unified Data Model (dbt)"
sidebar_position: 100
description: "Overridable macros in the Unified package"
hide_title: true
---

:::tip

For information about overriding our macros, see [here](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/overridable-macros/index.md#overriding-macros)

:::

```mdx-code-block
import MarkdownTableToMuiDataGrid from '@site/src/components/MarkdownTableAsMui'

export const datagridProps = {
    hideFooter: true
  };
```


### [<Icon icon="fa-brands fa-github"/>](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/unify_fields_query.sql) `unify_fields_query` 
#### Details
Used to populate the `snowplow_unified_events_this_run` table; groups together fields that come from multiple entities or SDEs depending on whether the platform is mobile or web. Should be overwritten if there is other grouping or complex SQL you wish to run on the `events this run` table.

### [<Icon icon="fa-brands fa-github"/>](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/filter_bots.sql) `filter_bots`
#### Arguments
- `table_alias`: The table alias to prefix a the column name with, if any. Default `none`

#### Details
Defines the filter to remove bot events from events processed by the package. Of the form `and <condition>`. Used throughout the package to filter out bots from all models.

### [<Icon icon="fa-brands fa-github"/>](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/field_definitions/channel_group_query.sql) `channel_group_query`
#### Details
Defines the channel a user arrived at using various fields, populates the `default_channel_group` field in the `views` and `sessions` tables. Must be a valid sql `select` object e.g. a complete `case when` statement. Used as part of the `platform_independent_fields` macro. 

The defaults can be altered by overwriting the macro in your project with the same name to generate your expected channels if they differ from the default macro which most likely will, as default values will not consider any custom marketing parameters you may have. It will most likely be a long list of case statements where `mkt_source` and `mkt_medium` fields are used for the classification. You can also rely on the help of the `source_category` field that you will get as the package automatically joins the seed file generated table `snowplow_unified_dim_ga4_source_categories` where this macro gets used.

Another consideration to have is to enable the `snowplow__use_refr_if_mkt_null` variable. In that case `src_field` will become a coalesce(mkt_source, refr_source), and it will become coalesce(mkt_medium, refr_medium) for the `medium_field` used as a reference throughout the original definition.


### [<Icon icon="fa-brands fa-github"/>](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/field_definitions/engaged_session.sql) `engaged_session`
#### Details
Defines if a session was engaged or not, populates the `is_engaged` field. Must return `true` or `false` and be a valid sql `select` object e.g. a complete `case when` statement. Used in `sessions_this_run` table. Default at least 2 views, or at engaged time of at least 2 heartbeats, or had a conversion event.

### [<Icon icon="fa-brands fa-github"/>](https://github.com/snowplow/dbt-snowplow-unified/blob/main/macros/field_definitions/content_group_query.sql) `content_group_query`
#### Details
Defines the content groups by classifying the page urls for views. Must be a valid sql `select` object e.g. a complete `case when` statement. Used in `views_this_run` table.
