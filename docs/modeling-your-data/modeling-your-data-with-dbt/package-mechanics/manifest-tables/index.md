---
title: "Manifest tables"
sidebar_label: "Manifest tables"
description: "Details around the manifest tables we use in our packages."
keywords: ["manifest tables", "session lifecycle", "quarantine table", "package state"]
sidebar_position: 50
---

Each of our packages has a set of manifest tables that manage the [Incremental Sessionization Logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) logic of our package, as well as quarantining long running sessions.

:::danger

These manifest tables are critical to the package **and as such are protected from full refreshes, i.e. being dropped, when running in production by default**. In development refreshes are enabled.

:::

The `allow_refresh()` macro defines the protection behavior. As [dbt recommends](https://docs.getdbt.com/docs/core/connect-data-platform/connection-profiles#understanding-targets-in-profiles), target names are used here to differentiate between your prod and dev environment. By default, this macro assumes your dev target is named `dev`. This can be changed by setting the `snowplow__dev_target_name` var in your `dbt_project.yml` file.

To full refresh any of the manifest models in production as part of a `--full-refresh`, set the `snowplow__allow_refresh` to `true` at run time.

Alternatively, you can amend the behavior of this macro entirely by overwriting it. See the [Overwriting Macros](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/overridable-macros/index.md) section for more details.

## Incremental manifest
The majority of our packages have an incremental manifest table; by default this is in your `_snowplow_manifest` suffixed schema, and will have the name `snowplow_<package_name>_incremental_manifest`. This table exists to track the [state](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md#how-to-identify-the-current-state) of each of the models in the package, including any [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) that have been tagged.

This table has 2 columns:
- `model`: The name of the model
- `last_success`: The timestamp of the max last event processed by the model, based on the field defined in the `snowplow__session_timestamp` variable

As this is the source of truth for processing for the package, it is highly recommended to never alter or edit this table directly as this can lead to unexpected outcomes. The manifest table is updated as part of an `on-run-end` hook, which calls the `snowplow_incremental_post_hook()` macro.

## Sessions lifecycle manifest
The majority of our packages have a session lifecycle manifest table; by default this is in your `_snowplow_manifest` suffixed schema, and will have the name `snowplow_<package_name>_base_sessions_lifecycle_manifest`. This table exists to track the start and end timestamps of any given session, allowing us to avoid a full table scan each run.

This table has 4 columns:
- `session_identifier`: The unique identifier for the session
- `user_identifier`: The unique user identifier for the session. Note that if multiple user identifiers exist for a given session we only take one.
- `start_tstamp`: The timestamp of the first event to process for the session (note due to late arriving data, this may not actually be the true first event in rare cases)
- `end_tstamp`: The timestamp of the last event to process for the session (note this may be capped with the `snowplow__max_session_days` variable)

Timestamps based on the field defined in the `snowplow__session_timestamp` variable. This table is used to calculate which sessions are to be processed in a run, and also helps inform the run limits.

## Quarantine table
Many of our packages have a quarantine table; by default this is in your `_snowplow_manifest` suffixed schema, and will have the name `snowplow_<package_name>_base_quarantined_sessions`. This table exists to track sessions that have gone beyond the `snowplow__max_session_days` limit and avoid re-processing them again.

This table has 1 column:
- `session_identifier`: The unique identifier for the session to not process in any further run.

This table is updated on the post-hook of the [base sessions this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#base-sessions-this-run) table. If there are any additional sessions you identify you want to remove from processing, you can manually add them to this table but ensure they do not already exist.
