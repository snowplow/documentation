---
title: "Media Player"
sidebar_position: 103
---
## Model Configuration

This packages make use of a series of other variables, which are all set to the recommend values for the operation of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::


| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `complete_play_rate`          | The rate to set what percentage of a media needs to be played in order to consider that complete. 0.99 (=99%) is set as a default value here but it may be increased to 1 (or decreased) depending on the use case.                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 0.99             |
| `enable_whatwg_media`         | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`          |
| `enable_whatwg_video`         | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`          |
| `enable_youtube`              | Set to `true` if the HTML5 media element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`          |
| `max_media_pv_window`         | The number of hours that needs to pass before new page_view level media player metrics from the `snowplow_media_player_base` table are safe to be processed by the model downstream in the `snowplow_media_player_media_stats` table. Please note that even if new events are added later on ( e.g. new `percentprogress` events are fired indicating potential replay) and the `snowplow_media_player_base` table is changed, the model will not update them in the media_stats table, therefore it is safer to set as big of a number as still convenient for analysis and reporting.                                                                                     | 10               |
| `percent_progress_boundaries` | The list of percent progress values. It needs to be aligned with the values being tracked by the tracker. It is worth noting that the more these percent progress boundaries are being tracked the more accurate the play time calculations become. Please note that tracking 100% is unnecessary as there is a separate `ended` event which the model equates to achieving 100% and it also gets included automatically to this list, in case it is not added (you can refer to the helper macro `get_percentage_boundaries` ([source](https://snowplow.github.io/dbt-snowplow-media-player/#!/macro/macro.snowplow_media_player.get_percentage_boundaries)) for details). | [10, 25, 50, 75] |
| `valid_play_sec`              | The minimum number of seconds that a media play needs to last to consider that interaction a valid play. The default is 30 seconds (based on the YouTube standard) but it can be modified here, if needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 30               |

## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"

<DbtSchemas/>
```

```yml
# dbt_project.yml
...
models:
  snowplow_media_player:
    web:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    custom:
      +schema: my_scratch_schema
```
