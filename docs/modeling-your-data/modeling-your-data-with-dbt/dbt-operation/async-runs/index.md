---
title: "Run modules asynchronously"
sidebar_label: "Asynchronous runs"
sidebar_position: 60
description: "Run dbt package modules asynchronously at different intervals using session identifiers and selective model execution."
keywords: ["async dbt runs", "asynchronous model execution", "dbt scheduling"]
---

You may wish to run the modules asynchronously, for instance run the views module hourly but the sessions and users modules daily. You would assume this could be achieved using e.g.:

```bash title="Do not do this"
dbt run --select +snowplow_web.page_views
```

However, due to the models being listed in the [manifest table](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/index.md) we would need to know which models are included in this at run time; this is not currently possible. Instead all models from the standard and custom modules are selected from the manifest table and the package will attempt to synchronize all models. This makes the above command unsuitable for asynchronous runs.

However you can leverage dbt's `ls` command in conjunction with shell substitution to explicitly state what models to run, allowing a subset of models to be selected from the manifest and thus run independently.

For example to run just the page views module asynchronously:

```bash title="Do this instead"
dbt run --select +snowplow_unified.views --vars "{'models_to_run': '$(dbt ls --select +snowplow_unified.views --output name | tail -n +4)'}"
```

:::note

The `| tail -n +4` simply removes the dbt logging front matter from the output

:::
