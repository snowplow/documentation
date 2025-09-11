---
title: "Custom Sessionization"
description: "Configure custom user identifiers in dbt packages for behavioral analytics identity resolution."
schema: "TechArticle"
keywords: ["Custom Identifiers", "Custom IDs", "Identifier Logic", "ID Management", "Custom Keys", "Identity Features"]
sidebar_position: 50
toc_max_heading_level: 5
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::danger

As this changes the core logic of the package, you should make sure you have a good understanding of how the [incremental sessionization logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) works (including things such as quarantining sessions), and a good certainty around the tracking of any custom fields you plan to use.

:::

Our packages come with a very robust [incremental sessionization logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) that makes sure when a session has a new event in the latest run, that _all_ events within that session are processed as part of that run to ensure all aggregations are correct and valid. There are some exceptions, such as quarantined sessions to avoid large table scans, but in general this approach ensures that you can be confident that in each run you have the full scope of a given session to process in our models, as well as any [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) you build to take advantage of this feature.

Traditionally a session in this sense has been a _true_ session i.e. it has been the `domain_sessionid` and `device_sessionid` value that has identified which events belong to the same session, however in our packages it is possible to overwrite the default field as part of the package logic and use your own session identifier, to ensure all events within a "session" are processed in the same run, whatever a "session" in this case means to you.

:::info

Throughout this page we refer to entity columns only by their major version (e.g. `com_mycompany_session_identifier_1`). If you use BigQuery, you will need to adjust these for the full version number (or use the `_*` wildcard to denote all minor versions), and may need to manage the combination of different versions yourself, details of how can be found below.

:::

:::tip

Remember that any events with a null "session" identifier will be excluded from the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table and any processing of the package, make sure your identifier has a value for all events you want to process!

:::

## Customizing session identifiers
To customize your session identifiers, you can make use of the `snowplow__session_identifiers` variable. This variable allows you to provide a list of identifiers that dbt will then try to use to create an identifying field for each session (by coalescing them in order), which will always be saved under the `session_identifier` column in your tables.

### Using additional atomic fields
For web data by default, your identifier will be the `domain_sessionid` field which is found in the atomic events table (this will vary by package). If you wanted to instead use a different field, say the `domain_userid` field that can also be found in the flat fields of the atomic events table, you could define your `snowplow__session_identifiers` as follows:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'atomic', 'field': 'domain_userid'}]
    ...
...
```

:::tip

`schema` here refers to the schemata the data was created from i.e. an atomic field, a self describing event, or an entity value. This has no relation to the database schema the table is in.

:::

If you wanted to include multiple identifiers, in case the first one is sometimes null, then you could define the `snowplow__session_identifiers` as follows:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'atomic', 'field': 'domain_userid'},
                                    {'schema': 'atomic', 'field': 'domain_sessionid'}]
    ...
...
```
This would then compile into the following SQL code:

```sql
SELECT
    ...
    COALESCE(e.domain_userid, e.domain_sessionid, NULL) as session_identifier,
...
FROM events e
```

:::info
The order in which you provide your identifiers is the order of precedence they will take in the `COALESCE` statement. In other words, in the example above the value of `domain_sessionid` will **only** be used when `domain_userid` is `NULL`. If both are `NULL`, the `session_identifier` will be `NULL` for that event, and that event will not be processed with this package.
:::

### Using custom entities
If you wanted to instead use session identifiers that come from a custom entity, you can do that as well. Let's assume you've created a session identifier entity that you attach to your events, and it's called `com_mycompany_session_identifier_1`. Let's also say you're interested in the `session_id` field of this entity as the identifier for each session. To make sure that your dbt models extract and use this field as the value for `session_identifier`, you need to define the `snowplow__session_identifiers` as follows:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1', 'field': 'session_id', 'prefix': 'si'}]
    ...
...
```
:::warning
Make sure you include a `prefix` value if you are running on **Postgres or Redshift**, as this ensures that you don't have duplicate column names somewhere in your SQL select statement. It is not required for the other warehouses, but is recommended.
:::

Similar to before, if you want to combine multiple identifiers in different (or the same) entities, you can do so by defining your `snowplow__session_identifiers` as shown below. First, however, let's assume there's another entity called `com_mycompany_logged_session_id_1` which has both a `logged_in_id` and `session_identifier` field in it. To include all of these:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [
            {'schema': 'com_mycompany_logged_session_id_1', 'field': 'logged_in_id', 'prefix': 'lsi'}, 
            {'schema': 'com_mycompany_logged_session_id_1', 'field': 'session_identifier', 'prefix': 'lsi'}, 
            {'schema': 'com_mycompany_session_identifier_1', 'field': 'session_id', 'prefix': 'si'}]
    ...
...
```
:::warning
Make sure if you include multiple fields from the same entity that you give them the same prefix.
:::

This will then render into the following SQL:
<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Databricks & Snowflake" default>

```sql
SELECT
    ...
    COALESCE(
        com_mycompany_logged_session_id_1[0].logged_in_id, 
        com_mycompany_logged_session_id_1[0].session_identifier, 
        com_mycompany_session_identifier_1[0].session_id, 
        NULL
        ) as session_identifier,
...
```

