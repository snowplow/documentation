---
title: "Snowplow Media Player Models"
description: Reference for snowplow_media_player dbt models developed by Snowplow
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';

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
<code>models/web/snowplow_media_player_base.sql</code>
</summary>

#### Description
This derived table aggregates media player interactions to a pageview level incrementally.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. |
| media_label | The optional, human readable name given to tracked media content. |
| domain_sessionid | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| duration | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. |
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
| start_tstamp | The `derived_tstamp` denoting the time when the event started. |
| end_tstamp | The `derived_tstamp` denoting the time when the last media player event belonging to the specific level of aggregation (e.g.: page_view by media) started. |
| play_time_sec | Estimated duration of play in seconds. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. |
| play_time_sec_muted | Calculated duration of muted play in seconds. It is based on the percent_progress event and whether the user played it on mute during this event or not. |
| is_played | Pageviews with at least one play event. |
| is_valid_play | A boolean value to show whether the duration of the play (`play_time_sec`) is bigger than or equal to the variable given in `snowplow__valid_play_sec` (defaulted to 30). |
| is_complete_play | A boolean value to show whether the total percentage played is bigger than or equal to the `snowplow__complete_play_rate` (defaulted to 0.99). |
| avg_playback_rate | Average playback rate (1 is normal speed). |
| retention_rate | The maximum percent progress reached before any seek event. |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. |
| percent_progress_reached | An array of percent progresses reached by the user while playing the media. In case the same percentprogress event was fired during the same page_view (e.g. due to seeks to rewatch part of the video) the % is added to the array again. e.g. in case of percent_progress_reached = [10, 25, 25, 50, 75] the user replayed part of the media so that the percentprogress event fired twice at the 25% mark. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/snowplow_media_player_base.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized= var("snowplow__incremental_materialization", 'snowplow_incremental'),
    upsert_date_key='start_tstamp',
    unique_key = 'play_id',
    sort = 'start_tstamp',
    dist = 'play_id',
    tags=["derived"],
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='start_tstamp_date'),
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["media_id"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

select *

from {{ ref('snowplow_media_player_base_this_run') }}

where {{ snowplow_utils.is_run_with_new_events('snowplow_web') }} --returns false if run doesn't contain new events.
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_web.snowplow_web_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_new_event_limits)
- [model.snowplow_web.snowplow_web_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_plays_by_pageview](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_plays_by_pageview)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Base This Run {#model.snowplow_media_player.snowplow_media_player_base_this_run}

<DbtDetails><summary>
<code>models/web/scratch/snowplow_media_player_base_this_run.sql</code>
</summary>

#### Description
This staging table aggregates media player interactions within the current run to a pageview level that is considered a base level for media plays.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. |
| media_label | The optional, human readable name given to tracked media content. |
| domain_sessionid | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| duration | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. |
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
| start_tstamp | The `derived_tstamp` denoting the time when the event started. |
| end_tstamp | The `derived_tstamp` denoting the time when the last media player event belonging to the specific level of aggregation (e.g.: page_view by media) started. |
| play_time_sec | Estimated duration of play in seconds. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. |
| play_time_sec_muted | Calculated duration of muted play in seconds. It is based on the percent_progress event and whether the user played it on mute during this event or not. |
| is_played | Pageviews with at least one play event. |
| is_valid_play | A boolean value to show whether the duration of the play (`play_time_sec`) is bigger than or equal to the variable given in `snowplow__valid_play_sec` (defaulted to 30). |
| is_complete_play | A boolean value to show whether the total percentage played is bigger than or equal to the `snowplow__complete_play_rate` (defaulted to 0.99). |
| avg_playback_rate | Average playback rate (1 is normal speed). |
| retention_rate | The maximum percent progress reached before any seek event. |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. |
| percent_progress_reached | An array of percent progresses reached by the user while playing the media. In case the same percentprogress event was fired during the same page_view (e.g. due to seeks to rewatch part of the video) the % is added to the array again. e.g. in case of percent_progress_reached = [10, 25, 25, 50, 75] the user replayed part of the media so that the percentprogress event fired twice at the 25% mark. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/scratch/snowplow_media_player_base_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='table',
    tags=["this_run"],
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='start_tstamp_date'),
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["media_id"]),
    sort = 'start_tstamp',
    dist = 'play_id',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

  select
    i.play_id,
    i.page_view_id,
    i.media_id,
    i.media_label,
    i.domain_sessionid,
    i.domain_userid,
    max(i.duration) as duration,
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
    sum(case when i.event_type in ('seek', 'seeked') then 1 else 0 end) as seeks,
    sum(i.play_time_sec) as play_time_sec,
    sum(i.play_time_sec_muted) as play_time_sec_muted,
    coalesce(sum(i.playback_rate * i.play_time_sec) / nullif(sum(i.play_time_sec), 0), max(i.playback_rate)) as avg_playback_rate,
    {{ snowplow_utils.get_string_agg('percent_progress', 'i', sort_numeric=true) }} as percent_progress_reached,
    min(case when i.event_type in ('seek', 'seeked') then start_tstamp end) as first_seek_time,
    max(i.percent_progress) as max_percent_progress

  from  {{ ref('snowplow_media_player_interactions_this_run') }} as i

  group by 1,2,3,4,5,6,8,9,10,11,13,14,15,16,17

)

, dedupe as (

  select
    *,
    row_number() over (partition by play_id order by start_tstamp) as duplicate_count

  from prep

)

, retention_rate as (

    select
      d.play_id,
      max(i.percent_progress) as retention_rate

    from dedupe d

    inner join {{ ref("snowplow_media_player_interactions_this_run") }} i
    on i.play_id = d.play_id

    where i.percent_progress is not null and (i.start_tstamp <= d.first_seek_time or d.first_seek_time is null)

    group by 1

)

-- for correcting NULLs in case of 'ready' events only where the metadata showing the duration is usually missing as the event fires before it has time to load
, duration_fix as (

  select
    f.media_id,
    max(f.duration) as duration

  from  {{ ref('snowplow_media_player_interactions_this_run') }} as f

  group by 1

)

