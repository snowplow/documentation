---
title: "Modeling your data with dbt"
date: "2022-10-05"
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

[dbt](https://docs.getdbt.com/) enables analytics engineers to transform data in their warehouses by simply writing select statements. 

To setup dbt, Snowplow open source users can start with the [dbt User Guide](https://docs.getdbt.com/guides/getting-started) and then we have prepared some [introduction videos](https://www.youtube.com/watch?v=1kd6BJhC4BE) for working with the Snowplow dbt packages.

For Snowplow BDP customers, currently dbt is not supported in the console, but this is in development and we expect to be able to support dbt models in BDP soon. 

# Snowplow dbt Packages

There are 3 core snowplow dbt packages:
-  [Snowplow Web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-web-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web))
-  [Snowplow Mobile](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-mobile-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile))
-  [Snowplow Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-media-player-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/overview/snowplow_media_player))

_The Snowplow Media Player package is designed to be used with the Snowplow Web package and not as a standalone package._

Each package comes with a set of standard models to take your [Snowplow tracker data](/docs/collecting-data/collecting-from-own-applications/index.md) and produce tables aggregated to levels such as Users, Sessions, and Page Views. You can also add your own models on top, see the page on [custom modules](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) for more information on how to do this.

The latest versions of all packages support BigQuery, Databricks, Postgres, Redshift, and Snowflake warehouses.


<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

| snowplow-web version | dbt versions        | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| -------------------- | ------------------- | --------- | ----------- | --------- | ---------- | --------- |
| 0.9.2                | >=1.0.0 to <2.0.0   | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.5.1                | >=0.20.0 to <1.0.0  | ✅        | ❌          | ✅        | ✅         | ✅        |
| 0.4.1                | >=0.18.0 to <0.20.0 | ✅        | ❌          | ✅        | ✅         | ❌        |
| 0.4.1                | >=0.19.0 to <0.20.0 | ❌        | ❌          | ❌        | ❌         | ✅        |

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

| snowplow-mobile version | dbt versions       | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| ----------------------- | ------------------ | --------- | ----------- | --------- | ---------- | --------- |
| 0.5.4                   | >=1.0.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.2.0                   | >=0.20.0 to <1.0.0 | ✅        | ❌          | ✅        | ✅         | ✅        |

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

| snowplow-media-player version | snowplow-web version | dbt versions       | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| ----------------------------- | -------------------- | ------------------ | --------- | ----------- | --------- | ---------- | --------- |
| 0.3.1                         | >=0.9.0 to <0.10.0   | >=1.0.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.1.0                         | >=0.6.0 to <0.7.0    | >=0.20.0 to <1.1.0 | ❌        | ❌          | ✅        | ❌         | ✅        |

</TabItem>
</Tabs>

------



