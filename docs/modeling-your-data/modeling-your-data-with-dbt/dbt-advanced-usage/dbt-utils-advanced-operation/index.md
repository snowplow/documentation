---
title: "Advanced utilization of Snowplow utils base functionality"
description: "Details on how to customise your Snowplow data models while leveraging the macros provided in the Snowplow utils dbt package."
sidebar_position: 500
toc_max_heading_level: 5
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The general idea behind the Snowplow-utils base functionality is to be able to add custom identifiers, bespoke behaviour, and customize naming Snowplow tables that get created as part of the incremental process. Here you can get a better understanding of what kinds of behaviours the package supports, how those scenarios actually work in terms of implementation, and a better understanding of all of the variables that can be used for these macros to unlock the full customization capability that has been built into the Snowplow-utils base functionality.

## Preface
:::info
If you are interfacing directly with the macros provided in the Snowplow utils dbt package, then you do not need to leverage the variable names provided in this documentation. Below you'll find a table which maps the variable names we use in this document with the argument names that the provided macros use, so that you can more easily understand which variables are responsible for which customizations.
:::

| Variable Name (Documentation) | Argument Name (Macro) |
| ----------------------- | ----------------------------- |
| `snowplow__session_identifiers` | `session_identifiers` |
| `snowplow__user_identifiers` | `user_identifiers` |
| `snowplow__custom_sql` | `custom_sql ` |
| `snowplow__entities_or_sdes` | `entities_or_sdes` |

## Usage
These macros exist to extend the functionality and customizability of your Snowplow data and by extension the Snowplow packages. This also allows you to leverage the benefit of the Snowplow incremental framework without necessarily using Snowplow's packages that are pre-built for specific use-cases. Equally, this could be used to overwrite certain pre-existing logic in Snowplow's other dbt packages.

The way this is intended to be used is by either calling the macros that are highlighted here directly in your `.sql` files as part of the models in your dbt project, or by defining variables within your `dbt_project.yml` which are being leveraged by Snowplow's other dbt packages. For more information, you can see the following demo projects that highlight how this might be used [here](https://github.com/snowplow-incubator/dbt-example-project).

## Adding custom identifiers
Adding custom identifiers allows you to decide how to identify sessions and users. By default, this is done using some variation of a `domain_sessionid` and `domain_userid` for sessions and users respectively, but there could be scenarios where you want to use your own custom identifiers that are embedded in global contexts to be modeled against. Rather than having to re-write your own data models, you can leverage some Snowplow provided variables in dbt to do the heavy lifting for you. Below you'll find two scenarios for customizing session and user identifiers, but these work in analogous ways.
### Customizing session identifiers
To customize your session identifiers, you can make use of the `snowplow__session_identifiers` variable and define it in your project. This variable allows you to provide a list of identifiers that dbt will then try to use to create an identifying field for each session, which will always be saved under the `session_identifier` column in your tables.
#### Using additional atomic fields
By default, your identifier will be the `domain_sessionid` field which is found in the atomic events table. If you wanted to instead use a different field, say the `domain_userid` field that can be found in the atomic events table, you could define your `snowplow__session_identifiers` as follows:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'atomic', 'field': 'domain_userid'}]
    ...
...
```

If you wanted to include multiple identifiers, then you could define the `snowplow__session_identifiers` as follows:

```yml
# dbt_project.yml
...
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

#### Using custom contexts
If you wanted to instead use session identifiers that come from a custom context, you can do that as well. Let's assume you've created a session identifier context that you attach to your events, and it's called `com_mycompany_session_identifier_1_0_0`. Let's also say you're interested in the `session_id` field of this context as the identifier for each session. To make sure that your dbt models extract and use this field as the value for `session_identifier`, you need to define the `snowplow__session_identifiers` as follows:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1_0_0', 'field': 'session_id', 'prefix': 'si'}]
    ...
