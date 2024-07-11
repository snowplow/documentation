---
title: "Additional SQL on events this run"
description: "Details on how to add sql to the events this run table"
sidebar_position: 40
---

There may be times when the [events this run table](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) requires additional fields on it for you to make use of to [add to your derived tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/examples/adding-fields-to-derived-table/index.md). It is not recommended to alter this model directly, as it is a core part of the packages, but you can use the `snowplow__custom_sql` variable in packages that support it to add custom sql into the `select` block of the events this run model.

To find out if your package supports this, check the [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) page.

## Using `snowplow__custom_sql`
The `snowplow__custom_sql` variable is passed as-is through to the `select` block of the events this run macro [<Icon icon="fa-brands fa-github"/>](https://github.com/snowplow/dbt-snowplow-utils/blob/19bfd655fea1338f28cd6b2f8ca5863cc137aac7/macros/base/base_create_snowplow_events_this_run.sql#L39). Because of where this is passed in, fields such as the session and user identifiers are not available at this point, but any other field should be. In the case of Redshift any self-describing events or entities provided in the [`snowplow__entities_or_sdes` variable](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md) will be available with the provided prefix and table alias.

Say you wanted to add a calculated field based on your app id, you would set this as such:
```yml title="dbt_project.yml"
...
vars:
  snowplow_<package_name>:
    snowplow__custom_sql: "case when app_id like '%_test' then 'test' else 'prod' end as app_type"
...
```

### Utilizing custom contexts or SDEs

Suppose you have a custom context called `contexts_com_mycompany_click_1` which contains a `click_id` that you want to concat with Snowplow's `domain_sessionid`. If you want to make this available in the events this run table directly you could do the following:

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

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


### Adding multiple fields

If you'd like to add multiple lines of SQL, you can do that as well by making this string a multi-line string, ending each non-final line with a comma. You can do that as follows:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__custom_sql: |
        com_mycompany_click_1.click_id || '_' || domain_sessionid as click_session_id,
        case when app_id like '%_test' then 'test' else 'prod' end as app_type
    ...
...
```
