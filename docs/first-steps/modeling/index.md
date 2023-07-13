---
title: "Running your first data models"
sidebar_position: 5
sidebar_label: "Modeling data"
description: "Using a data model to aggregate your data"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Querying the events table directly — as you would have done in the previous step — can be useful for exploring your events or building custom analytics. However, for many common use cases it’s much easier to use our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md), which provide a pre-aggregated view of your data.

We recommend [dbt](https://www.getdbt.com/) for data modeling. Here’s how to get started.

<Tabs groupId="offering" queryString>
  <TabItem value="enterprise" label="BDP Enterprise" default>

Refer to the [setup instructions](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/dbt/using-dbt/index.md) to add and configure your models in the Console, so that they can be run automatically by Snowplow BDP.

  </TabItem>
  <TabItem value="cloud" label="BDP Cloud">

You will need to install dbt and run the models yourself — see the “quick start” links below.

  </TabItem>
  <TabItem value="try" label="Try Snowplow">

You will need to install dbt and run the models yourself — see the “quick start” links below.

  </TabItem>
  <TabItem value="opensource" label="Open Source">

You will need to install dbt and run the models yourself — see the “quick start” links below.

  </TabItem>
</Tabs>

Next, add your first model:
* The [Web model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md) is a good starting point for websites, providing data about page views, sessions, users, and more ([quick start guide](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/web/index.md))
* The [Mobile model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/mobile/index.md) is a good starting point for mobile applications, providing data about screen views, sessions, users, and more ([quick start guide](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/mobile/index.md))

You can also explore the [full list of available models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md).

:::tip Using dbt

To start using our models with dbt, you will need to [create a dbt project](https://docs.getdbt.com/reference/commands/init) and [add the respective packages](https://docs.getdbt.com/docs/build/packages).

:::
