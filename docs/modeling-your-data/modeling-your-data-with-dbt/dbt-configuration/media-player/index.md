---
title: "Media Player"
sidebar_position: 400
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file. We have provided a [tool](#config-generator) below to help you with that.

:::caution

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::

### Warehouse and tracker

| Variable Name | Description | Default |
| --- | --- | --- |
| `percent_progress_boundaries` | The list of percent progress values. It needs to be aligned with the values being tracked by the tracker. It is worth noting that the more these percent progress boundaries are being tracked the more accurate the play time calculations become. Please note that tracking 100% is unnecessary as there is a separate `ended` event which the model equates to achieving 100% and it also gets included automatically to this list, in case it is not added (you can refer to the helper macro `get_percentage_boundaries` ([source](https://snowplow.github.io/dbt-snowplow-media-player/#!/macro/macro.snowplow_media_player.get_percentage_boundaries)) for details). | `[10, 25, 50, 75]` |

### Operation and logic

| Variable Name | Description | Default |
| --- | --- | --- |
| `complete_play_rate` | The rate to set what percentage of a media needs to be played in order to consider that complete. 0.99 (=99%) is set as a default value here but it may be increased to 1 (or decreased) depending on the use case. | 0.99 |
| `max_media_pv_window` | The number of hours that needs to pass before new page_view level media player metrics from the `snowplow_media_player_base` table are safe to be processed by the model downstream in the `snowplow_media_player_media_stats` table. Please note that even if new events are added later on ( e.g. new `percentprogress` events are fired indicating potential replay) and the `snowplow_media_player_base` table is changed, the model will not update them in the media_stats table, therefore it is safer to set as big of a number as still convenient for analysis and reporting. | 10 |
| `valid_play_sec` | The minimum number of seconds that a media play needs to last to consider that interaction a valid play. The default is 30 seconds (based on the YouTube standard) but it can be modified here, if needed. | 30 |
| `surrogate_key_treat_nulls_as_empty_strings` | Passed through to `dbt_utils` to match legacy surrogate key behavior. | `true` |

### Contexts, filters, and logs

| Variable Name | Description | Default |
| --- | --- | --- |
| `enable_whatwg_media` | Set to `true` if the [HTML5 media element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0) is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not. | `false` |
| `enable_whatwg_video` | Set to `true` if the [HTML5 video element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0) is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not. | `false` |
| `enable_youtube` | Set to `true` if the [YouTube context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.youtube/youtube/jsonschema/1-0-0) is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not. | `false` |
| `enable_media_player_v1` | Set to `true` if the [version 1 of the media player context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0) is enabled. This schema was used in our older media plugins on the JavaScript tracker. It is not tracked in the latest versions. | `false` |
| `enable_media_player_v2` | Set to `true` if the [version 2 of the media player context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/2-0-0) is enabled. This is tracked by our latest JavaScript and mobile trackers. | `true` |
| `enable_media_session` | Set to `true` if the [media session context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/session/jsonschema/1-0-0) is enabled. This is tracked by our latest JavaScript and mobile trackers (optional but enabled by default). | `true` |
| `enable_media_ad` | Set to `true` if the [media ad context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad/jsonschema/1-0-0) is enabled. This is tracked by our latest JavaScript and mobile trackers along with ad events. | `false` |
| `enable_media_ad_break` | Set to `true` if the [media ad-break context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad_break/jsonschema/1-0-0) is enabled. This is tracked by our latest JavaScript and mobile trackers when ad breaks are tracked along with ad events. | `false` |
| `enable_web_events` | Whether to use the web contexts for web media events in the processing (based on the web page context). | `true` |
| `enable_mobile_events` | Whether to use the mobile contexts for mobile media events in the processing (based on the client session and screen view context). | `false` |
| `enable_ad_quartile_event` | Set to `true` if [ad quartile events](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad_quartile_event/jsonschema/1-0-0) are tracked during media ad playback. | `false` |
| `app_id` | A list of app_ids to filter the events table on for processing within the package. | `[]` (no filter applied) |

### Warehouse Specific

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

Redshift and Postgres use a [shredded](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#shredded-data) approach for the context tables, so these variables are used to identify where they are, if different from the expected schema and table name. These should be the table name in your `atomic_schema`, as the defaults below show.

| Variable Name | Default |
| --- | --- |
| `media_player_event_context` | `'com_snowplowanalytics_snowplow_media_player_event_1'` |
| `media_player_context` | `'com_snowplowanalytics_snowplow_media_player_1'` |
| `media_player_v2_context` | `'com_snowplowanalytics_snowplow_media_player_2'` |
| `media_session_context` | `'com_snowplowanalytics_snowplow_media_session_1'` |
| `media_ad_context` | `'com_snowplowanalytics_snowplow_media_ad_1'` |
| `media_ad_break_context` | `'com_snowplowanalytics_snowplow_media_ad_break_1'` |
| `media_ad_quartile_event` | `'com_snowplowanalytics_snowplow_media_ad_quartile_event_1'` |
| `youtube_context` | `'com_youtube_youtube_1'` |
| `html5_media_element_context` | `'org_whatwg_media_element_1'` |
| `html5_video_element_context` | `'org_whatwg_video_element_1'` |
| `context_web_page` | `'com_snowplowanalytics_snowplow_web_page_1'` |
| `context_screen` | `'com_snowplowanalytics_mobile_screen_1'` |
| `context_mobile_session` | `'com_snowplowanalytics_snowplow_client_session_1'` |

</TabItem>
</Tabs>

## Output Schemas

```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"
import { SchemaSetter } from '@site/src/components/DbtSchemaSelector';
import CodeBlock from '@theme/CodeBlock';

<DbtSchemas/>

export const printSchemaVariables = (manifestSchema, scratchSchema, derivedSchema) => {
  return(
    <>
    <CodeBlock language="yaml">
    {`models:
  snowplow_media_player:
    base:
      manifest:
        +schema: ${manifestSchema}
      scratch:
        +schema: ${scratchSchema}
    media_base:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    media_plays:
      +schema: ${derivedSchema}
    media_stats:
      +schema: ${derivedSchema}
    custom:
      +schema: ${scratchSchema}
      +enabled: false
    media_ad_views:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    media_ads:
      +schema: ${derivedSchema}`}
        </CodeBlock>
    </>
  )
}
```
<SchemaSetter output={printSchemaVariables}/>

```mdx-code-block
import { dump } from 'js-yaml';
import { dbtSnowplowMediaPlayerConfigSchema } from '@site/src/components/JsonSchemaValidator/dbtMediaPlayer.js';
import { ObjectFieldTemplateGroupsGenerator, JsonApp } from '@site/src/components/JsonSchemaValidator';

export const GROUPS = [
  { title: "Warehouse and tracker", fields: ["snowplow__percent_progress_boundaries"] },
  { title: "Operation and Logic", fields: ["snowplow__complete_play_rate",
                                          "snowplow__max_media_pv_window",
                                          "snowplow__valid_play_sec",
                                          "snowplow__surrogate_key_treat_nulls_as_empty_strings"] },
  { title: "Contexts, Filters, and Logs", fields: ["snowplow__enable_whatwg_media",
                                                  "snowplow__enable_whatwg_video",
                                                  "snowplow__enable_youtube",
                                                  "snowplow__enable_media_player_v1",
                                                  "snowplow__enable_media_player_v2",
                                                  "snowplow__enable_media_session",
                                                  "snowplow__enable_media_ad",
                                                  "snowplow__enable_media_ad_break",
                                                  "snowplow__enable_web_events",
                                                  "snowplow__enable_mobile_events",
                                                  "snowplow__enable_ad_quartile_event"] },
  { title: "Warehouse Specific", fields: ["snowplow__media_player_event_context",
                                          "snowplow__media_player_context",
                                          "snowplow__youtube_context",
                                          "snowplow__html5_media_element_context",
                                          "snowplow__html5_video_element_context",
                                          "snowplow__media_player_v2_context",
                                          "snowplow__media_session_context",
                                          "snowplow__media_ad_context",
                                          "snowplow__media_ad_break_context",
                                          "snowplow__media_ad_quartile_event",
                                          "snowplow__context_web_page",
                                          "snowplow__context_screen",
                                          "snowplow__context_mobile_session"] }
];

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variables:</h4>
    <CodeBlock language="yaml">{dump({vars: {"snowplow_media_player": data}}, { flowLevel: 3 })}</CodeBlock>
    </>
  )
}

export const Template = ObjectFieldTemplateGroupsGenerator(GROUPS);
```

## Config Generator
```mdx-code-block
import ConfigGenerator from "@site/docs/reusable/data-modeling/config-generator/_index.md"

<ConfigGenerator/>
```


<JsonApp schema={dbtSnowplowMediaPlayerConfigSchema} output={printYamlVariables} template={Template}/>
