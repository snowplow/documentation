---
title: "Snowplow Media Player Models"
description: Reference for snowplow_media_player dbt models developed by Snowplow
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export function DbtDetails(props) {
return <div className="dbt"><details>{props.children}</details></div>
}
```

:::caution

This page is auto-generated from our dbt packages, some information may be incomplete

:::
## Snowplow Media Player
### Snowplow Media Player Base {#model.snowplow_media_player.snowplow_media_player_base}

<DbtDetails><summary>
<code>models/media_base/snowplow_media_player_base.sql</code>
</summary>

<h4>Description</h4>

This derived table aggregates media player interactions to a pageview level incrementally.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. | text |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. | text |
| media_label | The optional, human readable name given to tracked media content. | text |
| session_identifier | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. | text |
| user_id |   | text |
| page_referrer | URL of the referrer e.g. `http://www.referrer.com`. | text |
| page_url | The page URL e.g. `http://www.example.com`. | text |
| source_url | The url which shows the source of the media content. For YouTube it is the `url` context field, for HTML5 it is the `source_url` field. | text |
| geo_region_name | Visitor region name e.g. `Florida`. | text |
| br_name | Browser name e.g. `Firefox 12`. | text |
| dvce_type | Type of device e.g. `Computer`. | text |
| os_name | Name of operating system e.g. `Android`. | text |
| os_timezone | Client operating system timezone e.g. `Europe/London`. | text |
| platform | Platform e.g. ‘web’ | text |
| duration_secs | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. | float |
| media_type | The type of media content: video or audio. | text |
| media_player_type | The combination of schema_name and schema_vendor coming from the specific media player context e.g. com.youtube-youtube, org.whatwg-media_element. | text |
| start_tstamp | The `derived_tstamp` denoting the time when the event started. | timestamp_ntz |
| end_tstamp | The `derived_tstamp` denoting the time when the last media player event belonging to the specific level of aggregation (e.g.: page_view by media) started. | timestamp_ntz |
| avg_playback_rate | Average playback rate (1 is normal speed). | float |
| play_time_secs | Total seconds user spent playing content (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

 This also counts playback of rewatched content (see `content_watched_secs` for a measurement without considering rewatched content).

If the media session entity is not tracked, the value is estimated. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. | float |
| play_time_muted_secs | Total seconds user spent playing content on mute (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

If the media session entity is not tracked, the value is estimated. It is based on the percent_progress event and whether the user played it on mute during this event or not. | float |
| paused_time_secs | Total seconds user spent with paused content (excluding linear ads).

This information is provided by the tracker in the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| buffering_time_secs | Total seconds that playback was buffering.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| ads_time_secs | Total seconds that ads played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. | number |
| ads | Number of ads played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ads_clicked | Number of ads that the user clicked on.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ads_skipped | Number of ads that the user skipped.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ad_breaks | Number of ad breaks played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| is_played | Pageviews with at least one play event. | boolean |
| is_valid_play | A boolean value to show whether the duration of the play (`play_time_secs`) is bigger than or equal to the variable given in `snowplow__valid_play_sec` (defaulted to 30). | boolean |
| is_complete_play | A boolean value to show whether the total percentage played is bigger than or equal to the `snowplow__complete_play_rate` (defaulted to 0.99). | boolean |
| retention_rate | The maximum percent progress reached before any seek event. | float |
| percent_progress_reached | An array of percent progresses reached by the user while playing the media. In case the same percentprogress event was fired during the same page_view (e.g. due to seeks to rewatch part of the video) the % is added to the array again. e.g. in case of percent_progress_reached = [10, 25, 25, 50, 75] the user replayed part of the media so that the percentprogress event fired twice at the 25% mark. | text |
| content_watched_secs | Total seconds of the content played. Each part of the content played is counted once (i.e., counts rewinding or rewatching the same content only once).

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| content_watched_percent | Percentage of the content played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/media_base/snowplow_media_player_base.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized= "incremental",
    upsert_date_key='start_tstamp',
    unique_key = 'play_id',
    sort = 'start_tstamp',
    dist = 'play_id',
    tags=["derived"],
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["media_id"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize=true
  )
}}

select *

from {{ ref('snowplow_media_player_base_this_run') }}

