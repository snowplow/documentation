---
title: "Dispatch setup"
description: "Macro dispatch mechanism in dbt packages for behavioral data processing across different warehouses."
schema: "TechArticle"
keywords: ["DBT Dispatch", "Macro Dispatch", "Function Dispatch", "DBT Routing", "Macro Selection", "DBT Framework"]
sidebar_position: 30
---

Some of the functionality of our packages overwrites the default functionality of dbt core. To enable the use of our version over dbt, you must add the following must be added to your `dbt_project.yml` file once.

```yml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

This will ensure that, when it exists, our version of a macro is used over the dbt-core version.
