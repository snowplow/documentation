---
title: "Disabling models"
description: "Disable and manage dbt models for behavioral data processing workflow optimization."
schema: "TechArticle"
keywords: ["Disable Models", "DBT Control", "Model Management", "DBT Configuration", "Model Toggle", "DBT Settings"]
sidebar_position: 40
---

If you do not require certain modules provided by the package you have the option to disable them using the [model configuration](https://docs.getdbt.com/reference/resource-configs/enabled) in your project yaml. For instance to disable the users module in the `snowplow_unified` package:

```yml title="dbt_project.yml"
models:
  snowplow_unified:
    users:
      enabled: false
```

For other models, you can identify the path to the models in your `dbt_packages` folder in your project. Note you should disable the entire folder, now just the derived model itself otherwise the [this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#other-this-run-tables) tables will still process each run.

:::tip

Any dependent modules will also need to be disabled - for instance if you disabled the sessions module in the unified package, you will also have to disable the users module.

:::
