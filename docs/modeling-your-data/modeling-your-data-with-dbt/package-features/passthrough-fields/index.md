---
title: "Passthrough Fields"
description: "Details for how to pass additional fields through to the derived tables."
sidebar_position: 400
---

Passthrough fields are the term used to define any field from your [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-elements/this-run-tables/index.md#events-this-run) type table that you want available _as is_ in a derived table, i.e. these fields are *passed through* the processing to be available in your derived tables. There are many use cases for this, but the most common is the need to add a field from a custom context to the e.g. the views table to use as an additional dimension in analysis. Previously you would have to write a custom model to join this field on, or join the original view event at the time of the analysis, but with passthrough fields this is now far easier (and cheaper) to achieve.

## Availability

| Package | Minimum Required Version |
|---------|--------------------------|
| Unified | 0.3.0 |
| Media Player | 0.7.0 |
| Ecommerce | 0.6.0 |

## Usage

To enable the passthrough fields, you need to set the relevant variable in your root `dbt_project.yml` file; e.g`snowplow__view_passthroughs` (see your package [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for a full list of passthrough variables). Note that in some cases you may be able to specify multiple variables for the same table for the first and last of a given record (e.g. first and last session for a user). 

The variables are lists of fields; either the name of the field or a dictionary specifying the SQL and alias for the field e.g.

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__view_passthroughs: ['v_collector', {'sql': 'event_id || app_id', 'alias': 'event_app_id'}]
```

would add the `v_collector` field and a field called `event_app_id` which is the concatenation of the `event_id` and the `app_id`. A more useful case for the SQL block is to extract a specific field from a context, however you can also just use the context column name as the field to bring the whole context through as is e.g.

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__view_passthroughs: ['contexts_my_entity_1']
```

Note that how to extract a field from your context column will depend on your warehouse (see our [querying guide](/docs/storing-querying/querying-data/index.md#entities) for more information), and you are unable to use dbt macros in this variable. For first/last variables, any basic field will have `first_` or `last_` prefixed to the field name automatically to avoid clashes, however if you are using the SQL approach, you will need to add these prefixes as part of your alias.

## Usage Notes

Which event the field(s) are taken from depends on the derived table for example in the Views table in the Unified package the the field value from the `page_view` event itself, _not_ the pings. 

A general rule of thumb is that the field comes from the *first* event of that type at that table level. If you are unsure, you can always check the [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for the variable description or the model sql.

As mentioned, the fields are passed through _as is_, which means it is not currently possible aggregate the value of a field across a page view or session as we do some other fields in the table. In the case where this is required you should use the [custom aggregations](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-aggregations/index.md) if that is supported by the package, or build a [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md).



:::caution

It is unlikely, although not impossible, that when using the SQL approach you may need to provide a table alias to avoid ambiguous references, in this case please see the model sql file for the specific alias used for the `snowplow_unified_base_events_this_run` table in each case.

:::
