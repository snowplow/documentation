---
title: "Additional SQL on events this run"
description: "Details on how to add sql to the events this run table"
sidebar_position: 5
---
RHTODO
### Utilizing custom contexts or SDEs
Suppose you have a custom context called `contexts_com_mycompany_click_1` which contains a `click_id` that you want to concat with Snowplow's `domain_sessionid`. You could either do this concatenation when creating your own data models, but if you want to surface this to all of your data models downstream from Snowplow's initial data processing in it's dbt packages, you can add that transformation by adding the following to your `dbt_project.yml`:

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks+snowflake" label="Databricks & Snowflake" default>

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__custom_sql: "CONCAT(com_mycompany_click_1[0].click_id, '_', domain_sessionid) as click_session_id"
    ...
...
```
</TabItem>
<TabItem value="bigquery" label="BigQuery" default>

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__custom_sql: "CONCAT(com_mycompany_click_1[safe_offset(0)].click_id, '_', domain_sessionid) as click_session_id"
    ...
...
```
</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__custom_sql: "com_mycompany_click_1.click_id || '_' || domain_sessionid as click_session_id"
    ...
...
```
</TabItem>
</Tabs>

Any SQL included in the `snowplow__custom_sql` will be found in your `snowplow_base_events_this_run` table, and will be referenced at the end of the select statement, so there's no need to add a trailing comma. Any of the newly created fields can also be passed through to other tables created automatically by Snowplow's dbt packages using the `passthrough` variables provided in those packages.
If you'd like to add multiple lines of SQL, you can do that as well by making this string a multi-line string. You can do that as follows:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__custom_sql: |
        com_mycompany_click_1.click_id || '_' || domain_sessionid as click_session_id,
        COALESCE(com_mycompany_click_1.session_index, domain_sessionidx) as session_index
    ...
...
```