--returns false if run doesn't contain new events.
where {{ snowplow_utils.is_run_with_new_events('snowplow_media_player') }}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_incremental_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_plays_by_pageview](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_plays_by_pageview)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Base Events This Run {#model.snowplow_media_player.snowplow_media_player_base_events_this_run}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/snowplow_media_player_base_events_this_run.sql</code>
</summary>

<h4>Description</h4>

For any given run, this table contains all required events to be consumed by subsequent nodes in the Snowplow dbt media package. This is a cleaned, deduped dataset, containing all columns from the raw events table as well as having the `page_view_id` joined in from the page view context, and all of the fields parsed from the various media contexts.

**Note: This table should be used as the input to any custom modules that require event level data, rather than selecting straight from `atomic.events`**

<h4>File Paths</h4>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

`models/base/scratch/bigquery/snowplow_media_player_base_events_this_run.sql`

</TabItem>
<TabItem value="databricks" label="databricks">

`models/base/scratch/databricks/snowplow_media_player_base_events_this_run.sql`

</TabItem>
<TabItem value="default" label="default" default>

`models/base/scratch/default/snowplow_media_player_base_events_this_run.sql`

</TabItem>
<TabItem value="snowflake" label="snowflake">

`models/base/scratch/snowflake/snowplow_media_player_base_events_this_run.sql`

</TabItem>
</Tabs>


<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

:::note

Base event this run table column lists may be incomplete and is missing contexts/unstructs, please check your warehouse for a more accurate column list.

:::

| Column Name | Description |
|:------------|:------------|
| event_id | A UUID for each event e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_identifier | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. |
| media_label | The optional, human readable name given to tracked media content. |
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. |
| duration_secs | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. |
| media_type | The type of media content: video or audio. |
| media_player_type | The combination of schema_name and schema_vendor coming from the specific media player context e.g. com.youtube-youtube, org.whatwg-media_element. |
| page_referrer | URL of the referrer e.g. `http://www.referrer.com`. |
| page_url | The page URL e.g. `http://www.example.com`. |
| source_url | The url which shows the source of the media content. For YouTube it is the `url` context field, for HTML5 it is the `source_url` field. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| br_name | Browser name e.g. `Firefox 12`. |
| dvce_type | Type of device e.g. `Computer`. |
| os_name | Name of operating system e.g. `Android`. |
| os_timezone | Client operating system timezone e.g. `Europe/London`. |
| event_type | The type of event generated by the media player. e.g. 'ended', 'paused', 'playing'. |
| start_tstamp | The `derived_tstamp` denoting the time when the event started. |
| current_time | The playback position of a specific media in seconds whenever a media player event is fired. Could be used in custom models for more detailed analytics or play time calculations. |
| playback_rate | Playback rate (1 is normal speed). |
| playback_quality | Depending on the player it is either the playback quality field or the resolution. |
| percent_progress | The percent of the way through the media. It is based on either the percentprogress event that is fired at specific intervalls as defined during the tracker setup or the 'ended' event, which is equivalent to reaching 100% of the media's total duration (length). e.g. 25, meaning the user passed the 25% mark during play. It does not mean the user watched all the content in between two percentprogress marks, unless there is no seek events happening within the same page_view (`snowplow_media_player_base`). |
| is_muted | If the media is muted during the event that is fired. |
| play_time_secs | Total seconds user spent playing content (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

 This also counts playback of rewatched content (see `content_watched_secs` for a measurement without considering rewatched content).

If the media session entity is not tracked, the value is estimated. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. |
| play_time_muted_secs | Total seconds user spent playing content on mute (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

If the media session entity is not tracked, the value is estimated. It is based on the percent_progress event and whether the user played it on mute during this event or not. |
| collector_tstamp | Time stamp for the event recorded by the collector e.g. `2013-11-26 00:02:05`. |
| event_in_session_index | The index of the event in the corresponding session. |
| media_session_id | An identifier for the media session that is kept while the media content is played in the media player. |
| media_session_time_played | Total seconds user spent playing content (excluding linear ads). |
| media_session_time_played_muted | Total seconds user spent playing content on mute (excluding linear ads). |
| media_session_time_paused | Total seconds user spent with paused content (excluding linear ads). |
| media_session_content_watched | Total seconds of the content played. Each part of the content played is counted once (i.e., counts rewinding or rewatching the same content only once). Playback rate does not affect this value. |
| media_session_time_buffering | Total seconds that playback was buffering during the session. |
| media_session_time_spent_ads | Total seconds that ads played during the session. |
| media_session_ads | Number of ads played. |
| media_session_ads_clicked | Number of ads that the user clicked on. |
| media_session_ads_skipped | Number of ads that the user skipped. |
| media_session_ad_breaks | Number of ad breaks played. |
| media_session_avg_playback_rate | Average playback rate (1 is normal speed). |
| ad_name | Friendly name of the ad. |
| ad_id | Unique identifier for the ad taken from the ad context entity. |
| ad_creative_id | The ID of the ad creative. |
| ad_pod_position | The position of the ad within the ad break, starting with 1. |
| ad_duration_secs | Length of the video ad in seconds as reported in the ad context entity. |
| ad_skippable | Indicating whether skip controls are made available to the end user. |
| ad_break_name | Ad break name (e.g., pre-roll, mid-roll, and post-roll), reported in the ad_break context entity. |
| ad_break_id | An identifier for the ad break (reported in the ad_break context entity). |
| ad_break_type | Type of ads within the break: linear (take full control of the video for a period of time), nonlinear (run concurrently to the video), companion (accompany the video but placed outside the player). Reported in the ad_break context entity. |
| ad_percent_progress | The percent of the way through the ad. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/scratch/bigquery/snowplow_media_player_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    tags=["this_run"]
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_media_player_base_sessions_this_run'),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}

-- check for exceptions
{% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
  {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both need to be enabled for modelling html5 video tracking data.") }}
{% elif not var("snowplow__enable_media_player_v1") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media player context enabled. Please enable at least one media player context: snowplow__enable_media_player_v1 or snowplow__enable_media_player_v2") }}
{% elif not var("snowplow__enable_youtube") and not var("snowplow__enable_whatwg_media") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_media_player_v2, snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
{% endif %}

with prep as (

  select

    a.* except (
      domain_userid,
      domain_sessionid,
      derived_tstamp

      {% if not var('snowplow__enable_load_tstamp', true) %}
      , load_tstamp
      {% endif %}
    ),

    a.derived_tstamp as start_tstamp,
    b.domain_userid, -- take domain_userid from manifest. This ensures only 1 domain_userid per session.
    b.session_id as session_identifier,

    {{ web_or_mobile_field(
      web={ 'field': 'id', 'col_prefix': 'contexts_com_snowplowanalytics_snowplow_web_page_1' },
      mobile={'field': 'id', 'col_prefix': 'contexts_com_snowplowanalytics_mobile_screen_1' }
    ) }} as page_view_id,

    -- unpacking the media player event
    {{ media_player_field(
      v1={ 'field': 'label', 'col_prefix': 'unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1' },
      v2={ 'field': 'label' },
    ) }} as media_label,
    {{ media_event_type_field(media_player_event_type={}, event_name='a.event_name') }} as event_type,

    -- unpacking the media player object
    round({{ media_player_field(
      v1={ 'field': 'duration', 'dtype': 'numeric' },
      v2={ 'field': 'duration', 'dtype': 'numeric' }
    ) }}) as duration_secs,
    {{ media_player_field(
      v1={ 'field': 'current_time', 'dtype': 'numeric' },
      v2={ 'field': 'current_time', 'dtype': 'numeric' }
    ) }} as current_time,
    {{ media_player_field(
      v1={ 'field': 'playback_rate', 'dtype': 'numeric' },
      v2={ 'field': 'playback_rate', 'dtype': 'numeric' },
      default='1.0'
    ) }} as playback_rate,
    {{ percent_progress_field(
        v1_percent_progress={ 'field': 'percent_progress', 'dtype': 'int' },
        v1_event_type={},
        event_name='a.event_name',
        v2_current_time={ 'field': 'current_time', 'dtype': 'numeric' },
        v2_duration={ 'field': 'duration', 'dtype': 'numeric'}
    ) }} as percent_progress,
    {{ media_player_field(
      v1={ 'field': 'muted', 'dtype': 'boolean' },
      v2={ 'field': 'muted', 'dtype': 'boolean' }
    ) }} as is_muted,

    -- media session properties
    {{ media_session_field({ 'field': 'media_session_id' }) }} as media_session_id,
    {{ media_session_field({ 'field': 'time_played', 'dtype': 'numeric' }) }} as media_session_time_played,
    {{ media_session_field({ 'field': 'time_played_muted', 'dtype': 'numeric' }) }} as media_session_time_played_muted,
    {{ media_session_field({ 'field': 'time_paused', 'dtype': 'numeric' }) }} as media_session_time_paused,
    {{ media_session_field({ 'field': 'content_watched', 'dtype': 'numeric' }) }} as media_session_content_watched,
    {{ media_session_field({ 'field': 'time_buffering', 'dtype': 'numeric' }) }} as media_session_time_buffering,
    {{ media_session_field({ 'field': 'time_spent_ads', 'dtype': 'numeric' }) }} as media_session_time_spent_ads,
    {{ media_session_field({ 'field': 'ads', 'dtype': 'int' }) }} as media_session_ads,
    {{ media_session_field({ 'field': 'ads_clicked', 'dtype': 'int' }) }} as media_session_ads_clicked,
    {{ media_session_field({ 'field': 'ads_skipped', 'dtype': 'int' }) }} as media_session_ads_skipped,
    {{ media_session_field({ 'field': 'ad_breaks', 'dtype': 'int' }) }} as media_session_ad_breaks,
    {{ media_session_field({ 'field': 'avg_playback_rate', 'dtype': 'numeric' }) }} as media_session_avg_playback_rate,

    -- ad properties
    {{ media_ad_field({ 'field': 'name' }) }} as ad_name,
    {{ media_ad_field({ 'field': 'ad_id' }) }} as ad_id,
    {{ media_ad_field({ 'field': 'creative_id' }) }} as ad_creative_id,
    {{ media_ad_field({ 'field': 'pod_position', 'dtype': 'int' }) }} as ad_pod_position,
    {{ media_ad_field({ 'field': 'duration', 'dtype': 'numeric' }) }} as ad_duration_secs,
    {{ media_ad_field({ 'field': 'skippable', 'dtype': 'boolean' }) }} as ad_skippable,

    -- ad break properties
    {{ media_ad_break_field({ 'field': 'name' }) }} as ad_break_name,
    {{ media_ad_break_field({ 'field': 'break_id' }) }} as ad_break_id,
    {{ media_ad_break_field({ 'field': 'break_type' }) }} as ad_break_type,

    -- ad quartile event
    {{ media_ad_quartile_event_field({ 'field': 'percent_progress', 'dtype': 'int' }) }} as ad_percent_progress,

    -- combined media properties
    {{ media_id_field(
      v2_player_label={ 'field': 'label' },
      youtube_player_id={ 'field': 'player_id' },
      media_player_id={ 'field': 'html_id' }
    ) }} as media_id,
    {{ media_player_type_field(
      v2_player_type={ 'field': 'player_type' },
      youtube_player_id={ 'field': 'player_id' },
      media_player_id={ 'field': 'html_id' }
    ) }} as media_player_type,
    {{ source_url_field(
      youtube_url={ 'field': 'url' },
      media_current_src={ 'field': 'current_src' }
    )}} as source_url,
    {{ media_type_field(
      v2_media_type={ 'field': 'media_type' },
      media_media_type={ 'field': 'media_type' }
    ) }} as media_type,
    {{ playback_quality_field(
        v2_quality={ 'field': 'quality' },
        youtube_quality={ 'field': 'playback_quality' },
        video_width={ 'field': 'video_width', 'dtype': 'int' },
        video_height={ 'field': 'video_height', 'dtype': 'int' }
    ) }} as playback_quality

    from {{ var('snowplow__events') }} as a
    inner join {{ ref('snowplow_media_player_base_sessions_this_run') }} as b
      on {{ web_or_mobile_field(
        web='a.domain_sessionid',
        mobile={ 'field': 'session_id', 'col_prefix': 'contexts_com_snowplowanalytics_snowplow_client_session_1', 'dtype': 'string' }
      ) }} = b.session_id

    where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
    and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
    and a.collector_tstamp >= {{ lower_limit }}
    and a.collector_tstamp <= {{ upper_limit }}
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %}
      and a.derived_tstamp >= {{ snowplow_utils.timestamp_add('hour', -1, lower_limit) }}
      and a.derived_tstamp <= {{ upper_limit }}
    {% endif %}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ snowplow_media_player.event_name_filter(var("snowplow__media_event_names", "['media_player_event']")) }}

    qualify row_number() over (partition by a.event_id order by a.collector_tstamp) = 1

)

, ranked as (

  select
    *,
    dense_rank() over (partition by ev.session_identifier order by ev.start_tstamp) AS event_in_session_index,
  from prep as ev

)

select
  coalesce(
    p.media_session_id,
    {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }}
  ) as play_id,
  p.*,

  coalesce(cast(piv.weight_rate * p.duration_secs / 100 as {{ type_int() }}), 0) as play_time_secs,
  coalesce(cast(case when p.is_muted = true then piv.weight_rate * p.duration_secs / 100 else 0 end as {{ type_int() }}), 0) as play_time_muted_secs

  from ranked p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```

</TabItem>
<TabItem value="databricks" label="databricks">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/scratch/databricks/snowplow_media_player_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    tags=["this_run"]
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_media_player_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

-- check for exceptions
{% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
  {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both need to be enabled for modelling html5 video tracking data.") }}
{% elif not var("snowplow__enable_media_player_v1") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media player context enabled. Please enable at least one media player context: snowplow__enable_media_player_v1 or snowplow__enable_media_player_v2") }}
{% elif not var("snowplow__enable_youtube") and not var("snowplow__enable_whatwg_media") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_media_player_v2, snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
{% endif %}

with prep AS (

  select

    a.* except (
      domain_userid,
      domain_sessionid,
      derived_tstamp

      {% if not var('snowplow__enable_load_tstamp', true) %}
      , load_tstamp
      {% endif %}
    ),

    a.derived_tstamp as start_tstamp,
    b.domain_userid, -- take domain_userid from manifest. This ensures only 1 domain_userid per session.
    b.session_id as session_identifier,

    {{ web_or_mobile_field(
      web={ 'field': 'id', 'col_prefix': 'contexts_com_snowplowanalytics_snowplow_web_page_1', 'dtype': 'string' },
      mobile={ 'field': 'id', 'col_prefix': 'contexts_com_snowplowanalytics_mobile_screen_1', 'dtype': 'string' }
    ) }} as page_view_id,

    -- unpacking the media player event
    {{ media_player_field(
      v1={ 'field': 'label', 'col_prefix': 'unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1', 'dtype': 'string' },
      v2={ 'field': 'label', 'dtype': 'string' }
    ) }} as media_label,
    {{ media_event_type_field(media_player_event_type={ 'dtype': 'string' }, event_name='a.event_name') }} as event_type,

    -- unpacking the media player object
    round({{ media_player_field(
      v1={ 'field': 'duration', 'dtype': 'double' },
      v2={ 'field': 'duration', 'dtype': 'double' }
    ) }}) as duration_secs,
    {{ media_player_field(
      v1={ 'field': 'current_time', 'dtype': 'double' },
      v2={ 'field': 'current_time', 'dtype': 'double' }
    ) }} as current_time,
    {{ media_player_field(
      v1={ 'field': 'playback_rate', 'dtype': 'double' },
      v2={ 'field': 'playback_rate', 'dtype': 'double' },
      default='1.0'
    ) }} as playback_rate,
    {{ percent_progress_field(
        v1_percent_progress={ 'field': 'percent_progress', 'dtype': 'string' },
        v1_event_type={ 'field': 'type', 'dtype': 'string' },
        event_name='a.event_name',
        v2_current_time={ 'field': 'current_time', 'dtype': 'double' },
        v2_duration={ 'field': 'duration', 'dtype': 'double' }
    ) }} as percent_progress,
    {{ media_player_field(
      v1={ 'field': 'muted', 'dtype': 'boolean' },
      v2={ 'field': 'muted', 'dtype': 'boolean' }
    ) }} as is_muted,

    -- media session properties
    {{ media_session_field({ 'field': 'media_session_id', 'dtype': 'string' }) }} as media_session_id,
    {{ media_session_field({ 'field': 'time_played', 'dtype': 'double' }) }} as media_session_time_played,
    {{ media_session_field({ 'field': 'time_played_muted', 'dtype': 'double' }) }} as media_session_time_played_muted,
    {{ media_session_field({ 'field': 'time_paused', 'dtype': 'double' }) }} as media_session_time_paused,
    {{ media_session_field({ 'field': 'content_watched', 'dtype': 'double' }) }} as media_session_content_watched,
    {{ media_session_field({ 'field': 'time_buffering', 'dtype': 'double' }) }} as media_session_time_buffering,
    {{ media_session_field({ 'field': 'time_spent_ads', 'dtype': 'double' }) }} as media_session_time_spent_ads,
    {{ media_session_field({ 'field': 'ads', 'dtype': 'integer' }) }} as media_session_ads,
    {{ media_session_field({ 'field': 'ads_clicked', 'dtype': 'integer' }) }} as media_session_ads_clicked,
    {{ media_session_field({ 'field': 'ads_skipped', 'dtype': 'integer' }) }} as media_session_ads_skipped,
    {{ media_session_field({ 'field': 'ad_breaks', 'dtype': 'integer' }) }} as media_session_ad_breaks,
    {{ media_session_field({ 'field': 'avg_playback_rate', 'dtype': 'double' }) }} as media_session_avg_playback_rate,

    -- ad properties
    {{ media_ad_field({ 'field': 'name', 'dtype': 'string' }) }} as ad_name,
    {{ media_ad_field({ 'field': 'ad_id', 'dtype': 'string' }) }} as ad_id,
    {{ media_ad_field({ 'field': 'creative_id', 'dtype': 'string' }) }} as ad_creative_id,
    {{ media_ad_field({ 'field': 'pod_position', 'dtype': 'integer' }) }} as ad_pod_position,
    {{ media_ad_field({ 'field': 'duration', 'dtype': 'double' }) }} as ad_duration_secs,
    {{ media_ad_field({ 'field': 'skippable', 'dtype': 'boolean' }) }} as ad_skippable,

    -- ad break properties
    {{ media_ad_break_field({ 'field': 'name', 'dtype': 'string' }) }} as ad_break_name,
    {{ media_ad_break_field({ 'field': 'break_id', 'dtype': 'string' }) }} as ad_break_id,
    {{ media_ad_break_field({ 'field': 'break_type', 'dtype': 'string' }) }} as ad_break_type,

    -- ad quartile event
    {{ media_ad_quartile_event_field({ 'field': 'percent_progress', 'dtype': 'integer' }) }} as ad_percent_progress,

    -- combined media properties
    {{ media_id_field(
      v2_player_label={ 'field': 'label', 'dtype': 'string' },
      youtube_player_id={ 'field': 'player_id', 'dtype': 'string' },
      media_player_id={ 'field': 'html_id', 'dtype': 'string' }
    ) }} as media_id,
    {{ media_player_type_field(
      v2_player_type={ 'field': 'player_type', 'dtype': 'string' },
      youtube_player_id={ 'field': 'player_id', 'dtype': 'string' },
      media_player_id={ 'field': 'html_id', 'dtype': 'string' }
    ) }} as media_player_type,
    {{ source_url_field(
      youtube_url={ 'field': 'url', 'dtype': 'string' },
      media_current_src={ 'field': 'current_src', 'dtype': 'string' }
    ) }} as source_url,
    {{ media_type_field(
      v2_media_type={ 'field': 'media_type', 'dtype': 'string' },
      media_media_type={ 'field': 'media_type', 'dtype': 'string' }
    ) }} as media_type,
    {{ playback_quality_field(
        v2_quality={ 'field': 'quality', 'dtype': 'string' },
        youtube_quality={ 'field': 'playback_quality', 'dtype': 'string' },
        video_width={ 'field': 'video_width', 'dtype': 'integer' },
        video_height={ 'field': 'video_height', 'dtype': 'integer' }
    )}} as playback_quality

  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_media_player_base_sessions_this_run') }} as b
  on {{ web_or_mobile_field(
    web='a.domain_sessionid',
    mobile={ 'field': 'session_id', 'col_prefix': 'contexts_com_snowplowanalytics_snowplow_client_session_1', 'dtype': 'string' }
  ) }} = b.session_id

  where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
  and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
  and a.collector_tstamp >= {{ lower_limit }}
  and a.collector_tstamp <= {{ upper_limit }}
  and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
  and {{ snowplow_media_player.event_name_filter(var("snowplow__media_event_names", "['media_player_event']")) }}

  qualify row_number() over (partition by a.event_id order by a.collector_tstamp) = 1
)

select
  coalesce(
    p.media_session_id,
    {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }}
  ) as play_id,
  p.* except (percent_progress),

  cast(p.percent_progress as integer) as percent_progress,

  coalesce(cast(round(piv.weight_rate * p.duration_secs / 100) as {{ type_int() }}), 0) as play_time_secs,
  coalesce(cast(case when p.is_muted = true then round(piv.weight_rate * p.duration_secs / 100) else 0 end as {{ type_int() }}), 0) as play_time_muted_secs,

  dense_rank() over (partition by session_identifier order by start_tstamp) AS event_in_session_index

  from prep p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```

</TabItem>
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/scratch/default/snowplow_media_player_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
    config(
        sort='collector_tstamp',
        dist='event_id',
        tags=["this_run"]
    )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_media_player_base_sessions_this_run'),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}

-- check for exceptions
{% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
  {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both need to be enabled for modelling html5 video tracking data.") }}
{% elif not var("snowplow__enable_media_player_v1") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media player context enabled. Please enable at least one media player context: snowplow__enable_media_player_v1 or snowplow__enable_media_player_v2") }}
{% elif not var("snowplow__enable_youtube") and not var("snowplow__enable_whatwg_media") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_media_player_v2, snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
{% endif %}

with

{% if var("snowplow__enable_mobile_events") %}
-- unpacking the screen context entity
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_screen'), lower_limit, upper_limit) }},
-- unpacking the client session context entity
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_mobile_session'), lower_limit, upper_limit) }},
{% endif %}

/* Dedupe logic: Per dupe event_id keep earliest row ordered by collector_tstamp.
   If multiple earliest rows, take arbitrary one using row_number(). */

events_this_run AS (

    select
        a.app_id,
        a.platform,
        a.etl_tstamp,
        a.collector_tstamp,
        a.dvce_created_tstamp,
        a.event,
        a.event_id,
        a.txn_id,
        a.name_tracker,
        a.v_tracker,
        a.v_collector,
        a.v_etl,
        a.user_id,
        a.user_ipaddress,
        a.user_fingerprint,
        b.domain_userid, -- take domain_userid from manifest. This ensures only 1 domain_userid per session.
        a.domain_sessionidx,
        a.network_userid,
        a.geo_country,
        a.geo_region,
        a.geo_city,
        a.geo_zipcode,
        a.geo_latitude,
        a.geo_longitude,
        a.geo_region_name,
        a.ip_isp,
        a.ip_organization,
        a.ip_domain,
        a.ip_netspeed,
        a.page_url,
        a.page_title,
        a.page_referrer,
        a.page_urlscheme,
        a.page_urlhost,
        a.page_urlport,
        a.page_urlpath,
        a.page_urlquery,
        a.page_urlfragment,
        a.refr_urlscheme,
        a.refr_urlhost,
        a.refr_urlport,
        a.refr_urlpath,
        a.refr_urlquery,
        a.refr_urlfragment,
        a.refr_medium,
        a.refr_source,
        a.refr_term,
        a.mkt_medium,
        a.mkt_source,
        a.mkt_term,
        a.mkt_content,
        a.mkt_campaign,
        a.se_category,
        a.se_action,
        a.se_label,
        a.se_property,
        a.se_value,
        a.tr_orderid,
        a.tr_affiliation,
        a.tr_total,
        a.tr_tax,
        a.tr_shipping,
        a.tr_city,
        a.tr_state,
        a.tr_country,
        a.ti_orderid,
        a.ti_sku,
        a.ti_name,
        a.ti_category,
        a.ti_price,
        a.ti_quantity,
        a.pp_xoffset_min,
        a.pp_xoffset_max,
        a.pp_yoffset_min,
        a.pp_yoffset_max,
        a.useragent,
        a.br_name,
        a.br_family,
        a.br_version,
        a.br_type,
        a.br_renderengine,
        a.br_lang,
        a.br_features_pdf,
        a.br_features_flash,
        a.br_features_java,
        a.br_features_director,
        a.br_features_quicktime,
        a.br_features_realplayer,
        a.br_features_windowsmedia,
        a.br_features_gears,
        a.br_features_silverlight,
        a.br_cookies,
        a.br_colordepth,
        a.br_viewwidth,
        a.br_viewheight,
        a.os_name,
        a.os_family,
        a.os_manufacturer,
        a.os_timezone,
        a.dvce_type,
        a.dvce_ismobile,
        a.dvce_screenwidth,
        a.dvce_screenheight,
        a.doc_charset,
        a.doc_width,
        a.doc_height,
        a.tr_currency,
        a.tr_total_base,
        a.tr_tax_base,
        a.tr_shipping_base,
        a.ti_currency,
        a.ti_price_base,
        a.base_currency,
        a.geo_timezone,
        a.mkt_clickid,
        a.mkt_network,
        a.etl_tags,
        a.dvce_sent_tstamp,
        a.refr_domain_userid,
        a.refr_dvce_tstamp,
        b.session_id as session_identifier,
        a.derived_tstamp as start_tstamp,
        a.event_vendor,
        a.event_name,
        a.event_format,
        a.event_version,
        a.event_fingerprint,
        a.true_tstamp,
        {% if var('snowplow__enable_load_tstamp', true) %}
        a.load_tstamp,
        {% endif %}

        row_number() over (partition by a.event_id order by a.collector_tstamp) as event_id_dedupe_index,
        count(*) over (partition by a.event_id) as event_id_dedupe_count

    from {{ var('snowplow__events') }} as a
    {% if var('snowplow__enable_mobile_events', false) -%}
        left join {{ var('snowplow__context_mobile_session') }} cs on a.event_id = cs.client_session__id and a.collector_tstamp = cs.client_session__tstamp
    {%- endif %}
        inner join {{ ref('snowplow_media_player_base_sessions_this_run') }} as b
        on {{ web_or_mobile_field(
          web='a.domain_sessionid',
          mobile='cs.session_id'
        ) }} = b.session_id

    where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
        and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
        and a.collector_tstamp >= {{ lower_limit }}
        and a.collector_tstamp <= {{ upper_limit }}
        and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
        and {{ snowplow_media_player.event_name_filter(var("snowplow__media_event_names", "['media_player_event']")) }}

),

{% if var("snowplow__enable_media_player_v1") %}
-- unpacking the media player event
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__media_player_event_context'), lower_limit, upper_limit) }},
-- unpacking the media player context entity
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__media_player_context'), lower_limit, upper_limit) }},
{% endif %}
{% if var("snowplow__enable_media_player_v2") %}
-- unpacking the media player context entity v2
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__media_player_v2_context'), lower_limit, upper_limit) }},
{% endif %}
{% if var("snowplow__enable_media_session") %}
-- unpacking the media session context entity
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__media_session_context'), lower_limit, upper_limit) }},
{% endif %}
{% if var("snowplow__enable_media_ad") %}
-- unpacking the media ad context entity
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__media_ad_context'), lower_limit, upper_limit) }},
{% endif %}
{% if var("snowplow__enable_media_ad_break") %}
-- unpacking the media ad break context entity
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__media_ad_break_context'), lower_limit, upper_limit) }},
{% endif %}
-- unpacking the youtube context entity
{%- if var("snowplow__enable_youtube") -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__youtube_context'), lower_limit, upper_limit) }},
{%- endif %}
-- unpacking the whatwg media context entity
{% if var("snowplow__enable_whatwg_media") -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__html5_media_element_context'), lower_limit, upper_limit) }},
{%- endif %}
-- unpacking the whatwg video context entity
{% if var("snowplow__enable_whatwg_video") -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__html5_video_element_context'), lower_limit, upper_limit) }},
{%- endif %}
{% if var("snowplow__enable_web_events") %}
-- unpacking the web page context entity
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_web_page'), lower_limit, upper_limit) }},
{% endif %}
{% if var("snowplow__enable_ad_quartile_event") %}
-- unpacking the ad quartile event
{{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__media_ad_quartile_event'), lower_limit, upper_limit) }},
{% endif %}

prep as (
  select
    ev.*,

    {{ web_or_mobile_field(web='pv.id', mobile='sv.id') }} as page_view_id,

    -- unpacking the media player event
    {{ media_player_field(v1='mpe.label', v2='mp2.label') }} as media_label,
    {{ media_event_type_field(media_player_event_type='mpe.type', event_name='ev.event_name') }} as event_type,

    -- unpacking the media player object
    round({{ media_player_field(v1='mp.duration', v2='mp2.duration') }}) as duration_secs,
    {{ media_player_field(v1='mp.current_time', v2='mp2.current_time') }} as current_time,
    {{ media_player_field(
        v1='mp.playback_rate',
        v2='mp2.playback_rate',
        default='1'
    ) }} as playback_rate,
    {{ percent_progress_field(
        v1_percent_progress='mp.percent_progress',
        v1_event_type='mpe.type',
        event_name='ev.event_name',
        v2_current_time='mp2.current_time',
        v2_duration='mp2.duration'
    ) }} as percent_progress,
    {{ media_player_field(v1='mp.muted', v2='mp2.muted') }} as is_muted,

    -- media session properties
    cast({{ media_session_field('ms.media_session_id') }} as {{ type_string() }}) as media_session_id, {# This is the only key actually used regardless, redshift doesn't like casting a null at a later time#}
    {{ media_session_field('ms.time_played') }} as media_session_time_played,
    {{ media_session_field('ms.time_played_muted') }} as media_session_time_played_muted,
    {{ media_session_field('ms.time_paused') }} as media_session_time_paused,
    {{ media_session_field('ms.content_watched') }} as media_session_content_watched,
    {{ media_session_field('ms.time_buffering') }} as media_session_time_buffering,
    {{ media_session_field('ms.time_spent_ads') }} as media_session_time_spent_ads,
    {{ media_session_field('ms.ads') }} as media_session_ads,
    {{ media_session_field('ms.ads_clicked') }} as media_session_ads_clicked,
    {{ media_session_field('ms.ads_skipped') }} as media_session_ads_skipped,
    {{ media_session_field('ms.ad_breaks') }} as media_session_ad_breaks,
    {{ media_session_field('ms.avg_playback_rate') }} as media_session_avg_playback_rate,

    -- ad properties
    {{ media_ad_field('ma.name') }} as ad_name,
    {{ media_ad_field('ma.ad_id') }} as ad_id,
    {{ media_ad_field('ma.creative_id') }} as ad_creative_id,
    {{ media_ad_field('ma.pod_position') }} as ad_pod_position,
    {{ media_ad_field('ma.duration') }} as ad_duration_secs,
    {{ media_ad_field('ma.skippable') }} as ad_skippable,

    -- ad break properties
    {{ media_ad_break_field('mb.name') }} as ad_break_name,
    {{ media_ad_break_field('mb.break_id') }} as ad_break_id,
    {{ media_ad_break_field('mb.break_type') }} as ad_break_type,

    -- ad quartile event
    {{ media_ad_quartile_event_field('aq.percent_progress') }} as ad_percent_progress,

    -- combined media properties
    {{ media_id_field(v2_player_label='mp2.label', youtube_player_id='yt.player_id', media_player_id='me.html_id') }} as media_id,
    {{ media_player_type_field(v2_player_type='mp2.player_type', youtube_player_id='yt.player_id', media_player_id='me.html_id') }} as media_player_type,
    {{ source_url_field(youtube_url='yt.url', media_current_src='me.current_src')}} as source_url,
    {{ media_type_field(v2_media_type='mp2.media_type', media_media_type='me.media_type')}} as media_type,
    {{ playback_quality_field(
        v2_quality='mp2.quality',
        youtube_quality='yt.playback_quality',
        video_width='ve.video_width',
        video_height='ve.video_height'
    )}} as playback_quality,

    dense_rank() over (partition by session_identifier order by start_tstamp) AS event_in_session_index

    from events_this_run ev

    -- youtube context entity
    {% if var("snowplow__enable_youtube") %}
        left join {{ var('snowplow__youtube_context') }} yt on ev.event_id = yt.youtube__id and ev.collector_tstamp = yt.youtube__tstamp
    {%- endif %}
    -- whatwg media context entity
    {% if var("snowplow__enable_whatwg_media") %}
    left join {{ var('snowplow__html5_media_element_context') }} me on ev.event_id = me.media_element__id and ev.collector_tstamp = me.media_element__tstamp
    {%- endif %}
    -- whatwg video context entity
    {% if var("snowplow__enable_whatwg_video") %}
    left join {{ var('snowplow__html5_video_element_context') }} ve on ev.event_id = ve.video_element__id and ev.collector_tstamp = ve.video_element__tstamp
    {%- endif %}
    {% if var("snowplow__enable_media_player_v1") %}
    -- media player event
    left join {{ var('snowplow__media_player_event_context') }} mpe on ev.event_id = mpe.media_player_event__id and ev.collector_tstamp = mpe.media_player_event__tstamp
    -- media player context entity
    left join {{ var('snowplow__media_player_context') }} mp on ev.event_id = mp.media_player__id and ev.collector_tstamp = mp.media_player__tstamp
    {% endif %}
    {% if var("snowplow__enable_media_player_v2") %}
    -- media player v2 context entity
    left join {{ var('snowplow__media_player_v2_context') }} mp2 on ev.event_id = mp2.media_player__id and ev.collector_tstamp = mp2.media_player__tstamp
    {% endif %}
    {% if var("snowplow__enable_media_session") %}
    -- media session context entity
    left join {{ var('snowplow__media_session_context') }} ms on ev.event_id = ms.session__id and ev.collector_tstamp = ms.session__tstamp
    {% endif %}
    {% if var("snowplow__enable_media_ad") %}
    -- media ad context entity
    left join {{ var('snowplow__media_ad_context') }} ma on ev.event_id = ma.ad__id and ev.collector_tstamp = ma.ad__tstamp
    {% endif %}
    {% if var("snowplow__enable_media_ad_break") %}
    -- media ad break context entity
    left join {{ var('snowplow__media_ad_break_context') }} mb on ev.event_id = mb.ad_break__id and ev.collector_tstamp = mb.ad_break__tstamp
    {% endif %}
    {% if var("snowplow__enable_web_events") %}
    -- web page context entity
    left join {{ var('snowplow__context_web_page') }} pv on ev.platform = 'web' and ev.event_id = pv.web_page__id and ev.collector_tstamp = pv.web_page__tstamp
    {% endif %}
    {% if var("snowplow__enable_mobile_events") %}
    -- screen context entity
    left join {{ var('snowplow__context_screen') }} sv on ev.platform = 'mob' and ev.event_id = sv.screen__id and ev.collector_tstamp = sv.screen__tstamp
    {% endif %}
    {% if var("snowplow__enable_ad_quartile_event") %}
    -- ad quartile event
    left join {{ var('snowplow__media_ad_quartile_event') }} aq on ev.event_id = aq.ad_quartile_event__id and ev.collector_tstamp = aq.ad_quartile_event__tstamp
    {% endif %}

where
    ev.event_id_dedupe_index = 1
)

select
 coalesce(
    p.media_session_id,
    {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }}
  ) play_id,
  p.*,
  coalesce(cast(round(piv.weight_rate * p.duration_secs / 100) as {{ type_int() }}), 0) as play_time_secs,
  coalesce(cast(case when p.is_muted then round(piv.weight_rate * p.duration_secs / 100) end as {{ type_int() }}), 0) as play_time_muted_secs

  from prep p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/scratch/snowflake/snowplow_media_player_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_media_player_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

-- check for exceptions
{% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
  {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both need to be enabled for modelling html5 video tracking data.") }}
{% elif not var("snowplow__enable_media_player_v1") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media player context enabled. Please enable at least one media player context: snowplow__enable_media_player_v1 or snowplow__enable_media_player_v2") }}
{% elif not var("snowplow__enable_youtube") and not var("snowplow__enable_whatwg_media") and not var("snowplow__enable_media_player_v2") %}
  {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_media_player_v2, snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
{% endif %}

with prep as (

  select

    a.* exclude (
      domain_userid,
      domain_sessionid,
      derived_tstamp

      {% if not var('snowplow__enable_load_tstamp', true) %}
      , load_tstamp
      {% endif %}
    ),

    a.derived_tstamp as start_tstamp,
    b.domain_userid, -- take domain_userid from manifest. This ensures only 1 domain_userid per session.
    b.session_id as session_identifier,

    {{ web_or_mobile_field(
      web={ 'field': 'id', 'col_prefix': 'contexts_com_snowplowanalytics_snowplow_web_page_1', 'dtype': 'varchar' },
      mobile={ 'field': 'id', 'col_prefix': 'contexts_com_snowplowanalytics_mobile_screen_1', 'dtype': 'varchar' }
    ) }} as page_view_id,

    -- unpacking the media player event
    {{ media_player_field(
      v1={ 'field': 'label', 'col_prefix': 'unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1', 'dtype': 'varchar' },
      v2={ 'field': 'label', 'dtype': 'varchar' }
    ) }} as media_label,
    {{ media_event_type_field(media_player_event_type={ 'dtype': 'varchar' }, event_name='a.event_name') }} as event_type,

    -- unpacking the media player object
    round({{ media_player_field(
      v1={ 'field': 'duration', 'dtype': 'float' },
      v2={ 'field': 'duration', 'dtype': 'float' }
    ) }}) as duration_secs,
    {{ media_player_field(
      v1={ 'field': 'currentTime', 'dtype': 'float' },
      v2={ 'field': 'currentTime', 'dtype': 'float' }
    ) }} as current_time,
    {{ media_player_field(
      v1={ 'field': 'playbackRate', 'dtype': 'float' },
      v2={ 'field': 'playbackRate', 'dtype': 'float' },
      default='1.0'
    ) }} as playback_rate,
    {{ percent_progress_field(
        v1_percent_progress={ 'field': 'percentProgress', 'dtype': 'varchar' },
        v1_event_type={ 'field': 'type', 'dtype': 'varchar' },
        event_name='a.event_name',
        v2_current_time={ 'field': 'currentTime', 'dtype': 'float' },
        v2_duration={ 'field': 'duration', 'dtype': 'float' }
    ) }} as percent_progress,
    {{ media_player_field(
      v1={ 'field': 'muted', 'dtype': 'boolean' },
      v2={ 'field': 'muted', 'dtype': 'boolean' }
    ) }} as is_muted,

    -- media session properties
    {{ media_session_field({ 'field': 'mediaSessionId', 'dtype': 'varchar' }) }} as media_session_id,
    {{ media_session_field({ 'field': 'timePlayed', 'dtype': 'float' }) }} as media_session_time_played,
    {{ media_session_field({ 'field': 'timePlayedMuted', 'dtype': 'float' }) }} as media_session_time_played_muted,
    {{ media_session_field({ 'field': 'timePaused', 'dtype': 'float' }) }} as media_session_time_paused,
    {{ media_session_field({ 'field': 'contentWatched', 'dtype': 'float' }) }} as media_session_content_watched,
    {{ media_session_field({ 'field': 'timeBuffering', 'dtype': 'float' }) }} as media_session_time_buffering,
    {{ media_session_field({ 'field': 'timeSpentAds', 'dtype': 'float' }) }} as media_session_time_spent_ads,
    {{ media_session_field({ 'field': 'ads', 'dtype': 'integer' }) }} as media_session_ads,
    {{ media_session_field({ 'field': 'adsClicked', 'dtype': 'integer' }) }} as media_session_ads_clicked,
    {{ media_session_field({ 'field': 'adsSkipped', 'dtype': 'integer' }) }} as media_session_ads_skipped,
    {{ media_session_field({ 'field': 'adBreaks', 'dtype': 'integer' }) }} as media_session_ad_breaks,
    {{ media_session_field({ 'field': 'avgPlaybackRate', 'dtype': 'float' }) }} as media_session_avg_playback_rate,

    -- ad properties
    {{ media_ad_field({ 'field': 'name', 'dtype': 'varchar' }) }} as ad_name,
    {{ media_ad_field({ 'field': 'adId', 'dtype': 'varchar' }) }} as ad_id,
    {{ media_ad_field({ 'field': 'creativeId', 'dtype': 'varchar' }) }} as ad_creative_id,
    {{ media_ad_field({ 'field': 'podPosition', 'dtype': 'integer' }) }} as ad_pod_position,
    {{ media_ad_field({ 'field': 'duration', 'dtype': 'float' }) }} as ad_duration_secs,
    {{ media_ad_field({ 'field': 'skippable', 'dtype': 'boolean' }) }} as ad_skippable,

    -- ad break properties
    {{ media_ad_break_field({ 'field': 'name', 'dtype': 'varchar' }) }} as ad_break_name,
    {{ media_ad_break_field({ 'field': 'breakId', 'dtype': 'varchar' }) }} as ad_break_id,
    {{ media_ad_break_field({ 'field': 'breakType', 'dtype': 'varchar' }) }} as ad_break_type,

    -- ad quartile event
    {{ media_ad_quartile_event_field({ 'field': 'percentProgress', 'dtype': 'integer' }) }} as ad_percent_progress,

    -- combined media properties
    {{ media_id_field(
      v2_player_label={ 'field': 'label', 'dtype': 'varchar' },
      youtube_player_id={ 'field': 'playerId', 'dtype': 'varchar' },
      media_player_id={ 'field': 'htmlId', 'dtype': 'varchar' }
    ) }} as media_id,
    {{ media_player_type_field(
      v2_player_type={ 'field': 'playerType', 'dtype': 'varchar' },
      youtube_player_id={ 'field': 'playerId', 'dtype': 'varchar' },
      media_player_id={ 'field': 'htmlId', 'dtype': 'varchar' }
    ) }} as media_player_type,
    {{ source_url_field(
      youtube_url={ 'field': 'url', 'dtype': 'varchar' },
      media_current_src={ 'field': 'currentSrc', 'dtype': 'varchar' }
    ) }} as source_url,
    {{ media_type_field(
      v2_media_type={ 'field': 'mediaType', 'dtype': 'varchar' },
      media_media_type={ 'field': 'mediaType', 'dtype': 'varchar' }
    ) }} as media_type,
    {{ playback_quality_field(
        v2_quality={ 'field': 'quality', 'dtype': 'varchar' },
        youtube_quality={ 'field': 'playbackQuality', 'dtype': 'varchar' },
        video_width={ 'field': 'videoWidth', 'dtype': 'integer' },
        video_height={ 'field': 'videoHeight', 'dtype': 'integer' }
    )}} as playback_quality

    from {{ var('snowplow__events') }} as a
    inner join {{ ref('snowplow_media_player_base_sessions_this_run') }} as b
    on {{ web_or_mobile_field(
      web='a.domain_sessionid',
      mobile={ 'field': 'sessionId', 'col_prefix': 'contexts_com_snowplowanalytics_snowplow_client_session_1', 'dtype': 'varchar' }
    ) }} = b.session_id

    where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
    and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
    and a.collector_tstamp >= {{ lower_limit }}
    and a.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ snowplow_media_player.event_name_filter(var("snowplow__media_event_names", "['media_player_event']")) }}

    qualify row_number() over (partition by a.event_id order by a.collector_tstamp) = 1
)

select
  coalesce(
    p.media_session_id,
    {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }}
  ) as play_id,
  p.* exclude (percent_progress),

  cast(p.percent_progress as integer) as percent_progress,

  coalesce(
    cast(piv.weight_rate * p.duration_secs / 100 as {{ type_int() }}),
    0
  ) as play_time_secs,
  coalesce(
    cast(
      case
        when p.is_muted = true then piv.weight_rate * p.duration_secs / 100
        else 0
      end as {{ type_int() }}
    ),
    0
  ) as play_time_muted_secs,

  dense_rank() over (partition by session_identifier order by start_tstamp) AS event_in_session_index

  from prep as p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run)
- [model.snowplow_media_player.snowplow_media_player_pivot_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_pivot_base)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.type_int
- macro.dbt.type_string
- macro.dbt_utils.generate_surrogate_key
- [macro.snowplow_media_player.event_name_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.event_name_filter)
- [macro.snowplow_media_player.media_ad_break_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_break_field)
- [macro.snowplow_media_player.media_ad_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_field)
- [macro.snowplow_media_player.media_ad_quartile_event_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_quartile_event_field)
- [macro.snowplow_media_player.media_event_type_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_event_type_field)
- [macro.snowplow_media_player.media_id_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_id_field)
- [macro.snowplow_media_player.media_player_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_player_field)
- [macro.snowplow_media_player.media_player_type_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_player_type_field)
- [macro.snowplow_media_player.media_session_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_session_field)
- [macro.snowplow_media_player.media_type_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_type_field)
- [macro.snowplow_media_player.percent_progress_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.percent_progress_field)
- [macro.snowplow_media_player.playback_quality_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.playback_quality_field)
- [macro.snowplow_media_player.source_url_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.source_url_field)
- [macro.snowplow_media_player.web_or_mobile_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.web_or_mobile_field)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_sde_or_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_sde_or_context)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Base New Event Limits {#model.snowplow_media_player.snowplow_media_player_base_new_event_limits}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_media_player_base_new_event_limits.sql</code>
</summary>

<h4>Description</h4>

This table contains the lower and upper timestamp limits for the given run of the web model. These limits are used to select new events from the events table.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| lower_limit | The lower `collector_tstamp` limit for the run | timestamp_ntz |
| upper_limit | The upper `collector_tstamp` limit for the run | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/scratch/snowplow_media_player_base_new_event_limits.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{ config(
   post_hook=["{{snowplow_utils.print_run_limits(this, package='snowplow_media_player')}}"],
   sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
   )
}}


{%- set models_in_run = snowplow_utils.get_enabled_snowplow_models('snowplow_media_player') -%}

{% set min_last_success,
         max_last_success,
         models_matched_from_manifest,
         has_matched_all_models = snowplow_utils.get_incremental_manifest_status(ref('snowplow_media_player_incremental_manifest'),
                                                                                 models_in_run) -%}


{% set run_limits_query = snowplow_utils.get_run_limits(min_last_success,
                                                          max_last_success,
                                                          models_matched_from_manifest,
                                                          has_matched_all_models,
                                                          var("snowplow__start_date","2020-01-01")) -%}


{{ run_limits_query }}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_incremental_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_enabled_snowplow_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_enabled_snowplow_models)
- [macro.snowplow_utils.get_incremental_manifest_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_status)
- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Base Quarantined Sessions {#model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions}

<DbtDetails><summary>
<code>models/base/manifest/snowplow_media_player_base_quarantined_sessions.sql</code>
</summary>

<h4>Description</h4>

This table contains any sessions that have been quarantined. Sessions are quarantined once they exceed the maximum allowed session length, defined by `snowplow__max_session_days`.
Once quarantined, no further events from these sessions will be processed. Events up until the point of quarantine remain in your derived tables.
The reason for removing long sessions is to reduce table scans on both the events table and all derived tables. This improves performance greatly.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| session_id | The `session_id` of the quarantined session | text |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/manifest/snowplow_media_player_base_quarantined_sessions.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='incremental',
    full_refresh=snowplow_media_player.allow_refresh(),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

/*
Boilerplate to generate table.
Table updated as part of post-hook on sessions_this_run
Any sessions exceeding max_session_days are quarantined
Once quarantined, any subsequent events from the session will not be processed.
This significantly reduces table scans
*/

with prep as (
  select
    cast(null as {% if target.type == 'redshift' %} varchar(400) {% else %} {{snowplow_utils.type_max_string()}} {% endif %}) as session_id
)

select *

from prep
where false
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.allow_refresh)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Base Sessions Lifecycle Manifest {#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest}

<DbtDetails><summary>
<code>models/base/manifest/&lt;adaptor&gt;/snowplow_media_player_base_sessions_lifecycle_manifest.sql</code>
</summary>

<h4>Description</h4>

This incremental table is a manifest of all sessions that have been processed by the Snowplow dbt media package. For each session, the start and end timestamp is recorded.

By knowing the lifecycle of a session the model is able to able to determine which sessions and thus events to process for a given timeframe, as well as the complete date range required to reprocess all events of each session.

**Type**: Table

<h4>File Paths</h4>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

`models/base/manifest/bigquery/snowplow_media_player_base_sessions_lifecycle_manifest.sql`

</TabItem>
<TabItem value="databricks" label="databricks">

`models/base/manifest/databricks/snowplow_media_player_base_sessions_lifecycle_manifest.sql`

</TabItem>
<TabItem value="default" label="default" default>

`models/base/manifest/default/snowplow_media_player_base_sessions_lifecycle_manifest.sql`

</TabItem>
<TabItem value="snowflake" label="snowflake">

`models/base/manifest/snowflake/snowplow_media_player_base_sessions_lifecycle_manifest.sql`

</TabItem>
</Tabs>


<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. | text |
| start_tstamp | The `collector_tstamp` when the session began | timestamp_ntz |
| end_tstamp | The `collector_tstamp` when the session ended | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/manifest/bigquery/snowplow_media_player_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_media_player.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_media_player_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_media_player') %}

with new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_events', false),
          fields=[{'field': 'session_id', 'dtype': 'string'}],
          col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
          relation=source('atomic', 'events'),
          relation_alias='e',
          include_field_alias=false) }},
        e.domain_sessionid
      ) as session_id,
      max(coalesce(
      {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_events', false),
          fields=[{'field': 'user_id', 'dtype': 'string'}],
          col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
          relation=source('atomic', 'events'),
          relation_alias='e',
          include_field_alias=false) }},
        e.domain_userid
      )) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
      {{ snowplow_utils.get_optional_fields(
        enabled=var('snowplow__enable_mobile_events', false),
        fields=[{'field': 'session_id', 'dtype': 'string'}],
        col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
        relation=source('atomic', 'events'),
        relation_alias='e',
        include_field_alias=false) }},
      e.domain_sessionid
    ) is not null
          and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = coalesce(
      {{ snowplow_utils.get_optional_fields(
        enabled=var('snowplow__enable_mobile_events', false),
        fields=[{'field': 'session_id', 'dtype': 'string'}],
        col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
        relation=source('atomic', 'events'),
        relation_alias='e',
        include_field_alias=false) }},
      e.domain_sessionid
    )) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
    and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'dvce_created_tstamp') }} -- don't process data that's too late
    and e.collector_tstamp >= {{ lower_limit }}
    and e.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ event_name_filter(var("snowplow__media_event_names", ["media_player_event"]))}}
    and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %} -- BQ only
      and e.derived_tstamp >= {{ lower_limit }}
      and e.derived_tstamp <= {{ upper_limit }}
    {% endif %}

  group by 1
  )