...
```
:::warning
Make sure you include a `prefix` value if you are running on **Postgres or Redshift**, as this ensures that you don't have duplicate column names somewhere in your SQL select statement. It is not required for the other warehouses.
:::

Similar to before, if you want to combine multiple identifiers in different (or the same) contexts, you can do so by defining your `snowplow__session_identifiers` as shown below. First, however, let's assume there's another context called `com_mycompany_logged_session_id_1_0_0` which has both a `logged_in_id` and `session_identifier` field in it. To include all of these:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_logged_session_id_1_0_0', 'field': 'logged_in_id', 'prefix': 'lsi'}, {'schema': 'com_mycompany_logged_session_id_1_0_0', 'field': 'session_identifier', 'prefix': 'lsi'}, {'schema': 'com_mycompany_session_identifier_1_0_0', 'field': 'session_id', 'prefix': 'si'}]
    ...
...
```
:::warning
Make sure you include a `prefix` value if you are running on **Postgres or Redshift**, as this ensures that you don't have duplicate column names somewhere in your SQL select statement. It is not required for the other warehouses.
:::

This will then render into the following SQL:
<Tabs groupId="warehouse" queryString>
<TabItem value="databricks/snowflake" label="Databricks & Snowflake" default>

```sql
SELECT
    ...
    COALESCE(com_mycompany_logged_session_id_1_0_0[0].logged_in_id, com_mycompany_logged_session_id_1_0_0[0].session_identifier, com_mycompany_session_identifier_1_0_0[0].session_id, NULL) as session_identifier,
...
```

</TabItem>
<TabItem value="bigquery" label="Bigquery" default>

```sql
SELECT
    ...
    COALESCE(com_mycompany_logged_session_id_1_0_0[safe_offset(0)].logged_in_id, com_mycompany_logged_session_id_1_0_0[safe_offset(0)].session_identifier, com_mycompany_session_identifier_1_0_0[safe_offset(0)].session_id, NULL) as session_identifier,
...
```

</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

```sql
SELECT
    ...
    COALESCE(lsi_logged_in_id, lsi_session_identifier, si_session_id, NULL) as session_identifier,
...
```

</TabItem>
</Tabs>

with again the order of precedence being decided by the order of your list of identifiers.


#### Schema evolution of custom contexts
This can be extended into contexts where schema evolution takes place. Suppose, for example, your session identifying context has previously always been `com_mycompany_session_identifier_1_0_0`, where you extract the `session_id` field as the identifier. Then suppose you introduce some breaking changes that cause you to now use the `com_mycompany_session_identifier_2_0_0` context, where you extract `new_session_id` as the identifying field. In order to ensure you can track both as your session identifier, you would define your `snowplow__session_identifiers` as follows:
```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_2_0_0', 'field': 'new_session_id', 'prefix': 'si_t'},
                                    {'schema': 'com_mycompany_session_identifier_1_0_0', 'field': 'session_id', 'prefix': 'si_o'}]
    ...
...
```
This setup implies that the `new_session_id` from `com_mycompany_session_identifier_2_0_0` should have precedence over the `session_id` field from `com_mycompany_session_identifier_1_0_0`, meaning that if both are filled for a particular event, the `new_session_id` value would be the one present in the `session_identifier` field in your dbt tables. If you'd prefer to have the precedence swapped, you can swap the ordering in the `dbt_project.yml`. Handling minor version bumps of your schemas where this isn't automatically handled by your loader works in the exact same way. A small example of bumping `com_mycompany_session_identifier_1_0_0` to `com_mycompany_session_identifier_1_1_0` but leaving the `session_id` field as the key identifier would look as follows:
```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_session_identifier_1_1_0', 'field': 'session_id', 'prefix': 'si_t'},
                                    {'schema': 'com_mycompany_session_identifier_1_0_0', 'field': 'session_id', 'prefix': 'si_o'}]
    ...
...
```
:::info
Remember that the `prefix` key only needs to be set when running these models on Postgres or Redshift.
:::

#### Combining atomic fields and custom contexts
Combining atomic fields and custom contexts should then be straightforward if you're comfortable with what we described above. Let's say you want to combine the `logged_in_id` field from the `com_mycompany_logged_session_id_1_0_0` context together with the standard `domain_sessionid` field in the `events` table. To achieve that, you would include the following in your `dbt_project.yml`:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__session_identifiers: [{'schema': 'com_mycompany_logged_session_id_1_0_0', 'field': 'logged_in_id', 'prefix': 'lsi'},
                                    {'schema': 'atomic', 'field': 'domain_sessionid', 'prefix': 'e'}]
    ...
