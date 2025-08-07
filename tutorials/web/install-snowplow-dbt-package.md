---
title: Install the Snowplow dbt package
position: 3
---

The [snowplow-web dbt package](https://hub.getdbt.com/snowplow/snowplow_web/latest/) transforms and aggregates the raw web event data collected from the [Snowplow JavaScript tracker](https://github.com/snowplow/snowplow-javascript-tracker) into a set of derived tables for page views, sessions, and users. Modeling the data makes it easier to digest and derive business value from the Snowplow data either through AI or BI.

In this section you will learn how to set up and run the snowplow-web package to model the sample data.

Ensure you have set up a new dbt project using [`dbt init`](https://docs.getdbt.com/reference/commands/init) and validate your connection project using [`dbt debug`](https://docs.getdbt.com/reference/commands/debug) before adding our package. All commands should be run in the directory of this project.

You are going to be adding our `snowplow_web` package to your fresh project. This will mean your project is able to run all our models, but will keep our package in the `dbt_packages` folder to keep your project clean and organized.

## Add snowplow-web package

Add the snowplow-web package to your `packages.yml` file, which you may have to create at the same level as your `dbt_project.yml` file. The latest version of our package can be found [here](https://hub.getdbt.com/snowplow/snowplow_web/latest/).

```yml
packages:
  - package: snowplow/snowplow_web
    version: [">=0.16.0", "<0.17.0"]
```

## Install the package

Install the package by running:

```bash
dbt deps
```

Once this is done, you can find our package in the newly created `dbt_packages` folder. You can read more about the package, including some optional features and modules not detailed within this tutorial by checking out [our docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/).