</TabItem>
<TabItem value="bigquery" label="Bigquery" default>

```sql
SELECT
    ...
    COALESCE(
        com_mycompany_logged_session_id_1_0_0[safe_offset(0)].logged_in_id, 
        com_mycompany_logged_session_id_1_0_0[safe_offset(0)].session_identifier, 
        com_mycompany_session_identifier_1_0_0[safe_offset(0)].session_id, 
        NULL
        ) as session_identifier,
...
```

</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

```sql
SELECT
    ...
    COALESCE(
        lsi_logged_in_id, 
        lsi_session_identifier, 
        si_session_id, 
        NULL
        ) as session_identifier,
...
```

Note that we will manage joining any self describing event or entity tables for you as part of the package logic.

</TabItem>
</Tabs>

Again the order of precedence being decided by the order of your list of identifiers.


### Schema evolution of custom entities

:::tip

You can use this approach for schema evolution in BigQuery for any changes, in other warehouses you would only need to do this for major version changes.

:::

This can be extended into entities where schema evolution takes place. Suppose your session identifying entity has previously always been `com_mycompany_session_identifier_1`, where you extract the `session_id` field as the identifier. Then suppose you introduce some breaking changes that cause you to now use the `com_mycompany_session_identifier_2` entity, where you extract `new_session_id` as the identifying field. In order to ensure you can track both as your session identifier, you would define your `snowplow__session_identifiers` as follows:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_2', 'field': 'new_session_id', 'prefix': 'si_t'},
                                    {'schema': 'com_mycompany_session_identifier_1', 'field': 'session_id', 'prefix': 'si_o'}]
    ...
...
```

This setup implies that the `new_session_id` from `com_mycompany_session_identifier_2` should have precedence over the `session_id` field from `com_mycompany_session_identifier_1`, meaning that if both are filled for a particular event, the `new_session_id` value would be the one present in the `session_identifier` field in your dbt tables. If you'd prefer to have the precedence swapped, you can swap the ordering in the variable in your `dbt_project.yml`.

<details>
<summary>BigQuery Version Changes</summary>

Handling minor version bumps of your schemas where this isn't automatically handled by the loader, such as in BigQuery, works in the exact same way. A small example of bumping `com_mycompany_session_identifier_1_0_0` to `com_mycompany_session_identifier_1_1_0` but leaving the `session_id` field as the key identifier would look as follows:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1_1_0', 'field': 'session_id', 'prefix': 'si_t'},
                                    {'schema': 'com_mycompany_session_identifier_1_0_0', 'field': 'session_id', 'prefix': 'si_o'}]
    ...
...
```

Alternatively you can use a `_*` in the schema name to get the field from all columns of the same major version:
```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1_*1_0*', 'field': 'session_id', 'prefix': 'si'}]
    ...
...
```

</details>


### Combining atomic fields and custom entities
Combining atomic fields and custom entities is straightforward if you're comfortable with what we described above. Let's say you want to combine the `logged_in_id` field from the `com_mycompany_logged_session_id_1` entity together with the standard `domain_sessionid` field in the `events` table. To achieve that, you would include the following in your `dbt_project.yml`:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_logged_session_id_1', 'field': 'logged_in_id', 'prefix': 'lsi'},
                                    {'schema': 'atomic', 'field': 'domain_sessionid', 'prefix': 'e'}]
    ...
...
```

### Adding your own custom session logic
If there are session identifiers that are more complicated to utilize, then you can also provide your own session logic that will be used instead of the logic explained in the preceding sections. As an example, if you would want to concat two fields to create a session identifier, or instead apply a SQL function to a field to then use as a session identifier, that is completely possible using the `snowplow__session_sql` variable.

:::info
Defining the `snowplow__session_sql` variable will ensure that the package takes it's value as the `session_identifier` **over** anything you may have defined with the `snowplow__session_identifiers` variable.
:::

:::warning
For Redshift/Postgres, if you want to leverage custom entities for your custom session logic, you will need to include them in the `snowplow__session_identifiers` variable in the same way as in previous sections to ensure they are correctly joined to the table.
:::

#### Concatenating multiple fields to create a session identifier
To start, suppose you want to combine the atomic `domain_sessionid` and `domain_userid` fields to create a session identifier. It's simple to do that by defining the following variable in your `dbt_project.yml`:

 ```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_sql: "e.domain_userid || '_' || e.domain_sessionid"
    ...
...
```

This would be parsed into the following SQL:

```sql
SELECT
    ...
    e.domain_userid || '_' || e.domain_sessionid as session_identifier,
...
```

#### Applying a SQL function to a field to use as a session identifier
Instead, suppose you want to take the `DATE` value of your `derived_tstamp` as your session identifier. It's also simple to do that by defining the following variable in your `dbt_project.yml`:

 ```yml title="dbt_project.yml"
vars:
    ...
    snowplow__session_sql: "DATE(e.derived_tstamp)"
    ...
```

This would be parsed into the following SQL:

```sql
SELECT
    ...
    DATE(e.derived_tstamp) as session_identifier,
...
```
