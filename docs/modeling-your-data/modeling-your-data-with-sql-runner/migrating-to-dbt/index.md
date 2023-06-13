---
title: "Migrating from SQL Runner to dbt"
sidebar_position: 0
description: SQL Runner is no longer actively developed and users should try to migrate to dbt where possible, this guide helps you do that
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info

This guide assumes you are running the standard web and/or mobile SQL Runner models, if you have built any custom models or customized the standard models in any way, you will need to make these same changes to the dbt models. See our section on [custom dbt models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) for more information on how to do this.

:::

## Why Migrate?

SQL Runner is currently in maintenance mode, while we will continue to fix bugs when they are identified, we are not actively developing the tool or the models anymore and at some point in the future may deprecate it entirely. Our dbt models on the other hand are under active development, with new features and optimizations being made regularly. It is also a more widely used tool and we have a far wider range of packages available in dbt. 

In general, if you are happy with SQL Runner and don't foresee a need to add more models in the future then there is no need to migrate; however if you are starting from scratch, or would like to make use of our wider range of models, then you should consider migrating to dbt.

## Differences between the tools

The core of the web and mobile models (e.g. page/screen views, sessions, and users) are the same across SQL Runner and dbt, however the dbt versions contain some additional fields which may be useful for analysis, as well as additional optional modules for web such as consent and core web vitals. Below this the logic used to process the data is roughly the same, although we have made some optimizations and added more flexibility in how this processing is done in dbt.

We also have additional packages in dbt, including e-commerce, marketing attribution, and a package to normalize your Snowplow data. The final difference is that in dbt we support Databricks warehouses in addition to Snowflake, BigQuery, and Redshift.