...
```

This would be parsed into the following SQL:

```sql
SELECT
    ...
    COALESCE(lsi_logged_in_id, domain_sessionid, NULL) as session_identifier,
...
```

#### Adding your own custom session logic
If there are session identifiers that are more complicated to utilize, then you can also provide your own session logic that will be used instead of the logic explained in the preceding sections. As an example, if you would want to concat two fields to create a session identifier, or instead apply a SQL function to a field to then use as a session identifier, that is completely possible using the `snowplow__session_sql` variable.

:::info
Defining the `snowplow__session_sql` variable will ensure that the package takes it's value as the `session_identifier` **over** anything you may have defined with the `snowplow__session_identifiers` variable.
:::

:::warning
For Redshift/Postgres, if you want to leverage custom entities for your custom session logic, you will need to include them in the `snowplow__session_identifiers` variable in the same way as in [previous sections](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-utils-advanced-operation/#customizing-session-identifiers).
:::

##### Concatenating multiple fields to create a session identifier
To start, suppose you want to combine the atomic `domain_sessionid` and `domain_userid` fields to create a session identifier. It's simple to do that by defining the following variable in your `dbt_project.yml`:

 ```yml
# dbt_project.yml
...
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

##### Applying a SQL function to a field to use as a session identifier
Instead, suppose you want to take the `DATE` value of your `derived_tstamp` as your session identifier. It's also simple to do that by defining the following variable in your `dbt_project.yml`:

 ```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__session_sql: "DATE(e.derived_tstamp)"
    ...
...
```

This would be parsed into the following SQL:

```sql
SELECT
    ...
    DATE(e.derived_tstamp) as session_identifier,
...
```

### Customizing user identifiers
Customizing user identifiers works in the exact same way as customizing session identifiers, although you need to make use of the `snowplow__user_identifiers` variable instead of the `snowplow_session_identifiers` variable.

#### Using additional atomic fields
By default, your identifier will be the `domain_userid` field which is found in the atomic events table. If you wanted to instead use a different field, say the `network_userid` field that can be found in the atomic events table, you could define your `snowplow__user_identifiers` as follows:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_identifiers: [{'schema': 'atomic', 'field': 'network_userid'}]
    ...
...
```

If you wanted to include multiple identifiers, then you could define the `snowplow__user_identifiers` as follows:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_identifiers: [{'schema': 'atomic', 'field': 'network_userid'},
                                 {'schema': 'atomic', 'field': 'domain_userid'}]
    ...
...
```
This would then compile into the following SQL code:

```sql
SELECT
    ...
    COALESCE(e.network_userid, e.domain_userid, NULL) as user_identifier,
...
FROM events e
```

:::info
This is to say, the order in which you provide your identifiers is the order of precedence they will take in the `COALESCE` statement. In other words, in the example above the value of `domain_userid` will **only** be used when `network_userid` is `NULL`. If both are `NULL`, the `user_identifier` will be `NULL` for that event.
:::

#### Using custom contexts
If you wanted to instead use user identifiers that come from a custom context, you can do that as well. Let's assume you've created a user identifier context that you attach to your events, and it's called `com_mycompany_user_identifier_1_0_0`. Let's also say you're interested in the `user_id` field of this context as the identifier for each user. To make sure that your dbt models extract and use this field as the value for `user_identifier`, you need to define the `snowplow__user_identifiers` as follows:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_identifiers: [{'schema': 'com_mycompany_user_identifier_1_0_0', 'field': 'user_id', 'prefix': 'ui'}]
    ...
...
```
:::warning
Make sure you include a `prefix` value if you are running on **Postgres or Redshift**, as this ensures that you don't have duplicate column names somewhere in your SQL select statement. It is not required for the other warehouses.
:::

Similar to before, if you want to combine multiple identifiers in different (or the same) contexts, you can do so by defining your `snowplow__user_identifiers` as shown below. First, however, let's assume there's another context called `com_mycompany_logged_user_id_1_0_0` which has both a `logged_in_user_id` and `internal_user_id` field in it. To include all of these:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_identifiers: [{'schema': 'com_mycompany_logged_user_id_1_0_0', 'field': 'logged_in_user_id', 'prefix': 'lui'},
                                 {'schema': 'com_mycompany_logged_session_id_1_0_0', 'field': 'internal_user_id', 'prefix': 'lui'},
                                 {'schema': 'com_mycompany_user_identifier_1_0_0', 'field': 'user_id', 'prefix': 'ui'}]
    ...
...
```
:::warning
Make sure you include a `prefix` value if you are running on **Postgres or Redshift**, as this ensures that you don't have duplicate column names somewhere in your SQL select statement. It is not required for the other warehouses.
:::

