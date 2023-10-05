---
sidebar_label: "Utils"
sidebar_position: 300
title: "Utils Quickstart"
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info
The models, functionality, and variables described below are only available from `snowplow-utils v0.15.0` and above, as earlier packages do not utilize these variables.
:::

The `snowplow-utils` package allows you to create your own custom `snowplow_base_events_this_run` table using macros that generate the required SQL code for you, allowing you to incorporate whatever custom event types, contexts of Snowplow data. Using this package will allow you to leverage the [incremental nature](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md) of the Snowplow packages, meaning you can more easily build data models using our other packages such as `snowplow-web` and `snowplow-mobile`, as well as build your own completely custom packages without having to do the initial heavy lifting yourself. This can, however, be a bit complicated to set up and so for that purpose we've create this quickstart page to guide you through this process.

:::info
It is only recommended that you use this if you are planning on heavily customizing your Snowplow data modeling setup, whilst still taking advantage of the incremental framework that the existing dbt packages offer. If you are going to be heavily leveraging the existing Snowplow packages (e.g. [snowplow-web](https://hub.getdbt.com/snowplow/snowplow_web/latest/) or [snowplow-mobile](https://hub.getdbt.com/snowplow/snowplow_mobile/latest/)) then you will not need to leverage this package for the creation of your base tables. Please instead follow the appropriate quickstart guides for the packages you are going to be utilizing instead, such as for [web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/web/index.md) or [mobile](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/mobile/index.md).

:::

## Requirements

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and connected to your database you need:

- A dataset of Snowplow events from one of the [Snowplow trackers](/docs/collecting-data/index.md)

```mdx-code-block
import DbtPrivs from "@site/docs/reusable/dbt-privs/_index.md"

<DbtPrivs/>
```

```mdx-code-block
import DbtPackageInstallation from "@site/docs/reusable/dbt-package-installation/_index.md"

<DbtPackageInstallation/>
```

## Setup

:::info
You can largely skip redundant copy + pasting by cloning the following dbt project repository that we have created in GitHub. You can find it [here](https://github.com/snowplow-incubator/dbt-example-project), and this has all of the boilerplate setup for you already. If you want to customize model names or parameter values, you can still follow the quickstart guide below to help you understand how to do that, and what changing each variable will mean for your models. Feel free to skip steps 1 and 2, however.

:::

### 1. Override the dispatch order in your project
To take advantage of the optimized upsert that the Snowplow packages offer you need to ensure that certain macros are called from `snowplow_utils` first before `dbt-core`. This can be achieved by adding the following to the top level of your `dbt_project.yml` file:

```yml title="dbt_project.yml"
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
```
Once you've created all of these models, you need to call the correct macros in each model to ensure that the correct SQL gets generated for each model. If you'd like to rename any of the models, all you need to do is rename the `.sql` files listed above.

:::caution
Please only rename the models with caution and be sure to read the subsequent steps carefully as you may need to modify some of the boilerplate code outlined below to have the macros adapt properly to your naming conventions.
:::

### 3. Setting up the quarantined sessions macro
Within the `snowplow_base_quarantined_sessions.sql` file, you can call the `base_create_snowplow_quarantined_sessions` macro as follows:

```jinja2
{{
  config(
    materialized='incremental'
  )
}}

{% set quarantined_query = snowplow_utils.base_create_snowplow_quarantined_sessions() %}

{{ quarantined_query }}
```

This macro doesn't accept any arguments, and simply generates a table which contains a column named `session_identifier`, containing all session identifiers of sessions that have been quarantined due to exceeding the maximum session length, to avoid long table scans. More information on the sessionization logic and optimization can be found [here](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md)

### 4. Setting up the incremental manifest macro
Next, within the `snowplow_incremental_manifest.sql` file, you can call the `base_create_snowplow_incremental_manifest` macro as follows:

```jinja2
{{
  config(
    materialized='incremental'
  )
}}

{% set incremental_manifest_query = snowplow_utils.base_create_snowplow_incremental_manifest() %}

{{ incremental_manifest_query }}
```

Much like with the quarantined sessions macro, this does not require any arguments and generates the boilerplate for the incremental manifest table that Snowplow leverages.

### 5. Setting up the new event limits macro
For the `snowplow_base_new_event_limits` model, you need to add a few extra macros into the mix, which you can do as follows:

:::info
Be sure to specify your `PACKAGE_NAME` when calling the `get_enabled_snowplow_models` macro.
:::

```jinja2
{{
  config(
   post_hook=["{{snowplow_utils.print_run_limits(this)}}"]
   )
}}

{%- set models_in_run = snowplow_utils.get_enabled_snowplow_models(PACKAGE_NAME, graph_object=none, models_to_run="", base_events_table_name='snowplow_base_events_this_run') -%}

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

:::info
The below is just an example of a macro call when using custom naming, this isn't something additional to copy and add if you want to set up your `snowplow_new_event_limits` model!
:::

```jinja2
{% set min_last_success,
         max_last_success,
         models_matched_from_manifest,
         has_matched_all_models = snowplow_utils.get_incremental_manifest_status(ref('incremental_manifest'),
                                                                                 models_in_run) -%}
```

Secondly, you can choose the starting date of when your Snowplow data was first loaded into your data warehouse/lake. This is reflected in the value of the `snowplow__start_date` variable, which you may be familiar with if you've used previous Snowplow dbt packages. This variable is typically defined in your `dbt_project.yml`, and can be defined in that file in the following manner.
```yml title="dbt_project.yml"

vars:
    # to define it globally, use the following notation
    snowplow__start_date: '2020-01-01'

    # to define the variable locally within the project, use the following nesting
    my_dbt_project:
        snowplow__start_date: '2020-01-01'
```

### 6. Setting up the sessions lifecycle manifest macro
For the `snowplow_base_sessions_lifecycle_manifest` model, you have the following macro call which takes in a lot of parameters to allow for a high level of flexibility in how you can process your Snowplow data:

```jinja2

{% set sessions_lifecycle_manifest_query = snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest(
    session_identifiers=var('snowplow__session_identifiers', '[{"schema": "atomic", "field": "domain_sessionid"}]'),
    session_sql=var('snowplow__session_sql', none),
    session_timestamp=var('snowplow__session_timestamp', 'collector_tstamp'),
    user_identifiers=var('snowplow__user_identifiers', '[{"schema": "atomic", "field": "domain_userid"}]'),
    user_sql=var('snowplow__user_sql', none),
    quarantined_sessions=var('snowplow__quarantined_sessions', 'snowplow_base_quarantined_sessions'),
    derived_tstamp_partitioned=var('snowplow__derived_tstamp_partitioned', true),
    days_late_allowed=var('snowplow__days_late_allowed', 3),
    max_session_days=var('snowplow__max_session_days', 3),
    app_ids=var('snowplow__app_ids', []),
    snowplow_events_database=var('snowplow__events_schema', none),
    snowplow_events_schema=var('snowplow__events_schema', 'atomic'),
    snowplow_events_table=var('snowplow__events_table', 'events'),
    event_limits_table=var('snowplow__event_limits', 'snowplow_base_new_event_limits'),
    incremental_manifest_table=var('snowplow__incremental_manifest', 'snowplow_incremental_manifest'),
    package_name=var('snowplow__package_name, 'snowplow')
 ) %}

{{ sessions_lifecycle_manifest_query }}
```

To get an in-depth explanation of each variable passed here, please refer to the [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/utils/index.md) page.

There are several important parameters to consider. The first one is `snowplow__session_timestamp`, which helps identify the timestamp column used for sessionization. It's recommended to use either `collector_tstamp` or `load_tstamp` as sensible values.

Next, we have `snowplow__session_identifiers` and `snowplow__user_identifiers`, which expect a map object defining the location of session or user identifiers. In this map, the key represents the name of the context or entity where the identifier can be found. If the identifier is a field in the atomic columns, the key can be set to `atomic`. The value specifies the name of the field in either the context/entity or the atomic columns.

:::caution
Currently, we only support session and user identifiers found in atomic fields for Redshift/Postgres. We don't support nested level fields for any warehouses, and for BigQuery you will currently need to do the version management yourself. We will be getting around to supporting this extra functionality soon.
:::

By default, `snowplow__session_identifiers` is set to `[{"schema": "atomic", "field": "domain_sessionid"}]`, and `snowplow__user_identifiers` is set to `[{"schema": "atomic", "field": "domain_userid"}]`. This means that the identifiers for sessions and users are expected to be found in the `domain_sessionid` and `domain_userid` fields, respectively.

If you have more than one session or user identifier, you can specify multiple entries in the map. The order in which you list them determines the precedence that the macro will use to look for these field values, and `COALESCE` them into the common session/user_identifier field. E.g. if you have the following definition for your `user_identifier`:

<Tabs groupId="warehouse" queryString>
<TabItem value="default" label="BigQuery, Databricks, & Snowflake" default>
<pre><code className="language-json">
{`
[
  {"schema": "my_custom_context", "field": "internal_user_id"},
  {"schema": "atomic", "field": "domain_userid"}
]
`}
</code></pre>
</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres" default>
<pre><code className="language-json">
{`
[
  {"schema": "my_custom_context", "field": "internal_user_id", "prefix": "mcc", "alias": "mcc_iud"},
  {"schema": "atomic", "field": "domain_userid"}
]
`}
</code></pre>

For Redshift & Postgres we also introduce the `prefix` and `alias` fields, where `prefix` is the `prefix` that is put in front of each field name in the context, and `alias` is the table alias used upon joining. This can be useful when you are using custom SQL. As an example, using the above configuration we could access the `internal_user_id` field using the following SQL:

```sql
mcc_iud.mcc_internal_user_id as internal_user_id,
```

This could be leveraged in the `snowplow__custom_sql` variable. For more examples, please see [the following page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md).
</TabItem>
</Tabs>


The package will first extract `internal_user_id` from the `my_custom_context` context, and then use something similar to the following SQL statement: `COALESCE(my_custom_context.internal_user_id, events.domain_userid) as user_identifier`. This way, if a user is able to identify themselves through logging in which would populate a context called `my_custom_context`, their `internal_user_id` is used as a `user_identifier`. If, however, this is not the case, then the `user_identifier` field falls back on the value that the `domain_userid` has.

:::info
We currently only track one `user_identifier` value per session in the `session_lifecycle_manifest`, which means if a user logs in part-way through a session, we would only keep one of those values.
:::


Further, you can specify some additional configurations here such as in which table/schema the events data sits, what the names are of your `event_limits` and `incremental_manifest` tables, and some parameters around what the maximum session length is. You should once again be familiar with the majority of these variables if you've used another of our dbt packages before.

### 7. Setting up the sessions this run macro
For the `snowplow_base_sessions_this_run` model, you will need to add a post-hook to the configuration of the model as follows:

```jinja2
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

For the `base_create_snowplow_sessions_this_run` macro call, you specify the name of the `lifecycle_manifest_table` and the `new_event_limits_table`. The boilerplate contains their default names, and so if you have not customized anything you can simply copy this code into your `snowplow_base_sessions_this_run` model.

### 8. Setting up the events this run macro
For the `snowplow_base_events_this_run` model, you will need to run the following two macros in your model:

```jinja2
{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref(var('snowplow__base_sessions', 'snowplow_base_sessions_this_run')),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

{% set base_events_query = snowplow_utils.base_create_snowplow_events_this_run(
    sessions_this_run_table=var('snowplow__base_sessions', 'snowplow_base_sessions_this_run'),
    session_identifiers=var('snowplow__session_identifiers', '[{"schema": "atomic", "field": "domain_sessionid"}]'),
    session_sql=var('snowplow__session_sql', none),
    session_timestamp=var('snowplow__session_timestamp', 'collector_tstamp'),
    derived_tstamp_partitioned=var('snowplow__derived_tstamp_partitioned', true),
    days_late_allowed=var('snowplow__days_late_allowed', 3),
    max_session_days=var('snowplow__max_session_days', 3),
    app_ids=var('snowplow__app_ids', []),
    snowplow_events_database=var('snowplow__events_schema', none),
    snowplow_events_schema=var('snowplow__events_schema', 'atomic'),
    snowplow_events_table=var('snowplow__events_table', 'events')) %}

{{ base_events_query }}
```

Here you once again have a number of parameters that the macro can take, and to get an in-depth explanation of each variable passed here, please refer to the [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/utils/index.md) page. The variables used here are largely either self-explanatory or overlapping with those in the [lifecycle manifest](docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/utils/index.md#6-setting-up-the-sessions-lifecycle-manifest-macro) section, except that you can now specify custom names for your `snowplow_base_sessions_this_run` table through the `snowplow__base_sessions` variable.

### 9. Modify your `dbt_project.yml`
To properly configure your dbt project to utilize and update the manifest tables correctly, you will need to add the following hooks to your `dbt_project.yml`

```yml
# Completely or partially remove models from the manifest during run start.
on-run-start:
  - "{{ snowplow_utils.snowplow_delete_from_manifest(var('models_to_remove',[]), ref('snowplow_incremental_manifest')) }}"

# Update manifest table with last event consumed per sucessfully executed node/model
on-run-end:
  - "{{ snowplow_utils.snowplow_incremental_post_hook(package_name='snowplow', incremental_manifest_table_name=var('snowplow__incremental_manifest', 'snowplow_incremental_manifest'), base_events_this_run_table_name='snowplow_base_events_this_run', session_timestamp=var('snowplow__session_timestamp')) }}"
```

The `snowplow_delete_from_manifest` macro is called to remove models from manifest if specified using the `models_to_remove` variable, in case of a partial or full refresh. The `snowplow_incremental_post_hook` is used to update the manifest table with the timestamp of the last event consumed successfully for each Snowplow incremental model - make sure to change the `base_events_this_run_table_name` if you used a different table name.

:::tip

The `package_name` variable here is not necessarily the name of your project (although it keeps things simple to make it the same), instead it is what is used to identify your tagged incremental models as they should be tagged with `<package_name>_incremental`.

:::

### 10. Run your models

Now that you've configured all of your macros correctly, you can run your dbt project as normal. If you want to try to only run the models you've just created above, you can issue the following command in your terminal:

```bash
dbt run --select +snowplow_base_events_this_run
```

You will have to change the name of the model if you've customized this earlier.
