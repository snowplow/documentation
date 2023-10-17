---
sidebar_label: "Media Player"
sidebar_position: 400
title: "Media Player Quickstart"
---

## Requirements


In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web or mobile events dataset being available in your database:

- A dataset of media events must be available in the database. You can collect media events using our plugins for the JavaScript tracker or using the iOS and Android trackers: [Media plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/media/index.md), [HTML5 media player plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/media-tracking/index.md), [YouTube plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/youtube-tracking/index.md), [Vimeo plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/vimeo-tracking/index.md) or the [iOS and Android media APIs](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/vimeo-tracking/index.md)
- Have the [`webPage` context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md#adding-predefined-contexts) enabled on Web or the [screen context](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/screen-tracking/index.md#screen-view-event-and-screen-context-entity) on mobile (enabled by default).
- Enabled session tracking on the tracker (default).

The model is compatible with all versions of our media tracking APIs. These have evolved over time and may track the media events using two sets of event and contexts schemas:

1. Version 1 media schemas:

   - [media-player event schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0) used for all media events.
   - [media-player context v1 schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0).
   - Depending on the plugin / intention there are player-specific contexts:
      - in case of embedded YouTube tracking: Have the [YouTube specific context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.youtube/youtube/jsonschema/1-0-0) enabled.
      - in case of HTML5 audio or video tracking: Have the [HTML5 media element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0) enabled.
      - in case of HTML5 video tracking: Have the [HTML5 video element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0) enabled.

2. Version 2 media schemas (preferred):

   - [per-event media event schemas](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.media).
   - [media-player context v2 schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/2-0-0).
   - optional [media-session context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/session/jsonschema/1-0-0).
   - optional [media-ad](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad/jsonschema/1-0-0) and [ad break](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad_break/jsonschema/1-0-0) context schema.

```mdx-code-block
import DbtPrivs from "@site/docs/reusable/dbt-privs/_index.md"

<DbtPrivs/>
```

```mdx-code-block
import DbtPackageInstallation from "@site/docs/reusable/dbt-package-installation/_index.md"

<DbtPackageInstallation/>
```

## Setup

### 1. Override the dispatch order in your project
To take advantage of the optimized upsert that the Snowplow packages offer you need to ensure that certain macros are called from `snowplow_utils` first before `dbt-core`. This can be achieved by adding the following to the top level of your `dbt_project.yml` file:

```yml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

If you do not do this the package will still work, but the incremental upserts will become more costly over time.

### 2. Adding the `selectors.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the media player model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-media-player/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

### 3. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile), in the table labeled `events`. In order to change this, please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_media_player:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
    snowplow__events_table: table_of_snowplow_events
```

:::info Databricks only

Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::

### 4. Filter your data set

You can specify both `start_date` at which to start processing events, the `app_id`'s to filter for, and the `event_name` value to filter on. By default the `start_date` is set to `2020-01-01`, all `app_id`'s are selected, and all events with the `com.snowplowanalytics.snowplow.media` or the `media_player_event` event name are being surfaced. To change this please add/modify the following in your `dbt_project.yml` file:

```yml title=dbt_project.yml
...
vars:
  snowplow_media_player:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
    snowplow__media_event_names: ['media_player_event', 'my_custom_media_event']
```
### 5. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml title=dbt_project.yml
...
vars:
  snowplow_media_player:
    snowplow__derived_tstamp_partitioned: false
```

:::

### 6. Enable desired contexts and configuration

The media player package creates tables that depend on the existence of certain context entities that are tracked by the media plugins in the Snowplow trackers. Depending on which media plugin or tracking implementation you, you will need to enable the relevant contexts in your `dbt_project.yml`.

#### 6a. Using trackers with support for the version 2 media schemas

This option applied in case you are tracking media events with either the Snowplow Media plugin, Vimeo plugin for JavaScript tracker, or the iOS/Android trackers.

```yaml title=dbt_project.yml
...
vars:
  snowplow_media_player:
    # don't use the older version 1 of the media player context schema
    snowplow__enable_media_player_v1: false
    # use the version 2 of the media player context schema
    snowplow__enable_media_player_v2: true
    # use the media session context schema (unless disabled on the tracker)
    snowplow__enable_media_session: true
    # depending on whether you track ads, ad breaks and progress within ads:
    snowplow__enable_media_ad: true
    snowplow__enable_media_ad_break: true
    snowplow__enable_ad_quartile_event: true
    # depending on whether you track events from web or mobile apps:
    snowplow__enable_web_events: true
    snowplow__enable_mobile_events: true
```

#### 6b. Using the HTML5 media tracking plugin for JavaScript tracker

```yaml title=dbt_project.yml
...
vars:
  snowplow_media_player:
    # use the version 1 of the media player context schema used by the YouTube plugin
    snowplow__enable_media_player_v1: true
    # don't use the version 2 of the media player context schema as it is not tracked by the plugin
    snowplow__enable_media_player_v2: false
    # don't use the media session context schema as it is not tracked by the plugin
    snowplow__enable_media_session: false
    # set to true if the HTML5 media element context schema is enabled
    snowplow__enable_whatwg_media: true
    # set to true if the HTML5 video element context schema is enabled
    snowplow__enable_whatwg_video: true
```

#### 6c. Using the YouTube tracking plugin for JavaScript tracker

```yaml title=dbt_project.yml
...
vars:
  snowplow_media_player:
    # use the version 1 of the media player context schema used by the YouTube plugin
    snowplow__enable_media_player_v1: true
    # don't use the version 2 of the media player context schema as it is not tracked by the plugin
    snowplow__enable_media_player_v2: false
    # don't use the media session context schema as it is not tracked by the plugin
    snowplow__enable_media_session: false
    # set to true if the YouTube context schema is enabled
    snowplow__enable_youtube: true
```

For other variables you can configure please see the [model configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#model-configuration) section.

### 7. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_media_player
```
