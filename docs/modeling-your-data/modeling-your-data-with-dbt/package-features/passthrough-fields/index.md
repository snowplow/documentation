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

Note that how to extract a field from your self describing event / entity column will depend on your warehouse:

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift, Postgres" default>

For Redshift and Postgres, passthrough fields work with both standard columns and custom entities. Here's how to handle different scenarios:

**Standard Columns**
```yml
# Simple field passthrough
snowplow__view_passthroughs: ['page_url', 'page_title']

# SQL-based passthrough
snowplow__view_passthroughs: [
  {'sql': 'COALESCE(page_url, refr_url)', 'alias': 'final_url'}
]
```

**Custom Entities**
1. First, add your entities to `events_this_run` using the `snowplow__entities_or_sdes` variable:
```yml
snowplow__entities_or_sdes: [
  {'schema': 'custom_entity_table', 'prefix': 'my_entity_1', 'alias': 'entity_1'}
]
```

2. Then reference the fields in your passthrough configuration:
```yml
snowplow__view_passthroughs: [
  'my_entity_1_field',
  {'sql': 'COALESCE(my_entity_1_field_v1, my_entity_1_field_v2)', 'alias': 'entity_field'}
]
```

</TabItem>
<TabItem value="bigquery" label="BigQuery">

In BigQuery, passthrough fields can come from standard columns, self-describing events, or context entities:

**Standard Columns**
```yml
snowplow__view_passthroughs: [
  'page_url',
  {'sql': 'COALESCE(page_url, refr_url)', 'alias': 'final_url'}
]
```

**Self-describing Events**
```yml
snowplow__view_passthroughs: [
  # Extract specific fields from self-describing events
  {'sql': 'unstruct_event_my_event_1_0_0.field_name', 'alias': 'my_event_field'},
  # Multiple fields
  {'sql': 'unstruct_event_my_event_1_0_0.field1 || unstruct_event_my_event_1_0_0.field2', 'alias': 'combined_fields'}
]
```

**Context Entities**
```yml
snowplow__view_passthroughs: [
  # Extract first occurrence of an entity field
  {'sql': 'contexts_my_entity_1_0_0[SAFE_OFFSET(0)].field_name', 'alias': 'entity_field'},
  # Combine entity fields
  {'sql': 'COALESCE(contexts_entity_v1[SAFE_OFFSET(0)].field, contexts_entity_v2[SAFE_OFFSET(0)].field)', 'alias': 'entity_field_combined'}
]
```

</TabItem>
<TabItem value="snowflake" label="Snowflake">

Snowflake handles passthrough fields for standard columns, self-describing events, and context entities with its own syntax:

**Standard Columns**
```yml
snowplow__view_passthroughs: [
  'page_url',
  {'sql': 'COALESCE(page_url, refr_url)', 'alias': 'final_url'}
]
```

**Self-describing Events**
```yml
snowplow__view_passthroughs: [
  # Single field from an event
  {'sql': 'unstruct_event_my_event_1:fieldName::varchar', 'alias': 'event_field'},
  # Multiple fields
  {'sql': 'unstruct_event_my_event_1:field1::varchar || unstruct_event_my_event_1:field2::varchar', 'alias': 'combined_fields'}
]
```

**Context Entities**
```yml
snowplow__view_passthroughs: [
  # First occurrence of an entity field
  {'sql': 'contexts_my_entity_1[0]:fieldName::varchar', 'alias': 'entity_field'},
  # Combining versions
  {'sql': 'COALESCE(contexts_entity_v1[0]:field::varchar, contexts_entity_v2[0]:field::varchar)', 'alias': 'entity_field_combined'}
]
```

</TabItem>
<TabItem value="databricks" label="Databricks, Spark SQL">

Databricks handles passthrough fields using its native STRUCT types and array indexing:

**Standard Columns**
```yml
snowplow__view_passthroughs: [
  'page_url',
  {'sql': 'COALESCE(page_url, refr_url)', 'alias': 'final_url'}
]
```

**Self-describing Events**
```yml
snowplow__view_passthroughs: [
  # Single field from an event
  {'sql': 'unstruct_event_my_event_1.field_name', 'alias': 'event_field'},
  # Multiple fields
  {'sql': 'unstruct_event_my_event_1.field1 || unstruct_event_my_event_1.field2', 'alias': 'combined_fields'}
]
```

**Context Entities**
```yml
snowplow__view_passthroughs: [
  # First occurrence of an entity field
  {'sql': 'contexts_my_entity_1[0].field_name', 'alias': 'entity_field'},
  # Combining versions
  {'sql': 'COALESCE(contexts_entity_v1[0].field, contexts_entity_v2[0].field)', 'alias': 'entity_field_combined'}
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

:::caution

In certain cases, such as the users table in Unified, it may be required to first set passthrough fields on an upstream table (the sessions table in that case) to make sure it is available for selection. The best way to identify this is to look at the DAG in the dbt docs for the package you are using.

:::

## Usage Notes

Which event the field(s) are taken from depends on the derived table; for example in the Views table in the Unified package the the field value from the `page_view` event itself, _not_ the pings. 

A general rule of thumb is that the field comes from the *first* event of that type at that table level. If you are unsure, you can always check the [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for the variable description or the model sql.

As mentioned, the fields are passed through _as is_, which means it is not currently possible aggregate the value of a field across a page view or session as we do some other fields in the table. In the case where this is required you should use the [custom aggregations](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-aggregations/index.md) if that is supported by the package, or build a [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md).



:::caution

It is unlikely, although not impossible, that when using the SQL approach you may need to provide a table alias to avoid ambiguous references, in this case please see the model sql file for the specific alias used for the `snowplow_unified_base_events_this_run` table in each case.

:::