This will then render into the following SQL:
```sql
SELECT
    ...
    COALESCE(lui_logged_in_user_id, lui_internal_user_id, ui_user_id, NULL) as user_identifier,
...
```
with again the order of precedence being decided by the order of your list of identifiers.


#### Schema evolution of custom contexts
This can be extended into contexts where schema evolution takes place. Suppose, for example, your user identifying context has previously always been `com_mycompany_user_identifier_1_0_0`, where you extract the `user_id` field as the identifier. Then suppose you introduce some breaking changes that cause you to now use the `com_mycompany_user_identifier_2_0_0` context, where you extract `new_user_id` as the identifying field. In order to ensure you can track both as your user identifier, you would define your `snowplow__user_identifiers` as follows:
```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_identifiers: [{'schema': 'com_mycompany_user_identifier_2_0_0', 'field': 'new_user_id', 'prefix': 'ui_t'},
                                 {'schema': 'com_mycompany_user_identifier_1_0_0', 'field': 'user_id', 'prefix': 'ui_o'}]
    ...
...
```
This setup implies that the `new_user_id` from `com_mycompany_user_identifier_2_0_0` should have precedence over the `user_id` field from `com_mycompany_user_identifier_1_0_0`, meaning that if both are filled for a particular event, the `new_user_id` value would be the one present in the `user_identifier` field in your dbt tables. If you'd prefer to have the precedence swapped, you can swap the ordering in the `dbt_project.yml`.

Handling minor version bumps of your schemas where this isn't automatically handled by your loader works in the exact same way. A small example of bumping `com_mycompany_user_identifier_1_0_0` to `com_mycompany_user_identifier_1_1_0` but leaving the `user_id` field as the key identifier would look as follows:
```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_identifiers: [{'schema': 'com_mycompany_user_identifier_1_1_0', 'field': 'user_id', 'prefix': 'ui_t'},
                                 {'schema': 'com_mycompany_user_identifier_1_0_0', 'field': 'user_id', 'prefix': 'ui_o'}]
    ...
...
```
:::info
Remember that the `prefix` key only needs to be set when running these models on Postgres or Redshift.
:::

#### Combining atomic fields and custom contexts
Combining atomic fields and custom contexts should hopefully then be straightforward if you're comfortable with what we described above. Let's say you want to combine the `logged_in_user_id` field from the `com_mycompany_logged_user_id_1_0_0` context together with the standard `domain_userid` field in the `events` table. To achieve that, you would include the following in your `dbt_project.yml`:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_identifiers: [{'schema': 'com_mycompany_logged_user_id_1_0_0', 'field': 'logged_in_user_id', 'prefix': 'lui'},
                                 {'schema': 'atomic', 'field': 'domain_userid', 'prefix': 'e'}]
    ...
...
```

This would be parsed into the following SQL:
```sql
SELECT
    ...
    COALESCE(lui_logged_in_user_id, domain_userid, NULL) as user_identifier,
...
```

#### Adding your own custom user logic
If there are user identifiers that are more complicated to utilize, then you can also provide your own user logic that will be used instead of the logic explained in the preceding sections. As an example, if you would want to concat two fields to create a user identifier, or instead apply a SQL function to a field to then use as a user identifier, that is completely possible using the `snowplow__user_sql` variable.

:::info
Defining the `snowplow__user_sql` variable will ensure that the package takes it's value as the `user_identifier` **over** anything you may have defined with the `snowplow__user_identifiers` variable.
:::

:::warning
For Redshift/Postgres, if you want to leverage custom entities for your custom user logic, you will need to include them in the `snowplow__user_identifiers` variable in the same way as in [previous sections](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-utils-advanced-operation/#customizing-user-identifiers).
:::

##### Concatenating multiple fields to create a user identifier
To start, suppose you want to combine the atomic `network_userid` and `domain_userid` fields to create a user identifier. It's simple to do that by defining the following variable in your `dbt_project.yml`:

 ```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_sql: "e.network_userid || '_' || e.domain_userid"
    ...
