---
title: Install fractribution package
position: 3
---

In this section you are going to be adding our `snowplow_fractribution` package to your fresh project. This will mean your project is able to run all our models, but will keep our package in the `dbt_packages` folder to keep your project clean and organized.

:::note
Ensure you have set up a new dbt project using [`dbt init`](https://docs.getdbt.com/reference/commands/init) and validated your connection using [`dbt debug`](https://docs.getdbt.com/reference/commands/debug) before adding our package. All commands should be run in the directory of this project.
:::

## Add snowplow_fractribution package

Add the latest snowplow_fractribution `packages.yml` file, which you may have to create at the same level as your `dbt_project.yml` file. The latest version of our package can be found [here](https://hub.getdbt.com/snowplow/snowplow_fractribution/latest/). You should already have the snowplow_web package present in the `packages.yml` file.

```yml
packages:
  - package: snowplow/snowplow_fractribution
    version: [">=0.3.0", "<0.4.0"]
  - package: snowplow/snowplow_web
    version: [">=0.15.0", "<0.16.0"]
```

## Install the package

Install the package by running:

```bash
dbt deps
```

Once this is done, you can find our package in the `dbt_packages` folder. You can read more about the package, including some optional features and modules not detailed within this tutorial by checking out [our docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-fractribution-data-model/).
