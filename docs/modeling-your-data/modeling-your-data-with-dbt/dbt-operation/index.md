---
title: "Operation of the dbt packages"
date: "2022-10-05"
sidebar_position: 300
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info
Due to its unique relationship with the web package, the media player package operates in a different way. More information can be found on the [media player package section](#media-player-package).

:::

The Snowplow models are designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, run the model using:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt run --select snowplow_web tag:snowplow_web_incremental
```
The `snowplow_web` selection will execute all nodes within the relevant Snowplow package, while the `tag:snowplow_web_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the [YAML selectors](#yaml-selectors) we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_web
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt run --select snowplow_mobile tag:snowplow_mobile_incremental
```

The `snowplow_mobile` selection will execute all nodes within the Snowplow mobile package, while the `tag:snowplow_mobile_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the [YAML selectors](#yaml-selectors) we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_mobile
```

</TabItem>
</Tabs>

------

## YAML Selectors

Within the packages we have provided a suite of suggested selectors to run and test the models within the packages. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax).

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

- `snowplow_web`: Recommended way to run the package. This selection includes all models within the Snowplow Web as well as any custom models you have created.
- `snowplow_web_lean_tests`: Recommended way to test the models within the package. See the testing section for more details.

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

- `snowplow_mobile`: Recommended way to run the package. This selection includes all models within the Snowplow Mobile as well as any custom models you have created.
- `snowplow_mobile_lean_tests`: Recommended way to test the models within the package. See the testing section for more details.

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

- `snowplow_web`:  Recommended way to run the package. This selection includes all models within the Snowplow Web and Snowplow Media Player as well as any custom models you have created.
- `snowplow_web_lean_and_media_player_tests`: Recommended way to test the models within the package. See the testing section for more details.
- `snowplow_media_player_tests`: Runs all tests within the Snowplow Media Player Package and any custom models tagged with `snowplow_media_player`.
- `snowplow_web_and_media_player_tests`: Runs all tests within the Snowplow Web and Snowplow Media Player Package and any custom models tagged with `snowplow_media_player` or `snowplow_web_incremental`.

</TabItem>
</Tabs>

------

These are defined in each `selectors.yml` file within the packages, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

## Manifest Tables
<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

There are 3 manifest tables included in this package:

- `snowplow_web_incremental_manifest`: Records the current state of the package.
- `snowplow_web_base_sessions_lifecycle_manifest`: Records the start & end timestamp of all sessions.
- `snowplow_web_base_quarantined_sessions`: Records sessions that have exceeded the maximum allowed session length, defined by `snowplow__max_session_days` (default 3 days).


</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

There are 2 manifest tables included in this package:

- `snowplow_mobile_incremental_manifest`: Records the current state of the package.
- `snowplow_mobile_base_sessions_lifecycle_manifest`: Records the start & end timestamp of all sessions.

</TabItem>
</Tabs>

------

Please refer to the [Incremental Logic](#incremental-logic) section more details on the purpose of each of these tables.

These manifest models are critical to the package **and as such are protected from full refreshes, i.e. being dropped, by default when running in production, while in development refreshes are allowed.**

The `allow_refresh()` macro defines this behavior. As [dbt recommends](https://docs.getdbt.com/faqs/target-names), target names are used here to differentiate between your prod and dev environment. By default, this macro assumes your dev target is named `dev`. This can be changed by setting the `snowplow__dev_target_name` var in your `dbt_project.yml` file.

To full refresh any of the manifest models in production, set the `snowplow__allow_refresh` to `true` at run time (see below).

Alternatively, you can amend the behavior of this macro entirely by overwriting it. See the [Overwriting Macros](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/index.md#overriding-macros) section for more details.

## Complete refresh of Snowplow package

While you can drop and recompute the incremental tables within this package using the standard `--full-refresh` flag, as mentioned above all manifest tables are protected from being dropped in production. Without dropping the manifest during a full refresh, the selected derived incremental tables would be dropped but the processing of events would resume from where the package left off (as captured by the `snowplow_web_incremental_manifest` table) rather than your `snowplow__start_date`.

In order to drop all the manifest tables and start again set the `snowplow__allow_refresh` var to `true` at run time:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt run --select snowplow_web tag:snowplow_web_incremental --full-refresh --vars 'snowplow__allow_refresh: true'
# or using selector flag
dbt run --selector snowplow_web --full-refresh --vars 'snowplow__allow_refresh: true'
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt run --select snowplow_mobile tag:snowplow_mobile_incremental --full-refresh --vars 'snowplow__allow_refresh: true'
# or using selector flag
dbt run --selector snowplow_mobile --full-refresh --vars 'snowplow__allow_refresh: true'
```

</TabItem>
</Tabs>

------

## Media Player Package

Due to its unique relationship with the web package, in order to operate the media player package together with the web model there are several considerations to keep in mind. Depending on the use case one of the following scenarios may happen:

1. The web package is already being used and the media tracking package needs to be added at a later time.
2. The web package has not been used but it needs to be run together with the media player package.
3. Only the media player package needs to be run.
------
#### 1. Adding the media player data model to an existing dbt project with web model data already running

Supposing there are months of data being collected using the web package and media tracking is introduced at that later stage there is no need to fully reprocess the web data from the date media tracking was deployed.

As models from both packages need to be run in sync, first the backfilling of the models from the new package needs to happen. Please note that during backfill no new web data is allowed to be processed and depending on the `snowplow_backfill_limit_days` configured and the period that needs backfilling it can take a while for all models to sync up and new web events to be processed.

To begin the synching process please run the following script:

```bash
dbt run -m snowplow_web.base snowplow_media_player --vars 'snowplow__start_date: <date_when_media_player_tracking_starts>'
```
This way only the base module is reprocessed which is used as one of the main sources for the media player package. The web model's update logic should recognize the new media player models (as all are tagged with `snowplow_web_incremental`) and backfilling should start between the date you defined within `snowplow_start_date` and the upper limit defined by the variable `snowplow_backfill_limit_days` that is set for the web model.

```bash
Snowplow: New Snowplow incremental model. Backfilling
```

 You can overwrite this limit for this backfilling process temporarily while it lasts, if needed:

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__backfill_limit_days: 1
```

After this you should be able to see all media_player models added to the `derived.snowplow_web_incremental_manifest` table. Any subsequent run from this point onwards could be carried out using the recommended web model running method - using the snowplow_web selector - which automatically adds all media_models as they are within the project directory and are all tagged with `snowplow_web_incremental`.

```bash
dbt run --selector snowplow_web
```
As soon as backfilling finishes, running the model results in both the web and the media player models being updated during the same run for the same period, both using the same latest set of data from the `_base_events_this_run` table.

#### 2. Starting both the media and web model from scratch

The easiest implementation out of the three scenarios. As the `snowplow_web_incremental_manifest` table is new, all models from both packages (plus any custom modules tagged with `snowplow_web_incremental`) will be processed using the recommended web model running method - using the snowplow_web selector without any extra step.

```bash
dbt run --selector snowplow_web
```

#### 3. Only running the media player package from the same dbt project

Although the media player package is not designed for standalone usage, there can be scenarios where only the media player models are targeted for the update, not the web model. In such case the web model still has to be configured with the main difference that all modules that the media player model does not rely on need to be disabled. It is essentially only the base model that is needed, so please disable all the rest like so:

```yml
# dbt_project.yml
...
models:
  snowplow_web:
    page_views:
      enabled: false
    sessions:
      enabled: false
    user_mapping:
      enabled: false
    users:
      enabled: false
```
Running it, however can still be achieved by running the selector as defined in the web model. In order for it to work, you can copy the selectors.yml file ([source](https://github.com/snowplow/dbt-snowplow-media-player/blob/main/selectors.yml)) from the package to your dbt project's main directory.

```bash
dbt run --selector snowplow_web
```

After the run finishes, you should only see the media player related models to be present within the snowplow_web_incremental_manifest table.
