---
title: Install dbt package
position: 10
---

The [snowplow-ecommerce dbt package](https://hub.getdbt.com/snowplow/snowplow_ecommerce/latest/) transforms and aggregates the raw ecommerce event data collected from the Snowplow JavaScript tracker into a set of derived tables including carts, transactions, and products. Modeling the data makes it easier to digest and derive business value from the Snowplow data either through AI or BI.

:::note
Ensure you have set up a new dbt project using [`dbt init`](https://docs.getdbt.com/reference/commands/init) and validated your connection using [`dbt debug`](https://docs.getdbt.com/reference/commands/debug) before adding our package. All commands should be run in the directory of this project.
:::

## Add snowplow-ecommerce package

Add the snowplow-ecommerce package to your `packages.yml` file, which you may have to create at the same level as your `dbt_project.yml` file. The latest version of our package can be found [here](https://hub.getdbt.com/snowplow/snowplow_ecommerce/latest/).

```yml
packages:
  - package: snowplow/snowplow_ecommerce
    version: [">=0.6.0", "<0.7.0"]
```

## Install the package

Install the package by running:

```bash
dbt deps
```

Once this is done, you can find our package in the newly created `dbt_packages` folder. You can read more about the package, including some optional features and modules not detailed within this accelerator by checking out [our docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/).

The package is now ready to be configured and run with your ecommerce tracking data.
