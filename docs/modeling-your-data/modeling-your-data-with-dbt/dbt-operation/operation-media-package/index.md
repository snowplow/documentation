---
title: "Media Player Operation"
sidebar_position: 1
description: "Operation of the Media Player Snowplow dbt package"
---

## Media Player Package

Due to its unique relationship with the web package, in order to operate the media player package together with the web model there are several considerations to keep in mind. Depending on the use case one of the following scenarios may happen:

1. The web package is already being used and the media tracking package needs to be added at a later time.
2. The web package has not been used but it needs to be run together with the media player package.
3. Only the media player package needs to be run.

### 1. Adding the media player data model to an existing dbt project with web model data already running

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

### 2. Starting both the media and web model from scratch

The easiest implementation out of the three scenarios. As the `snowplow_web_incremental_manifest` table is new, all models from both packages (plus any custom modules tagged with `snowplow_web_incremental`) will be processed using the recommended web model running method - using the snowplow_web selector without any extra step.

```bash
dbt run --selector snowplow_web
```

### 3. Only running the media player package from the same dbt project

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