{% if is_incremental() %}

, previous_sessions as (
  select *

  from {{ this }}

  where start_tstamp >= {{ session_lookback_limit }}
  and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
)

, session_lifecycle as (
  select
    ns.session_id,
    coalesce(self.domain_userid, ns.domain_userid) as domain_userid, -- Edge case 1: Take previous value to keep domain_userid consistent. Not deterministic but performant
    least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
    greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

  from new_events_session_ids ns
  left join previous_sessions as self
    on ns.session_id = self.session_id

  where
    self.session_id is null -- process all new sessions
    or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
  )

{% else %}

, session_lifecycle as (

  select * from new_events_session_ids

)

{% endif %}

select
  sl.session_id,
  sl.domain_userid,
  sl.start_tstamp,
  least({{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(sl.start_tstamp) as start_tstamp_date
  {%- endif %}

from session_lifecycle sl
```

</TabItem>
<TabItem value="databricks" label="databricks">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/manifest/databricks/snowplow_media_player_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_media_player.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_media_player_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_media_player') %}

with new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        e.domain_sessionid
      ) as session_id,
      max(coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].user_id::string,
        e.domain_userid
      )) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        e.domain_sessionid
      ) is not null
      and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::string,
        e.domain_sessionid
      )) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
    and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'dvce_created_tstamp') }} -- don't process data that's too late
    and e.collector_tstamp >= {{ lower_limit }}
    and e.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ event_name_filter(var("snowplow__media_event_names", ["media_player_event"]))}}
    and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %} -- BQ only
      and e.derived_tstamp >= {{ lower_limit }}
      and e.derived_tstamp <= {{ upper_limit }}
    {% endif %}

  group by 1
  )

{% if is_incremental() %}

, previous_sessions as (
  select *

  from {{ this }}

  where start_tstamp >= {{ session_lookback_limit }}
  and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
)

, session_lifecycle as (
  select
    ns.session_id,
    coalesce(self.domain_userid, ns.domain_userid) as domain_userid, -- Edge case 1: Take previous value to keep domain_userid consistent. Not deterministic but performant
    least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
    greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

  from new_events_session_ids ns
  left join previous_sessions as self
    on ns.session_id = self.session_id

  where
    self.session_id is null -- process all new sessions
    or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
  )

{% else %}

, session_lifecycle as (

  select * from new_events_session_ids

)

{% endif %}

select
  sl.session_id,
  sl.domain_userid,
  sl.start_tstamp,
  least({{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(sl.start_tstamp) as start_tstamp_date
  {%- endif %}

from session_lifecycle sl
```

</TabItem>
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/manifest/default/snowplow_media_player_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_media_player.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_media_player_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_media_player') %}

with

{% if var('snowplow__enable_mobile_events', false) -%}
    {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), var('snowplow__context_mobile_session'), lower_limit, upper_limit, 'mob_session') }},
{%- endif %}