select
  d.play_id,
  d.page_view_id,
  d.media_id,
  d.media_label,
  d.domain_sessionid,
  d.domain_userid,
  f.duration,
  d.media_type,
  d.media_player_type,
  d.page_referrer,
  d.page_url,
  d.source_url,
  d.geo_region_name,
  d.br_name,
  d.dvce_type,
  d.os_name,
  d.os_timezone,
  d.start_tstamp,
  d.end_tstamp,
  d.play_time_sec,
  d.play_time_sec_muted,
  d.plays > 0 as is_played,
  case when d.play_time_sec > {{ var("snowplow__valid_play_sec") }} then true else false end is_valid_play,
  case when play_time_sec / nullif(f.duration, 0) >= {{ var("snowplow__complete_play_rate") }} then true else false end as is_complete_play,
  cast(d.avg_playback_rate as {{ type_float() }}) as avg_playback_rate,
  cast(coalesce(case when r.retention_rate > d.max_percent_progress
          then d.max_percent_progress / cast(100 as {{ type_float() }})
          else r.retention_rate / cast(100 as {{ type_float() }})
          end, 0) as {{ type_float() }}) as retention_rate, -- to correct incorrect result due to duplicate session_id (one removed)
  d.seeks,
  case when d.percent_progress_reached = '' then null else d.percent_progress_reached end as percent_progress_reached

  {% if target.type in ['databricks', 'spark'] -%}
  , date(start_tstamp) as start_tstamp_date
  {%- endif %}

from dedupe d

left join retention_rate r
on r.play_id = d.play_id

left join duration_fix f
on f.media_id = d.media_id

where d.duplicate_count = 1
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_interactions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.type_float
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.get_string_agg](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_string_agg)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Interactions This Run {#model.snowplow_media_player.snowplow_media_player_interactions_this_run}

<DbtDetails><summary>
<code>models/web/scratch/interactions_this_run/&lt;adaptor&gt;/snowplow_media_player_interactions_this_run.sql</code>
</summary>

#### Description
This staging table shows all media player events within the current incremental run and calculates play_time. It could be used in custom models for more in-depth time based calculations.

#### File Paths
<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

`models/web/scratch/interactions_this_run/bigquery/snowplow_media_player_interactions_this_run.sql`
</TabItem>
<TabItem value="databricks" label="databricks" >

`models/web/scratch/interactions_this_run/databricks/snowplow_media_player_interactions_this_run.sql`
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

`models/web/scratch/interactions_this_run/redshift_postgres/snowplow_media_player_interactions_this_run.sql`
</TabItem>
<TabItem value="snowflake" label="snowflake" >

`models/web/scratch/interactions_this_run/snowflake/snowplow_media_player_interactions_this_run.sql`
</TabItem>
</Tabs>


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| event_id | A UUID for each event e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| domain_sessionid | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. |
| media_label | The optional, human readable name given to tracked media content. |
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. |
| duration | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. |
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
| player_current_time | The playback position of a specific media in seconds whenever a media player event is fired. Could be used in custom models for more detailed analytics or play time calculations. |
| playback_rate | Playback rate (1 is normal speed). |
| playback_quality | Depending on the player it is either the playback quality field or the resolution. |
| percent_progress | The percent of the way through the media. It is based on either the percentprogress event that is fired at specific intervalls as defined during the tracker setup or the 'ended' event, which is equivalent to reaching 100% of the media's total duration (length). e.g. 25, meaning the user passed the 25% mark during play. It does not mean the user watched all the content in between two percentprogress marks, unless there is no seek events happening within the same page_view (`snowplow_media_player_base`). |
| is_muted | If the media is muted during the event that is fired. |
| play_time_sec | Estimated duration of play in seconds. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. |
| play_time_sec_muted | Calculated duration of muted play in seconds. It is based on the percent_progress event and whether the user played it on mute during this event or not. |
| is_live | If the media is live. |
| loop | If the video should restart after ending. |
| volume | Volume percent. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/scratch/interactions_this_run/bigquery/snowplow_media_player_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='table',
    tags=["this_run"],
  )
}}

