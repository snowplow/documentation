---
title: Install the Snowplow Unified Digital dbt package
position: 3
---

The [snowplow-unified dbt package](https://hub.getdbt.com/snowplow/snowplow_unified/latest/) transforms and aggregates the raw web event data collected from the [Snowplow JavaScript tracker](https://github.com/snowplow/snowplow-javascript-tracker) into a set of derived tables for page views, sessions, and users. This package supersedes the deprecated snowplow-web package and provides a unified approach for modeling both web and mobile data. Modeling the data makes it easier to digest and derive business value from the Snowplow data either through AI or BI.

In this section you will learn how to set up and run the snowplow-unified package to model the sample data.

Ensure you have set up a new dbt project using [`dbt init`](https://docs.getdbt.com/reference/commands/init) and validate your connection project using [`dbt debug`](https://docs.getdbt.com/reference/commands/debug) before adding our package. All commands should be run in the directory of this project.

You are going to be adding our `snowplow_unified` package to your fresh project. This will mean your project is able to run all our models, but will keep our package in the `dbt_packages` folder to keep your project clean and organized.

## Add snowplow-unified package

Add the snowplow-unified package to your `packages.yml` file, which you may have to create at the same level as your `dbt_project.yml` file. The latest version of our package can be found [here](https://hub.getdbt.com/snowplow/snowplow_unified/latest/).

```yml
packages:
  - package: snowplow/snowplow_unified
    version: [">=0.4.0"]
```

## Install the package

Install the package by running:

```bash
dbt deps
```

Once this is done, you can find our package in the newly created `dbt_packages` folder. You can read more about the package, including some optional features and modules not detailed within this tutorial by checking out [our docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/).
