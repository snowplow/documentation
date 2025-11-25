---
title: "Modeling your data with dbt"
description: "Information for our dbt packages including quickstarts, configurations, and building custom models."
sidebar_position: 1
---

[dbt](https://docs.getdbt.com/) enables analytics engineers to transform data in their warehouses by simply writing select statements. Snowplow has written and maintain a number of dbt packages to model your snowplow data for various purposes and produce derived tables for use in analytics, AI, ML, BI, or reverse ETL tools.

Using Snowplow's dbt packages means you can draw insight and value from your data *quicker*, *easier*, and *cheaper* than building your own modeling from scratch.

<p align="center">
<ThemedImage
alt='Snowplow Data Modeling Packages'
width="70%"
sources={{
light: require('./images/dbt_packages-light.drawio.png').default,
dark: require('./images/dbt_packages-dark.drawio.png').default
}}
/>
</p>


To set up dbt, Snowplow Self-Hosted users can start with the [dbt User Guide](https://docs.getdbt.com/guides/getting-started) and then we have prepared some [introduction videos](https://www.youtube.com/watch?v=1kd6BJhC4BE) for working with the Snowplow dbt packages.

For Snowplow CDI customers, dbt projects can be configured and scheduled in the console meaning you can [get started](/docs/modeling-your-data/running-data-models-via-console/dbt/index.md) running dbt models alongside your Snowplow pipelines.


## Snowplow dbt Packages

:::info

Our dbt packages are available under a mix of licenses. For more information about how to get access to these packages, please contact us by requesting a demo if you are new to Snowplow or by reaching out to our support team.

:::


Our dbt packages come with powerful built-in features such as an [optimization to the incremental materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/optimized-upserts/index.md) to save you cost on warehouse compute resources compared to the standard method, a custom [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) to ensure we process just the required data for each run and keep your models in sync, plus the ability to build your own custom models using both of these!

There are 4 core snowplow dbt packages:
- [Snowplow Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-unified/#!/overview/snowplow_unified)): for modeling your web and mobile data for page and screen views, sessions, users, and consent
- [Snowplow Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/overview/snowplow_media_player)): for modeling your media elements for play statistics
- [Snowplow E-commerce](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/overview/snowplow_ecommerce)): for modeling your E-commerce interactions across carts, products, checkouts, and transactions
- [Snowplow Attribution](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-attribution/#!/overview/attribution)): used for Attribution Modeling with Snowplow

We also have 2 utility packages:
- [Snowplow Normalize](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-normalize-data-model/index.md) package that makes it easy for you to build models that transform your events data into a different structure that may be better suited for downstream consumers
- [Snowplow Utils](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/index.md) contains all our shared macros and features used across our packages

There are also 3 legacy dbt packages for web, mobile (superseded by unified) and fractribution (superseeded by attribution):
- [Snowplow Web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web)): for modeling your web data for page views, sessions, users, and consent
- [Snowplow Mobile](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-mobile-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile)): for modeling your mobile app data for screen views, sessions, users, and crashes
- [Snowplow Fractribution](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-fractribution-data-model/index.md) ([dbt model docs](https://snowplow.github.io/dbt-snowplow-fractribution/#!/overview/fractribution)): used for Attribution Modeling with Snowplow


Each package comes with a set of standard models to take your [Snowplow tracker data](/docs/sources/trackers/index.md) and produce tables aggregated to different levels, or to perform analysis for you. You can also add your own models on top, see the page on [custom modules](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) for more information on how to do this.



The supported data warehouses per version can be seen below:

```mdx-code-block
import ModelVersions from './_model-versions.md'

<ModelVersions/>
```

## dbt Version Compatibility Checker

You may be using other dbt packages that require you to use a specific version of dbt, or a specific version of the `dbt_utils` package. Or you simply may not wish to upgrade your existing setup.

Here’s a way to check the latest version of our packages you can install for a given setup. Simply enter your dbt version and (optionally) `dbt_utils` version below.

```mdx-code-block
import DbtVersionChecker from "@site/src/components/DbtVersionChecker"

<DbtVersionChecker/>
```
