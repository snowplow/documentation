---
title: "Modeling your data with dbt"
date: "2022-10-05"
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

[dbt](https://docs.getdbt.com/) enables analytics engineers to transform data in their warehouses by simply writing select statements. It is the preferred method for transforming Snowplow event and supersedes our use of [SQL Runner](/docs/modeling-your-data/modeling-your-data-with-sql-runner/index.md).

To setup dbt, Snowplow open source users can start with the [dbt User Guide](https://docs.getdbt.com/guides/getting-started) and then we have prepared some [introduction videos](https://www.youtube.com/watch?v=1kd6BJhC4BE) for working with the Snowplow dbt packages.

For Snowplow BDP customers, currently dbt is not supported in the console, but this is in development and we expect to be able to support dbt models in BDP soon. 

# Snowplow dbt Packages


|Package |Repo|Model Docs|
| --- | --- | --- |
|**Snowplow Web**|[Github](https://github.com/snowplow/dbt-snowplow-web)|[Docs](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web)|
|**Snowplow Mobile**|[Github](https://github.com/snowplow/dbt-snowplow-mobile)|[Docs](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile)|
|**Snowplow Media Player**|[Github](https://github.com/snowplow/dbt-snowplow-media-player)|[Docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/overview/snowplow_media_player)|
|_Snowplow Utils_| [Github](https://github.com/snowplow/dbt-snowplow-utils)| |


Currently there are 3 core snowplow dbt packages; [Snowplow Web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-web-data-model/index.md), [Snowplow Mobile](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-mobile-data-model/index.md), and [Snowplow Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-media-player-data-model/index.md). The Snowplow Media Player package is designed to be used with the Snowplow Web package and not as a standalone model so much of the information on this page applies primarily to the web and mobile packages. There is a fourth package, Snowplow Utils that is used to collect together utility macros for the three main packages, but you will not need to interact with this package.

The 'standard' modules in each package can be thought of as source code for the core logic of the model, which Snowplow maintains. These modules carry out the incremental logic in such a way that custom modules can be written to plug into the models' structure, without needing to write a parallel incremental logic. We recommend that all customizations are written in this way, which allows us to safely maintain and roll out updates to the model, without impact on dependent custom sql. See the page on [custom modules](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) for more information.

Each module produces a table which acts as the input to the subsequent module (the `_this_run` tables), and updates a derived table - with the exception of the Base module, which takes atomic data as its input, and does not update a derived table. The Snowplow Media Player package works slightly differently as it is used in addition to the Web package, not as a standalone set of models, see it's [documentation page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-media-player-data-model/index.md) for further information.

The latest versions of all packages support BigQuery, Databricks, Postgres, Redshift, and Snowflake warehouses.


<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

| snowplow-web version | dbt versions        | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| -------------------- | ------------------- | --------- | ----------- | --------- | ---------- | --------- |
| 0.9.2                | >=1.0.0 to <2.0.0   | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.5.1                | >=0.20.0 to <1.0.0  | ✅        | ❌          | ✅        | ✅         | ✅        |
| 0.4.1                | >=0.18.0 to <0.20.0 | ✅        | ❌          | ✅        | ✅         | ❌        |
| 0.4.1                | >=0.19.0 to <0.20.0 | ❌        | ❌          | ❌        | ❌         | ✅        |

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

| snowplow-mobile version | dbt versions       | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| ----------------------- | ------------------ | --------- | ----------- | --------- | ---------- | --------- |
| 0.5.4                   | >=1.0.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.2.0                   | >=0.20.0 to <1.0.0 | ✅        | ❌          | ✅        | ✅         | ✅        |

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

| snowplow-media-player version | snowplow-web version | dbt versions       | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| ----------------------------- | -------------------- | ------------------ | --------- | ----------- | --------- | ---------- | --------- |
| 0.3.1                         | >=0.9.0 to <0.10.0   | >=1.0.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.1.0                         | >=0.6.0 to <0.7.0    | >=0.20.0 to <1.1.0 | ❌        | ❌          | ✅        | ❌         | ✅        |

</TabItem>
</Tabs>

------

:::caution

When using multiple dbt packages you must be careful to specify which scope a variable or configuration is defined within. In general, always specify each value in your `dbt_project.yml` nested under the specific package e.g.

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__atomic_schema: schema_with_snowplow_web_events
  snowplow_mobile:
    snowplow__atomic_schema: schema_with_snowplow_mobile_events
```

You can read more about variable scoping in dbt's docs around [variable precedence](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-variables#variable-precedence).

:::

## Requirements

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

- [Snowplow Javascript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md) version 2 or later implemented.
- Web Page context [enabled](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracker-setup/initializing-a-tracker-2/index.md#webPage_context) (enabled by default in [v3+](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/index.md#webPage_context)).
- [Page view events](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#page-views) implemented.

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a mobile events dataset being available in your database:

- Snowplow [Android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/index.md) or [iOS](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/index.md) mobile tracker version 1.1.0 or later implemented.
- Mobile session context enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#session-context) or  [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#session-tracking)).
- Screen view events enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#tracking-features) or [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#tracking-features)). 


</TabItem>
<TabItem value="media" label="Snowplow Media Player">

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

- A dataset of media-player web events from the [Snowplow JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/index.md)] must be available in the database. In order for this to happen at least one of the JavaScript based media tracking plugins need to be enabled: [Media Tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/media-tracking/index.md) or [YouTube Tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/youtube-tracking/index.md)
- Have the [`webPage` context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/index.md#adding-predefined-contexts) enabled.
- Have the [media-player event schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0) enabled.
- Have the [media-player context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0) enabled.
- Depending on the plugin / intention have all the relevant contexts from below enabled:
  - in case of embedded YouTube tracking: Have the [YouTube specific context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.youtube/youtube/jsonschema/1-0-0) enabled.
  - in case of HTML5 audio or video tracking: Have the [HTML5 media element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0) enabled.
  - in case of HTML5 video tracking: Have the [HTML5 video element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0) enabled.

</TabItem>
</Tabs>

------

## Installation

Check [dbt Hub](https://hub.getdbt.com/snowplow/snowplow_web/latest/) for the latest installation instructions, or read the [dbt docs](https://docs.getdbt.com/docs/building-a-dbt-project/package-management) for more information on installing packages. If you are using multiple packages you may need to up/downgrade a specific package to ensure compatibility, especially when using the web and media player packages together.


