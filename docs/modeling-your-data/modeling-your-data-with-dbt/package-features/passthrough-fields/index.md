---
title: "Passthrough Fields"
description: "Details for how to pass additional fields through to the derived tables."
sidebar_position: 20
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Passthrough fields are the term used to define any field from your [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) type table that you want available _as is_ in a derived table, i.e. these fields are *passed through* the processing to be available in your derived tables. There are many use cases for this, but the most common is the need to add a field from a custom context to the e.g. the views table to use as an additional dimension in analysis. Previously you would have to write a custom model to join this field on, or join the original view event at the time of the analysis, but with passthrough fields this is now far easier (and cheaper) to achieve.

## Availability

| Package | Minimum Required Version |
|---------|--------------------------|
| Unified | 0.3.0 |
| Media Player | 0.7.0 |
| Ecommerce | 0.6.0 |

## Usage

To enable the passthrough fields, you need to set the relevant variable in your root `dbt_project.yml` file; e.g `snowplow__view_passthroughs` (see your package [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for a full list of passthrough variables). Note that in some cases you may be able to specify multiple variables for the same table for the first and last of a given record (e.g. first and last session for a user). 

The variables are lists of fields; either the name of the field or a dictionary specifying the SQL and alias for the field e.g.

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__view_passthroughs: ['v_collector', {'sql': 'event_id || app_id', 'alias': 'event_app_id'}]
```

would add the `v_collector` field and a field called `event_app_id` which is the concatenation of the `event_id` and the `app_id`. A more useful case for the SQL block is to extract a specific field from an entity, however you can also just use the context column name as the field to bring the whole column through as is e.g.

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__view_passthroughs: ['contexts_my_entity_1']
```

Note that how to extract a field from your self describing event / entity column will depend on your warehouse and you would need to extract fields one by one, giving each a unique alias: 


<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift, Postgres" default>

For Redshift and Postgres users, self-describing events and entities are not part of the standard `events` table. Instead, each type of event is in its own table. The table name and the fields in the table will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

In order for you to use fields from there through passthrough fields, you would need to first make sure that those fields are part of the base_events_this_run table. 

Any custom entities or self-describing events are able to be added to the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table, and are de-duped on by taking the earliest `collector_tstamp` record, by using the `snowplow__entities_or_sdes` variable in our package. See [modeling entities](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md) for more information and examples.

Once you add those fields into your events_this_run table through the snowplow__entities_or_sdes variable you can simply refer to them as passthrough fields, coalesce different versions etc.

```yml
snowplow__entities_or_sdes: [
      {'schema': 'custom_table_name', 'prefix': 'device_1', 'alias': 'dvc_1', 'single_entity': true},
]
snowplow__view_passthroughs: [
      device_1_type,
      device_1_viewport,
      device_1_app_version,
      device_1_app_user_agent,
]
```

</TabItem>
<TabItem value="bigquery" label="BigQuery">

**Self-describing events**

Each type of self-describing event is in a dedicated `RECORD`-type column. The column name and the fields in the record will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event like so:

```sql
SELECT
    ...
    unstruct_event_my_example_event_1_0_0.my_field,
    ...
FROM
    <events>

```
**Entities**

Each type of entity is in a dedicated `REPEATED RECORD`-type column. The column name and the fields in the record will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
SELECT
    ...
    contexts_my_entity_1_0_0[SAFE_OFFSET(0)].my_field AS my_field,
    ...
FROM
    <events>
```

In either case, you need to add this extraction logic to the `{'sql': '...'}` part of the passthrough field definitions with the `{'alias': '...'}` being the unique field name.

</TabItem>
<TabItem value="snowflake" label="Snowflake">

**Self-describing events**

Each type of self-describing event is in a dedicated `OBJECT`-type column. The column name will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event like so:

```sql
SELECT
    ...
    unstruct_event_my_example_event_1:myField::varchar, -- field will be variant type so important to cast
    ...
FROM
    <events>
```
**Entities**

Each type of entity is in a dedicated `ARRAY`-type column. The column name will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
SELECT
    ...
    contexts_my_entity_1[0]:myField::varchar,  -- field will be variant type so important to cast
    ...
FROM
    <events>
```
In either case, you need to add this extraction logic to the `{'sql': '...'}` part of the passthrough field definitions with the `{'alias': '...'}` being the unique field name.
</TabItem>
<TabItem value="databricks" label="Databricks, Spark SQL">

**Self-describing events**

Each type of self-describing event is in a dedicated `STRUCT`-type column. The column name and the fields in the `STRUCT` will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event by extracting them like so:

```sql
SELECT
    ...
    unstruct_event_my_example_event_1.my_field,
    ...
FROM
    <events>
```

**Entities**

Each type of entity is in a dedicated `ARRAY<STRUCT>`-type column. The column name and the fields in the `STRUCT` will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
SELECT
    ...
    contexts_my_entity_1[0].my_field,
    ...
FROM
    <events>
```

In either case, you need to add this extraction logic to the `{'sql': '...'}` part of the passthrough field definitions with the `{'alias': '...'}` being the unique field name.
</TabItem>
</Tabs>


Please note you are unable to use dbt macros in this variable, and also not able to use lateral flatten / explode type extractions. 

For first/last variables, any basic field will have `first_` or `last_` prefixed to the field name automatically to avoid clashes, however if you are using the SQL approach, you will need to add these prefixes as part of your alias.


:::tip

In certain cases, such as the users table in Unified, it may be required to first set passthrough fields on an upstream table (the sessions table in that case) to make sure it is available for selection. The best way to identify this is to look at the DAG in the dbt docs for the package you are using.

:::

## Usage Notes

Which event the field(s) are taken from depends on the derived table; for example in the Views table in the Unified package the the field value from the `page_view` event itself, _not_ the pings. 

A general rule of thumb is that the field comes from the *first* event of that type at that table level. If you are unsure, you can always check the [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for the variable description or the model sql.

As mentioned, the fields are passed through _as is_, which means it is not currently possible aggregate the value of a field across a page view or session as we do some other fields in the table. In the case where this is required you should use the [custom aggregations](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-aggregations/index.md) if that is supported by the package, or build a [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md).



:::caution

It is unlikely, although not impossible, that when using the SQL approach you may need to provide a table alias to avoid ambiguous references, in this case please see the model sql file for the specific alias used for the `snowplow_unified_base_events_this_run` table in each case.

:::
