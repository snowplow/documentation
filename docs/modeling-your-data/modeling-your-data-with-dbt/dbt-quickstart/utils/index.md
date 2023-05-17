---
sidebar_label: "Utils"
sidebar_position: 103
title: "Utils Quickstart"
---

The `snowplow-utils` package allows you to create your own custom `snowplow_base_events_this_run` table using macros that generate the required SQL code for you, allowing you to incorporate whatever custom event types, contexts of Snowplow data. Using this package will allow you to leverage the incremental nature of the Snowplow packages, meaning you can more easily build data models using our other packages such as `snowplow-web` and `snowplow-mobile`, as well as build your own completely custom packages without having to do the initial heavy lifting yourself. This can, however, be a bit complicated to set up and so for that purpose we've create this quickstart page to guide you through this process.

## Requirements

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and an events dataset being available in your database:

- A dataset of Snowplow events from one of the [Snowplow trackers](docs/collecting-data/)

```mdx-code-block
import DbtPrivs from "@site/docs/reusable/dbt-privs/_index.md"

<DbtPrivs/>
```

```mdx-code-block
import DbtPackageInstallation from "@site/docs/reusable/dbt-package-installation/_index.md"

<DbtPackageInstallation/>
```

## Setup

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

### 2. Creating the `base` module in your dbt project
In your dbt project, create a `base` folder somewhere within your `models` directory. Within this `base` folder, you need to create the 6 `.sql` files shown below:
```ascii
my_dbt_project
├── analyses
│   └── .gitkeep
├── dbt_packages
│   ├── dbt_utils
│   └── snowplow_utils
├── logs
├── macros
├── models
│   └── base
│       ├── snowplow_base_quarantined_sessions.sql
│       ├── snowplow_incremental_manifest.sql
│       ├── snowplow_base_new_event_limits.sql
│       ├── snowplow_base_sessions_lifecycle_manifest.sql
│       ├── snowplow_base_sessions_this_run.sql
│       └── snowplow_base_events_this_run.sql
├── seeds
├── snapshots
├── target
├── tests
├── .gitignore
├── dbt_project.yml
├── packages.yml
├── README.md
└── selectors.yml
Once you've created all of these models, you need to call the correct macros in each model to ensure that the correct SQL gets generated for each model. If you'd like to rename any of the models, all you need to do is rename the `.sql` files listed above. However, please do so with caution and be sure to read the subsequent steps carefully as you may need to modify some of the boilerplate code outlined below to have the macros adapt properly to your naming conventions.

### 3. Setting up the quarantined sessions macro
Within the `snowplow_base_quarantined_sessions.sql` file, you can call the `base_create_snowplow_quarantined_sessions` macro as follows:

```sql
{{
  config(
    materialized='incremental'
  )
}}

{% set quarantined_query = snowplow_utils.base_create_snowplow_quarantined_sessions() %}

{{ quarantined_query }}
```

This macro doesn't accept any arguments, and simply generates a table which contains a column named `session_identifier`, containing all session identifiers of sessions that have been quarantined due to exceeding the maximum session length, to avoid long table scans.

### 4. Setting up the incremental manifest macro
Next, within the `snowplow_incremental_manifest.sql` file, you can call the `base_create_snowplow_incremental_manifest` macro as follows:

```sql
{{
  config(
    materialized='incremental'
  )
}}

{% set incremental_manifest_query = snowplow_utils.base_create_snowplow_incremental_manifest() %}

{{ incremental_manifest_query }}
```

Much like with the quarantined sessions macro, this does not accept any arguments and generates the boilerplate for the incremental manifest table that Snowplow leverages.

### 5. Setting up the new event limits macro
For the `snowplow_base_new_event_limits` model, you need to add a few extra macros into the mix, which you can do as follows:

```sql

{%- set models_in_run = snowplow_utils.base_get_enabled_snowplow_models() -%}

