---
title: "Model selection"
description: "Select and run specific dbt models for targeted behavioral data transformation workflows."
schema: "TechArticle"
keywords: ["Model Selection", "DBT Selection", "Model Targeting", "DBT Filter", "Model Scope", "DBT Targeting"]
sidebar_position: 30
---

The Snowplow models in each package are designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, run the model using:

```bash
dbt run --select snowplow_<package> tag:snowplow_<package>_incremental
```
The `snowplow_<package>` selection will execute all nodes within the relevant Snowplow package, while the `tag:snowplow_<package>_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the YAML selectors we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_<package>
```

Within the packages we have provided a suite of suggested selectors to run and test the models within the packages. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax).

These are defined in each `selectors.yml` file within the packages, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.
