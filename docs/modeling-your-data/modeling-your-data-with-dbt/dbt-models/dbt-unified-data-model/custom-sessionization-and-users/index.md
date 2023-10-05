---
title: "Custom Sessionization & Users"
sidebar_position: 500
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info

Custom Sessionization & Users are a feature only available in the web package versions 0.16.0 and higher

:::

:::danger

As this changes the core logic of the package, you should make sure you have a good understanding of how the incremental sessionization logic works (including things such as quarantining sessions), and a good certainty around the tracking of any custom fields you plan to use.

:::


Our packages come with a very robust [incremental sessionization logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/) that makes sure when a session has a new event in the latest run, that _all_ events within that session are processed as part of that run to ensure all aggregations are correct and valid. There are some exceptions, such as quarantined sessions to avoid large table scans, but in general this approach ensures that you can be confident that in each run you have the full scope of a given session to process in our models, as well as any [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) you build to take advantage of this feature.

Traditionally a session in this sense has been a _true_ session i.e. it has been the `domain_sessionid` and `device_sessionid` value that has identified which events belong to the same session, however over time this became a limitation of the Snowplow packages as users wanted to define their session using a different field or logic, which meant they were unable to use our packages and take advantage of the complex ground work we provided. In this package it is possible to overwrite the default `domain_sessionid` or `decice_sessionid` field as part of the package logic and use your own session identifier, to ensure all events within a "session" are processed in the same run, whatever a "session" in this case means to you.

## Examples

A deeper set of documentation is available in the [Advanced Usage of Snowplow Utils](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md?warehouse=redshift%2Bpostgres#utilizing-custom-contexts-or-sdes) page, including how to provide a hierarchy of fields in case one is null, but here are two short example showcasing how you can use a field in a custom context, and how you can provide custom SQL to create your "session" identifier.

:::tip

Remember that any events with a null "session" identifier will be excluded from the `snowplow_base_events_this_run` table and any processing of the package, make sure your identifier has a value for all events you want to process!

:::



#### Custom Context

This example uses a field called `session_id` in your `com_mycompany_session_identifier_1` context and will use this as the value in your `domain_sessionid` field for all tables (excluding the manifest tables, which uses a column named `session_identifier`).

<Tabs groupId="warehouse" queryString>
<TabItem value="bigquery" label="Bigquery" default>

```yml title="dbt_project.yml"
vars:
    snowplow_unified:
        snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1_*', 'field': 'session_id'}]
```

:::info
Note that for BigQuery, if you have multiple minor versions of a schema that you would like included (e.g. `com_mycompany_session_identifier_1_0_2`, `com_mycompany_session_identifier_1_0_1`, `com_mycompany_session_identifier_1_0_0`) you can specify that by including a trailing `_*` on the context schema that you'd like to include, and the package will automatically find all matching schemas and coalesce them.
:::
</TabItem>
<TabItem value="databricks" label="Databricks" default>

```yml title="dbt_project.yml"
vars:
    snowplow_unified:
        snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1', 'field': 'session_id'}]
```
</TabItem>
<TabItem value="redshift" label="Redshift & Postgres" default>

```yml title="dbt_project.yml"
vars:
    snowplow_unified:
        snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1', 'field': 'session_id', 'prefix': 'si'}]
```
</TabItem>
<TabItem value="snowflake" label="Snowflake" default>

```yml title="dbt_project.yml"
vars:
    snowplow_unified:
        snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1', 'field': 'sessionId'}]
```
</TabItem>
</Tabs>

#### Custom SQL

This example creates a session identifier based off the combination of `app_id` and `domain_sessionid` which you may want if you use cross-domain tracking, but want to split the sessions for your analysis. Note that if you provide a value for `snowplow__session_sql` this will be used instead of `snowplow__session_identifiers`.

```yml title="dbt_project.yml"
vars:
    snowplow_unified:
        snowplow__session_sql: 'app_id || domain_sessionid'
```

The same approaches can be taken to provide a custom `domain_userid` overwrite as well, using the `snowplow__user_identifiers`/`snowplow__user_sql` variables.
