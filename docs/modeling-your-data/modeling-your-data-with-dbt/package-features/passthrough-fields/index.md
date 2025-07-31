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

To enable the passthrough fields, you need to set the relevant variable in your root `dbt_project.yml` file. E.g. `snowplow__view_passthroughs` (see your package [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for a full list of passthrough variables). 

:::info
Note that in some cases you may be able to specify multiple variables for the same table for the first and last of a given record (e.g. first and last session for a user).
:::

To set these variables, you need to define field references in the format of a list of `field names` (in case it is one of the event table columns that can be used as is without the need to alias it) or `dictionaries` specifying the `sql` which defines the sql creating a new field, as well as the `alias` to give a name to the custom field name. The list of such field references to be used as passthrough fields will get compiled and used in a select clause, therefore any valid sql within that context is applicable.

### 1. Passing through columns as is
In case of out-of-the-box event table columns, you can simply reference the name of the field as it appears as a column within your events table. E.g.:

```yml title="dbt_project.yml"

snowplow__view_passthroughs: ['page_url', 'page_title']
```

For those warehouses where the self-describing events or custom entities are also available in the events table you can opt for unnesting the column in a downstream table only, passing through the unnested field as is. E.g.:

```yml title="dbt_project.yml"
snowplow__view_passthroughs: ['contexts_my_entity_1']
```

### 2. SQL-defined Columns
You can also use any valid sql supported by your warehouse that can be used in a select clause. This time you need to use the dictionary format, specifying the relevant sql and the field alias. E.g.:

```yml title="dbt_project.yml"
snowplow__view_passthroughs: [
  {'sql': 'COALESCE(page_url, refr_url)', 'alias': 'final_url'}
]
```

### 3. Extracting fields from a self-describing event or custom context entity
A more useful case for the SQL block is to extract a specific field from an entity or sde. However, please note that how to extract a field from your self describing event / entity column will depend on your warehouse:

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift, Postgres" default>

**Step 1. Making fields available in the events table**

For Redshift and Postgres users, entities and self describing events are not part of the standard events table. Instead, each type of entity/sde is in its own table. The table name and the fields in the table will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/destinations/warehouses-lakes/schemas-in-warehouse/index.md) for more details.

In order for you to use fields from there through passthrough fields, you would need to first make sure that those fields are part of the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table. Any custom entities or self-describing events can be added to this table (which get de-duped by taking the earliest `collector_tstamp` record) by using the `snowplow__entities_or_sdes` variable in our package. See [modeling entities](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md) for more information and examples.

:::caution
It is unlikely, although not impossible, that when using the SQL approach you may need to provide a table alias to avoid ambiguous references, in this case please see the model sql file for the specific alias used for the `snowplow_unified_base_events_this_run` table in each case.
:::


```yml
snowplow__entities_or_sdes: [
      {'schema': 'custom_table_name', 'prefix': 'my_entity_1', 'alias': 'entity_1', 'single_entity': true},
]
```

**Step 2. Referencing the fields as passthrough fields**

Once you add those fields into your events_this_run table through the `snowplow__entities_or_sdes` variable, you can simply refer to them as passthrough fields, coalesce different versions etc.:

```yml
snowplow__view_passthroughs: [
  'my_entity_1_field_x',
  'my_entity_1_field_y',
  'my_entity_1_field_z',
  {'sql': 'COALESCE(my_entity_1_field_x, my_entity_1_field_y)', 'alias': 'entity_field_combined'}
]
```

</TabItem>
<TabItem value="bigquery" label="BigQuery">

**Self-describing Events**
```yml
snowplow__view_passthroughs: [
  # Extract specific fields from self-describing events
  {'sql': 'unstruct_event_my_event_1_0_0.field_name', 'alias': 'my_event_field'},
  # Custom sql example (joining two extracted fields together)
  {'sql': 'unstruct_event_my_event_1_0_0.field1 || unstruct_event_my_event_1_0_0.field2', 'alias': 'my_event_fields'}
]
```

