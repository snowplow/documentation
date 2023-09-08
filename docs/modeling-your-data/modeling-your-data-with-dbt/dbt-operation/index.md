---
title: "Operation"
sidebar_position: 40
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info
Due to its unique relationship with the web package, the media player package operates in a different way. More information can be found on the [media player package section](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md).

:::

## Required Privileges 

```mdx-code-block
import DbtPrivs from "@site/docs/reusable/dbt-privs/_index.md"

<DbtPrivs/>
```

## Manifest Tables

Each of our packages has a set of manifest tables that manage the [Incremental Sessionization Logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md) logic of our package, as well as thinks such as quarantined sessions. 

:::danger

These manifest tables are critical to the package **and as such are protected from full refreshes, i.e. being dropped, when running in production by default**. In development refreshes are enabled.

:::

<Tabs groupId="dbt-packages" queryString>
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

The `allow_refresh()` macro defines the protection behavior. As [dbt recommends](https://docs.getdbt.com/faqs/target-names), target names are used here to differentiate between your prod and dev environment. By default, this macro assumes your dev target is named `dev`. This can be changed by setting the `snowplow__dev_target_name` var in your `dbt_project.yml` file.

To full refresh any of the manifest models in production, set the `snowplow__allow_refresh` to `true` at run time.

Alternatively, you can amend the behavior of this macro entirely by overwriting it. See the [Overwriting Macros](//docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/macros-and-keys/index.md#overriding-macros) section for more details.
