---
title: "Operation"
sidebar_position: 300
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info
Due to its unique relationship with the web package, the media player package operates in a different way. More information can be found on the [media player package section](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md).

:::

:::tip
On this page, `<package>` can be one of: `web`, `mobile`, `ecommerce,` `normalize`

:::



## YAML Selectors

The Snowplow models in each package are designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, run the model using:

```bash
dbt run --select snowplow_<package> tag:snowplow_<package>_incremental
```
The `snowplow_<package>` selection will execute all nodes within the relevant Snowplow package, while the `tag:snowplow_<package>_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the YAML selectors we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_<package>
```

Within the packages we have provided a suite of suggested selectors to run and test the models within the packages. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax).

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

- `snowplow_web`: Recommended way to run the package. This selection includes all models within the Snowplow Web as well as any custom models you have created
- `snowplow_web_lean_tests`: Recommended way to test the models within the package. See the testing section for more details

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

- `snowplow_mobile`: Recommended way to run the package. This selection includes all models within the Snowplow Mobile as well as any custom models you have created
- `snowplow_mobile_lean_tests`: Recommended way to test the models within the package. See the testing section for more details

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

- `snowplow_web`:  Recommended way to run the package. This selection includes all models within the Snowplow Web and Snowplow Media Player as well as any custom models you have created
- `snowplow_web_lean_and_media_player_tests`: Recommended way to test the models within the package. See the testing section for more details
- `snowplow_media_player_tests`: Runs all tests within the Snowplow Media Player Package and any custom models tagged with `snowplow_media_player`
- `snowplow_web_and_media_player_tests`: Runs all tests within the Snowplow Web and Snowplow Media Player Package and any custom models tagged with `snowplow_media_player` or `snowplow_web_incremental`

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">

- `snowplow_normalize`:  Recommended way to run the package. This selection includes all models within the Snowplow Normalize package as well as any custom models you have created

</TabItem>

<TabItem value="ecommerce" label="Snowplow E-commerce">

- `snowplow_ecommerce`: Recommended way to run the package. This selection includes all models within the Snowplow E-commerce as well as any custom models you have created
- `snowplow_ecommerce_lean_tests`: Recommended way to test the models within the package. See the testing section for more details

</TabItem>
</Tabs>


These are defined in each `selectors.yml` file within the packages, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

## Manifest Tables
<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

There are 3 manifest tables included in this package:

- `snowplow_web_incremental_manifest`: Records the current state of the package
- `snowplow_web_base_sessions_lifecycle_manifest`: Records the start & end timestamp of all sessions
- `snowplow_web_base_quarantined_sessions`: Records sessions that have exceeded the maximum allowed session length, defined by `snowplow__max_session_days` (default 3 days)

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

There are 2 manifest tables included in this package:

- `snowplow_mobile_incremental_manifest`: Records the current state of the package
- `snowplow_mobile_base_sessions_lifecycle_manifest`: Records the start & end timestamp of all sessions

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">

There is 1 manifest table included in this package:

- `snowplow_normalize_incremental_manifest`: Records the current state of the package

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

There are 3 manifest tables included in this package:

- `snowplow_ecommerce_incremental_manifest`: Records the current state of the package
- `snowplow_ecommerce_base_sessions_lifecycle_manifest`: Records the start & end timestamp of all sessions
- `snowplow_ecommerce_base_quarantined_sessions`: Records sessions that have exceeded the maximum allowed session length, defined by `snowplow__max_session_days` (default 3 days)

</TabItem>
</Tabs>

_Please refer to the [Incremental Logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md) section more details on the purpose of each of these tables._

:::danger

These manifest models are critical to the package **and as such are protected from full refreshes, i.e. being dropped, by default when running in production**. While in development refreshes are allowed.

:::



The `allow_refresh()` macro defines this behavior. As [dbt recommends](https://docs.getdbt.com/faqs/target-names), target names are used here to differentiate between your prod and dev environment. By default, this macro assumes your dev target is named `dev`. This can be changed by setting the `snowplow__dev_target_name` var in your `dbt_project.yml` file.

To full refresh any of the manifest models in production, set the `snowplow__allow_refresh` to `true` at run time (see below).

Alternatively, you can amend the behavior of this macro entirely by overwriting it. See the [Overwriting Macros](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-advanced-operation/index.md#overriding-macros) section for more details.

## Complete refresh of Snowplow package

While you can drop and recompute the incremental tables within this package using the standard `--full-refresh` flag, as mentioned above all manifest tables are protected from being dropped in production. Without dropping the manifest during a full refresh, the selected derived incremental tables would be dropped but the processing of events would resume from where the package left off (as captured by the `snowplow_web_incremental_manifest` table) rather than your `snowplow__start_date`.

In order to drop all the manifest tables and start again set the `snowplow__allow_refresh` var to `true` at run time:


```bash
dbt run --select snowplow_<package> tag:snowplow_<package>_incremental --full-refresh --vars 'snowplow__allow_refresh: true'
# or using selector flag
dbt run --selector snowplow_<package> --full-refresh --vars 'snowplow__allow_refresh: true'
```

:::tip

If you want to backfill a previously disabled model, or refresh only a subset of models, check out the docs on [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md).

:::
