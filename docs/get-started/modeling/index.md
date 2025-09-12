---
title: "Running your first data models"
sidebar_position: 7
sidebar_label: "Run a data model"
description: "Introduction to data modeling concepts and approaches for transforming behavioral events into analytics insights."
schema: "TechArticle"
keywords: ["Data Modeling", "Getting Started", "Model Introduction", "Analytics Modeling", "Data Transformation", "Model Basics"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Querying the events table directly — as you would have done in the previous step — can be useful for exploring your events or building custom analytics. However, for many common use cases it’s much easier to use our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md), which provide a pre-aggregated view of your data.

We recommend [dbt](https://www.getdbt.com/) for data modeling. Here’s how to get started.

<Tabs groupId="offering" queryString>
  <TabItem value="enterprise" label="BDP Enterprise" default>

Refer to the [setup instructions](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/index.md) to add and configure your models in the Console, so that they can be run automatically by Snowplow BDP.

  </TabItem>
  <TabItem value="cloud" label="BDP Cloud">

Refer to the [setup instructions](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/index.md) to add and configure your models in the Console, so that they can be run automatically by Snowplow BDP.

  </TabItem>
  <TabItem value="community" label="Community Edition">

You will need to install dbt and run the models yourself — see the “quick start” links below.

  </TabItem>
</Tabs>

Next, add your first model:
* The [Unified Digital model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) is a good starting point for websites and/or mobile applications, providing data about page and screen views, sessions, users, and more ([quick start guide](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/unified/index.md))

You can also explore the [full list of available models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md).

:::tip Using dbt

To start using our models with dbt, you will need to [create a dbt project](https://docs.getdbt.com/reference/commands/init) and [add the respective packages](https://docs.getdbt.com/docs/build/packages).

:::
