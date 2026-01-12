---
title: "Full calculation for run timestamps"
sidebar_label: "Full calculation for run timestamps"
description: "A detailed deep dive into how we calculate which events to process in a run."
keywords: ["run timestamps", "event processing", "timestamp calculation", "incremental run"]
sidebar_position: 40
---

:::tip

The following information is meant for educational purposes only, there should never be a need to alter this logic as the package manages it all for you.

:::

## Timestamps used in our packages
When calculating the timestamps required for our [incremental sessionization logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) by default we use `collector_tstamp`; historically this was the field the events table was most likely to be partitioned on. Nowadays `load_tstamp` is increasingly common, and users may have changed the partition field of their table. To accommodate this and make use of more efficient filtering you can alter the field we use to identify new events using the `snowplow__session_timestamp` variable. Note that where possible this should match your partition key, and the choice will impact the calculation when looking for which events to process.

## Calculation for run timestamps

The details provided above cover how we calculate the first step of the date range to process on a run, based on the state of models in the package and any new data. This is not the full story as in a given run the date range of specific events that are available in the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table will differ from this. What follows is the full details of how this is calculated and processed.

### Step 1: Calculate Base New Event Limits
The first step is to identify the model limits for the run. This is accomplished by the [`get_incremental_manifest_status` macro](https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_incremental_manifest_status.sql) to find the min and max last success in the manifest, and then uses the [`get_run_limits` macro](https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_run_limits.sql) to identify which state the package is in and calculate the timestamp range for this run, as detailed above.

This range is then printed to the console and stored in the `snowplow_<package_name>_base_new_event_limits` table for later use.

### Step 2: Update sessions lifecycle manifest
Next, we need to now process the sessions with new events into the [sessions lifecycle manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/index.md#sessions-lifecycle-manifest) table. Here we apply many filters to the events table before calculating the [identifiers](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-identifiers/index.md) and minimum and maximum `snowplow__session_timestamp` for each session.

The filters that are applied are:
#### Filter to events within the limits
To minimize the table scan and ensure a consistent processing of data, we filter to events with a timestamp bound by the limits defined in step 1.
```jinja2
and {{ session_timestamp }} >= {{ lower_limit }}
and {{ session_timestamp }} <= {{ upper_limit }}
```

If `snowplow__derived_tstamp_partitioned` is set to true, and it is running in BigQuery, this will also apply the filter to the `derived_tstamp` field as well.

#### Filter late arriving data
To avoid scanning too far back in the events table for a session, and to avoid recalculating sessions far in the past, we filter out late arriving data based on the device created and send timestamp. How late these events can be sent is defined by the `snowplow__days_late_allowed` variable, which has a default of 3.
```jinja2
and dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', days_late_allowed, 'dvce_created_tstamp') }}
```

#### Filter app IDs
Based on the input provided in the `snowplow__app_id` variable, we filter to only those app ids provided.
```jinja2
and {{ snowplow_utils.app_id_filter(app_ids) }}
```

#### Filter out quarantined sessions
We also exclude any session identifiers listed in the [quarantine manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/index.md#quarantine-table) table to avoid processing long running sessions. For a session to be quarantined it must have events spanning longer than the value in your `snowplow__max_session_days` variable.
```jinja2
where session_identifier is not null
    and not exists (select 1 from {{ ref(quarantined_sessions) }} as a where a.session_identifier = e.session_identifier)
```

Once this is all calculated, we merge these with the existing manifest and take the least of the start timestamp, and the greatest of the end timestamp. In the case of a session running over the `snowplow__max_session_days` the end timestamp is re-calculated based on this instead.

### Step 3: Building sessions this run
We next identify which sessions need to be included in the current run, based on our event run limits and the _start_ timestamp of that session. Using the [`return_base_new_event_limits` macro](https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/return_base_new_event_limits.sql) we get the upper and lower limits as calculated in step 1, but also the lower limit minus the `snowplow__max_session_days` to get the earliest a session could start and still have events included in this run (the session start limit).

We then include in the run any session that:
- Starts after the session start limit
- Starts before or at the upper limit for the run
- Ends after the lower limit for the run

The [base sessions this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#base-sessions-this-run) table then contains any sessions that satisfy these conditions from the lifecycle manifest, but with an `end_tstamp` capped at the upper limit.

### Step 4: Build events this run
Finally we query the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table and filter to events that satisfy the following conditions:
- Session identifier is within the base sessions this run table created in Step 3
- Timestamp is between the min start and max end of sessions in the base sessions this run table created in Step 3
- Timestamp is greater than or equal to the start timestamp for that specific session identifier in base sessions this run table created in Step 3
- (Optional) App ID is in the list provided

This is the [deduplicated](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/deduplication/index.md) and other transformations are applied such as adding any entities, SDEs, or custom sql.

:::tip

The result of all of this is that the range of timestamps in the events this run table will be larger than the range printed in the log, and stored in the base new events limits table, but is required to ensure we correctly process complete sessions and are able to handle late arriving data.

:::
