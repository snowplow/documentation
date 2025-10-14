---
title: Enabling Conversions within Unified Package
position: 3
---

Snowplow’s Attribution package requires the optional conversions module to be configured within the Unified package, because the `snowplow_unified_conversions` table is used as a source by default. This is an additional incremental table that will be updated for each run of the Unified package.

Enabling Conversions will also add 6 extra columns into the sessions table. See more details about that on [this page](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/conversions/).

If you already have conversion events and the conversion module is enabled, you can skip this step.

:::info
Please note: All the actions within this step are to be completed within your Snowplow **Unified Package** dbt project.
:::

### Configuring Conversions in Unified

1. Add `snowplow__conversion_events: []` variable to dbt_project.yml file inside your project where you the run Snowplow Unified package.
2. Add a conversion event into the array as shown below to the dbt_project.yml file in the vars section.

You can see further details on configuring the conversion event on [this page of the docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/conversions/)

:::info
Please Note: The total value of conversions must be greater than 0 for the Attribution Package as it is required to calculate the proportion of value brought in by a campaign or channel.
:::

```yml
vars:
  snowplow_unified:
    snowplow__conversion_events: [
      {
        "name": "purchase", # Required, name of the conversion, string (must be valid SQL column name)
        "condition": " event_name == 'purchase' ", # Required, valid SQL condition that returns true or false
        "value": " 1 ", # Optional but recommended, can be field name or SQL
        "default_value": "0", # Optional, can be field name or SQL
        "list_events": "true" # Optional, boolean
      }
    ]
```

3. Enable the Conversions Module to create the `snowplow_unified_conversions` table by setting the following variable in your Unified dbt_project.yml file.

```yml
vars:
  snowplow_unified:
    snowplow__enable_conversions: true
```

:::warning
If you have not previously run the Unified package with the conversions module enabled by default it will cause the Snowplow package to backfill from the `snowplow__start_date` (with `snowplow__backfill_limit_days` increments for each run) until the `snowplow_unified_conversions` table becomes up-to-date with the rest of the incremental tables. During backfilling any existing derived incremental tables (e.g. sessions table) are not going to get updated.

Alternatively, you can adjust the run configurations the first time you run the package with the enabled conversions module to only backfill the `snowplow_unified_conversions` table from a certain more recent date only. [Read more details here](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/backfilling/).

:::

### (Optional) Enable referral fields if marketing fields are null

It can be useful to use the referral fields source and medium if the marketing fields are null, by default the marketing fields are set from UTM parameters. Having referral fields as a fallback can be enabled with a variable from within the Unified Package.

1. Set the following variable to true within your `dbt_project.yml` file

```yml
vars:
  snowplow_unified:
    snowplow__use_refr_if_mkt_null: true
```

### Run the Unified Package

1. Run the Snowplow Unified package to create the `snowplow_unified_conversions` table and include your conversion events in your `snowplow_unified_sessions` table. By default, your `snowplow_unified_conversions` table will be in the same schema/dataset as your other unified model derived tables.

```bash
dbt run --select snowplow_unified
```