**Context Entities**
```yml
snowplow__view_passthroughs: [
  # Extract specific fields from a custom context field
  {'sql': 'contexts_my_entity_1_0_0[SAFE_OFFSET(0)].field_name', 'alias': 'entity_field'},
  # Custom sql example (coalescing different major versions of the same field)
  {'sql': 'COALESCE(contexts_entity_1[SAFE_OFFSET(0)].field, contexts_entity_2[SAFE_OFFSET(0)].field)', 'alias': 'entity_field_combined'}
]
```

</TabItem>
<TabItem value="snowflake" label="Snowflake">

**Self-describing Events**
```yml
snowplow__view_passthroughs: [
  # Extract specific fields from self-describing events
  {'sql': 'unstruct_event_my_event_1:fieldName::varchar', 'alias': 'event_field'},
  # Custom sql example (joining two extracted fields together)
  {'sql': 'unstruct_event_my_event_1:field1::varchar || unstruct_event_my_event_1:field2::varchar', 'alias': 'combined_fields'}
]
```

**Context Entities**
```yml
snowplow__view_passthroughs: [
  # Extract specific fields from a custom context field
  {'sql': 'contexts_my_entity_1[0]:fieldName::varchar', 'alias': 'entity_field'},
  # Custom sql example (coalescing different major versions of the same field)
  {'sql': 'COALESCE(contexts_my_entity_1[0]:field::varchar, contexts_my_entity_2[0]:field::varchar)', 'alias': 'entity_field_combined'}
]
```

</TabItem>
<TabItem value="databricks" label="Databricks, Spark SQL">

**Self-describing Events**
```yml
snowplow__view_passthroughs: [
  # Extract specific fields from self-describing events
  {'sql': 'unstruct_event_my_event_1.field_name', 'alias': 'event_field'},
  # Custom sql example (joining two extracted fields together)
  {'sql': 'unstruct_event_my_event_1.field1 || unstruct_event_my_event_1.field2', 'alias': 'combined_fields'}
]
```

**Context Entities**
```yml
snowplow__view_passthroughs: [
  # Extract specific fields from a custom context field
  {'sql': 'contexts_my_entity_1[0].field_name', 'alias': 'entity_field'},
  # Custom sql example (coalescing different major versions of the same field)
  {'sql': 'COALESCE(contexts_my_entity_1[0].field, contexts_my_entity_2[0].field)', 'alias': 'entity_field_combined'}
]
```

</TabItem>
</Tabs>

:::tip
When using passthrough fields with entities or self-describing events, always consider:
1. Field type casting may be required (especially in Snowflake)
2. Array indexes start at 0 for the first occurrence
3. Use COALESCE when dealing with multiple versions of the same field
4. Please note you are unable to use dbt macros in this variable, and also not able to use lateral flatten / explode type extractions. 
:::


## Usage Notes

The event that the passthrough fields are taken from depends on the derived table you are adding them to. For example, in the `snowplow_unified_views` table, the `page_view` event is used, not other events, such as `page_ping` or any other custom events. Therefore, if you are adding a passthrough field to the `snowplow_unified_views` table, you must access a property or custom entity that is attached to a `page_view` event.

A general rule of thumb is that the field comes from the *first* event of that type at that table level. If you are unsure, you can always check the [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for the variable description or the model sql.

As mentioned, the fields are passed through _as is_, which means it is not currently possible aggregate the value of a field across a page view or session as we do some other fields in the table. In the case where this is required you should use the [custom aggregations](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-aggregations/index.md) if that is supported by the package, or build a [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md).

:::caution

In certain cases, such as the users table in Unified, it may be required to first set passthrough fields on an upstream table (the sessions table in that case) to make sure it is available for selection. The best way to identify this is to look at the DAG in the dbt docs for the package you are using.

:::