new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(ms.mob_session_session_id, e.domain_sessionid) as session_id,
      max(coalesce(ms.mob_session_user_id, e.domain_userid)) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e
  {% if var('snowplow__enable_mobile_events', false) -%}
      left join {{ var('snowplow__context_mobile_session') }} ms on e.event_id = ms.mob_session__id and e.collector_tstamp = ms.mob_session__tstamp
  {%- endif %}
  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(ms.mob_session_session_id, e.domain_sessionid) is not null
      and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = coalesce(ms.mob_session_session_id, e.domain_sessionid)) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
    and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'dvce_created_tstamp') }} -- don't process data that's too late
    and e.collector_tstamp >= {{ lower_limit }}
    and e.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ event_name_filter(var("snowplow__media_event_names", ["media_player_event"]))}}
    and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %} -- BQ only
      and e.derived_tstamp >= {{ lower_limit }}
      and e.derived_tstamp <= {{ upper_limit }}
    {% endif %}

  group by 1
  )

{% if is_incremental() %}

, previous_sessions as (
  select *

  from {{ this }}

  where start_tstamp >= {{ session_lookback_limit }}
  and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
)

, session_lifecycle as (
  select
    ns.session_id,
    coalesce(self.domain_userid, ns.domain_userid) as domain_userid, -- Edge case 1: Take previous value to keep domain_userid consistent. Not deterministic but performant
    least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
    greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

  from new_events_session_ids ns
  left join previous_sessions as self
    on ns.session_id = self.session_id

  where
    self.session_id is null -- process all new sessions
    or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
  )

{% else %}

, session_lifecycle as (

  select * from new_events_session_ids

)

{% endif %}

select
  sl.session_id,
  sl.domain_userid,
  sl.start_tstamp,
  least({{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(sl.start_tstamp) as start_tstamp_date
  {%- endif %}

from session_lifecycle sl
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/manifest/snowflake/snowplow_media_player_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='incremental',
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"]),
    full_refresh=snowplow_media_player.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize = true
  )
}}

-- Known edge cases:
-- 1: Rare case with multiple domain_userid per session.

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_media_player_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_media_player') %}

