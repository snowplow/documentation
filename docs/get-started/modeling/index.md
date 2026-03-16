---
title: "Running your first data models"
sidebar_position: 7
sidebar_label: "Run a data model"
description: "Using a data model to aggregate your data"
keywords: ["data modeling", "dbt", "Unified Digital model", "data aggregation"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Querying the events table directly — as you would have done in the previous step — can be useful for exploring your events or building custom analytics. However, for many common use cases it's much easier to use our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md), which provide a pre-aggregated view of your data.

We recommend [dbt](https://www.getdbt.com/) for data modeling. Refer to the [setup instructions](/docs/modeling-your-data/running-data-models-via-console/index.md) to add and configure your models in [Snowplow Console](https://console.snowplowanalytics.com), so that they can be run automatically by Snowplow.

The [Unified Digital model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) is a good starting point for websites and/or mobile applications. It provides data about page and screen views, sessions, users, and more. You can also explore the [full list of available models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md).

If you don't have access to Snowplow Console, you'll need to install dbt and run the models yourself. Check out our [Unified Digital Quick Start tutorial](/tutorials/unified-digital/intro) for help getting started.

:::tip Using dbt
To start using our models with dbt, you will need to [create a dbt project](https://docs.getdbt.com/reference/commands/init) and [add the respective packages](https://docs.getdbt.com/docs/build/packages).
:::
