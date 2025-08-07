---
title: Configure and run dbt package
position: 4
---

This step assumes you have data in the `ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER` table which will be used to demonstrate how to set up and run the snowplow_media_player dbt package to model Snowplow media player data.

## Override the dispatch order in your project

To take advantage of the optimized upsert that the Snowplow packages offer you need to ensure that certain macros are called from `snowplow_utils` first before `dbt-core`. This can be achieved by adding the following to the top level of your `dbt_project.yml` file:

```yaml
# dbt_project.yml
...
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

If you do not do this the package will still work, but the incremental upserts will become more costly over time.

## Add the selectors.yml file

The snowplow_media_player package provides a suite of suggested selectors to run and test the models.

These are defined in the [selectors.yml](https://github.com/snowplow/dbt-snowplow-media-player/blob/main/selectors.yml) file within the package, however to use these model selections you will need to copy this file into your own dbt project directory.

This is a top-level file and therefore should sit alongside your `dbt_project.yml` file.

## Set up variables

The snowplow_media_player dbt package comes with a list of variables specified with a default value that you may need to overwrite in your own dbt project's `dbt_project.yml` file. For details you can have a look at our [docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/media-player/) which contains descriptions and default values of each variable, or you can look in the installed package's project file which can be found at `[dbt_project_name]/dbt_packages/snowplow_media_player/dbt_project.yml`.

If you are using the provided sample data in `ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER`, add the following snippet to the `dbt_project.yml`:

```yaml
vars:
  snowplow_media_player:
    snowplow__start_date: '2023-08-04'
    snowplow__events_table: SAMPLE_EVENTS_MEDIA_PLAYER
    snowplow__enable_media_ad: true
    snowplow__enable_media_ad_break: true
    snowplow__enable_ad_quartile_event: true
```

If you are using your own events, depending on which media plugin or tracking implementation you use, you will need to enable the relevant contexts in your `dbt_project.yml`:

### Media or Vimeo JS plugin

```yaml
vars:
  snowplow_media_player:
    # use the media session context schema (unless disabled on the tracker)
    snowplow__enable_media_session: true
    # depending whether you track ads, ad breaks and progress within ads:
    snowplow__enable_media_ad: true
    snowplow__enable_media_ad_break: true
    snowplow__enable_ad_quartile_event: true
```

### YouTube JS plugin

```yaml
vars:
  snowplow_media_player:
    snowplow__enable_media_player_v1: true
    snowplow__enable_media_player_v2: false
    snowplow__enable_media_session: false
    snowplow__enable_youtube: true
```

### HTML5 media tracking JS plugin

```yaml
vars:
  snowplow_media_player:
    snowplow__enable_media_player_v1: true
    snowplow__enable_media_player_v2: false
    snowplow__enable_media_session: false
    snowplow__enable_whatwg_media: true
    snowplow__enable_whatwg_video: true
```

### Mobile

```yaml
vars:
  snowplow_media_player:
    snowplow__enable_web_events: false
    snowplow__enable_mobile_events: true
    # use the media session context schema (unless disabled on the tracker)
    snowplow__enable_media_session: true
    # depending whether you track ads, ad breaks and progress within ads:
    snowplow__enable_media_ad: true
    snowplow__enable_media_ad_break: true
    snowplow__enable_ad_quartile_event: true
```

### Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [`target.database`](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile), in the table labeled `events`. In order to change this, please add the following to your `dbt_project.yml` file:

```yaml
vars:
  snowplow_media_player:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
    snowplow__events_table: table_of_snowplow_events
```

### Filter your data set

You can specify the `start_date` at which to start processing events, the `app_id`'s to filter for, and the `event_name` value to filter on. By default the `start_date` is set to `2020-01-01`, all `app_id`'s are selected, and all events with the `com.snowplowanalytics.snowplow.media` or the `media_player_event` event name are being surfaced. To change this please add/modify the following in your `dbt_project.yml` file:

```yaml
vars:
  snowplow_media_player:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
    snowplow__media_event_names: ['media_player_event', 'my_custom_media_event']
```

## Run the model

Execute the following either through your CLI or from within dbt Cloud:

```bash
dbt run --selector snowplow_media_player
```

This should take a couple of minutes to run each time, depending on how many events you have per day.