with new_events_session_ids as (
  select
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        e.domain_sessionid
      ) as session_id,
      max(coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:userId::varchar,
        e.domain_userid
      )) as domain_userid,
    {% else %}
      e.domain_sessionid as session_id,
      max(e.domain_userid) as domain_userid, -- Edge case 1: Arbitary selection to avoid window function like first_value.
    {% endif %}
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    {% if var('snowplow__enable_mobile_events', false) %}
      coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        e.domain_sessionid
      ) is not null
      and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = coalesce(
        e.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar,
        e.domain_sessionid
      )) -- don't continue processing v.long sessions
    {% else %}
      e.domain_sessionid is not null
      and not exists (select 1 from {{ ref('snowplow_media_player_base_quarantined_sessions') }} as a where a.session_id = e.domain_sessionid) -- don't continue processing v.long sessions
    {% endif %}
    and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'dvce_created_tstamp') }} -- don't process data that's too late
    and e.collector_tstamp >= {{ lower_limit }}
    and e.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and {{ event_name_filter(var("snowplow__media_event_names", ["media_player_event"]))}}
    and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %} -- BQ only
      and e.derived_tstamp >= {{ lower_limit }}
      and e.derived_tstamp <= {{ upper_limit }}
    {% endif %}

  group by 1
  )

{% if is_incremental() %}

, previous_sessions as (
  select *

  from {{ this }}

  where start_tstamp >= {{ session_lookback_limit }}
  and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
)

, session_lifecycle as (
  select
    ns.session_id,
    coalesce(self.domain_userid, ns.domain_userid) as domain_userid, -- Edge case 1: Take previous value to keep domain_userid consistent. Not deterministic but performant
    least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
    greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

  from new_events_session_ids ns
  left join previous_sessions as self
    on ns.session_id = self.session_id

  where
    self.session_id is null -- process all new sessions
    or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
  )

{% else %}

, session_lifecycle as (

  select * from new_events_session_ids

)

{% endif %}

select
  sl.session_id,
  sl.domain_userid,
  sl.start_tstamp,
  least({{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(sl.start_tstamp) as start_tstamp_date
  {%- endif %}

from session_lifecycle sl
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions)
- [model.snowplow_media_player.snowplow_media_player_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_incremental_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.is_incremental
- [macro.snowplow_media_player.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.allow_refresh)
- [macro.snowplow_media_player.event_name_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.event_name_filter)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)
- [macro.snowplow_utils.get_sde_or_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_sde_or_context)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Base Sessions This Run {#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_media_player_base_sessions_this_run.sql</code>
</summary>

<h4>Description</h4>

For any given run, this table contains all the required sessions.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. | text |
| start_tstamp | The `collector_tstamp` when the session began | timestamp_ntz |
| end_tstamp | The `collector_tstamp` when the session ended | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/scratch/snowplow_media_player_base_sessions_this_run.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    post_hook=[
      "{{ snowplow_utils.quarantine_sessions('snowplow_media_player', var('snowplow__max_session_days')) }}"
    ],
  )
}}

{%- set lower_limit,
        upper_limit,
        session_start_limit = snowplow_utils.return_base_new_event_limits(ref('snowplow_media_player_base_new_event_limits')) %}

select
  s.session_id,
  s.domain_userid,
  s.start_tstamp,
  -- end_tstamp used in next step to limit events. When backfilling, set end_tstamp to upper_limit if end_tstamp > upper_limit.
  -- This ensures we don't accidentally process events after upper_limit
  case when s.end_tstamp > {{ upper_limit }} then {{ upper_limit }} else s.end_tstamp end as end_tstamp

from {{ ref('snowplow_media_player_base_sessions_lifecycle_manifest')}} s

where
-- General window of start_tstamps to limit table scans. Logic complicated by backfills.
-- To be within the run, session start_tstamp must be >= lower_limit - max_session_days as we limit end_tstamp in manifest to start_tstamp + max_session_days
s.start_tstamp >= {{ session_start_limit }}
and s.start_tstamp <= {{ upper_limit }}
-- Select sessions within window that either; start or finish between lower & upper limit, start and finish outside of lower and upper limits
and not (s.start_tstamp > {{ upper_limit }} or s.end_tstamp < {{ lower_limit }})
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.quarantine_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.quarantine_sessions)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Base This Run {#model.snowplow_media_player.snowplow_media_player_base_this_run}

<DbtDetails><summary>
<code>models/media_base/scratch/snowplow_media_player_base_this_run.sql</code>
</summary>

<h4>Description</h4>

This staging table aggregates media player interactions within the current run to a pageview level that is considered a base level for media plays.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. | text |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. | text |
| media_label | The optional, human readable name given to tracked media content. | text |
| session_identifier | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. | text |
| user_id |   | text |
| page_referrer | URL of the referrer e.g. `http://www.referrer.com`. | text |
| page_url | The page URL e.g. `http://www.example.com`. | text |
| source_url | The url which shows the source of the media content. For YouTube it is the `url` context field, for HTML5 it is the `source_url` field. | text |
| geo_region_name | Visitor region name e.g. `Florida`. | text |
| br_name | Browser name e.g. `Firefox 12`. | text |
| dvce_type | Type of device e.g. `Computer`. | text |
| os_name | Name of operating system e.g. `Android`. | text |
| os_timezone | Client operating system timezone e.g. `Europe/London`. | text |
| platform | Platform e.g. ‘web’ | text |
| duration_secs | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. | float |
| media_type | The type of media content: video or audio. | text |
| media_player_type | The combination of schema_name and schema_vendor coming from the specific media player context e.g. com.youtube-youtube, org.whatwg-media_element. | text |
| start_tstamp | The `derived_tstamp` denoting the time when the event started. | timestamp_ntz |
| end_tstamp | The `derived_tstamp` denoting the time when the last media player event belonging to the specific level of aggregation (e.g.: page_view by media) started. | timestamp_ntz |
| avg_playback_rate | Average playback rate (1 is normal speed). | float |
| play_time_secs | Total seconds user spent playing content (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

 This also counts playback of rewatched content (see `content_watched_secs` for a measurement without considering rewatched content).

If the media session entity is not tracked, the value is estimated. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. | float |
| play_time_muted_secs | Total seconds user spent playing content on mute (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

If the media session entity is not tracked, the value is estimated. It is based on the percent_progress event and whether the user played it on mute during this event or not. | float |
| paused_time_secs | Total seconds user spent with paused content (excluding linear ads).

This information is provided by the tracker in the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| buffering_time_secs | Total seconds that playback was buffering.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| ads_time_secs | Total seconds that ads played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. | number |
| ads | Number of ads played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ads_clicked | Number of ads that the user clicked on.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ads_skipped | Number of ads that the user skipped.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ad_breaks | Number of ad breaks played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| is_played | Pageviews with at least one play event. | boolean |
| is_valid_play | A boolean value to show whether the duration of the play (`play_time_secs`) is bigger than or equal to the variable given in `snowplow__valid_play_sec` (defaulted to 30). | boolean |
| is_complete_play | A boolean value to show whether the total percentage played is bigger than or equal to the `snowplow__complete_play_rate` (defaulted to 0.99). | boolean |
| retention_rate | The maximum percent progress reached before any seek event. | float |
| percent_progress_reached | An array of percent progresses reached by the user while playing the media. In case the same percentprogress event was fired during the same page_view (e.g. due to seeks to rewatch part of the video) the % is added to the array again. e.g. in case of percent_progress_reached = [10, 25, 25, 50, 75] the user replayed part of the media so that the percentprogress event fired twice at the 25% mark. | text |
| content_watched_secs | Total seconds of the content played. Each part of the content played is counted once (i.e., counts rewinding or rewatching the same content only once).

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| content_watched_percent | Percentage of the content played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/media_base/scratch/snowplow_media_player_base_this_run.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='table',
    tags=["this_run"],
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["media_id"]),
    sort = 'start_tstamp',
    dist = 'play_id',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with

events_this_run as (
    select
      *,
      row_number()
        over (partition by media_session_id order by start_tstamp desc) as media_session_index
    from {{ ref('snowplow_media_player_base_events_this_run') }}
)

, prep as (

  select
    i.play_id,
    i.page_view_id,
    i.media_id,
    i.media_label,
    i.session_identifier,
    i.domain_userid,
    i.user_id,
    i.platform,
    max(i.duration_secs) as duration_secs,
    i.media_type,
    i.media_player_type,
    i.page_referrer,
    i.page_url,
    max(i.source_url) as source_url,
    i.geo_region_name,
    i.br_name,
    i.dvce_type,
    i.os_name,
    i.os_timezone,
    min(start_tstamp) as start_tstamp,
    max(start_tstamp) as end_tstamp,
    sum(case when i.event_type = 'play' then 1 else 0 end) as plays,
    sum(case when i.event_type in ('seek', 'seeked', 'seekend') then 1 else 0 end) as seeks,
    sum(i.play_time_secs) as play_time_secs,
    sum(i.play_time_muted_secs) as play_time_muted_secs,
    coalesce(
      sum(i.playback_rate * i.play_time_secs) / nullif(sum(i.play_time_secs), 0),
      max(i.playback_rate)
    ) as avg_playback_rate,
    min(case when i.event_type in ('seek', 'seeked', 'seekstart', 'seekend') then start_tstamp end) as first_seek_time,
    max(i.percent_progress) as max_percent_progress

  from events_this_run as i

  group by 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 19

)

, dedupe as (

  select
    *,
    row_number()
      over (partition by play_id order by start_tstamp) as duplicate_count

  from prep

)

, media_sessions as (

  select
    media_session_id,
    media_session_time_played,
    media_session_time_played_muted,
    media_session_time_paused,
    media_session_content_watched,
    media_session_time_buffering,
    media_session_time_spent_ads,
    media_session_ads,
    media_session_ads_clicked,
    media_session_ads_skipped,
    media_session_ad_breaks,
    media_session_avg_playback_rate

  from events_this_run
  where media_session_index = 1

)

--- The following CTEs create a distinct list of percent_progress values for each play_id. We first need to select distinct percent_progress, because get_string_agg can't get distinct values with numeric ordering.
, distinct_percent_progress as (
  select distinct ev.play_id, ev.percent_progress
  from events_this_run as ev
  where ev.percent_progress is not null
)
, percent_progress_by_play_id as (
  select
    i.play_id,
    {{ snowplow_utils.get_string_agg('percent_progress', 'i', sort_numeric=true) }} as percent_progress_reached
  from distinct_percent_progress as i
  group by 1
)

, retention_rate as (

  select
    d.play_id,
    max(i.percent_progress) as retention_rate

  from dedupe as d

  inner join events_this_run as i
    on i.play_id = d.play_id

  where
    i.percent_progress is not null
    and (i.start_tstamp <= d.first_seek_time or d.first_seek_time is null)

  group by 1

)

-- for correcting NULLs in case of 'ready' events only where the metadata showing the duration_secs is usually missing as the event fires before it has time to load
, duration_fix as (

  select
    f.media_id,
    max(f.duration_secs) as duration_secs

  from events_this_run as f

  group by 1

)

{% set play_time_secs -%}
  coalesce({{ media_session_field('s.media_session_time_played') }}, d.play_time_secs)
{%- endset %}

select
  d.play_id,
  d.page_view_id,
  d.media_id,
  d.media_label,
  d.session_identifier,
  d.domain_userid,
  d.user_id,
  d.page_referrer,
  d.page_url,
  d.source_url,
  d.geo_region_name,
  d.br_name,
  d.dvce_type,
  d.os_name,
  d.os_timezone,
  d.platform,

  -- media information
  f.duration_secs,
  d.media_type,
  d.media_player_type,

  -- playback information
  d.start_tstamp,
  d.end_tstamp,
  coalesce(
    {{ media_session_field('s.media_session_avg_playback_rate') }},
    cast(d.avg_playback_rate as {{ type_float() }})
  ) as avg_playback_rate,

  -- time spent
  {{ play_time_secs }} as play_time_secs,
  coalesce({{ media_session_field('s.media_session_time_played_muted') }}, d.play_time_muted_secs) as play_time_muted_secs,
  {{ media_session_field('s.media_session_time_paused') }} as paused_time_secs,
  {{ media_session_field('s.media_session_time_buffering') }} as buffering_time_secs,
  {{ media_session_field('s.media_session_time_spent_ads') }} as ads_time_secs,

  -- event counts
  d.seeks,
  {{ media_session_field('s.media_session_ads') }} as ads,
  {{ media_session_field('s.media_session_ads_clicked') }} as ads_clicked,
  {{ media_session_field('s.media_session_ads_skipped') }} as ads_skipped,
  {{ media_session_field('s.media_session_ad_breaks') }} as ad_breaks,

  -- playback progress
  d.plays > 0 as is_played,
  case
    when {{ play_time_secs }} > {{ var("snowplow__valid_play_sec") }} then true else
      false
  end as is_valid_play,
  case
    when
      coalesce({{ media_session_field('s.media_session_content_watched') }}, d.play_time_secs) / nullif(f.duration_secs, 0)
      >= {{ var("snowplow__complete_play_rate") }}
      then true else
      false
  end as is_complete_play,
  cast(coalesce(case
    when r.retention_rate > d.max_percent_progress
      then d.max_percent_progress / cast(100 as {{ type_float() }})
    else r.retention_rate / cast(100 as {{ type_float() }})
  -- to correct incorrect result due to duplicate session_identifier (one removed)
  end, 0) as {{ type_float() }}) as retention_rate,
  p.percent_progress_reached,
  {{ media_session_field('s.media_session_content_watched') }} as content_watched_secs,
  case
    when d.duration_secs is not null and {{ media_session_field('s.media_session_content_watched') }} is not null and d.duration_secs > 0
    then least(
      {{ media_session_field('s.media_session_content_watched') }} / d.duration_secs,
      1.0
    )
  end as content_watched_percent

  {% if target.type in ['databricks', 'spark'] -%}
  , date(d.start_tstamp) as start_tstamp_date
  {%- endif %}

from dedupe as d

left join retention_rate as r
  on r.play_id = d.play_id

left join duration_fix as f
  on f.media_id = d.media_id

left join media_sessions as s
  on s.media_session_id = d.play_id

left join percent_progress_by_play_id as p
  on p.play_id = d.play_id

where d.duplicate_count = 1
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.type_float
- [macro.snowplow_media_player.media_session_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_session_field)
- [macro.snowplow_utils.get_string_agg](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_string_agg)
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Incremental Manifest {#model.snowplow_media_player.snowplow_media_player_incremental_manifest}

<DbtDetails><summary>
<code>models/base/manifest/snowplow_media_player_incremental_manifest.sql</code>
</summary>

<h4>Description</h4>

This incremental table is a manifest of the timestamp of the latest event consumed per model within the Snowplow dbt media package as well as any models leveraging the incremental framework provided by the package. The latest event's timestamp is based off `collector_tstamp`. This table is used to determine what events should be processed in the next run of the model.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| model | The name of the model. | text |
| last_success | The timestamp of the latest event consumed by the model, based on `collector_tstamp` | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/manifest/snowplow_media_player_incremental_manifest.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='incremental',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    full_refresh=snowplow_media_player.allow_refresh(),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

-- Boilerplate to generate table.
-- Table updated as part of end-run hook

with prep as (
  select
    cast(null as {{ snowplow_utils.type_max_string() }}) as model,
    cast('1970-01-01' as {{ type_timestamp() }}) as last_success
)

select *

from prep
where false
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_timestamp
- [macro.snowplow_media_player.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.allow_refresh)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Media Ad Views {#model.snowplow_media_player.snowplow_media_player_media_ad_views}

<DbtDetails><summary>
<code>models/media_ad_views/snowplow_media_player_media_ad_views.sql</code>
</summary>

<h4>Description</h4>

This derived table aggregates media player interactions to a pageview level incrementally.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| media_ad_id | Generated identifier that identifies an ad (identified using the ad_id) played with a specific media (identified using the media_id) and on a specific platform (based on the platform property). | text |
| platform | Platform e.g. ‘web’ | text |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. | text |
| media_label | The optional, human readable name given to tracked media content. | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. | text |
| session_identifier | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. | text |
| ad_break_id | An identifier for the ad break (reported in the ad_break context entity). | text |
| ad_break_name | Ad break name (e.g., pre-roll, mid-roll, and post-roll), reported in the ad_break context entity. | text |
| ad_break_type | Type of ads within the break: linear (take full control of the video for a period of time), nonlinear (run concurrently to the video), companion (accompany the video but placed outside the player). Reported in the ad_break context entity. | text |
| ad_id | Unique identifier for the ad taken from the ad context entity. | text |
| name | Friendly name of the ad taken from the ad context entity. | text |
| creative_id | The ID of the ad creative taken from the ad context entity. | text |
| duration_secs | Length of the video ad in seconds as reported in the ad context entity. | float |
| pod_position | The position of the ad within the ad break, starting with 1 (reported in the ad context entity). | number |
| skippable | Indicating whether skip controls are made available to the end user (reported in the ad context entity). | boolean |
| clicked | Whether the ad was clicked during this ad view. | boolean |
| skipped | Whether the ad was skipped during this ad view. | boolean |
| percent_reached_25 | Number of times users reached 25% of the ad playback (repeated views are counted as well). | boolean |
| percent_reached_50 | Number of times users reached 50% of the ad playback (repeated views are counted as well). | boolean |
| percent_reached_75 | Number of times users reached 75% of the ad playback (repeated views are counted as well). | boolean |
| percent_reached_100 | Number of times users watched the whole ad (repeated views are counted as well). | boolean |
| viewed_at | Datetime when the ad was viewed. | timestamp_ntz |
| last_event | Datetime of the last event. | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/media_ad_views/snowplow_media_player_media_ad_views.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized= "incremental",
    upsert_date_key='last_event',
    sort = 'last_event',
    dist = 'media_ad_id',
    tags=["derived"],
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "viewed_at",
      "data_type": "timestamp"
    }, databricks_val='viewed_at_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["media_ad_id"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    snowplow_optimize=true,
    enabled=var('snowplow__enable_media_ad', false)
  )
}}

