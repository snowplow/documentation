---
title: Model your data
position: 7
---

To process raw events created by the Snowplow Enhanced Consent plugin we have included an optional module to model consent events in the [snowplow-web dbt package](https://hub.getdbt.com/snowplow/snowplow_web/latest/).

In this section you will learn how to enable and run the consent module within the snowplow-web package.

## Step 1: Enable the optional consent module

As the [advanced-analytics-for-web accelerator](https://docs.snowplow.io/accelerators/web/) is a prerequisite, it is assumed that you already have a dbt project set up to process basic web events using the `snowplow_web` package.

To enable the optional consent module, simply set the `snowplow__enable_consent` variable to true:

```yml
# dbt_project.yml
vars:
  snowplow_web:
    snowplow__enable_consent: true
```

> If you are using a version of `snowplow_web` prior to version 0.15.0, you need to set the following instead:
>   
>   ```yml
>   models:
>     snowplow_web:
>       optional_modules:
>         consent:
>           enabled: true
>           +schema: "derived"
>           +tags: ["snowplow_web_incremental", "derived"]
>           scratch:
>             +schema: "scratch"
>             +tags: "scratch"
>             bigquery:
>               enabled: "{{ target.type == 'bigquery' | as_bool() }}"
>             databricks:
>               enabled: "{{ target.type in ['databricks', 'spark'] | as_bool() }}"
>             default:
>               enabled: "{{ target.type in ['redshift', 'postgres'] | as_bool() }}"
>             snowflake:
>               enabled: "{{ target.type == 'snowflake' | as_bool() }}"
>   ```

## Step 2: Run the package

If this is your first time processing the snowplow_web package then you can run the package the recommended way either through your CLI or from within dbt Cloud with the following command:

```bash
dbt run --selector snowplow_web
```

If you already have a working snowplow_web package and would like to enable the consent module you do not need to rebuild the whole model from scratch. For the least amount of reprocessing impact execute the first run the following way:

```bash
dbt run -m snowplow_web.base --vars 'snowplow__start_date: <date_when_consent_tracking_starts>'
```

This way only the base module is reprocessed. The web model's update logic will recognize the newly enabled models and backfilling should start between the date you defined within snowplow_start_date and the upper limit defined by the variable `snowplow_backfill_limit_days` that is set for the web model.

`Snowplow: New Snowplow incremental model. Backfilling`

You can overwrite this limit for the backfilling process temporarily if needed:

```yml
# dbt_project.yml

vars:
  snowplow_web:
    snowplow__backfill_limit_days: 1
```

After this you should be able to see all consent models created and added to the derived.snowplow_web_incremental_manifest table. Any subsequent run from this point onwards could be carried out using the recommended web model running method - using the snowplow_web selector.

```bash
dbt run --selector snowplow_web
```

As soon as backfilling finishes, running the model results in both the web and the consent models being updated during the same run for the same period, both using the same latest set of data from the `_base_events_this_run` table. Please note that while the backfilling process lasts, no new web events are going to be processed.

The following models will be generated:

- **snowplow_web_consent_log**: Snowplow incremental table showing the audit trail of consent and Consent Management Platform (cmp) events
- **snowplow_web_consent_users**: Incremental table of user consent tracking stats
- **snowplow_web_consent_totals**: Summary of the latest consent status, per consent version
- **snowplow_web_consent_scope_status**: Aggregate of current number of users consented to each consent scope
- **snowplow_web_cmp_stats**: Used for modeling cmp_visible events and related metrics
- **snowplow_web_consent_versions**: Incremental table used to keep track of each consent version and its validity