...
```

This would be parsed into the following SQL:

```sql
SELECT
    ...
    e.network_userid || '_' || e.domain_userid as user_identifier,
...
```

##### Applying a SQL function to a field to use as a user identifier
Instead, suppose you want to take the `DATE` value of your `derived_tstamp` as your user identifier. It's also simple to do that by defining the following variable in your `dbt_project.yml`:

 ```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__user_sql: "DATE(e.derived_tstamp)"
    ...
...
```

This would be parsed into the following SQL:

```sql
SELECT
    ...
    DATE(e.derived_tstamp) as user_identifier,
...
```
## Introducing custom SQL logic to every event
If there are certain SQL transformations you want to apply to events that are being processed by Snowplow's dbt packages you can leverage the `snowplow__custom_sql` variable to write out custom SQL that will be included in your `base_events_this_run` table, which can then be leveraged for any of your subsequent tables.

The process for this looks slightly different for Redshift & Postgres relative to the other databases. If you use Redshift & Postgres, please skip ahead to the warehouse specific section to understand how that works.

### Utilizing custom contexts or SDEs
Suppose you have a custom context called `contexts_com_mycompany_click_1_0_0` which contains a `click_id` that you want to concat with Snowplow's `domain_sessionid`. You could either do this concatenation when creating your own data models, but if you want to surface this to all of your data models downstream from Snowplow's initial data processing in it's dbt packages, you can add that transformation by adding the following to your `dbt_project.yml`:

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks+snowflake" label="Databricks & Snowflake" default>

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__custom_sql: "CONCAT(com_mycompany_click_1_0_0[0].click_id, '_', domain_sessionid) as click_session_id"
    ...
...
```

If you'd like to add multiple lines of SQL, you can do that as well by making this string a multi-line string. Any SQL included in the `snowplow__custom_sql` will be found in your `snowplow_base_events_this_run` table, and will be referenced at the end of the select statement, so there's no need to add a trailing comma. Any of the newly created fields can also be passed through to other tables created automatically by Snowplow's dbt packages.

</TabItem>
<TabItem value="bigquery" label="BigQuery" default>

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__custom_sql: "CONCAT(com_mycompany_click_1_0_0[safe_offset(0)].click_id, '_', domain_sessionid) as click_session_id"
    ...
...
```

If you'd like to add multiple lines of SQL, you can do that as well by making this string a multi-line string. Any SQL included in the `snowplow__custom_sql` will be found in your `snowplow_base_events_this_run` table, and will be referenced at the end of the select statement, so there's no need to add a trailing comma. Any of the newly created fields can also be passed through to other tables created automatically by Snowplow's dbt packages.

</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__custom_sql: "com_mycompany_click_1_0_0.click_id || '_' || domain_sessionid as click_session_id"
    ...
...
```

If you'd like to add multiple lines of SQL, you can do that as well by making this string a multi-line string. Any SQL included in the `snowplow__custom_sql` will be found in your `snowplow_base_events_this_run` table, and will be referenced at the end of the select statement, so there's no need to add a trailing comma. Any of the newly created fields can also be passed through to other tables created automatically by Snowplow's dbt packages.