select *

from {{ ref('snowplow_media_player_media_ad_views_this_run') }}

--returns false if run doesn't contain new events.
where {{ snowplow_utils.is_run_with_new_events('snowplow_media_player') }}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_incremental_manifest)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_media_ads](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ads)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Media Ad Views This Run {#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run}

<DbtDetails><summary>
<code>models/media_ad_views/scratch/snowplow_media_player_media_ad_views_this_run.sql</code>
</summary>

<h4>Description</h4>

This derived table aggregates information about ad views. Each ad view (a user viewing a single ad within a media playback) is represented using one row. The ad views aggregate information about the percentage progress of the ad viewed, whether it was skipped, clicked or completed. They also contain meta information about the played ads.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| media_ad_id | Generated identifier that identifies an ad (identified using the ad_id) played with a specific media (identified using the media_id) and on a specific platform (based on the platform property). | text |
| platform | Platform e.g. ‘web’ | text |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. | text |
| media_label | The optional, human readable name given to tracked media content. | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. | text |
| session_identifier | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| user_id | Unique ID set by business e.g. ‘jon.doe@email.com’ | text |
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. | text |
| ad_break_id | An identifier for the ad break (reported in the ad_break context entity). | text |
| ad_break_name | Ad break name (e.g., pre-roll, mid-roll, and post-roll), reported in the ad_break context entity. | text |
| ad_break_type | Type of ads within the break: linear (take full control of the video for a period of time), nonlinear (run concurrently to the video), companion (accompany the video but placed outside the player). Reported in the ad_break context entity. | text |
| ad_id | Unique identifier for the ad taken from the ad context entity. | text |
| name | Friendly name of the ad taken from the ad context entity. | text |
| creative_id | The ID of the ad creative taken from the ad context entity. | text |
| duration_secs | Length of the video ad in seconds as reported in the ad context entity. | float |
| pod_position | The position of the ad within the ad break, starting with 1 (reported in the ad context entity). | number |
| skippable | Indicating whether skip controls are made available to the end user (reported in the ad context entity). | boolean |
| clicked | Whether the ad was clicked during this ad view. | boolean |
| skipped | Whether the ad was skipped during this ad view. | boolean |
| percent_reached_25 | Number of times users reached 25% of the ad playback (repeated views are counted as well). | boolean |
| percent_reached_50 | Number of times users reached 50% of the ad playback (repeated views are counted as well). | boolean |
| percent_reached_75 | Number of times users reached 75% of the ad playback (repeated views are counted as well). | boolean |
| percent_reached_100 | Number of times users watched the whole ad (repeated views are counted as well). | boolean |
| viewed_at | Datetime when the ad was viewed. | timestamp_ntz |
| last_event | Datetime of the last event. | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/media_ad_views/scratch/snowplow_media_player_media_ad_views_this_run.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='table',
    tags=["this_run"],
    sort='last_event',
    dist='media_ad_id',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "viewed_at",
      "data_type": "timestamp"
    }, databricks_val='viewed_at_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["media_ad_id"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    enabled=var('snowplow__enable_media_ad', false)
  )
}}

with

events_this_run as (

    select * from {{ ref('snowplow_media_player_base_events_this_run') }}
    where ad_id is not null and media_id is not null

)

, prep as (

  select
    {{ dbt_utils.generate_surrogate_key(['ev.platform', 'ev.media_id', 'ev.ad_id']) }} as media_ad_id,

    ev.platform,
    ev.media_id,
    max(ev.media_label) as media_label,
    ev.domain_userid,
    ev.session_identifier,
    ev.user_id,
    ev.play_id,

    {{ media_ad_break_field('ev.ad_break_id') }} as ad_break_id,
    {{ media_ad_break_field('max(ev.ad_break_name)' ) }} as ad_break_name,
    {{ media_ad_break_field('max(ev.ad_break_type)' ) }} as ad_break_type,

    {{ media_ad_field('ev.ad_id') }} as ad_id,
    {{ media_ad_field('max(ev.ad_name)') }} as name,
    {{ media_ad_field('max(ev.ad_creative_id)') }} as creative_id,
    {{ media_ad_field('max(ev.ad_duration_secs)') }} as duration_secs,
    {{ media_ad_field('avg(ev.ad_pod_position)') }} as pod_position,
    {{ media_ad_field('sum(case when ev.ad_skippable then 1 else 0 end) > 0') }} as skippable,

    max(case when ev.event_type = 'adclick' then 1 else 0 end) > 0 as clicked,
    max(case when ev.event_type = 'adskip' then 1 else 0 end) > 0 as skipped,
    {{ media_ad_quartile_event_field("max(case when ev.event_type = 'adcomplete' or (ev.event_type = 'adquartile' and ev.ad_percent_progress >= 25) then 1 else 0 end) > 0") }} as percent_reached_25,
    {{ media_ad_quartile_event_field("max(case when ev.event_type = 'adcomplete' or (ev.event_type = 'adquartile' and ev.ad_percent_progress >= 50) then 1 else 0 end) > 0") }} as percent_reached_50,
    {{ media_ad_quartile_event_field("max(case when ev.event_type = 'adcomplete' or (ev.event_type = 'adquartile' and ev.ad_percent_progress >= 75) then 1 else 0 end) > 0") }} as percent_reached_75,
    max(case when ev.event_type = 'adcomplete' then 1 else 0 end) > 0 as percent_reached_100,

    min(ev.start_tstamp) as viewed_at,
    max(ev.start_tstamp) as last_event

  from events_this_run as ev

  group by 1, 2, 3, 5, 6, 7, 8, 9, 12

)

select *
    {% if target.type in ['databricks', 'spark'] -%}
      , date(prep.viewed_at) as viewed_at_date
    {%- endif %}
  from prep
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt_utils.generate_surrogate_key
- [macro.snowplow_media_player.media_ad_break_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_break_field)
- [macro.snowplow_media_player.media_ad_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_field)
- [macro.snowplow_media_player.media_ad_quartile_event_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_quartile_event_field)
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_media_ad_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Media Ads {#model.snowplow_media_player.snowplow_media_player_media_ads}

<DbtDetails><summary>
<code>models/media_ads/snowplow_media_player_media_ads.sql</code>
</summary>

<h4>Description</h4>

This derived table aggregates information about ads. Each row represents one ad played within a certain media on a certain platform. Stats about the number of ad clicks, progress reached and more are calculated as total values but also as counts of unique users (identified using `domain_userid`).

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| media_ad_id | The primary key of this table | text |
| platform | Platform e.g. ‘web’ | text |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. | text |
| media_label | The optional, human readable name given to tracked media content. | text |
| ad_id | Unique identifier for the ad taken from the ad context entity. | text |
| name | Friendly name of the ad taken from the ad context entity. | text |
| creative_id | The ID of the ad creative taken from the ad context entity. | text |
| duration_secs | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. | float |
| skippable | Indicating whether skip controls are made available to the end user (reported in the ad context entity). | boolean |
| pod_position | The position of the ad within the ad break, starting with 1 (reported in the ad context entity). | number |
| views | Number of total views on the ad (repeated views are counted as well). | number |
| clicked | Whether the ad was clicked during this ad view. | number |
| skipped | Whether the ad was skipped during this ad view. | number |
| percent_reached_25 | Number of times users reached 25% of the ad playback (repeated views are counted as well). | number |
| percent_reached_50 | Number of times users reached 50% of the ad playback (repeated views are counted as well). | number |
| percent_reached_75 | Number of times users reached 75% of the ad playback (repeated views are counted as well). | number |
| percent_reached_100 | Number of times users watched the whole ad (repeated views are counted as well). | number |
| views_unique | Number of users that viewed the ad (identified by their domain_userid). | number |
| clicked_unique | Number of users that clicked on the ad (identified by their domain_userid). | number |
| skipped_unique | Number of users that skipped the ad (identified by their domain_userid). | number |
| percent_reached_25_unique | Number of users that watched 25% of the ad (identified by their domain_userid). | number |
| percent_reached_50_unique | Number of users that watched 50% of the ad (identified by their domain_userid). | number |
| percent_reached_75_unique | Number of users that watched 75% of the ad (identified by their domain_userid). | number |
| percent_reached_100_unique | Number of users that watched 100% of the ad (identified by their domain_userid). | number |
| first_view | Datetime of the first ad view. | timestamp_ntz |
| last_view | Datetime of the last ad view. | timestamp_ntz |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/media_ads/snowplow_media_player_media_ads.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized= 'incremental',
    unique_key = 'media_ad_id',
    sort = 'last_view',
    dist = 'media_ad_id',
    tags=["derived"],
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "first_view",
      "data_type": "timestamp"
    }, databricks_val='first_view_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["media_ad_id"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    },
    enabled=var('snowplow__enable_media_ad', false)
  )
}}

with

new_media_ad_views as (

  select *

  from {{ ref("snowplow_media_player_media_ad_views") }} a

  {% if is_incremental() %}
    where -- enough time has passed since the page_view's start_tstamp to be able to process it as a whole (please bear in mind the late arriving data)
    cast({{ dateadd('hour', var("snowplow__max_media_pv_window", 10), 'a.viewed_at') }} as {{ type_timestamp() }}) < {{ snowplow_utils.current_timestamp_in_utc() }}
    -- and it has not been processed yet
    and (
      not exists(select 1 from {{ this }}) or -- no records in the table
      a.viewed_at > ( select max(last_view) from {{ this }} )
    )
  {% endif %}

)

, new_data as (

  select
    a.media_ad_id,

    a.platform,
    a.media_id,
    max(a.media_label) as media_label,

    {{ media_ad_field('a.ad_id') }} as ad_id,
    {{ media_ad_field('max(a.name)') }} as name,
    {{ media_ad_field('max(a.creative_id)') }} as creative_id,
    {{ media_ad_field('max(a.duration_secs)') }} as duration_secs,
    {{ media_ad_field('sum(case when a.skippable then 1 else 0 end) > 0') }} as skippable,
    {{ media_ad_field('avg(a.pod_position)') }} as pod_position,

    count(*) as views,
    sum(case when a.clicked then 1 else 0 end) as clicked,
    sum(case when a.skipped then 1 else 0 end) as skipped,
    {{ media_ad_quartile_event_field('sum(case when a.percent_reached_25 then 1 else 0 end)') }} as percent_reached_25,
    {{ media_ad_quartile_event_field('sum(case when a.percent_reached_50 then 1 else 0 end)') }} as percent_reached_50,
    {{ media_ad_quartile_event_field('sum(case when a.percent_reached_75 then 1 else 0 end)') }} as percent_reached_75,
    sum(case when a.percent_reached_100 then 1 else 0 end) as percent_reached_100,

    {% if is_incremental() %}
      0 as views_unique,
      0 as clicked_unique,
      0 as skipped_unique,
      {{ media_ad_quartile_event_field('0') }} as percent_reached_25_unique,
      {{ media_ad_quartile_event_field('0') }} as percent_reached_50_unique,
      {{ media_ad_quartile_event_field('0') }} as percent_reached_75_unique,
      0 as percent_reached_100_unique,
    {% else %}
      count(distinct a.domain_userid) as views_unique,
      count(distinct case when a.clicked then a.domain_userid end) as clicked_unique,
      count(distinct case when a.skipped then a.domain_userid end) as skipped_unique,
      {{ media_ad_quartile_event_field('count(distinct case when a.percent_reached_25 then domain_userid end)') }} as percent_reached_25_unique,
      {{ media_ad_quartile_event_field('count(distinct case when a.percent_reached_50 then domain_userid end)') }} as percent_reached_50_unique,
      {{ media_ad_quartile_event_field('count(distinct case when a.percent_reached_75 then domain_userid end)') }} as percent_reached_75_unique,
      count(distinct case when a.percent_reached_100 then domain_userid end) as percent_reached_100_unique,
    {% endif %}

    min(viewed_at) as first_view,
    max(viewed_at) as last_view

  from new_media_ad_views a

  group by 1, 2, 3, 5

)

{% if is_incremental() %}

, unique_counts_that_exist_in_new_data as (

  select
    a.media_ad_id,
    count(distinct a.domain_userid) as views_unique,
    count(distinct case when a.clicked then a.domain_userid end) as clicked_unique,
    count(distinct case when a.skipped then a.domain_userid end) as skipped_unique,
    {{ media_ad_quartile_event_field('count(distinct case when a.percent_reached_25 then domain_userid end)') }} as percent_reached_25_unique,
    {{ media_ad_quartile_event_field('count(distinct case when a.percent_reached_50 then domain_userid end)') }} as percent_reached_50_unique,
    {{ media_ad_quartile_event_field('count(distinct case when a.percent_reached_75 then domain_userid end)') }} as percent_reached_75_unique,
    count(distinct case when a.percent_reached_100 then domain_userid end) as percent_reached_100_unique

  from {{ ref("snowplow_media_player_media_ad_views") }} a

  where
    -- enough time has passed since the page_view's start_tstamp to be able to process it as a whole (please bear in mind the late arriving data)
    cast({{ dateadd('hour', var("snowplow__max_media_pv_window", 10), 'a.viewed_at') }} as {{ type_timestamp() }}) < {{ snowplow_utils.current_timestamp_in_utc() }}

    -- exists in the new data
    and exists(select 1 from new_media_ad_views as b where b.media_ad_id = a.media_ad_id)

  group by 1

)

