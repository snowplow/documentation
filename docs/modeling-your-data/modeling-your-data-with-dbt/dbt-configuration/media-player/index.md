---
title: "Media Player"
sidebar_position: 103
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::


### Warehouse and tracker 
| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `percent_progress_boundaries` | The list of percent progress values. It needs to be aligned with the values being tracked by the tracker. It is worth noting that the more these percent progress boundaries are being tracked the more accurate the play time calculations become. Please note that tracking 100% is unnecessary as there is a separate `ended` event which the model equates to achieving 100% and it also gets included automatically to this list, in case it is not added (you can refer to the helper macro `get_percentage_boundaries` ([source](https://snowplow.github.io/dbt-snowplow-media-player/#!/macro/macro.snowplow_media_player.get_percentage_boundaries)) for details). | `[10, 25, 50, 75]` |

### Operation and logic
| Variable Name                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Default |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `complete_play_rate`                         | The rate to set what percentage of a media needs to be played in order to consider that complete. 0.99 (=99%) is set as a default value here but it may be increased to 1 (or decreased) depending on the use case.                                                                                                                                                                                                                                                                                                                                                                     | 0.99    |
| `max_media_pv_window`                        | The number of hours that needs to pass before new page_view level media player metrics from the `snowplow_media_player_base` table are safe to be processed by the model downstream in the `snowplow_media_player_media_stats` table. Please note that even if new events are added later on ( e.g. new `percentprogress` events are fired indicating potential replay) and the `snowplow_media_player_base` table is changed, the model will not update them in the media_stats table, therefore it is safer to set as big of a number as still convenient for analysis and reporting. | 10      |
| `valid_play_sec`                             | The minimum number of seconds that a media play needs to last to consider that interaction a valid play. The default is 30 seconds (based on the YouTube standard) but it can be modified here, if needed.                                                                                                                                                                                                                                                                                                                                                                              | 30      |
| `surrogate_key_treat_nulls_as_empty_strings` | Passed through to `dbt_utils` to match legacy surrogate key behavior.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `true`  |

### Contexts, filters, and logs
| Variable Name         | Description                                                                                                                                                                              | Default |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `enable_whatwg_media` | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not. | `false` |
| `enable_whatwg_video` | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not. | `false` |
| `enable_youtube`      | Set to `true` if the YouTube context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.             | `false` |

### Warehouse Specific 

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift+postgres" label="Redshift & Postgres">

Redshift and Postgres use a [shredded](/docs/destinations/warehouses-and-lakes/rdb/transforming-enriched-data/index.md#shredded-data) approach for the context tables, so these variables are used to identify where they are, if different from the expected schema and table name. They must be passed in a stringified `source` function as the defaults below show.

| Variable Name                           | Default                                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `snowplow__media_player_event_context`  | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_media_player_event_1') }}"` |
| `snowplow__media_player_context`        | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_media_player_1') }}"`       |
| `snowplow__youtube_context`             | `"{{ source('atomic', 'com_youtube_youtube_1') }}"`                               |
| `snowplow__html5_media_element_context` | `"{{ source('atomic', 'org_whatwg_media_element_1') }}"`                          |
| `snowplow__html5_video_element_context` | `"{{ source('atomic', 'org_whatwg_video_element_1') }}"`                          |

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
    web:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${manifestSchema}
    custom:
      +schema: ${manifestSchema}`}
        </CodeBlock>
    </>
  )
}

```
<SchemaSetter output={printSchemaVariables}/>