{% set min_last_success,
         max_last_success,
         models_matched_from_manifest,
         has_matched_all_models = snowplow_utils.get_incremental_manifest_status(ref('snowplow_incremental_manifest'),
                                                                                 models_in_run) -%}


{% set run_limits_query = snowplow_utils.get_run_limits(min_last_success,
                                                          max_last_success,
                                                          models_matched_from_manifest,
                                                          has_matched_all_models,
                                                          var("snowplow__start_date")) -%}


{{ run_limits_query }}
```

Here there are a couple of variables that can be used to modify the `new_event_limits` table setup. Firstly, if you chose to name your `snowplow_incremental_manifest` model differently, be sure to reference that properly in the `get_incremental_manifest_status` macro call. If for example, you chose to call the manifest model `incremental_manifest` by naming your file `incremental_manifest.sql` instead of the prescribed `snowplow_incremental_manifest.sql`, then you would reflect that using the following macro call:

```sql
{% set min_last_success,
         max_last_success,
         models_matched_from_manifest,
         has_matched_all_models = snowplow_utils.get_incremental_manifest_status(ref('incremental_manifest'),
                                                                                 models_in_run) -%}
```

Secondly, you can choose the starting date of when your Snowplow data was first loaded into your data warehouse/lake. This is reflected in the value of the `snowplow__start_date` variable, which you may be familiar with if you've used previous Snowplow dbt packages. This variable is typically defined in your `dbt_project.yml`, and can be defined in that file in the following manner.
```yml
# dbt_project.yml

vars:
    # to define it globally, use the following notation
    snowplow__start_date: '2020-01-01'

    # to define the variable locally within the project, use the following nesting
    my_dbt_project:
        snowplow__start_date: '2020-01-01'
```

### 6. Setting up the sessions lifecycle manifest macro
For the `snowplow_base_sessions_lifecycle_manifest` model, you have the following macro call which takes in a lot of parameters:

```sql

{% set sessions_lifecycle_manifest_query = snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest(
    var('snowplow__session_identifiers', '{"atomic": "domain_sessionid"}'),
    var('snowplow__session_timestamp', 'collector_tstamp'),
    var('snowplow__user_identifiers', '{"atomic" : "domain_userid"}'),
    var('snowplow__quarantined_sessions', 'snowplow_base_quarantined_sessions'),
    var('snowplow__derived_tstamp_partitioned', true),
    var('snowplow__days_late_allowed', 3),
    var('snowplow__max_session_days', 3),
    var('snowplow__app_ids', []),
    var('snowplow__events_schema', 'atomic'),
    var('snowplow__events_table', 'events'),
    var('snowplow__event_limits', 'snowplow_base_new_event_limits'),
    var('snowplow__incremental_manifest', 'snowplow_incremental_manifest')
 ) %}

{{ sessions_lifecycle_manifest_query }}
```

To get an in-depth explanation of each variable passed here, please refer to the [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/utils/index.md) page.

Some key parameters, however, are the `snowplow__session_timestamp` which is used to identify which timestamp column is used for sessionization, with sensible values being either `collector_tstamp` or `load_tstamp`. You also have the `snowplow__session_identifiers` and `snowplow__user_identifiers` which expect a map object which stipulates where all session or user identifiers are contained. The key stipulates the name of the context/entity where this identifier can be found (or this can be set to `atomic` if it is a field found in the atomic columns), and the value stipulates the name of this field in either the context/entity or the atomic columns. As you can see, these default to `atomic: domain_sessionid` and `atomic: domain_userid` by default respectively. If you have more than one session/user identifier, you can specify multiple within the map, with the order in which you specify them being the order of precedence that the macro will try to `COALESCE` these field values into a common `session/user_identifier` field.

Further, you can specify some additional configurations here such as in which table/schema the events data sits, what the names are of your `event_limits` and `incremental_manifest` tables, and some parameters around what the maximum session length is. You should once again be familiar with the majority of these variables if you've used another of our dbt packages before.

### 7. Setting up the sessions this run macro
For the `snowplow_base_sessions_this_run` model, you will need to add a post-hook to the configuration of the model as follows:

```sql
{{
    config(
        post_hook=["{{ snowplow_utils.base_quarantine_sessions(var('snowplow__max_session_days', 3), var('snowplow__quarantined_sessions', 'snowplow_base_quarantined_sessions')) }}"]
    )
}}