with prep as (

 select
    e.event_id,
    e.page_view_id,
    e.domain_sessionid,
    e.domain_userid,
    e.page_referrer,
    e.page_url,
    {{ snowplow_utils.get_optional_fields(
                enabled= true,
                fields=[{'field': 'label', 'dtype': 'string'}],
                col_prefix='unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1',
                relation=ref('snowplow_web_base_events_this_run'),
                relation_alias='e',
                include_field_alias=false)}} as media_label,
    round(cast({{ snowplow_utils.get_optional_fields(
                 enabled= true,
                 fields=[{'field': 'duration', 'dtype': 'int'}],
                 col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                 relation=ref('snowplow_web_base_events_this_run'),
                 relation_alias='e',
                 include_field_alias=false)}} as float64)) as duration,
    e.geo_region_name,
    e.br_name,
    e.dvce_type,
    e.os_name,
    e.os_timezone,
    {{ snowplow_utils.get_optional_fields(
                enabled= true,
                fields=[{'field': 'type', 'dtype': 'string'}],
                col_prefix='unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1',
                relation=ref('snowplow_web_base_events_this_run'),
                relation_alias='e',
                   include_field_alias=false)}} as event_type,
    e.derived_tstamp as start_tstamp,
    {{ snowplow_utils.get_optional_fields(
                enabled= true,
                fields=[{'field': 'current_time', 'dtype': 'string'}],
                col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                relation=ref('snowplow_web_base_events_this_run'),
                relation_alias='e',
                include_field_alias=false)}} as player_current_time,
    coalesce(cast({{ snowplow_utils.get_optional_fields(
                        enabled= true,
                        fields=[{'field': 'playback_rate', 'dtype': 'string'}],
                        col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                        relation=ref('snowplow_web_base_events_this_run'),
                        relation_alias='e',
                        include_field_alias=false)}} as float64), 1) as playback_rate,
    case when {{ snowplow_utils.get_optional_fields(
                        enabled= true,
                        fields=[{'field': 'type', 'dtype': 'string'}],
                        col_prefix='unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1',
                        relation=ref('snowplow_web_base_events_this_run'),
                        relation_alias='e',
                        include_field_alias=false)}} = 'ended'
        then 100
        else safe_cast({{ snowplow_utils.get_optional_fields(
                        enabled= true,
                        fields=[{'field': 'percent_progress', 'dtype': 'int'}],
                        col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                        relation=ref('snowplow_web_base_events_this_run'),
                        relation_alias='e',
                        include_field_alias=false)}} as int64) end as percent_progress,
    cast({{ snowplow_utils.get_optional_fields(
                enabled= true,
                fields=[{'field': 'muted', 'dtype': 'string'}],
                col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                relation=ref('snowplow_web_base_events_this_run'),
                relation_alias='e',
                include_field_alias=false)}} as boolean) as is_muted,
    {{ snowplow_utils.get_optional_fields(
                enabled= true,
                fields=[{'field': 'is_live', 'dtype': 'string'}],
                col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                relation=ref('snowplow_web_base_events_this_run'),
                relation_alias='e',
                include_field_alias=false)}} as is_live,
    {{ snowplow_utils.get_optional_fields(
                enabled= true,
                fields=[{'field': 'loop', 'dtype': 'string'}],
                col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                relation=ref('snowplow_web_base_events_this_run'),
                relation_alias='e',
                include_field_alias=false)}} as loop,
    {{ snowplow_utils.get_optional_fields(
                enabled= true,
                fields=[{'field': 'volume', 'dtype': 'string'}],
                col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1',
                relation=ref('snowplow_web_base_events_this_run'),
                relation_alias='e',
                include_field_alias=false)}} as volume,
    {% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
      {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both need to be enabled for modelling html5 video tracking data.") }}

    {% elif var("snowplow__enable_youtube") %}
      {% if var("snowplow__enable_whatwg_media") %}
        coalesce({{ snowplow_utils.get_optional_fields(
                            enabled= true,
                            fields=[{'field': 'player_id', 'dtype': 'string'}],
                            col_prefix='contexts_com_youtube_youtube_1',
                            relation=ref('snowplow_web_base_events_this_run'),
                            relation_alias='e',
                            include_field_alias=false)}}, {{ snowplow_utils.get_optional_fields(
                                                                                enabled= true,
                                                                                fields=[{'field': 'html_id', 'dtype': 'string'}],
                                                                                col_prefix='contexts_org_whatwg_media_element_1_',
                                                                                relation=ref('snowplow_web_base_events_this_run'),
                                                                                relation_alias='e',
                                                                                include_field_alias=false)}}) as media_id,
        case when {{ snowplow_utils.get_optional_fields(
                              enabled= true,
                              fields=[{'field': 'player_id', 'dtype': 'string'}],
                              col_prefix='contexts_com_youtube_youtube_1',
                              relation=ref('snowplow_web_base_events_this_run'),
                              relation_alias='e',
                              include_field_alias=false)}} is not null
            then 'com.youtube-youtube'
            when {{ snowplow_utils.get_optional_fields(
                              enabled= true,
                              fields=[{'field': 'html_id', 'dtype': 'string'}],
                              col_prefix='contexts_org_whatwg_media_element_1_',
                              relation=ref('snowplow_web_base_events_this_run'),
                              relation_alias='e',
                              include_field_alias=false)}} is not null
            then 'org.whatwg-media_element'
            else 'unknown' end as media_player_type,
        coalesce({{ snowplow_utils.get_optional_fields(
                            enabled= true,
                            fields=[{'field': 'url', 'dtype': 'string'}],
                            col_prefix='contexts_com_youtube_youtube_1',
                            relation=ref('snowplow_web_base_events_this_run'),
                            relation_alias='e',
                            include_field_alias=false)}}, {{ snowplow_utils.get_optional_fields(
                                                                      enabled= true,
                                                                      fields=[{'field': 'current_src', 'dtype': 'string'}],
                                                                      col_prefix='contexts_org_whatwg_media_element_1_',
                                                                      relation=ref('snowplow_web_base_events_this_run'),
                                                                      relation_alias='e',
                                                                      include_field_alias=false)}}) as source_url,
        case when {{ snowplow_utils.get_optional_fields(
                              enabled= true,
                              fields=[{'field': 'media_type', 'dtype': 'string'}],
                              col_prefix='contexts_org_whatwg_media_element_1_',
                              relation=ref('snowplow_web_base_events_this_run'),
                              relation_alias='e',
                              include_field_alias=false)}} = 'audio' then 'audio' else 'video' end as media_type,
        {% if var("snowplow__enable_whatwg_video") %}
          coalesce({{ snowplow_utils.get_optional_fields(
                              enabled= true,
                              fields=[{'field': 'playback_quality', 'dtype': 'string'}],
                              col_prefix='contexts_com_youtube_youtube_1',
                              relation=ref('snowplow_web_base_events_this_run'),
                              relation_alias='e',
                              include_field_alias=false)}}, {{ snowplow_utils.get_optional_fields(
                                                                                enabled= true,
                                                                                fields=[{'field': 'video_width', 'dtype': 'string'}],
                                                                                col_prefix='contexts_org_whatwg_video_element_1',
                                                                                relation=ref('snowplow_web_base_events_this_run'),
                                                                                relation_alias='e',
                                                                                include_field_alias=false)}}||'x'||{{ snowplow_utils.get_optional_fields(
                                                                                                                                        enabled= true,
                                                                                                                                        fields=[{'field': 'video_height', 'dtype': 'string'}],
                                                                                                                                        col_prefix='contexts_org_whatwg_video_element_1',
                                                                                                                                        relation=ref('snowplow_web_base_events_this_run'),
                                                                                                                                        relation_alias='e',
                                                                                                                                        include_field_alias=false)}}) as playback_quality
        {% else %}
          {{ snowplow_utils.get_optional_fields(
                              enabled= true,
                              fields=[{'field': 'playback_quality', 'dtype': 'string'}],
                              col_prefix='contexts_com_youtube_youtube_1',
                              relation=ref('snowplow_web_base_events_this_run'),
                              relation_alias='e')}},
        {% endif %}
      {% else %}
        {{ snowplow_utils.get_optional_fields(
                   enabled= true,
                   fields=[{'field': 'player_id', 'dtype': 'string'}],
                   col_prefix='contexts_com_youtube_youtube_1',
                   relation=ref('snowplow_web_base_events_this_run'),
                   relation_alias='e',
                   include_field_alias=false)}} as media_id,
        'com.youtube-youtube' as media_player_type,
        {{ snowplow_utils.get_optional_fields(
                            enabled= true,
                            fields=[{'field': 'url', 'dtype': 'string'}],
                            col_prefix='contexts_com_youtube_youtube_1',
                            relation=ref('snowplow_web_base_events_this_run'),
                            relation_alias='e',
                            include_field_alias=false)}} as source_url,
        'video' as media_type,
        {{ snowplow_utils.get_optional_fields(
                              enabled= true,
                              fields=[{'field': 'playback_quality', 'dtype': 'string'}],
                              col_prefix='contexts_com_youtube_youtube_1',
                              relation=ref('snowplow_web_base_events_this_run'),
                              relation_alias='e')}}
      {% endif %}

    {% elif var("snowplow__enable_whatwg_media") %}
      {{ snowplow_utils.get_optional_fields(
                  enabled= true,
                  fields=[{'field': 'html_id', 'dtype': 'string'}],
                  col_prefix='contexts_org_whatwg_media_element_1_',
                  relation=ref('snowplow_web_base_events_this_run'),
                  relation_alias='e',
                  include_field_alias=false)}} as media_id,
      'org.whatwg-media_element' as media_player_type,
      {{ snowplow_utils.get_optional_fields(
                  enabled= true,
                  fields=[{'field': 'current_src', 'dtype': 'string'}],
                  col_prefix='contexts_org_whatwg_media_element_1_',
                  relation=ref('snowplow_web_base_events_this_run'),
                  relation_alias='e',
                  include_field_alias=false)}} as source_url,
      case when {{ snowplow_utils.get_optional_fields(
                              enabled= true,
                              fields=[{'field': 'media_type', 'dtype': 'string'}],
                              col_prefix='contexts_org_whatwg_media_element_1_',
                              relation=ref('snowplow_web_base_events_this_run'),
                              relation_alias='e',
                              include_field_alias=false)}} = 'audio' then 'audio' else 'video' end as media_type,
      {% if var("snowplow__enable_whatwg_video") %}
        {{ snowplow_utils.get_optional_fields(
                    enabled= true,
                    fields=[{'field': 'video_width', 'dtype': 'string'}],
                    col_prefix='contexts_org_whatwg_video_element_1',
                    relation=ref('snowplow_web_base_events_this_run'),
                    relation_alias='e',
                    include_field_alias=false)}}||'x'||{{ snowplow_utils.get_optional_fields(
                                                                            enabled= true,
                                                                            fields=[{'field': 'video_height', 'dtype': 'string'}],
                                                                            col_prefix='contexts_org_whatwg_video_element_1',
                                                                            relation=ref('snowplow_web_base_events_this_run'),
                                                                            relation_alias='e',
                                                                            include_field_alias=false)}} as playback_quality
      {% else %}
        'N/A' as playback_quality
      {% endif %}

    {% else %}
      {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
    {% endif %}

    from {{ ref("snowplow_web_base_events_this_run") }} as e

    where event_name = 'media_player_event'
)

 select
  {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }} play_id,
  p.*,
  coalesce(cast(piv.weight_rate * p.duration / 100 as {{ type_int() }}), 0) as play_time_sec,
  coalesce(cast(case when p.is_muted = true then piv.weight_rate * p.duration / 100 else 0 end as {{ type_int() }}), 0) as play_time_sec_muted

  from prep p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```
</TabItem>
<TabItem value="databricks" label="databricks" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/scratch/interactions_this_run/databricks/snowplow_media_player_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='table',
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

 select
    e.event_id,
    e.page_view_id,
    e.domain_sessionid,
    e.domain_userid,
    e.page_referrer,
    e.page_url,
    e.unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1.label::STRING as media_label,
    round(contexts_com_snowplowanalytics_snowplow_media_player_1[0].duration::float) as duration,
    e.geo_region_name,
    e.br_name,
    e.dvce_type,
    e.os_name,
    e.os_timezone,
    e.unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1.type::STRING as event_type,
    e.derived_tstamp as start_tstamp,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0].current_time::float as player_current_time,
    coalesce(contexts_com_snowplowanalytics_snowplow_media_player_1[0].playback_rate::STRING, 1) as playback_rate,
    case when e.unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1.type::STRING = 'ended' then 100 else contexts_com_snowplowanalytics_snowplow_media_player_1[0].percent_progress::int end percent_progress,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0].muted::STRING as is_muted,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0].is_live::STRING as is_live,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0].loop::STRING as loop,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0].volume::STRING as volume,
    {% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
      {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both need to be enabled for modelling html5 video tracking data.") }}
    {% elif var("snowplow__enable_youtube") %}
      {% if var("snowplow__enable_whatwg_media") %}
        coalesce(e.contexts_com_youtube_youtube_1[0].player_id::STRING, e.contexts_org_whatwg_media_element_1[0].html_id::STRING) as media_id,
        case when e.contexts_com_youtube_youtube_1[0].player_id is not null then 'com.youtube-youtube'
        when e.contexts_org_whatwg_media_element_1[0].html_id::STRING is not null then 'org.whatwg-media_element' else 'unknown' end as media_player_type,
        coalesce(e.contexts_com_youtube_youtube_1[0].url::STRING, e.contexts_org_whatwg_media_element_1[0].current_src::STRING) as source_url,
        case when e.contexts_org_whatwg_media_element_1[0].media_type::STRING = 'audio' then 'audio' else 'video' end as media_type,
        {% if var("snowplow__enable_whatwg_video") %}
          coalesce(e.contexts_com_youtube_youtube_1[0].playback_quality::STRING, e.contexts_org_whatwg_video_element_1[0].video_width::STRING||'x'||e.contexts_org_whatwg_video_element_1[0].video_height::STRING) as playback_quality
        {% else %}
          e.contexts_com_youtube_youtube_1[0].playback_quality::STRING
        {% endif %}
      {% else %}
        e.contexts_com_youtube_youtube_1[0].player_id::STRING as media_id,
        'com.youtube-youtube' as media_player_type,
        e.contexts_com_youtube_youtube_1[0].url::STRING as source_url,
        'video' as media_type,
        e.contexts_com_youtube_youtube_1[0].playback_quality::STRING
      {% endif %}
    {% elif var("snowplow__enable_whatwg_media") %}
      e.contexts_org_whatwg_media_element_1[0].html_id::STRING as media_id,
      'org.whatwg-media_element' as media_player_type,
      e.contexts_org_whatwg_media_element_1[0].current_src::STRING as source_url,
      case when e.contexts_org_whatwg_media_element_1[0].media_type::STRING = 'audio' then 'audio' else 'video' end as media_type,
      {% if var("snowplow__enable_whatwg_video") %}
      e.contexts_org_whatwg_video_element_1[0].video_width::STRING||'x'||e.contexts_org_whatwg_video_element_1[0].video_height::STRING as playback_quality
      {% else %}
        'N/A' as playback_quality
      {% endif %}
    {% else %}
      {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
    {% endif %}

    from {{ ref("snowplow_web_base_events_this_run") }} as e

    where event_name = 'media_player_event'
)

 select
  {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }} play_id,
  p.*,
  coalesce(cast(round(piv.weight_rate * p.duration / 100) as {{ type_int() }}), 0) as play_time_sec,
  coalesce(cast(case when p.is_muted = true then round(piv.weight_rate * p.duration / 100) else 0 end as {{ type_int() }}), 0) as play_time_sec_muted

  from prep p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/scratch/interactions_this_run/redshift_postgres/snowplow_media_player_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='table',
    tags=["this_run"],
    sort = 'start_tstamp',
    dist = 'event_id'
  )
}}

with prep as (

  select
    e.event_id,
    e.page_view_id,
    e.domain_sessionid,
    e.domain_userid,
    e.page_referrer,
    e.page_url,
    mpe.label as media_label,
    round(mp.duration) as duration,
    e.geo_region_name,
    e.br_name,
    e.dvce_type,
    e.os_name,
    e.os_timezone,
    mpe.type as event_type,
    e.derived_tstamp as start_tstamp,
    mp.current_time as player_current_time,
    coalesce(mp.playback_rate, 1) as playback_rate,
    case when mpe.type = 'ended' then 100 else mp.percent_progress end percent_progress,
    mp.muted as is_muted,
    mp.is_live,
    mp.loop,
    mp.volume,
    {% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
       {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both needs to be enabled for modelling html5 video tracking data.") }}
    {% elif var("snowplow__enable_youtube") %}
      {% if var("snowplow__enable_whatwg_media") %}
        coalesce(y.player_id, me.html_id) as media_id,
        case when y.player_id is not null then 'com.youtube-youtube' when me.html_id is not null then 'org.whatwg-media_element' else 'unknown' end as media_player_type,
        coalesce(y.url, me.current_src) as source_url,
        case when me.media_type = 'audio' then 'audio' else 'video' end as media_type,
        {% if var("snowplow__enable_whatwg_video") %}
          coalesce(y.playback_quality, ve.video_width||'x'||ve.video_height) as playback_quality
        {% else %}
          y.playback_quality
        {% endif %}
      {% else %}
        y.player_id as media_id,
        'com.youtube-youtube' as media_player_type,
        y.url as source_url,
        'video' as media_type,
        y.playback_quality
      {% endif %}
    {% elif var("snowplow__enable_whatwg_media") %}
      me.html_id as media_id,
     'org.whatwg-media_element' as media_player_type,
      me.current_src as source_url,
      case when me.media_type = 'audio' then 'audio' else 'video' end as media_type,
      {% if var("snowplow__enable_whatwg_video") %}
        ve.video_width||'x'||ve.video_height as playback_quality
      {% else %}
        'N/A' as playback_quality
      {% endif %}
    {% else %}
      {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
    {% endif %}

    from {{ ref("snowplow_web_base_events_this_run") }} as e

    inner join {{ var('snowplow__media_player_event_context') }} as mpe
    on mpe.root_id = e.event_id and mpe.root_tstamp = e.collector_tstamp

    inner join {{ var('snowplow__media_player_context') }} as mp
    on mp.root_id = e.event_id and mp.root_tstamp = e.collector_tstamp

  {% if var("snowplow__enable_youtube") %}
    left join {{ var('snowplow__youtube_context') }} as y
    on y.root_id = e.event_id and y.root_tstamp = e.collector_tstamp
  {% endif %}

  {% if var("snowplow__enable_whatwg_media") %}
    left join {{ var('snowplow__html5_media_element_context') }} as me
    on me.root_id = e.event_id and me.root_tstamp = e.collector_tstamp
  {% endif %}

  {% if var("snowplow__enable_whatwg_video") %}
    left join {{ var('snowplow__html5_video_element_context') }} as ve
    on ve.root_id = e.event_id and ve.root_tstamp = e.collector_tstamp
  {% endif %}

)

 select
 {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }} play_id,
  p.*,
  coalesce(cast(round(piv.weight_rate * p.duration / 100) as {{ type_int() }}), 0) as play_time_sec,
  coalesce(cast(case when p.is_muted then round(piv.weight_rate * p.duration / 100) end as {{ type_int() }}), 0) as play_time_sec_muted

  from prep p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```
</TabItem>
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/scratch/interactions_this_run/snowflake/snowplow_media_player_interactions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='table',
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

 select
    e.event_id,
    e.page_view_id,
    e.domain_sessionid,
    e.domain_userid,
    e.page_referrer,
    e.page_url,
    e.unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1:label::varchar as media_label,
    round(contexts_com_snowplowanalytics_snowplow_media_player_1[0]:duration::int) as duration,
    e.geo_region_name,
    e.br_name,
    e.dvce_type,
    e.os_name,
    e.os_timezone,
    e.unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1:type::varchar as event_type,
    e.derived_tstamp as start_tstamp,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:currentTime::float as player_current_time,
    coalesce(contexts_com_snowplowanalytics_snowplow_media_player_1[0]:playbackRate::varchar, 1) as playback_rate,
    cast(case when e.unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1:type::varchar = 'ended' then '100'
        when contexts_com_snowplowanalytics_snowplow_media_player_1[0]:percentProgress::varchar = '' THEN NULL
        else contexts_com_snowplowanalytics_snowplow_media_player_1[0]:percentProgress::varchar END AS int) percent_progress,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:muted::boolean as is_muted,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:isLive::varchar as is_live,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:loop::varchar as loop,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:volume::varchar as volume,
    {% if var("snowplow__enable_whatwg_media") is false and var("snowplow__enable_whatwg_video") %}
      {{ exceptions.raise_compiler_error("variable: snowplow__enable_whatwg_video is enabled but variable: snowplow__enable_whatwg_media is not, both need to be enabled for modelling html5 video tracking data.") }}
    {% elif var("snowplow__enable_youtube") %}
      {% if var("snowplow__enable_whatwg_media") %}
        coalesce(e.contexts_com_youtube_youtube_1[0]:playerId::varchar, e.contexts_org_whatwg_media_element_1[0]:htmlId::varchar) as media_id,
        case when e.contexts_com_youtube_youtube_1[0]:playerId is not null then 'com.youtube-youtube'
        when e.contexts_org_whatwg_media_element_1[0]:htmlId::varchar is not null then 'org.whatwg-media_element' else 'unknown' end as media_player_type,
        coalesce(e.contexts_com_youtube_youtube_1[0]:url::varchar, e.contexts_org_whatwg_media_element_1[0]:currentSrc::varchar) as source_url,
        case when e.contexts_org_whatwg_media_element_1[0]:mediaType::varchar = 'audio' then 'audio' else 'video' end as media_type,
        {% if var("snowplow__enable_whatwg_video") %}
          coalesce(e.contexts_com_youtube_youtube_1[0]:playbackQuality::varchar, e.contexts_org_whatwg_video_element_1[0]:videoWidth::varchar||'x'||e.contexts_org_whatwg_video_element_1[0]:videoHeight::varchar) as playback_quality
        {% else %}
          e.contexts_com_youtube_youtube_1[0]:playbackQuality::varchar
        {% endif %}
      {% else %}
        e.contexts_com_youtube_youtube_1[0]:playerId::varchar as media_id,
        'com.youtube-youtube' as media_player_type,
        e.contexts_com_youtube_youtube_1[0]:url::varchar as source_url,
        'video' as media_type,
        e.contexts_com_youtube_youtube_1[0]:playbackQuality::varchar
      {% endif %}
    {% elif var("snowplow__enable_whatwg_media") %}
      e.contexts_org_whatwg_media_element_1[0]:htmlId::varchar as media_id,
      'org.whatwg-media_element' as media_player_type,
      e.contexts_org_whatwg_media_element_1[0]:currentSrc::varchar as source_url,
      case when e.contexts_org_whatwg_media_element_1[0]:mediaType::varchar = 'audio' then 'audio' else 'video' end as media_type,
      {% if var("snowplow__enable_whatwg_video") %}
        e.contexts_org_whatwg_video_element_1[0]:videoWidth::varchar||'x'||e.contexts_org_whatwg_video_element_1[0]:videoHeight::varchar as playback_quality
      {% else %}
        'N/A' as playback_quality
      {% endif %}
    {% else %}
      {{ exceptions.raise_compiler_error("No media context enabled. Please enable as many of the following variables as required: snowplow__enable_youtube, snowplow__enable_whatwg_media, snowplow__enable_whatwg_video") }}
    {% endif %}

    from {{ ref("snowplow_web_base_events_this_run") }} as e

    where event_name = 'media_player_event'
)

 select
  {{ dbt_utils.generate_surrogate_key(['p.page_view_id', 'p.media_id' ]) }} play_id,
  p.*,
  coalesce(cast(piv.weight_rate * p.duration / 100 as {{ type_int() }}), 0) as play_time_sec,
  coalesce(cast(case when p.is_muted = true then piv.weight_rate * p.duration / 100 else 0 end as {{ type_int() }}), 0) as play_time_sec_muted

  from prep p

  left join {{ ref("snowplow_media_player_pivot_base") }} piv
  on p.percent_progress = piv.percent_progress
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_pivot_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_pivot_base)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.type_int
- macro.dbt_utils.generate_surrogate_key
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Media Stats {#model.snowplow_media_player.snowplow_media_player_media_stats}

<DbtDetails><summary>
<code>models/web/snowplow_media_player_media_stats.sql</code>
</summary>

#### Description
This derived table aggregates the pageview level interactions to show overall media stats.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| media_id | The primary key of this table |
| media_label | The optional, human readable name given to tracked media content. |
| duration | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. |
| media_type | The type of media content: video or audio. |
| media_player_type | The combination of schema_name and schema_vendor coming from the specific media player context e.g. com.youtube-youtube, org.whatwg-media_element. |
| play_time_min | Calculated duration of play in minutes. |
| avg_play_time_min | Estimated average duration of plays in minutes. |
| first_play | The `derived_tstamp` of the beginning of the first play of a media element. |
| last_play | The `derived_tstamp` of the beginning of the last play of a media element. |
| plays | The number of pageviews with plays of any duration. |
| valid_plays | The sum of all media plays that exceeds the minimum media length set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 (seconds). |
| complete_plays | The number of plays where the total percentage played is bigger than or equal to the `snowplow__complete_play_rate`. Default is 0.99, meaning that 99% of the video being watched constitutes a complete play. |
| impressions | The number of pageviews where a media content was rendered regardless of whether the media was actually played or not. |
| avg_playback_rate | Average playback rate (1 is normal speed). |
| play_rate | Total plays divided by impressions. Please note that as the base for media plays is pageview / media_id, in case the same video is played multiple times within the same pageview, it will still count as one play. |
| completion_rate_by_plays | The number of complete plays divided by the number of pageviews with plays of any duration. |
| avg_percent_played | Average of total play_time divided by the media duration. |
| avg_retention_rate | The maximum percent progress reached before any seek event. |
| last_base_tstamp | The start_tstamp of the last processed page_view across all media_ids to be used as a lower limit for subsequent incremental runs. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/snowplow_media_player_media_stats.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized= 'incremental',
    unique_key = 'media_id',
    sort = 'last_play',
    dist = 'media_id',
    tags=["derived"],
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "first_play",
      "data_type": "timestamp"
    }, databricks_partition_by='first_play_date'),
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["media_id"]),
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
    max(p.duration) as duration,
    p.media_type,
    p.media_player_type,
    min(case when is_played then p.start_tstamp end) as first_play,
    max(case when is_played then p.start_tstamp end) as last_play,
    sum(p.play_time_sec) as play_time_sec,
    sum(case when is_played then 1 else 0 end) as plays,
    sum(case when is_valid_play then 1 else 0 end) as valid_plays,
    sum(case when p.is_complete_play then 1 else 0 end) as complete_plays,
    count(distinct p.page_view_id) as impressions,
    avg(case when is_played then coalesce(p.play_time_sec, 0) / nullif(p.duration, 0) end) as avg_percent_played,
    avg(case when is_played then p.retention_rate end) as avg_retention_rate,
    avg(case when is_played then p.avg_playback_rate end) as avg_playback_rate,
    max(start_tstamp) as last_base_tstamp

