---
title: "Dispatch setup for dbt packages"
sidebar_label: "Dispatch setup"
description: "Details on how to setup the dispatch order for macros"
keywords: ["dbt dispatch", "macro dispatch", "dispatch order", "macro overrides"]
sidebar_position: 30
---

Some of the functionality of our packages overwrites the default functionality of dbt core. To enable the use of our version over dbt, you must add the following must be added to your `dbt_project.yml` file once.

```yml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

This will ensure that, when it exists, our version of a macro is used over the dbt-core version.