{% set sessions_query = snowplow_utils.base_create_snowplow_sessions_this_run(
    lifecycle_manifest_table='snowplow_base_sessions_lifecycle_manifest',
    new_event_limits_table='snowplow_base_new_event_limits') %}

{{ sessions_query }}

```

Here the parameters that are called in both macros are only used to direct the macro to the right model names, so again if you've chosen to modify any of the table names then you should adjust the names in the right macros here. For the `base_quarantine_sessions` macro you simply pass the maximum session duration in days, which is taken from the `snowplow__max_session_days` variable, and you specify the name of the `snowplow_base_quarantined_sessions` table, specified by the `snowplow__quarantined_sessions` variable.

For the `base_create_snowplow_sessions_this_run` macro call, you specify the name of the `lifecycle_manifest_table` and the `new_evet_limits_table`. The boilerplate contains their default names, and so if you have not customised anything you can simply copy this code into your `snowplow_base_sessions_this_run.sql` model.

### 8. Setting up the events this run macro
For the `snowplow_base_events_this_run` model, you will need to run the following two macros in your model:

```sql
{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref(var('snowplow__base_sessions', 'snowplow_base_sessions_this_run')),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

{% set base_events_query = snowplow_utils.base_create_snowplow_events_this_run(
    var('snowplow__base_sessions', 'snowplow_base_sessions_this_run'),
    var('snowplow__session_identifiers', '{"atomic": "domain_sessionid"}'),
    var('snowplow__session_timestamp', 'collector_tstamp'),
    var('snowplow__derived_tstamp_partitioned', true),
    var('snowplow__days_late_allowed', 3),
    var('snowplow__max_session_days', 3),
    var('snowplow__app_ids', []),
    var('snowplow__events_schema', 'atomic'),
    var('snowplow__events_table', 'events')) %}

{{ base_events_query }}
```

Here you once again have a number of parameters that the macro can take, and to get an in-depth explanation of each variable passed here, please refer to the [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/utils/index.md) page. The variables used here are largely either self-explanatory or overlapping with those in the [lifecycle manifest](docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/utils/index.md#6-setting-up-the-sessions-lifecycle-manifest-macro) section, except that you can now specify custom names for your `snowplow_base_sessions_this_run` table through the `snowplow__base_sessions` variable.

### 9. Modify your `dbt_project.yml`
To properly configure your dbt project to utilise and update the manifest tables correctly, you will need to add the following hooks to your `dbt_project.yml`

```yml
# Completely or partially remove models from the manifest during run start.
on-run-start:
  - "{{ snowplow_utils.snowplow_delete_from_manifest(var('models_to_remove',[]), ref('snowplow_incremental_manifest')) }}"

# Update manifest table with last event consumed per sucessfully executed node/model
on-run-end:
  - "{{ snowplow_utils.snowplow_incremental_post_hook() }}"
```

The `snowplow_delete_from_manifest` macro is called to remove models from manifest if specified using the `models_to_remove` variable, in case of a partial or full refresh. The `snowplow_incremental_post_hook` is used to update the manifest table with the timestamp of the last event consumed successfully for each Snowplow model.

### 10. Run your models

Now that you've configured all of your macros correctly, you can run your dbt project as normal. If you want to try to only run the models you've just created above, you can issue the following command in your terminal:

```bash
dbt run --select +snowplow_base_events_this_run
```

You will have to change the name of the model if you've customized this earlier.