from {{ ref("snowplow_media_player_base") }} p

where -- enough time has passed since the page_view's start_tstamp to be able to process it as a whole (please bear in mind the late arriving data)
cast({{ dateadd('hour', var("snowplow__max_media_pv_window", 10), 'p.end_tstamp ') }} as {{ type_timestamp() }}) < {{ snowplow_utils.current_timestamp_in_utc() }}
-- and it has not been processed yet
and p.start_tstamp > ( select max(last_base_tstamp) from {{ this }} )

group by 1,2,4,5

)

, prep as (

  select
    n.media_id,
    n.media_label,
    greatest(n.duration, coalesce(t.duration, 0)) as duration,
    n.media_type,
    n.media_player_type,
    n.last_base_tstamp,
    least(n.first_play, coalesce(t.first_play, cast('2999-01-01 00:00:00' as {{ type_timestamp() }}))) as first_play,
    greatest(n.last_play, coalesce(t.last_play, cast('2000-01-01 00:00:00' as {{ type_timestamp() }}))) as last_play,
    n.play_time_sec / cast(60 as {{ type_float() }}) + coalesce(t.play_time_min, 0) as play_time_min,
    (n.play_time_sec / cast(60 as {{ type_float() }}) + coalesce(t.play_time_min, 0))  / nullif((n.plays + coalesce(t.plays, 0)), 0) as avg_play_time_min,
    n.plays + coalesce(t.plays, 0) as plays,
    n.valid_plays + coalesce(t.valid_plays, 0) as valid_plays,
    n.complete_plays + coalesce(t.complete_plays, 0) as complete_plays,
    n.impressions + coalesce(t.impressions, 0)  as impressions,
    -- weighted average calculations
    (n.avg_percent_played * n.plays / nullif((n.plays + coalesce(t.plays, 0)),0)) + (coalesce(t.avg_percent_played, 0) * coalesce(t.plays, 0) / nullif((n.plays + coalesce(t.plays, 0)), 0)) as avg_percent_played,
    (n.avg_retention_rate * n.plays / nullif((n.plays + coalesce(t.plays, 0)), 0)) + (coalesce(t.avg_retention_rate, 0) * coalesce(t.plays, 0) / nullif((n.plays + coalesce(t.plays, 0)), 0)) as avg_retention_rate,
    (n.avg_playback_rate * n.plays / nullif((n.plays + coalesce(t.plays, 0)), 0)) + (coalesce(t.avg_playback_rate, 0) * coalesce(t.plays, 0) / nullif((n.plays + coalesce(t.plays, 0)), 0)) as avg_playback_rate

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
    prefix='_',
    suffix='_percent_reached',
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

    {% set alias  = '_' + element_string + '_percent_reached' %}

    coalesce(p._{{ element_string }}_percent_reached, 0)
  + coalesce(t._{{ element_string }}_percent_reached, 0)
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
    max(p.duration) as duration,
    p.media_type,
    p.media_player_type,
    max(start_tstamp) as last_base_tstamp,
    min(case when is_played then p.start_tstamp end) as first_play,
    max(case when is_played then p.start_tstamp end) as last_play,
    sum(p.play_time_sec) / cast(60 as {{ type_float() }}) as play_time_min,
    avg(case when is_played then p.play_time_sec / cast(60 as {{ type_float() }}) end) as avg_play_time_min,
    sum(case when is_played then 1 else 0 end) as plays,
    sum(case when is_valid_play then 1 else 0 end) as valid_plays,
    sum(case when p.is_complete_play then 1 else 0 end) as complete_plays,
    count(distinct p.page_view_id) as impressions,
    avg(case when is_played then coalesce(p.play_time_sec / nullif(p.duration, 0), 0) end) as avg_percent_played,
    avg(case when is_played then p.retention_rate end) as avg_retention_rate,
    avg(case when is_played then p.avg_playback_rate end) as avg_playback_rate


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
  p.duration,
  p.media_type,
  p.media_player_type,
  p.play_time_min,
  p.avg_play_time_min,
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
  date(first_play) as first_play_date,
{%- endif %}

{% if is_incremental() %}

  {% for element in get_percentage_boundaries(var("snowplow__percent_progress_boundaries")) %}
     coalesce(cast(a._{{ element }}_percent_reached as {{ type_int() }}), 0) as _{{ element }}_percent_reached
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
  prefix='_',
  suffix='_percent_reached',
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

group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19

{% endif %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_pivot_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_pivot_base)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.dateadd
- macro.dbt.is_incremental
- macro.dbt.type_float
- macro.dbt.type_int
- macro.dbt.type_timestamp
- macro.dbt_utils.get_column_values
- macro.dbt_utils.pivot
- [macro.snowplow_media_player.get_percentage_boundaries](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.get_percentage_boundaries)
- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.get_split_to_array](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_split_to_array)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.unnest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.unnest)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Pivot Base {#model.snowplow_media_player.snowplow_media_player_pivot_base}

<DbtDetails><summary>
<code>models/web/scratch/snowplow_media_player_pivot_base.sql</code>
</summary>

#### Description
This helper table serves as a base to calculate percent_progress based fields as well as the play_time metrics (by calculating the weight attributed to a percent progress being reached).

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| percent_progress | The percent of the way through the media. It is based on either the percentprogress event that is fired at specific intervalls as defined during the tracker setup or the 'ended' event, which is equivalent to reaching 100% of the media's total duration (length). e.g. 25, meaning the user passed the 25% mark during play. It does not mean the user watched all the content in between two percentprogress marks, unless there is no seek events happening within the same page_view (`snowplow_media_player_base`). |
| weight_rate | The weight given for each percent progress reached used for the calculation of the play_time_sec_estimated field. It is based on the difference of the current and preciding percent_progress rate. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/scratch/snowplow_media_player_pivot_base.sql">Source</a></i></b></center>

```jinja2
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
    percent_progress - lag(percent_progress, 1) over(order by percent_progress) as weight_rate,
    first_value(percent_progress) over(order by percent_progress rows between unbounded preceding and unbounded following) as first_item

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


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_media_player.get_percentage_boundaries](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.get_percentage_boundaries)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_interactions_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Plays By Pageview {#model.snowplow_media_player.snowplow_media_player_plays_by_pageview}

<DbtDetails><summary>
<code>models/web/snowplow_media_player_plays_by_pageview.sql</code>
</summary>

#### Description
This view removes impressions from the derived snowplow_media_base table for showing pageview level media play events.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| play_id | The surrogate key generated from `page_view_id` and `media_id `to create a unique play event identifier. |
| page_view_id | A UUID for each page view e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| media_id | The unique identifier of a specific media element. It is the `player_id` in case of YouTube and `html_id` in case of HTML5. |
| media_label | The optional, human readable name given to tracked media content. |
| domain_sessionid | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| duration | Total length of media in seconds e.g. it's a 5:32 youtube video so the duration is 332 seconds. |
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
| start_tstamp | The `derived_tstamp` denoting the time when the event started. |
| end_tstamp | The `derived_tstamp` denoting the time when the last media player event belonging to the specific level of aggregation (e.g.: page_view by media) started. |
| play_time_sec | Estimated duration of play in seconds. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. |
| play_time_sec_muted | Calculated duration of muted play in seconds. It is based on the percent_progress event and whether the user played it on mute during this event or not. |
| is_played | Pageviews with at least one play event. |
| is_valid_play | A boolean value to show whether the duration of the play (`play_time_sec`) is bigger than or equal to the variable given in `snowplow__valid_play_sec` (defaulted to 30). |
| is_complete_play | A boolean value to show whether the total percentage played is bigger than or equal to the `snowplow__complete_play_rate` (defaulted to 0.99). |
| avg_playback_rate | Average playback rate (1 is normal speed). |
| retention_rate | The maximum percent progress reached before any seek event. |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. |
| percent_progress_reached | An array of percent progresses reached by the user while playing the media. In case the same percentprogress event was fired during the same page_view (e.g. due to seeks to rewatch part of the video) the % is added to the array again. e.g. in case of percent_progress_reached = [10, 25, 25, 50, 75] the user replayed part of the media so that the percentprogress event fired twice at the 25% mark. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/web/snowplow_media_player_plays_by_pageview.sql">Source</a></i></b></center>

```jinja2
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


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Session Stats {#model.snowplow_media_player.snowplow_media_player_session_stats}

<DbtDetails><summary>
<code>models/custom/snowplow_media_player_session_stats.sql</code>
</summary>

#### Description
This table aggregates the pageview level interactions to show session level media stats.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| domain_sessionid | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
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
| play_time_sec | Estimated duration of play in seconds. It is calculated using the percent_progress events that are fired during play. In case such an event is fired, it is assumed that the total section of the media in between the previous and current percent_progress is played through, even if the user seeks to another point in time within the audio / video. The more often these events are tracked (e.g. every 5% of the media's length) the more accurate the calculation becomes. |
| play_time_sec_muted | Calculated duration of muted play in seconds. It is based on the percent_progress event and whether the user played it on mute during this event or not. |
| avg_play_time_sec | Estimated average duration of plays in seconds. |
| avg_percent_played | Average of total play_time divided by the media duration. |
| complete_plays | The number of plays where the total percentage played is bigger than or equal to the `snowplow__complete_play_rate`. Default is 0.99, meaning that 99% of the video being watched constitutes a complete play. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/custom/snowplow_media_player_session_stats.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized = 'table',
    sort = 'start_tstamp',
    dist = 'domain_sessionid',
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='start_tstamp_date'),
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["domain_userid"]),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

  select
    domain_sessionid,
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
    sum(play_time_sec / cast(60 as {{ type_float() }})) as play_time_min,
    sum(play_time_sec_muted / cast(60 as {{ type_float() }})) as play_time_min_muted,
    coalesce(avg(case when is_played then play_time_sec / cast(60 as {{ type_float() }}) end), 0) as avg_play_time_min,
    coalesce(avg(case when is_played then coalesce(play_time_sec / nullif(duration, 0), 0) end),0) as avg_percent_played,
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


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- macro.dbt.type_float
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player User Stats {#model.snowplow_media_player.snowplow_media_player_user_stats}

<DbtDetails><summary>
<code>models/custom/snowplow_media_player_user_stats.sql</code>
</summary>

#### Description
This table aggregates the pageview level interactions to show user level media stats.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| domain_userid | User ID set by Snowplow using 1st party cookie e.g. `bc2e92ec6c204a14`. |
| first_play | The `derived_tstamp` of the beginning of the first play of a media element. |
| last_play | The `derived_tstamp` of the beginning of the last play of a media element. |
| video_plays | The number of pageviews with video plays of any duration. |
| audio_plays | The number of pageviews with audio plays of any duration. |
| valid_video_plays | The sum of all video plays that exceed the limit set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 seconds. |
| valid_audio_plays | The sum of all audio plays that exceeded the limit set within the variable `snowplow__valid_play_sec`, it is defaulted to 30 seconds. |
| complete_plays | The number of plays where the total percentage played is bigger than or equal to the `snowplow__complete_play_rate`. Default is 0.99, meaning that 99% of the video being watched constitutes a complete play. |
| seeks | The count of seek events within a certain aggregation level. The seek event occurs when a user moves/skips to a new position in the media content. |
| play_time_min | Calculated duration of play in minutes. |
| avg_session_play_time_min | Estimated average duration of plays in seconds within a session. |
| avg_percent_played | Average of total play_time divided by the media duration. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/models/custom/snowplow_media_player_user_stats.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized = 'table',
    sort = 'first_play',
    dist = 'domain_userid',
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "first_play",
      "data_type": "timestamp"
    }, databricks_partition_by='first_play_date'),
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["domain_userid"]),
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
    cast(sum(play_time_min) as {{ type_int() }}) as play_time_min,
    -- using session and not page_view as the base for average to save cost by not joining on snowplow_media_player_base for calculating on individual page_view level average
    coalesce(cast(avg(case when (video_plays + audio_plays) > 0 then avg_play_time_min end) as {{ type_int() }}), 0) as avg_session_play_time_min,
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


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- macro.dbt.type_int
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

