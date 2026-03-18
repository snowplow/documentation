---
title: "Table grants for dbt packages"
sidebar_label: "Table grants"
description: "Details for granted access to our tables to other users/roles"
keywords: ["table grants", "dbt grants", "database permissions", "user access"]
sidebar_position: 30
---

:::tip

This functionality requires dispatching to our macros over dbt core, see how to do this on the [dispatch setup](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/dispatch/index.md) page.

:::

## Availability
:::tip

Any package can make use of the table grants feature provided by the `snowplow__grant_select_to` variable if you are using at least version 0.16.2 of snowplow-utils, even if the variable is not listed in the configuration. Granting usage on schemas however requires specific package versions.

:::

| Package         | Minimum Required Version |
| --------------- | ------------------------ |
| Unified Digital | 0.3.0                    |
| E-commerce      | 0.8.1                    |
| Media Player    | 0.7.2                    |
| Normalize       | 0.3.5                    |
| Attribution     | 0.2.0                    |

Note that this feature is not supported for BigQuery due to the different approach to permissions they take via IAM roles.

## Usage
### Granting select on tables
To grant `select` on all tables created within our package, you can provide a list of the users/roles in the `snowplow__grant_select_to` variable e.g.

```yaml title=dbt_project.yml
vars:
  snowplow_<package_name>:
    snowplow__grant_select_to: ['myuser1', 'myuser2']
```
Note that these user/role names are case sensitive. Databricks Principals are also supported. If the user does not exist an error will occur when the grant tries to run. This feature is compatible with the built-in [dbt grants](https://docs.getdbt.com/reference/resource-configs/grants) functionality and we will grant to a combination of the two.

:::warning

It is important to scope this to the relevant package, if you set this variable at the top level of your project then all models will have this grant applied.

:::

:::warning

Note this will overwrite any existing grants applied to the table manually in the warehouse.

:::

### Granting usage on schemas
In the case of some warehouses, users also need `usage` permissions on the schema a table is in to be able to access the data. We provide this functionality via a post-hook that grants usage on **any** schema interacted with during the `dbt run` to the users listed in `snowplow__grant_select_to`.

:::danger

Due to limitations with dbt, we are not able to scope this only to schemas interacted with by our package. This means **ALL** schemas in the run will have `usage` granted to these users.

:::

This functionality will only trigger if `snowplow__grant_select_to` is not empty, and you can disable this by setting `snowplow__grant_schema_usage` to false.