, all_data as (

  select * from new_data
  union all
  select * {% if target.type in ['databricks', 'spark'] %}except(first_view_date){% endif %}
   from {{ this }}

)

, all_data_grouped as (

  select
    a.media_ad_id,

    a.platform,
    a.media_id,
    max(a.media_label) as media_label,

    {{ media_ad_field('a.ad_id') }} as ad_id,
    {{ media_ad_field('max(a.name)') }} as name,
    {{ media_ad_field('max(a.creative_id)') }} as creative_id,
    {{ media_ad_field('max(a.duration_secs)') }} as duration_secs,
    {{ media_ad_field('sum(case when a.skippable then 1 else 0 end) > 0') }} as skippable,
    {{ media_ad_field('sum(a.pod_position * a.views) / sum(a.views)') }} as pod_position,

    sum(a.views) as views,
    sum(a.clicked) as clicked,
    sum(a.skipped) as skipped,
    {{ media_ad_quartile_event_field('sum(a.percent_reached_25)') }} as percent_reached_25,
    {{ media_ad_quartile_event_field('sum(a.percent_reached_50)') }} as percent_reached_50,
    {{ media_ad_quartile_event_field('sum(a.percent_reached_75)') }} as percent_reached_75,
    sum(a.percent_reached_100) as percent_reached_100,

    sum(a.views_unique) as views_unique,
    sum(a.clicked_unique) as clicked_unique,
    sum(a.skipped_unique) as skipped_unique,
    {{ media_ad_quartile_event_field('sum(a.percent_reached_25_unique)') }} as percent_reached_25_unique,
    {{ media_ad_quartile_event_field('sum(a.percent_reached_50_unique)') }} as percent_reached_50_unique,
    {{ media_ad_quartile_event_field('sum(a.percent_reached_75_unique)') }} as percent_reached_75_unique,
    sum(a.percent_reached_100_unique) as percent_reached_100_unique,

    min(a.first_view) as first_view,
    max(a.last_view) as last_view

  from all_data a

  group by 1, 2, 3, 5

)

, prep as (

  select
    a.media_ad_id,

    a.platform,
    a.media_id,
    a.media_label,

    a.ad_id,
    a.name,
    a.creative_id,
    a.duration_secs,
    a.skippable,
    a.pod_position,

    a.views,
    a.clicked,
    a.skipped,
    {{ media_ad_quartile_event_field('a.percent_reached_25') }} as percent_reached_25,
    {{ media_ad_quartile_event_field('a.percent_reached_50') }} as percent_reached_50,
    {{ media_ad_quartile_event_field('a.percent_reached_75') }} as percent_reached_75,
    a.percent_reached_100,

    coalesce(b.views_unique, a.views_unique) as views_unique,
    coalesce(b.clicked_unique, a.clicked_unique) as clicked_unique,
    coalesce(b.skipped_unique, a.skipped_unique) as skipped_unique,
    {{ media_ad_quartile_event_field('coalesce(b.percent_reached_25_unique, a.percent_reached_25_unique)') }} as percent_reached_25_unique,
    {{ media_ad_quartile_event_field('coalesce(b.percent_reached_50_unique, a.percent_reached_50_unique)') }} as percent_reached_50_unique,
    {{ media_ad_quartile_event_field('coalesce(b.percent_reached_75_unique, a.percent_reached_75_unique)') }} as percent_reached_75_unique,
    coalesce(b.percent_reached_100_unique, a.percent_reached_100_unique) as percent_reached_100_unique,

    a.first_view,
    a.last_view

  from all_data_grouped a

  left join unique_counts_that_exist_in_new_data b
    on a.media_ad_id = b.media_ad_id
)

{% else %}

, prep as (

  select * from new_data

)

{% endif %}

select *
  {% if target.type in ['databricks', 'spark'] -%}
  , date(prep.first_view) as first_view_date
  {%- endif %}

  from prep
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_media_ad_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.dateadd
- macro.dbt.is_incremental
- macro.dbt.type_timestamp
- [macro.snowplow_media_player.media_ad_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_field)
- [macro.snowplow_media_player.media_ad_quartile_event_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_quartile_event_field)
- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Media Stats {#model.snowplow_media_player.snowplow_media_player_media_stats}

<DbtDetails><summary>
<code>models/media_stats/snowplow_media_player_media_stats.sql</code>
</summary>

<h4>Description</h4>

This derived table aggregates the pageview level interactions to show overall media stats.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| media_id | The primary key of this table | text |
| media_label | The optional, human readable name given to tracked media content. | text |
| duration_secs | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. | float |
| media_type | The type of media content: video or audio. | text |
| media_player_type | The combination of schema_name and schema_vendor coming from the specific media player context e.g. com.youtube-youtube, org.whatwg-media_element. | text |
| play_time_mins | Calculated duration of play in minutes.  This also counts rewatched content (see `avg_content_watched_mins` for a measurement without considering rewatched content). | float |
| avg_play_time_mins | Estimated average duration of plays in minutes. This also counts rewatched content (see `avg_content_watched_mins` for a measurement without considering rewatched content).

If the media session context entity is tracked with events, the information is taken from there which makes it more accurate since it is calculated on the tracker. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| avg_content_watched_mins | Average duration of the content played in minutes. Each part of the content played is counted once (i.e., counts rewinding or rewatching the same content only once).

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| first_play | The `derived_tstamp` of the beginning of the first play of a media element. | timestamp_ntz |
| last_play | The `derived_tstamp` of the beginning of the last play of a media element. | timestamp_ntz |
| plays | The number of pageviews with plays of any duration. | number |
| valid_plays | The sum of all media plays that exceeds the minimum media length set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 (seconds). | number |
| complete_plays | The number of plays where the total percentage played is bigger than or equal to the `snowplow__complete_play_rate`. Default is 0.99, meaning that 99% of the video being watched constitutes a complete play. | number |
| impressions | The number of pageviews where a media content was rendered regardless of whether the media was actually played or not. | number |
| avg_playback_rate | Average playback rate (1 is normal speed). | float |
| play_rate | Total plays divided by impressions. Please note that as the base for media plays is pageview / media_id, in case the same video is played multiple times within the same pageview, it will still count as one play. | float |
| completion_rate_by_plays | The number of complete plays divided by the number of pageviews with plays of any duration. | float |
| avg_percent_played | Average of total play_time divided by the media duration. | float |
| avg_retention_rate | The maximum percent progress reached before any seek event. | float |
| last_base_tstamp | The start_tstamp of the last processed page_view across all media_ids to be used as a lower limit for subsequent incremental runs. | timestamp_ntz |
| percent_reached_10 |   | number |
| percent_reached_25 |   | number |
| percent_reached_50 |   | number |
| percent_reached_75 |   | number |
| percent_reached_100 |   | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/media_stats/snowplow_media_player_media_stats.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized= 'incremental',
    unique_key = 'media_id',
    sort = 'last_play',
    dist = 'media_id',
    tags=["derived"],
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "first_play",
      "data_type": "timestamp"
    }, databricks_val='first_play_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["media_id"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

{% if is_incremental() %}

with new_data as (

  select
    p.media_id,
    p.media_label,
    max(p.duration_secs) as duration_secs,
    p.media_type,
    p.media_player_type,
    min(case when is_played then p.start_tstamp end) as first_play,
    max(case when is_played then p.start_tstamp end) as last_play,
    sum(p.play_time_secs) as play_time_secs,
    sum(case when is_played then 1 else 0 end) as plays,
    sum(case when is_valid_play then 1 else 0 end) as valid_plays,
    sum(case when p.is_complete_play then 1 else 0 end) as complete_plays,
    count(distinct p.page_view_id) as impressions,
    avg(case when is_played then coalesce({{ media_session_field('p.content_watched_secs') }}, p.play_time_secs, 0) / nullif(p.duration_secs, 0) end) as avg_percent_played,
    avg(case when is_played then p.retention_rate end) as avg_retention_rate,
    avg(case when is_played then p.avg_playback_rate end) as avg_playback_rate,
    {{ media_session_field('avg(case when is_played then p.content_watched_secs end)') }} as avg_content_watched_sec,
    max(start_tstamp) as last_base_tstamp

from {{ ref("snowplow_media_player_base") }} p

where -- enough time has passed since the page_view's start_tstamp to be able to process it as a whole (please bear in mind the late arriving data)
cast({{ dateadd('hour', var("snowplow__max_media_pv_window", 10), 'p.end_tstamp ') }} as {{ type_timestamp() }}) < {{ snowplow_utils.current_timestamp_in_utc() }}
-- and it has not been processed yet
and (
  not exists(select 1 from {{ this }}) or -- no records in the table
  p.start_tstamp > ( select max(last_base_tstamp) from {{ this }} )
)

group by 1,2,4,5

)

, prep as (

  select
    n.media_id,
    n.media_label,
    greatest(n.duration_secs, coalesce(t.duration_secs, 0)) as duration_secs,
    n.media_type,
    n.media_player_type,
    n.last_base_tstamp,
    nullif(
      least(n.first_play, coalesce(t.first_play, cast('2999-01-01 00:00:00' as {{ type_timestamp() }}))),
      cast('2999-01-01 00:00:00' as {{ type_timestamp() }})
    ) as first_play,
    nullif(
      greatest(n.last_play, coalesce(t.last_play, cast('2000-01-01 00:00:00' as {{ type_timestamp() }}))),
      cast('2000-01-01 00:00:00' as {{ type_timestamp() }})
    ) as last_play,
    n.play_time_secs / cast(60 as {{ type_float() }}) + coalesce(t.play_time_mins, 0) as play_time_mins,
    (n.play_time_secs / cast(60 as {{ type_float() }}) + coalesce(t.play_time_mins, 0))  / nullif((n.plays + coalesce(t.plays, 0)), 0) as avg_play_time_mins,
    n.plays + coalesce(t.plays, 0) as plays,
    n.valid_plays + coalesce(t.valid_plays, 0) as valid_plays,
    n.complete_plays + coalesce(t.complete_plays, 0) as complete_plays,
    n.impressions + coalesce(t.impressions, 0)  as impressions,
    -- weighted average calculations
    (n.avg_percent_played * n.plays / nullif((n.plays + coalesce(t.plays, 0)),0)) + (coalesce(t.avg_percent_played, 0) * coalesce(t.plays, 0) / nullif((n.plays + coalesce(t.plays, 0)), 0)) as avg_percent_played,
    (n.avg_retention_rate * n.plays / nullif((n.plays + coalesce(t.plays, 0)), 0)) + (coalesce(t.avg_retention_rate, 0) * coalesce(t.plays, 0) / nullif((n.plays + coalesce(t.plays, 0)), 0)) as avg_retention_rate,
    (n.avg_playback_rate * n.plays / nullif((n.plays + coalesce(t.plays, 0)), 0)) + (coalesce(t.avg_playback_rate, 0) * coalesce(t.plays, 0) / nullif((n.plays + coalesce(t.plays, 0)), 0)) as avg_playback_rate,
    cast({{ media_session_field('(coalesce(n.avg_content_watched_sec, 0.0) / cast(60 as ' + type_float() + ') * n.plays + coalesce(t.avg_content_watched_mins, 0.0) * coalesce(t.plays, 0.0)) / nullif((n.plays + coalesce(t.plays, 0.0)), 0.0)') }} as {{ type_float() }}) as avg_content_watched_mins

  from new_data n

  left join {{ this }} t
  on n.media_id = t.media_id

)

