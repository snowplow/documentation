---
title: "Modeling your data with dbt"
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';
```

[dbt](https://docs.getdbt.com/) enables analytics engineers to transform data in their warehouses by simply writing select statements. Snowplow has written and maintain a number of dbt packages to model your snowplow data for various purposes and produce derived tables for use in analytics, AI, ML, BI, or reverse ETL tools.

<center>
<ThemedImage 
alt='Snowplow Data Modeling Packages'
width="70%"
sources={{
light: require('./images/dbt_packages-light.drawio.png').default, 
dark: require('./images/dbt_packages-dark.drawio.png').default
}}
/>
</center>


To setup dbt, Snowplow open source users can start with the [dbt User Guide](https://docs.getdbt.com/guides/getting-started) and then we have prepared some [introduction videos](https://www.youtube.com/watch?v=1kd6BJhC4BE) for working with the Snowplow dbt packages.

For Snowplow BDP customers, dbt projects can be configured and scheduled in the console meaning you can [get started](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/dbt/index.md) running dbt models alongside your Snowplow pipelines.


# Snowplow dbt Packages

There are 5 core snowplow dbt packages:
- [Snowplow Web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web)): for modeling your web data for page views, sessions, users, and consent
- [Snowplow Mobile](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-mobile-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile)): for modeling your mobile app data for screen views, sessions, users, and crashes
- [Snowplow Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/overview/snowplow_media_player)): for modeling your (web-based) media elements for play statistics
- [Snowplow E-commerce](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/overview/snowplow_ecommerce)): for modeling your (web-based) E-commerce interactions across carts, products, checkouts, and transactions
- [Snowplow Fractribution](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-fractribution-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-fractribution/#!/overview/fractribution)): for computing fractional attribution of marketing campaigns

_The Snowplow Media Player package is designed to be used with the Snowplow Web package and not as a standalone package._

Each package comes with a set of standard models to take your [Snowplow tracker data](/docs/collecting-data/collecting-from-own-applications/index.md) and produce tables aggregated to different levels, or to perform analysis for you. You can also add your own models on top, see the page on [custom modules](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) for more information on how to do this.

In addition to the other packages, there is a [Normalize](docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-normalize-data-model/index.md) package that makes it easy for you to build models that transform your events data into a different structure that may be better suited for downstream consumers.

The supported data warehouses per version can be seen below:


<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

| snowplow-web version | dbt versions        | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| -------------------- | ------------------- | --------- | ----------- | --------- | ---------- | --------- |
| 0.13.0              | >=1.3.0 to <2.0.0   | ✅        | ✅            | ✅        | ✅         | ✅          |
| 0.11.0              | >=1.0.0 to <1.3.0   | ✅        | ✅            | ✅        | ✅         | ✅          |
| 0.5.1                | >=0.20.0 to <1.0.0  | ✅        | ❌            | ✅        | ✅         | ✅          |
| 0.4.1                | >=0.18.0 to <0.20.0 | ✅        | ❌            | ✅        | ✅         | ❌          |

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

| snowplow-mobile version | dbt versions       | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| ----------------------- | ------------------ | --------- | ----------- | --------- | ---------- | --------- |
| 0.6.2                   | >=1.3.0 to <2.0.0  | ✅          | ✅          | ✅        | ✅           | ✅        |
| 0.5.5                   | >=1.0.0 to <1.3.0  | ✅          | ✅          | ✅        | ✅           | ✅        |
| 0.2.0                   | >=0.20.0 to <1.0.0 | ✅          | ❌          | ✅        | ✅           | ✅        |

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

| snowplow-media-player version | snowplow-web version | dbt versions       | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ----------------------------- | -------------------- | ------------------ | -------- | ---------- | -------- | --------- | -------- |
| 0.4.1                         | >=0.12.0 to <0.13.0   | >=1.3.0 to <2.0.0  | ✅       | ✅          | ✅       | ✅        | ✅        |
| 0.3.4                         | >=0.9.0 to <0.12.0   | >=1.0.0 to <1.3.0  | ✅       | ✅          | ✅       | ✅        | ✅        |
| 0.1.0                         | >=0.6.0 to <0.7.0    | >=0.20.0 to <1.1.0 | ❌       | ❌          | ✅       | ❌        | ✅        |

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">

| snowplow-normalize version | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ----------------------------- | ----------------- | -------- | ---------- | -------- | --------- | -------- |
| 0.2.1                         | >=1.3.0 to <2.0.0 | ✅        | ✅        | ❌        | ✅        | ❌        |
| 0.1.0                         | >=1.0.0 to <2.0.0 | ✅        | ✅        | ❌        | ✅        | ❌        |

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

| snowplow-ecommerce version | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------- | ----------------- | -------- | ---------- | -------- | --------- | -------- |
| 0.3.0                      | >=1.3.0 to <2.0.0 | ✅        | ✅        | ❌       | ✅        | ❌       |
| 0.2.1                      | >=1.0.0 to <2.0.0 | ✅        | ✅        | ❌       | ✅        | ❌       |

</TabItem>

<TabItem value="fractribution" label="Snowplow Fractribution">

| snowplow-fractribution version | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ----------------------------- | ----------------- | -------- | ---------- | -------- | --------- | -------- |
| 0.2.0                         |  >=1.0.0 to <2.0.0 | ✅       |  ✅       | ❌       | ✅       | ❌        |
| 0.1.0                         |  >=1.0.0 to <2.0.0 | ❌       |  ❌       | ❌       | ✅       | ❌        |

</TabItem>
</Tabs>
