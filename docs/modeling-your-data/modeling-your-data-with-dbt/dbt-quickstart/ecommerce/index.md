---
sidebar_label: "E-commerce"
sidebar_position: 600
title: "E-commerce Quickstart"
---

```mdx-code-block
import { Accelerator } from "@site/src/components/AcceleratorAdmonitions";

<Accelerator href="https://docs.snowplow.io/accelerators/ecommerce/" name="E-Commerce"/>
```

## Requirements

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

- A dataset of e-commerce events from the [Snowplow JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/index.md), or the [iOS/Android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/ecommerce-tracking/index.md) trackers must be available in the database.
- Have the [`webPage` context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md#adding-predefined-contexts) enabled. (Note if you have only tracked mobile e-commerce events, you will need other events in your warehouse to have used this context as we require the column to exist).
- Have the following e-commerce contexts enabled: `cart`, `checkout_step`, `page` `transaction`, `user`
- Track the e-commerce tracking action events on your website/mobile application

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

```yml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

If you do not do this the package will still work, but the incremental upserts will become more costly over time.

### 2. Adding the `selectors.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the e-commerce model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/selectors.yml)) within the package, however in order to use these selectors you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

### 3. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile), in the table labeled `events`. In order to change this, please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_ecommerce:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
    snowplow__events_table: table_of_snowplow_events
```

:::info Databricks only

Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::

### 4. Filter your data set

You can specify both `start_date` at which to start processing events, the `app_id`'s to filter for, and the `event_name` value to filter on. By default the `start_date` is set to `2020-01-01`, all `app_id`'s are selected, and only the `snowplow_ecommerce_action` name is being surfaced. To change this please add/modify the following in your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_ecommerce:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
    snowplow__ecommerce_event_names: ['snowplow_ecommerce_action', 'my_custom_ecommerce_event']
```
### 5. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml title="dbt_project.yml"
vars:
  snowplow_ecommerce:
    snowplow__derived_tstamp_partitioned: false
```

:::

### 6. Removing unused modules

The e-commerce package creates tables that depend on the existence of certain entities that are a part of the [Snowplow e-commerce](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md) JS plugin. If, for some reason, you have not implemented them and would like to streamline your data modeling not to create empty tables, then you need to add that configuration to your `dbt_project.yml` file. Below you can see an example of what that would look like if you wanted to disable the [cart entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md#cart-entity)

#### Disabling the cart module in `dbt_project.yml` (recommended)

```yml title="dbt_project.yml"

...
vars:
    snowplow_ecommerce:
        snowplow__disable_ecommerce_carts: true
...
models:
    snowplow_ecommerce:
        carts:
            +enabled: false
```

Adding these two configurations to your `dbt_project.yml` will ensure that the carts module is disabled.

#### Disabling the cart module using `dbt run`
If you want to temporarily disable a module, or you just find it easier to use the command line, you can also do this in the command line when executing the `dbt run` command. You will need to run the following command to disable the carts module

```bash
dbt run --exclude carts --select snowplow_ecommerce --vars '{snowplow__disable_ecommerce_carts: true}'
```

### 7. Enable mobile e-commerce events
Mobile e-commerce events may be processed in the package, if they have a `domain_sessionid` and are in your listed `app_id`s, however to correctly source the mobile session and screen view ids you need to set the following in your `dbt_project.yml`:

```yml title="dbt_project.yml"
vars:
  snowplow_ecommerce:
    snowplow__enable_mobile_events: true
```

### 8. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_ecommerce
```