, percent_progress_reached as (

    select
      media_id,
      {{ snowplow_utils.get_split_to_array('percent_progress_reached', 'p') }} as percent_progress_reached

    from {{ ref("snowplow_media_player_base") }} p

    where -- enough time has passed since the page_view`s start_tstamp to be able to process it a a whole (please bear in mind the late arriving data)

    cast({{ dateadd('hour', var("snowplow__max_media_pv_window", 10), 'p.end_tstamp ') }} as {{ type_timestamp() }}) < {{ snowplow_utils.current_timestamp_in_utc() }}

    -- and it has not been processed yet
    and p.start_tstamp > ( select max(last_base_tstamp) from {{ this }} )

)

, unnesting as (

  {{ snowplow_utils.unnest('media_id', 'percent_progress_reached', 'value_reached', 'percent_progress_reached') }}

)

, pivoting as (

  select
    u.media_id,
  {{ dbt_utils.pivot(
    column='u.value_reached',
    values=dbt_utils.get_column_values( table=ref('snowplow_media_player_pivot_base'), column='percent_progress', default=[]) | sort,
    alias=True,
    agg='sum',
    cmp='=',
    prefix='percent_reached_',
    quote_identifiers=FALSE
    ) }}

  from unnesting u

  group by 1

)

, addition as (

  select
    coalesce(p.media_id, t.media_id) as media_id,

  {% for element in get_percentage_boundaries(var("snowplow__percent_progress_boundaries")) %}

    {% set element_string = element | string() %}

    {% set alias  = 'percent_reached_' + element_string %}

    coalesce(p.percent_reached_{{ element_string }}, 0)
  + coalesce(t.percent_reached_{{ element_string }}, 0)
    as {{ alias }}

    {% if not loop.last %}

      ,

    {% endif %}

  {% endfor %}

  from pivoting p

  full outer join {{ this }} t
  on t.media_id = p.media_id

)

{% else %}

with prep as (

  select
    p.media_id,
    p.media_label,
    max(p.duration_secs) as duration_secs,
    p.media_type,
    p.media_player_type,
    max(start_tstamp) as last_base_tstamp,
    min(case when is_played then p.start_tstamp end) as first_play,
    max(case when is_played then p.start_tstamp end) as last_play,
    sum(p.play_time_secs) / cast(60 as {{ type_float() }}) as play_time_mins,
    avg(case when is_played then p.play_time_secs / cast(60 as {{ type_float() }}) end) as avg_play_time_mins,
    sum(case when is_played then 1 else 0 end) as plays,
    sum(case when is_valid_play then 1 else 0 end) as valid_plays,
    sum(case when p.is_complete_play then 1 else 0 end) as complete_plays,
    count(distinct p.page_view_id) as impressions,
    avg(case when is_played then coalesce({{ media_session_field('p.content_watched_secs') }}, p.play_time_secs, 0) / nullif(p.duration_secs, 0) end) as avg_percent_played,
    avg(case when is_played then p.retention_rate end) as avg_retention_rate,
    avg(case when is_played then p.avg_playback_rate end) as avg_playback_rate,
    cast({{ media_session_field('avg(
      case
        when is_played and p.content_watched_secs is not null
        then p.content_watched_secs / cast(60 as ' + type_float() + ') end
    )') }} as {{ type_float() }}) as avg_content_watched_mins


from {{ ref("snowplow_media_player_base") }} p

group by 1,2,4,5

)

, percent_progress_reached as (

    select
      media_id,
      {{ snowplow_utils.get_split_to_array('percent_progress_reached', 'p') }} as percent_progress_reached

    from {{ ref("snowplow_media_player_base") }} p

)

, unnesting as (

  {{ snowplow_utils.unnest('media_id', 'percent_progress_reached', 'value_reached', 'percent_progress_reached') }}

)

{% endif %}


select
  p.media_id,
  p.media_label,
  p.duration_secs,
  p.media_type,
  p.media_player_type,
  p.play_time_mins,
  p.avg_play_time_mins,
  p.avg_content_watched_mins,
  p.first_play,
  p.last_play,
  p.plays,
  p.valid_plays,
  p.complete_plays,
  p.impressions,
  p.avg_playback_rate,
  p.plays / cast(nullif(p.impressions, 0) as {{ type_float() }}) as play_rate,
  p.complete_plays / cast(nullif(p.plays, 0) as {{ type_float() }}) as completion_rate_by_plays,
  p.avg_percent_played,
  p.avg_retention_rate,
  l.last_base_tstamp,

  {% if target.type in ['databricks', 'spark'] -%}
    date(p.first_play) as first_play_date,
  {%- endif %}

  {% if is_incremental() %}

    {% for element in get_percentage_boundaries(var("snowplow__percent_progress_boundaries")) %}
      coalesce(cast(a.percent_reached_{{ element }} as {{ type_int() }}), 0) as percent_reached_{{ element }}
      {% if not loop.last %}
        ,
      {% endif %}
    {% endfor %}

  {% else %}

    {{ dbt_utils.pivot(
    column='un.value_reached',
    values=dbt_utils.get_column_values( table=ref('snowplow_media_player_pivot_base'), column='percent_progress', default=[]) | sort,
    alias=True,
    agg='sum',
    cmp='=',
    prefix='percent_reached_',
    quote_identifiers=FALSE
    ) }}

  {% endif %}

  from prep p

  left join (select max(last_base_tstamp) as last_base_tstamp from prep ) l
  on 1 = 1

  {% if is_incremental() %}

  left join addition a
  on a.media_id = p.media_id

  {% else %}

  left join unnesting un
  on un.media_id = p.media_id

  {{ dbt_utils.group_by(n=20) }}

{% endif %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_pivot_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_pivot_base)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.dateadd
- macro.dbt.is_incremental
- macro.dbt.type_float
- macro.dbt.type_int
- macro.dbt.type_timestamp
- macro.dbt_utils.get_column_values
- macro.dbt_utils.group_by
- macro.dbt_utils.pivot
- [macro.snowplow_media_player.get_percentage_boundaries](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.get_percentage_boundaries)
- [macro.snowplow_media_player.media_session_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_session_field)
- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.get_split_to_array](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_split_to_array)
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.unnest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.unnest)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Pivot Base {#model.snowplow_media_player.snowplow_media_player_pivot_base}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_media_player_pivot_base.sql</code>
</summary>

<h4>Description</h4>

This helper table serves as a base to calculate percent_progress based fields as well as the play_time metrics (by calculating the weight attributed to a percent progress being reached).

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| percent_progress | The percent of the way through the media. It is based on either the percentprogress event that is fired at specific intervalls as defined during the tracker setup or the 'ended' event, which is equivalent to reaching 100% of the media's total duration (length). e.g. 25, meaning the user passed the 25% mark during play. It does not mean the user watched all the content in between two percentprogress marks, unless there is no seek events happening within the same page_view (`snowplow_media_player_base`). | number |
| weight_rate | The weight given for each percent progress reached used for the calculation of the play_time_sec_estimated field. It is based on the difference of the current and preciding percent_progress rate. | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/base/scratch/snowplow_media_player_pivot_base.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='table',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

  {% for element in get_percentage_boundaries(var("snowplow__percent_progress_boundaries")) %}

    select

      {{ element }} as percent_progress

    {% if not loop.last %}

      union all

    {% endif %}

  {% endfor %}

)

, weight_calc as (

  select
    percent_progress,
    percent_progress
    - lag(percent_progress, 1) over (order by percent_progress) as weight_rate,
    first_value(percent_progress)
      over (
        order by
          percent_progress
        rows between unbounded preceding and unbounded following
      ) as first_item

  from prep

  order by percent_progress

)

select
  percent_progress,
  coalesce(weight_rate, first_item) as weight_rate

from weight_calc
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.get_percentage_boundaries](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.get_percentage_boundaries)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Plays By Pageview {#model.snowplow_media_player.snowplow_media_player_plays_by_pageview}

<DbtDetails><summary>
<code>models/media_plays/snowplow_media_player_plays_by_pageview.sql</code>
</summary>

<h4>Description</h4>

This view removes impressions from the derived snowplow_media_player_base table for showing pageview level media play events. This means that only media player instances where a play event was tracked are kept (where `is_played` is true).

**Type**: View

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. | text |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. | text |
| media_label | The optional, human readable name given to tracked media content. | text |
| session_identifier | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. | text |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. | text |
| user_id |   | text |
| page_referrer | URL of the referrer e.g. `http://www.referrer.com`. | text |
| page_url | The page URL e.g. `http://www.example.com`. | text |
| source_url | The url which shows the source of the media content. For YouTube it is the `url` context field, for HTML5 it is the `source_url` field. | text |
| geo_region_name | Visitor region name e.g. `Florida`. | text |
| br_name | Browser name e.g. `Firefox 12`. | text |
| dvce_type | Type of device e.g. `Computer`. | text |
| os_name | Name of operating system e.g. `Android`. | text |
| os_timezone | Client operating system timezone e.g. `Europe/London`. | text |
| platform | Platform e.g. ‘web’ | text |
| duration_secs | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. | float |
| media_type | The type of media content: video or audio. | text |
| media_player_type | The combination of schema_name and schema_vendor coming from the specific media player context e.g. com.youtube-youtube, org.whatwg-media_element. | text |
| start_tstamp | The `derived_tstamp` denoting the time when the event started. | timestamp_ntz |
| end_tstamp | The `derived_tstamp` denoting the time when the last media player event belonging to the specific level of aggregation (e.g.: page_view by media) started. | timestamp_ntz |
| avg_playback_rate | Average playback rate (1 is normal speed). | float |
| play_time_secs | Total seconds user spent playing content (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

 This also counts playback of rewatched content (see `content_watched_secs` for a measurement without considering rewatched content).

If the media session entity is not tracked, the value is estimated. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. | float |
| play_time_muted_secs | Total seconds user spent playing content on mute (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

If the media session entity is not tracked, the value is estimated. It is based on the percent_progress event and whether the user played it on mute during this event or not. | float |
| paused_time_secs | Total seconds user spent with paused content (excluding linear ads).

This information is provided by the tracker in the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| buffering_time_secs | Total seconds that playback was buffering.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| ads_time_secs | Total seconds that ads played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. | number |
| ads | Number of ads played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ads_clicked | Number of ads that the user clicked on.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ads_skipped | Number of ads that the user skipped.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| ad_breaks | Number of ad breaks played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | number |
| is_played | Pageviews with at least one play event. | boolean |
| is_valid_play | A boolean value to show whether the duration of the play (`play_time_secs`) is bigger than or equal to the variable given in `snowplow__valid_play_sec` (defaulted to 30). | boolean |
| is_complete_play | A boolean value to show whether the total percentage played is bigger than or equal to the `snowplow__complete_play_rate` (defaulted to 0.99). | boolean |
| retention_rate | The maximum percent progress reached before any seek event. | float |
| percent_progress_reached | An array of percent progresses reached by the user while playing the media. In case the same percentprogress event was fired during the same page_view (e.g. due to seeks to rewatch part of the video) the % is added to the array again. e.g. in case of percent_progress_reached = [10, 25, 25, 50, 75] the user replayed part of the media so that the percentprogress event fired twice at the 25% mark. | text |
| content_watched_secs | Total seconds of the content played. Each part of the content played is counted once (i.e., counts rewinding or rewatching the same content only once).

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
| content_watched_percent | Percentage of the content played.

Calculated on the tracker and provided through the media session context entity. If the media session entity is not tracked (when using our older tracking plugins or when it is disabled on the tracker), this property will be null. | float |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/media_plays/snowplow_media_player_plays_by_pageview.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized='view',
    tags=["derived"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select *

from {{ ref("snowplow_media_player_base") }}

where is_played
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Session Stats {#model.snowplow_media_player.snowplow_media_player_session_stats}

<DbtDetails><summary>
<code>models/custom/snowplow_media_player_session_stats.sql</code>
</summary>

<h4>Description</h4>

This table aggregates the pageview level interactions to show session level media stats.

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|:------------|:------------|
| session_identifier | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| impressions | The number of pageviews where a media content was rendered regardless of whether the media was actually played or not. |
| videos_played | The distinct number of videos that were played during a session. |
| audio_played | The distinct number of audio files that were played during a session. |
| video_plays | The number of pageviews with video plays of any duration. |
| audio_plays | The number of pageviews with audio plays of any duration. |
| valid_video_plays | The sum of all video plays that exceed the limit set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 seconds. |
| valid_audio_plays | The sum of all audio plays that exceeded the limit set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 seconds. |
| start_tstamp | The `derived_tstamp` denoting the time when the event started. |
| end_tstamp | The `derived_tstamp` denoting the time when the last media player event belonging to the specific level of aggregation (e.g.: page_view by media) started. |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. |
| play_time_secs | Total seconds user spent playing content (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

 This also counts playback of rewatched content (see `content_watched_secs` for a measurement without considering rewatched content).

If the media session entity is not tracked, the value is estimated. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. |
| play_time_muted_secs | Total seconds user spent playing content on mute (excluding linear ads). If the media session entity is tracked with media events, the information is read from there. This is an accurate measurement provided by the tracker.

If the media session entity is not tracked, the value is estimated. It is based on the percent_progress event and whether the user played it on mute during this event or not. |
| avg_play_time_sec | Estimated average duration of plays in seconds. This also counts rewatched content (see `content_watched_secs` for a measurement without considering rewatched content).

If the media session context entity is tracked with events, the information is taken from there which makes it more accurate since it is calculated on the tracker. |
| avg_percent_played | Average of total play_time divided by the media duration. |
| complete_plays | The number of plays where the total percentage played is bigger than or equal to the `snowplow__complete_play_rate`. Default is 0.99, meaning that 99% of the video being watched constitutes a complete play. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/custom/snowplow_media_player_session_stats.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized = 'table',
    sort = 'start_tstamp',
    dist = 'session_identifier',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["domain_userid"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

  select
    session_identifier,
    domain_userid,
    count(*) as impressions,
    count(distinct case when media_type = 'video' and is_played then media_id end) as videos_played,
    count(distinct case when media_type = 'audio' and is_played then media_id end) as audio_played,
    sum(case when media_type = 'video' and is_played then 1 else 0 end) as video_plays,
    sum(case when media_type = 'audio' and is_played then 1 else 0 end) as audio_plays,
    sum(case when media_type = 'video' and is_valid_play then 1 else 0 end) as valid_video_plays,
    sum(case when media_type = 'audio' and is_valid_play then 1 else 0 end) as valid_audio_plays,
    min(start_tstamp) start_tstamp,
    max(end_tstamp) as end_tstamp,
    sum(seeks) as seeks,
    sum(play_time_secs / cast(60 as {{ type_float() }})) as play_time_mins,
    sum(play_time_muted_secs / cast(60 as {{ type_float() }})) as play_time_muted_mins,
    coalesce(avg(case when is_played then play_time_secs / cast(60 as {{ type_float() }}) end), 0) as avg_play_time_mins,
    coalesce(avg(case when is_played then coalesce(play_time_secs / nullif(duration_secs, 0), 0) end),0) as avg_percent_played,
    sum(case when is_complete_play then 1 else 0 end) as complete_plays

  from {{ ref("snowplow_media_player_base") }}

  group by 1,2

)

select *

{% if target.type in ['databricks', 'spark'] -%}
, date(start_tstamp) as start_tstamp_date
{%- endif %}

from prep
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_float
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player User Stats {#model.snowplow_media_player.snowplow_media_player_user_stats}

<DbtDetails><summary>
<code>models/custom/snowplow_media_player_user_stats.sql</code>
</summary>

<h4>Description</h4>

This table aggregates the pageview level interactions to show user level media stats.

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|:------------|:------------|
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| first_play | The `derived_tstamp` of the beginning of the first play of a media element. |
| last_play | The `derived_tstamp` of the beginning of the last play of a media element. |
| video_plays | The number of pageviews with video plays of any duration. |
| audio_plays | The number of pageviews with audio plays of any duration. |
| valid_video_plays | The sum of all video plays that exceed the limit set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 seconds. |
| valid_audio_plays | The sum of all audio plays that exceeded the limit set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 seconds. |
| complete_plays | The number of plays where the total percentage played is bigger than or equal to the `snowplow__complete_play_rate`. Default is 0.99, meaning that 99% of the video being watched constitutes a complete play. |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. |
| play_time_mins | Calculated duration of play in minutes.  This also counts rewatched content (see `avg_content_watched_mins` for a measurement without considering rewatched content). |
| avg_session_play_time_mins | Estimated average duration of plays in seconds within a session. |
| avg_percent_played | Average of total play_time divided by the media duration. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/custom/snowplow_media_player_user_stats.sql">Source</a></i></b></center>

```jinja2
{#
Copyright (c) 2022-present Snowplow Analytics Ltd. All rights reserved.
This program is licensed to you under the Snowplow Personal and Academic License Version 1.0,
and you may not use this file except in compliance with the Snowplow Personal and Academic License Version 1.0.
You may obtain a copy of the Snowplow Personal and Academic License Version 1.0 at https://docs.snowplow.io/personal-and-academic-license-1.0/
#}

{{
  config(
    materialized = 'table',
    sort = 'first_play',
    dist = 'domain_userid',
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "first_play",
      "data_type": "timestamp"
    }, databricks_val='first_play_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["domain_userid"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

  select
    domain_userid,
    min(case when (video_plays + audio_plays) > 0 then start_tstamp end) as first_play,
    max(case when (video_plays + audio_plays) > 0 then start_tstamp end) as last_play,
    sum(video_plays) as video_plays,
    sum(audio_plays) as audio_plays,
    sum(valid_video_plays) as valid_video_plays,
    sum(valid_audio_plays) as valid_audio_plays,
    sum(complete_plays) as complete_plays,
    sum(seeks) as seeks,
    cast(sum(play_time_mins) as {{ type_int() }}) as play_time_mins,
    -- using session and not page_view as the base for average to save cost by not joining on snowplow_media_player_base for calculating on individual page_view level average
    coalesce(cast(avg(case when (video_plays + audio_plays) > 0 then avg_play_time_mins end) as {{ type_int() }}), 0) as avg_session_play_time_mins,
    coalesce(avg(avg_percent_played),0) as avg_percent_played

  from {{ ref("snowplow_media_player_session_stats") }}

  group by 1

)

select *

{% if target.type in ['databricks', 'spark'] -%}
, date(first_play) as first_play_date
{%- endif %}

from prep
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_int
- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

