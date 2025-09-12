---
title: "Incorporating non-snowplow data"
description: "Incorporate external data sources into dbt behavioral analytics models for comprehensive analysis."
schema: "TechArticle"
keywords: ["External Data", "Third Party", "Non Snowplow", "Data Integration", "External Sources", "Data Blending"]
sidebar_position: 100
---

There may be times when you wish to add some fields to our derived tables that are not coming from the events table itself but from your own external data sources.

Our packages are designed to process events associated to sessions, based on newly incoming events from the `atomic.events` table. Allowing for incorporating external data into the processing by default is not planned so far, not only because there can be a myriad of ways how different users would want to link their data to our events/sessions, but also because the package would then need some sort of governance over the data source being readily available for the period to be processed, which it has no impact over. However, there is a way to accomplish that through custom models.

**Example Scenario 1:**
Imagine you run an e-commerce site, and you are only tracking the products` SKU, but you have an internal table with richer information about the particular product. You would like to add some extra information to your views table through the custom page_view context.

**Example Scenario 2:**
Wanting to incorporate additional user based information into the sessions table with the use of the external User Profiles table.

In both cases what you could do is follow the recommendations on [adding a custom derived table](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/examples/adding-fields-to-derived-table/index.md#option-3:-custom-derived-table), basically by disabling the package provided derived table, copying the content of the existing derived table as is, which is normally just a select * from the upstream this_run table.

:::info

You might want to add extra safety measures to avoid misaligned data between the package and the table you want to bring data from. Consider using a pre-hook that you can add to the config section of your derived table for instance. Update schedules would also need to be synced for a hassle-free run and consider the impact when there are changes, refreshes to the source table, in case you need to run a full or partial refresh afterwards.
:::

When modifying the model you would typically want to add left joins using the key that makes sense for your use case (e.g. user_identifier, session_identifier, view_id etc.) and list the additional field(s) which you would like to be incorporated. As long as you keep a `this_run` table as a basis and select everything from it, and also tag your custom model as `snowplow_{{package_name}}_incremental` it will become part of the run and the package will keep everything in sync through the manifest table. 

Bear in mind that if you make changes to the Sessions table, you might break the Users table in the Unified Digital package depending on the changes as the Users table is built on top of the Sessions table (e.g. it is generally safe to add more fields (be careful about name clashes), though you might also need to add them as a [passthrough field](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/passthrough-fields/index.md) for them to show up in the Users table, but probably not to remove them, best to test it first), otherwise they are safe to update independently. 

:::info Lineage Graph
You can inspect the lineage graph to verify this if you are unsure by using dbt's built in data lineage feature through dbt docs. We also update that for each of our latest releases on github: https://snowplow.github.io/dbt-snowplow-unified/#!/overview?g_v=1
:::
