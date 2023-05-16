---
sidebar_label: "Media Player"
sidebar_position: 104
title: "Media Player Quickstart"
---

## Requirements


In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

- A dataset of media-player web events from the [Snowplow JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/index.md) must be available in the database. In order for this to happen at least one of the JavaScript based media tracking plugins need to be enabled: [Media Tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/media-tracking/index.md) or [YouTube Tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/youtube-tracking/index.md)
- Have the [`webPage` context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/index.md#adding-predefined-contexts) enabled.
- Have the [media-player event schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0) enabled.
- Have the [media-player context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0) enabled.
- Depending on the plugin / intention have all the relevant contexts from below enabled:
  - in case of embedded YouTube tracking: Have the [YouTube specific context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.youtube/youtube/jsonschema/1-0-0) enabled.
  - in case of HTML5 audio or video tracking: Have the [HTML5 media element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0) enabled.
  - in case of HTML5 video tracking: Have the [HTML5 video element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0) enabled.

```mdx-code-block
import DbtPrivs from "@site/docs/reusable/dbt-privs/_index.md"

<DbtPrivs/>
```

```mdx-code-block
import DbtPackageInstallation from "@site/docs/reusable/dbt-package-installation/_index.md"

<DbtPackageInstallation/>
```

## Setup

:::caution

If you are not starting the media player package at the same time as the web package, see the [media player package details](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md#operating-with-the-web-package) for how to best sync them.

:::

### 1. Override the dispatch order in your project
To take advantage of the optimized upsert that the Snowplow packages offer you need to ensure that certain macros are called from `snowplow_utils` first before `dbt-core`. This can be achieved by adding the following to the top level of your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

If you do not do this the package will still work, but the incremental upserts will become more costly over time.

### 2. Adding the `selectors.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-media-player/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

### 3. Configuring the web model (in case it has not been run before)

Please refer to the `Quick Start` guide for the Snowplow Web package to make sure you configure the web model appropriately. (e.g. checking the source data or enabling desired contexts).

### 4. Enable desired contexts

If you have enabled a specific context you will need to enable it in your `dbt_project.yml` file:

```yaml
 dbt_project.yml
...
vars:
  snowplow_media_player:
    # set to true if the YouTube context schema is enabled
    snowplow__enable_youtube: true
    # set to true if the HTML5 media element context schema is enabled
    snowplow__enable_whatwg_media: true
    # set to true if the HTML5 video element context schema is enabled
    snowplow__enable_whatwg_video: true
```

For other variables you can configure please see the [model configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#model-configuration) section.

### 5. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_web
```