In Redshift & Postgres, due to the [shredded table design](https://docs.snowplow.io/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/#shredded-data) (meaning each context is loaded separately into a table), you need to specify which contexts you want to be included in the `snowplow_base_events_this_run` table, which you can do using the `snowplow__entities_or_sdes` variable. The `snowplow__entities_or_sdes` variable expects a list of key:value dictionary (dict) with the following keys:


| Key | Description | Example |
| ----------------------- | ----------------------------- | ----------------------------- |
| `name` | The name denotes the name of the entity or SDE that you would like to join, which should also be the name of the table that is in your warehouse. | `contexts_com_mycompany_click_1` |
| `prefix` | The prefix that each field in the context will receive. E.g with a prefix of `my_click` and a field name of `id`, this field will be accessible in the `snowplow_base_events_this_run` table under the `my_click_id` column. | `my_click` |
| `alias` | The alias that is used for the context table join, for reference in your custom SQL queries. | `mc` |
| `single_entity` | A boolean to say whether this is a single entity or whether there can be multiple for each event. | `true` |

:::warning
If your `single_entity` value is set to false, then you will get duplicate events (by design) in your `snowplow_base_events_this_run` table, which is unlikely to be what is intended. If you find that you may need to set the `single_entity` value to false, it may be easier for you to join these contexts on in a later model where they are required.
:::

So, taking the example values from the table above, you could define your `snowplow__entities_or_sdes` in the following way:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__entities_or_sdes: [{'name': 'contexts_com_mycompany_click_1', 'prefix': 'click', 'alias': 'mc', 'single_entity': true}]
    ...
...
```

Note that you can simply add more entities or self-describing events to join by adding more dicts to the list.

Once you've added in the entities or self-describing events that you want to leverage, you can use `snowplow__custom_sql` to transform them and surface that in your `snowplow_base_events_this_run` table. Similiarly to the example for other warehouses, suppose you have a custom context called `contexts_com_mycompany_click_1` which contains a `id` that you want to concat with Snowplow's `domain_sessionid`. You can add that transformation by adding the following to your `dbt_project.yml`:

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__entities_or_sdes: [{'name': 'contexts_com_mycompany_click_1', 'prefix': 'my_click', 'alias': 'mc', 'single_entity': true}]
    snowplow__custom_sql: "mc.my_click_id || '_' || domain_sessionid as click_session_id"
    ...
...
```

This would then allow you to leverage the `click_session_id` field within your `snowplow_base_events_this_run` table, as well as other tables downstream from this.

</TabItem>
</Tabs>

### Utilizing advanced custom SQL
If you'd prefer to circumvent the need for using Snowplow variables to create advanced SQL transformations, you can instead use the `snowplow_create_base_events` macro as a CTE in your dbt model. Before looking at the code, let's suppose you've once again decided to extract a new field called `click_session_id` which is defined as in the previous example. Here is what your dbt model could look like:

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks+snowflake" label="Databricks & Snowflake" default>

```sql
# snowplow_base_events_this_run.sql

{% set base_events_query = snowplow_utils.base_create_snowplow_events_this_run(
    sessions_this_run_table='snowplow_base_sessions_this_run',
    session_identifiers=var('snowplow__session_identifiers'),
    session_timestamp='derived_tstamp'
) %}

with base_events AS (
    {{ base_events_query }}
)

select *,
       CONCAT(contexts_com_mycompany_click_1[0].id, '_', domain_sessionid) as click_session_id

from base_events

```

</TabItem>
<TabItem value="bigquery" label="BigQuery" default>

```sql
# snowplow_base_events_this_run.sql

{% set base_events_query = snowplow_utils.base_create_snowplow_events_this_run(
    sessions_this_run_table='snowplow_base_sessions_this_run',
    session_identifiers=var('snowplow__session_identifiers'),
    session_timestamp='derived_tstamp',
    derived_tstamp_partitioned=var('snowplow__derived_tstamp_partitioned')
) %}

with base_events AS (
    {{ base_events_query }}
)

select *,
       CONCAT(contexts_com_mycompany_click_1[safe_offset(0)].id, '_', domain_sessionid) as click_session_id

from base_events

```

</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

```yml
# dbt_project.yml
...
vars:
    ...
    snowplow__entities_or_sdes: [{'name': 'contexts_com_mycompany_click_1', 'prefix': 'my_click', 'alias': 'mc', 'single_entity': true}]
    ...
...
```

```sql
# snowplow_base_events_this_run.sql

{% set base_events_query = snowplow_utils.base_create_snowplow_events_this_run(
    sessions_this_run_table='snowplow_base_sessions_this_run',
    session_identifiers=var('snowplow__session_identifiers'),
    session_timestamp='derived_tstamp',
    entities_or_sdes=snowplow__entities_or_sdes
) %}

with base_events AS (
    {{ base_events_query }}
)

select *,
       mc.my_click_id || '_' || domain_sessionid as click_session_id

from base_events

```


</TabItem>

</Tabs>