We recommend you take a look at the [docs](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for our dbt packages to get a better understanding of how they work and how you can use them going forward.

## Pre-requisites
We assume that you have dbt [installed](https://docs.getdbt.com/docs/core/installation), a working connection, and some basic understanding of using dbt including installing packages and running models. 

## Mapping the variables

While the variables for your SQL Runner models are spread throughout the files, in dbt all variables are in your `dbt_project.yml` file. We have mostly been consistent between the two tools, with the dbt variables being prefixed by `snowplow__`, but some have new names. The table below maps each SQL Runner variable to the equivalent dbt variable, but there are many more you can set to customize how the models run - you can read about these in the relevant [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) page. 

```mdx-code-block
import DbtVariables from "@site/docs/reusable/dbt-variables/_index.md"

<DbtVariables/>
```

> Values in bold have a different name instead of just the prefix

| SQL Runner Variable                | dbt variable                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **`app_errors`**                   | **`snowplow__enable_app_errors_module`**                                                                |
| **`app_id_filters`**               | **`snowplow__app_id`**                                                                                  |
| **`application_context`**          | **`snowplow__enable_application_context`**                                                              |
| `cleanup_mode`                     | No equivalent variable *(closest is `snowplow__allow_refresh` combined with dbt `--full-refresh` flag)* |
| `cluster_by`                       | No equivalent variable *(Clustering defined in model)*                                                  |
| `days_late_allowed`                | `snowplow__days_late_allowed`                                                                           |
| `derived_tstamp_partitioned`       | `snowplow__derived_tstamp_partitioned`                                                                  |
| `enabled` (Mobile app errors only) | **`snowplow__enable_app_errors_module`**                                                                |
| `ends_run`                         | No equivalent variable                                                                                  |
| `entropy`                          | No equivalent variable                                                                                  |
| **`geolocation_context`**          | **`snowplow__enable_geolocation_context`**                                                              |
| `heartbeat`                        | `snowplow__heartbeat`                                                                                   |
| **`iab`**                          | **`snowplow__enable_iab`**                                                                              |
| **`input_schema`**                 | **`snowplow__atomic_schema`**                                                                           |
| `lookback_window_hours`            | `snowplow__lookback_window_hours`                                                                       |
| **`minimumVisitLength`**           | **`snowplow_min_visit_length`**                                                                         |
| **`mobile_context`**               | **`snowplow__enable_mobile_context`**                                                                   |
| **`model_version`**                | No equivalent variable                                                                                  |
| `output_schema`                    | Set in `models` part of project file, see relevant configuration page for more info.                    |
| **`platform_filters`**             | **`snowplow__platform`**                                                                                |
| `scratch_schema`                   | Set in `models` part of project file, see relevant configuration page for more info.                    |
| **`screen_context`**               | **`snowplow__enable_screen_contextt`**                                                                  |
| `session_lookback_days`            | `snowplow__session_lookback_days` *(default increased to 730)*                                          |
| `skip_derived`                     | No equivalent variable *(use dbt `--select` flag)*                                                      |
| `stage_next`                       | No equivalent variable                                                                                  |
| `start_date`                       | `snowplow__start_date`                                                                                  |
| `ua_bot_filter`                    | `snowplow__ua_bot_filter`                                                                               |
| **`ua_parser`**                    | **`snowplow__enable_ua`**                                                                               |
| **`update_cadence_days`**          | **`snowplow__backfill_limit_days`** *(default increased to 30)*                                         |
| `upsert_lookback_days`             | `snowplow__upsert_lookback_days`                                                                        |
| **`yauaa`**                        | **`snowplow__enable_yauaa`**                                                                            |


## Setting up and running our dbt packages

The latest information for our packages can be found in the [quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) section of our docs. It is highly recommended you just start running your dbt project from scratch and process all data from the start date to ensure the package works as intended and all your data is processed in the same way.

## Migrate existing derived data

:::danger

The dbt package uses slightly different logic for processing, including the quarantining of sessions and different format manifest tables. It is highly recommended that you just run the dbt project from your start date. The following is a best-effort suggestion and we make no guarantee that all data will be correctly processed or that issues may not happen later in the lifetime of the project.

This method will also not correctly populate the user stitching table or process for historic data.

:::

There may be cases where running the dbt models from scratch is not a viable option for you, in this case it is possible to migrate your existing derived SQL Runner data into the derived tables produced by dbt. 

It is advisable to produce your dbt tables into new schemas where possible, even though the derived tables should have different names; this will help keep your data separate and ensure that as we go through the following steps that dbt does not overwrite your SQL Runner tables.

### Create dbt tables by doing a recent-dated run
Because of the difference in manifest tables and incremental logic between SQL Runner and dbt models it makes sense to first create the dbt tables and then insert your existing data into them, rather than try and create the dbt tables directly from your SQL Runner data. 

Once you have your dbt project and variables set up, change your `snowplow__start_date` to a recent date, say 7 days before the end of your last SQL Runner processed date, and run the project once. This will produce all the dbt tables including the manifest tables needed to manage the incremental logic, and ensure a good overlap between the end of your SQL Runner processing and the start of dbt processing.

### Merge your existing data into the new tables (web)

The following SQL will merge the existing web records in your SQL Runner derived tables into the new dbt derived tables, please run each one as required. This approach will leave any columns that only exist in dbt `null`. Please ensure you replace the schema and table names with your ones where appropriate.

**If you are using Redshift, be sure to `commit` your changes.**

:::caution

It is possible, particularly for columns which may have been null, that the types of columns across the two tables don't entirely match. Your warehouse may manage this for you, or you may have to use a `cast(col_name as new_type)` in place of just selecting the column based on any error message you receive.

:::

#### Page Views



```sql
MERGE INTO <DBT_DERIVED_SCHEMA>.snowplow_web_page_views t
USING <SQL_RUNNER_DERIVED_SCHEMA>.page_views s
ON T.page_view_id = s.page_view_id
WHEN NOT MATCHED THEN
INSERT 
(
    page_view_id,
    event_id,
    app_id,
    user_id,
    domain_userid,
    network_userid,
    domain_sessionid,
    domain_sessionidx,
    page_view_in_session_index,
    page_views_in_session,
    dvce_created_tstamp,
    collector_tstamp,
    derived_tstamp,
    start_tstamp,
    end_tstamp,
    engaged_time_in_s,
    absolute_time_in_s,
    horizontal_pixels_scrolled,
    vertical_pixels_scrolled,
    horizontal_percentage_scrolled,
    vertical_percentage_scrolled,
    doc_width,
    doc_height,
    page_title,
    page_url,
    page_urlscheme,
    page_urlhost,
    page_urlpath,
    page_urlquery,
    page_urlfragment,
    mkt_medium,
    mkt_source,
    mkt_term,
    mkt_content,
    mkt_campaign,
    mkt_clickid,
    mkt_network,
    page_referrer,
    refr_urlscheme,
    refr_urlhost,
    refr_urlpath,
    refr_urlquery,
    refr_urlfragment,
    refr_medium,
    refr_source,
    refr_term,
    geo_country,
    geo_region,
    geo_region_name,
    geo_city,
    geo_zipcode,
    geo_latitude,
    geo_longitude,
    geo_timezone,
    user_ipaddress,
    useragent,
    br_lang,
    br_viewwidth,
    br_viewheight,
    br_colordepth,
    br_renderengine,
    os_timezone,
    category,
    primary_impact,
    reason,
    spider_or_robot,
    useragent_family,
    useragent_major,
    useragent_minor,
    useragent_patch,
    useragent_version,
    os_family,
    os_major,
    os_minor,
    os_patch,
    os_patch_minor,
    os_version,
    device_family,
    device_class,
    agent_class,
    agent_name,
    agent_name_version,
    agent_name_version_major,
    agent_version,
    agent_version_major,
    device_brand,
    device_name,
    device_version,
    layout_engine_class,
    layout_engine_name,
    layout_engine_name_version,
    layout_engine_name_version_major,
    layout_engine_version,
    layout_engine_version_major,
    operating_system_class,
    operating_system_name,
    operating_system_name_version,
    operating_system_version
)
VALUES 
(
    s.page_view_id,
    s.event_id,
    s.app_id,
    s.user_id,
    s.domain_userid,
    s.network_userid,
    s.domain_sessionid,
    s.domain_sessionidx,
    s.page_view_in_session_index,
    s.page_views_in_session,
    s.dvce_created_tstamp,
    s.collector_tstamp,
    s.derived_tstamp,
    s.start_tstamp,
    s.end_tstamp,
    s.engaged_time_in_s,
    s.absolute_time_in_s,
    s.horizontal_pixels_scrolled,
    s.vertical_pixels_scrolled,
    s.horizontal_percentage_scrolled,
    s.vertical_percentage_scrolled,
    s.doc_width,
    s.doc_height,
    s.page_title,
    s.page_url,
    s.page_urlscheme,
    s.page_urlhost,
    s.page_urlpath,
    s.page_urlquery,
    s.page_urlfragment,
    s.mkt_medium,
    s.mkt_source,
    s.mkt_term,
    s.mkt_content,
    s.mkt_campaign,
    s.mkt_clickid,
    s.mkt_network,
    s.page_referrer,
    s.refr_urlscheme,
    s.refr_urlhost,
    s.refr_urlpath,
    s.refr_urlquery,
    s.refr_urlfragment,
    s.refr_medium,
    s.refr_source,
    s.refr_term,
    s.geo_country,
    s.geo_region,
    s.geo_region_name,
    s.geo_city,
    s.geo_zipcode,
    s.geo_latitude,
    s.geo_longitude,
    s.geo_timezone,
    s.user_ipaddress,
    s.useragent,
    s.br_lang,
    s.br_viewwidth,
    s.br_viewheight,
    s.br_colordepth,
    s.br_renderengine,
    s.os_timezone,
    s.category,
    s.primary_impact,
    s.reason,
    s.spider_or_robot,
    s.useragent_family,
    s.useragent_major,
    s.useragent_minor,
    s.useragent_patch,
    s.useragent_version,
    s.os_family,
    s.os_major,
    s.os_minor,
    s.os_patch,
    s.os_patch_minor,
    s.os_version,
    s.device_family,
    s.device_class,
    s.agent_class,
    s.agent_name,
    s.agent_name_version,
    s.agent_name_version_major,
    s.agent_version,
    s.agent_version_major,
    s.device_brand,
    s.device_name,
    s.device_version,
    s.layout_engine_class,
    s.layout_engine_name,
    s.layout_engine_name_version,
    s.layout_engine_name_version_major,
    s.layout_engine_version,
    s.layout_engine_version_major,
    s.operating_system_class,
    s.operating_system_name,
    s.operating_system_name_version,
    s.operating_system_version
);
```

#### Sessions

```sql
MERGE INTO <DBT_DERIVED_SCHEMA>.snowplow_web_sessions t
USING <SQL_RUNNER_DERIVED_SCHEMA>.sessions s
ON T.domain_sessionid = s.domain_sessionid
WHEN NOT MATCHED THEN
INSERT 
(
    app_id,
    domain_sessionid,
    domain_sessionidx,
    start_tstamp,
    end_tstamp,
    user_id,
    domain_userid,
    network_userid,
    page_views,
    engaged_time_in_s,
    absolute_time_in_s,
    first_page_title,
    first_page_url,
    first_page_urlscheme,
    first_page_urlhost,
    first_page_urlpath,
    first_page_urlquery,
    first_page_urlfragment,
    last_page_title,
    last_page_url,
    last_page_urlscheme,
    last_page_urlhost,
    last_page_urlpath,
    last_page_urlquery,
    last_page_urlfragment,
    referrer,
    refr_urlscheme,
    refr_urlhost,
    refr_urlpath,
    refr_urlquery,
    refr_urlfragment,
    refr_medium,
    refr_source,
    refr_term,
    mkt_medium,
    mkt_source,
    mkt_term,
    mkt_content,
    mkt_campaign,
    mkt_clickid,
    mkt_network,
    geo_country,
    geo_region,
    geo_region_name,
    geo_city,
    geo_zipcode,
    geo_latitude,
    geo_longitude,
    geo_timezone,
    user_ipaddress,
    useragent,
    br_renderengine,
    br_lang,
    os_timezone,
    category,
    primary_impact,
    reason,
    spider_or_robot,
    useragent_family,
    useragent_major,
    useragent_minor,
    useragent_patch,
    useragent_version,
    os_family,
    os_major,
    os_minor,
    os_patch,
    os_patch_minor,
    os_version,
    device_family,
    device_class,
    agent_class,
    agent_name,
    agent_name_version,
    agent_name_version_major,
    agent_version,
    agent_version_major,
    device_brand,
    device_name,
    device_version,
    layout_engine_class,
    layout_engine_name,
    layout_engine_name_version,
    layout_engine_name_version_major,
    layout_engine_version,
    layout_engine_version_major,
    operating_system_class,
    operating_system_name,
    operating_system_name_version,
    operating_system_version
)
VALUES
(
    s.app_id,
    s.domain_sessionid,
    s.domain_sessionidx,
    s.start_tstamp,
    s.end_tstamp,
    s.user_id,
    s.domain_userid,
    s.network_userid,
    s.page_views,
    s.engaged_time_in_s,
    s.absolute_time_in_s,
    s.first_page_title,
    s.first_page_url,
    s.first_page_urlscheme,
    s.first_page_urlhost,
    s.first_page_urlpath,
    s.first_page_urlquery,
    s.first_page_urlfragment,
    s.last_page_title,
    s.last_page_url,
    s.last_page_urlscheme,
    s.last_page_urlhost,
    s.last_page_urlpath,
    s.last_page_urlquery,
    s.last_page_urlfragment,
    s.referrer,
    s.refr_urlscheme,
    s.refr_urlhost,
    s.refr_urlpath,
    s.refr_urlquery,
    s.refr_urlfragment,
    s.refr_medium,
    s.refr_source,
    s.refr_term,
    s.mkt_medium,
    s.mkt_source,
    s.mkt_term,
    s.mkt_content,
    s.mkt_campaign,
    s.mkt_clickid,
    s.mkt_network,
    s.geo_country,
    s.geo_region,
    s.geo_region_name,
    s.geo_city,
    s.geo_zipcode,
    s.geo_latitude,
    s.geo_longitude,
    s.geo_timezone,
    s.user_ipaddress,
    s.useragent,
    s.br_renderengine,
    s.br_lang,
    s.os_timezone,
    s.category,
    s.primary_impact,
    s.reason,
    s.spider_or_robot,
    s.useragent_family,
    s.useragent_major,
    s.useragent_minor,
    s.useragent_patch,
    s.useragent_version,
    s.os_family,
    s.os_major,
    s.os_minor,
    s.os_patch,
    s.os_patch_minor,
    s.os_version,
    s.device_family,
    s.device_class,
    s.agent_class,
    s.agent_name,
    s.agent_name_version,
    s.agent_name_version_major,
    s.agent_version,
    s.agent_version_major,
    s.device_brand,
    s.device_name,
    s.device_version,
    s.layout_engine_class,
    s.layout_engine_name,
    s.layout_engine_name_version,
    s.layout_engine_name_version_major,
    s.layout_engine_version,
    s.layout_engine_version_major,
    s.operating_system_class,
    s.operating_system_name,
    s.operating_system_name_version,
    s.operating_system_version
);
```

#### Users

```sql
MERGE INTO <DBT_DERIVED_SCHEMA>.snowplow_web_users t
USING <SQL_RUNNER_DERIVED_SCHEMA>.users s
ON T.domain_userid = s.domain_userid
WHEN NOT MATCHED THEN
INSERT 
(
    user_id,
    domain_userid,
    network_userid,
    start_tstamp,
    end_tstamp,
    page_views,
    sessions,
    engaged_time_in_s,
    first_page_title,
    first_page_url,
    first_page_urlscheme,
    first_page_urlhost,
    first_page_urlpath,
    first_page_urlquery,
    first_page_urlfragment,
    last_page_title,
    last_page_url,
    last_page_urlscheme,
    last_page_urlhost,
    last_page_urlpath,
    last_page_urlquery,
    last_page_urlfragment,
    referrer,
    refr_urlscheme,
    refr_urlhost,
    refr_urlpath,
    refr_urlquery,
    refr_urlfragment,
    refr_medium,
    refr_source,
    refr_term,
    mkt_medium,
    mkt_source,
    mkt_term,
    mkt_content,
    mkt_campaign,
    mkt_clickid,
    mkt_network
)
VALUES
(
    s.user_id,
    s.domain_userid,
    s.network_userid,
    s.start_tstamp,
    s.end_tstamp,
    s.page_views,
    s.sessions,
    s.engaged_time_in_s,
    s.first_page_title,
    s.first_page_url,
    s.first_page_urlscheme,
    s.first_page_urlhost,
    s.first_page_urlpath,
    s.first_page_urlquery,
    s.first_page_urlfragment,
    s.last_page_title,
    s.last_page_url,
    s.last_page_urlscheme,
    s.last_page_urlhost,
    s.last_page_urlpath,
    s.last_page_urlquery,
    s.last_page_urlfragment,
    s.referrer,
    s.refr_urlscheme,
    s.refr_urlhost,
    s.refr_urlpath,
    s.refr_urlquery,
    s.refr_urlfragment,
    s.refr_medium,
    s.refr_source,
    s.refr_term,
    s.mkt_medium,
    s.mkt_source,
    s.mkt_term,
    s.mkt_content,
    s.mkt_campaign,
    s.mkt_clickid,
    s.mkt_network,
);
```


### Merge your existing data into the new tables (mobile)

The following SQL will merge the existing mobile records in your SQL Runner derived tables into the new dbt derived tables, please run each one as required. This approach will leave any columns that only exist in dbt `null`. Please ensure you replace the schema and table names with your ones where appropriate.

**If you are using Redshift, be sure to `commit` your changes.**

:::caution

It is possible, particularly for columns which may have been null, that the types of columns across the two tables don't entirely match. Your warehouse may manage this for you, or you may have to use a `cast(col_name as new_type)` in place of just selecting the column based on any error message you receive.

:::

#### Screen Views

```sql
MERGE INTO <DBT_DERIVED_SCHEMA>.snowplow_mobile_screen_views t
USING <SQL_RUNNER_DERIVED_SCHEMA>.mobile_screen_views s
ON T.screen_view_id = s.screen_view_id
WHEN NOT MATCHED THEN
INSERT 
(
    screen_view_id,
    event_id,
    app_id,
    user_id,
    device_user_id,
    network_userid,
    session_id,
    session_index,
    previous_session_id,
    session_first_event_id,
    screen_view_in_session_index,
    screen_views_in_session,
    dvce_created_tstamp,
    collector_tstamp,
    derived_tstamp,
    model_tstamp,
    screen_view_name,
    screen_view_transition_type,
    screen_view_type,
    screen_fragment,
    screen_top_view_controller,
    screen_view_controller,
    screen_view_previous_id,
    screen_view_previous_name,
    screen_view_previous_type,
    platform,
    dvce_screenwidth,
    dvce_screenheight,
    device_manufacturer,
    device_model,
    os_type,
    os_version,
    android_idfa,
    apple_idfa,
    apple_idfv,
    open_idfa,
    device_latitude,
    device_longitude,
    device_latitude_longitude_accuracy,
    device_altitude,
    device_altitude_accuracy,
    device_bearing,
    device_speed,
    geo_country,
    geo_region,
    geo_city,
    geo_zipcode,
    geo_latitude,
    geo_longitude,
    geo_region_name,
    geo_timezone,
    user_ipaddress,
    useragent,
    carrier,
    network_technology,
    network_type,
    build,
    version
)
VALUES
(
    s.screen_view_id,
    s.event_id,
    s.app_id,
    s.user_id,
    s.device_user_id,
    s.network_userid,
    s.session_id,
    s.session_index,
    s.previous_session_id,
    s.session_first_event_id,
    s.screen_view_in_session_index,
    s.screen_views_in_session,
    s.dvce_created_tstamp,
    s.collector_tstamp,
    s.derived_tstamp,
    s.model_tstamp,
    s.screen_view_name,
    s.screen_view_transition_type,
    s.screen_view_type,
    s.screen_fragment,
    s.screen_top_view_controller,
    s.screen_view_controller,
    s.screen_view_previous_id,
    s.screen_view_previous_name,
    s.screen_view_previous_type,
    s.platform,
    s.dvce_screenwidth,
    s.dvce_screenheight,
    s.device_manufacturer,
    s.device_model,
    s.os_type,
    s.os_version,
    s.android_idfa,
    s.apple_idfa,
    s.apple_idfv,
    s.open_idfa,
    s.device_latitude,
    s.device_longitude,
    s.device_latitude_longitude_accuracy,
    s.device_altitude,
    s.device_altitude_accuracy,
    s.device_bearing,
    s.device_speed,
    s.geo_country,
    s.geo_region,
    s.geo_city,
    s.geo_zipcode,
    s.geo_latitude,
    s.geo_longitude,
    s.geo_region_name,
    s.geo_timezone,
    s.user_ipaddress,
    s.useragent,
    s.carrier,
    s.network_technology,
    s.network_type,
    s.build,
    s.version,
);
```

#### Sessions

```sql
MERGE INTO <DBT_DERIVED_SCHEMA>.snowplow_mobile_sessions t
USING <SQL_RUNNER_DERIVED_SCHEMA>.mobile_session s
ON T.session_id = s.session_id
WHEN NOT MATCHED THEN
INSERT 
(
    app_id,
    session_id,
    session_index,
    previous_session_id,
    session_first_event_id,
    session_last_event_id,
    start_tstamp,
    end_tstamp,
    model_tstamp,
    user_id,
    device_user_id,
    network_userid,
    session_duration_s,
    has_install,
    screen_views,
    screen_names_viewed,
    app_errors,
    fatal_app_errors,
    first_event_name,
    last_event_name,
    first_screen_view_name,
    first_screen_view_transition_type,
    first_screen_view_type,
    last_screen_view_name,
    last_screen_view_transition_type,
    last_screen_view_type,
    platform,
    dvce_screenwidth,
    dvce_screenheight,
    device_manufacturer,
    device_model,
    os_type,
    os_version,
    android_idfa,
    apple_idfa,
    apple_idfv,
    open_idfa,
    device_latitude,
    device_longitude,
    device_latitude_longitude_accuracy,
    device_altitude,
    device_altitude_accuracy,
    device_bearing,
    device_speed,
    geo_country,
    geo_region,
    geo_city,
    geo_zipcode,
    geo_latitude,
    geo_longitude,
    geo_region_name,
    geo_timezone,
    user_ipaddress,
    useragent,
    name_tracker,
    v_tracker,
    carrier,
    network_technology,
    network_type,
    first_build,
    last_build,
    first_version,
    last_version
)
VALUES
(
    s.app_id,
    s.session_id,
    s.session_index,
    s.previous_session_id,
    s.session_first_event_id,
    s.session_last_event_id,
    s.start_tstamp,
    s.end_tstamp,
    s.model_tstamp,
    s.user_id,
    s.device_user_id,
    s.network_userid,
    s.session_duration_s,
    s.has_install,
    s.screen_views,
    s.screen_names_viewed,
    s.app_errors,
    s.fatal_app_errors,
    s.first_event_name,
    s.last_event_name,
    s.first_screen_view_name,
    s.first_screen_view_transition_type,
    s.first_screen_view_type,
    s.last_screen_view_name,
    s.last_screen_view_transition_type,
    s.last_screen_view_type,
    s.platform,
    s.dvce_screenwidth,
    s.dvce_screenheight,
    s.device_manufacturer,
    s.device_model,
    s.os_type,
    s.os_version,
    s.android_idfa,
    s.apple_idfa,
    s.apple_idfv,
    s.open_idfa,
    s.device_latitude,
    s.device_longitude,
    s.device_latitude_longitude_accuracy,
    s.device_altitude,
    s.device_altitude_accuracy,
    s.device_bearing,
    s.device_speed,
    s.geo_country,
    s.geo_region,
    s.geo_city,
    s.geo_zipcode,
    s.geo_latitude,
    s.geo_longitude,
    s.geo_region_name,
    s.geo_timezone,
    s.user_ipaddress,
    s.useragent,
    s.name_tracker,
    s.v_tracker,
    s.carrier,
    s.network_technology,
    s.network_type,
    s.first_build,
    s.last_build,
    s.first_version,
    s.last_version
);
```

#### Users

```sql
MERGE INTO <DBT_DERIVED_SCHEMA>.snowplow_mobile_users t
USING <SQL_RUNNER_DERIVED_SCHEMA>.mobile_users s
ON t.device_user_id = s.device_user_id
WHEN NOT MATCHED THEN
INSERT 
(
    user_id,
    device_user_id,
    network_userid,
    start_tstamp,
    end_tstamp,
    model_tstamp,
    screen_views,
    screen_names_viewed,
    sessions,
    sessions_duration_s,
    active_days,
    app_errors,
    fatal_app_errors,
    first_screen_view_name,
    first_screen_view_transition_type,
    first_screen_view_type,
    last_screen_view_name,
    last_screen_view_transition_type,
    last_screen_view_type,
    platform,
    dvce_screenwidth,
    dvce_screenheight,
    device_manufacturer,
    device_model,
    os_type,
    first_os_version,
    last_os_version,
    android_idfa,
    apple_idfa,
    apple_idfv,
    open_idfa,
    geo_country,
    geo_region,
    geo_city,
    geo_zipcode,
    geo_latitude,
    geo_longitude,
    geo_region_name,
    geo_timezone,
    first_carrier,
    last_carrier
)
VALUES
(
    s.user_id,
    s.device_user_id,
    s.network_userid,
    s.start_tstamp,
    s.end_tstamp,
    s.model_tstamp,
    s.screen_views,
    s.screen_names_viewed,
    s.sessions,
    s.sessions_duration_s,
    s.active_days,
    s.app_errors,
    s.fatal_app_errors,
    s.first_screen_view_name,
    s.first_screen_view_transition_type,
    s.first_screen_view_type,
    s.last_screen_view_name,
    s.last_screen_view_transition_type,
    s.last_screen_view_type,
    s.platform,
    s.dvce_screenwidth,
    s.dvce_screenheight,
    s.device_manufacturer,
    s.device_model,
    s.os_type,
    s.first_os_version,
    s.last_os_version,
    s.android_idfa,
    s.apple_idfa,
    s.apple_idfv,
    s.open_idfa,
    s.geo_country,
    s.geo_region,
    s.geo_city,
    s.geo_zipcode,
    s.geo_latitude,
    s.geo_longitude,
    s.geo_region_name,
    s.geo_timezone,
    s.first_carrier,
    s.last_carrier
);
```

#### App Errors

```sql
MERGE INTO <DBT_DERIVED_SCHEMA>.snowplow_mobile_app_errors t
USING <SQL_RUNNER_DERIVED_SCHEMA>.mobile_app_errors s
ON t.event_id = s.event_id
WHEN NOT MATCHED THEN
INSERT 
(
    event_id,
        app_id,
        user_id,
        device_user_id,
        network_userid,
        session_id,
        session_index,
        previous_session_id,
        session_first_event_id,
        dvce_created_tstamp,
        collector_tstamp,
        derived_tstamp,
        model_tstamp,
        platform,
        dvce_screenwidth,
        dvce_screenheight,
        device_manufacturer,
        device_model,
        os_type,
        os_version,
        android_idfa,
        apple_idfa,
        apple_idfv,
        open_idfa,
        screen_id,
        screen_name,
        screen_activity,
        screen_fragment,
        screen_top_view_controller,
        screen_type,
        screen_view_controller,
        device_latitude,
        device_longitude,
        device_latitude_longitude_accuracy,
        device_altitude,
        device_altitude_accuracy,
        device_bearing,
        device_speed,
        geo_country,
        geo_region,
        geo_city,
        geo_zipcode,
        geo_latitude,
        geo_longitude,
        geo_region_name,
        geo_timezone,
        user_ipaddress,
        useragent,
        carrier,
        network_technology,
        network_type,
        build,
        version,
        event_index_in_session,
        message,
        programming_language,
        class_name,
        exception_name,
        is_fatal,
        line_number,
        stack_trace,
        thread_id,
        thread_name
)
VALUES
(
    s.event_id,
    s.app_id,
    s.user_id,
    s.device_user_id,
    s.network_userid,
    s.session_id,
    s.session_index,
    s.previous_session_id,
    s.session_first_event_id,
    s.dvce_created_tstamp,
    s.collector_tstamp,
    s.derived_tstamp,
    s.model_tstamp,
    s.platform,
    s.dvce_screenwidth,
    s.dvce_screenheight,
    s.device_manufacturer,
    s.device_model,
    s.os_type,
    s.os_version,
    s.android_idfa,
    s.apple_idfa,
    s.apple_idfv,
    s.open_idfa,
    s.screen_id,
    s.screen_name,
    s.screen_activity,
    s.screen_fragment,
    s.screen_top_view_controller,
    s.screen_type,
    s.screen_view_controller,
    s.device_latitude,
    s.device_longitude,
    s.device_latitude_longitude_accuracy,
    s.device_altitude,
    s.device_altitude_accuracy,
    s.device_bearing,
    s.device_speed,
    s.geo_country,
    s.geo_region,
    s.geo_city,
    s.geo_zipcode,
    s.geo_latitude,
    s.geo_longitude,
    s.geo_region_name,
    s.geo_timezone,
    s.user_ipaddress,
    s.useragent,
    s.carrier,
    s.network_technology,
    s.network_type,
    s.build,
    s.version,
    s.event_index_in_session,
    s.message,
    s.programming_language,
    s.class_name,
    s.exception_name,
    s.is_fatal,
    s.line_number,
    s.stack_trace,
    s.thread_id,
    s.thread_name
);
```
