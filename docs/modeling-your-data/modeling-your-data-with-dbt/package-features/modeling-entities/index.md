---
title: "Modeling Entities and Self-Describing Events"
sidebar_position: 40
---

## Out-of-the-box Entities & Events

Our dbt packages provide out-of-the-box modeling for many [entities](/docs/fundamentals/entities/index.md) that are relevant to each package. Fields from these contexts are added to the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table for use within downstream models. For example our [unified package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) will add all fields from the [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) entity by setting the `snowplow__enable_yauaa` to true.

Relevant [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) fields are extracted in the same way as needed per-package, and are often dependent on enabling optional modules.

:::tip

In some cases, these fields may exist but be null when the entity or self-describing event is not enabled in the project yaml to enable more consistent structure to the events this run table.

:::

## Custom Entities & Events

For warehouses other than Redshift, all columns in your atomic events table are available in the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table, so you can use them as needed in any other models.

For Redshift we provide the `snowplow__entities_or_sdes` in our packages that have an events this run table. This variable takes the name of your entity or self-describing event table, a prefix, an alias, and if it is a single entity.

:::warning

Only entities that are "single valued" should be added directly to the event this run table i.e. the list should only contain one instance of the entity. A multi-valued entity would cause duplicates in the events this run table and lead to incorrect data in all downstream models. See below for how to use multi-valued entities.

:::

This variable is a list of objects which have the following structure:

| Key             | Description                                                                                                                                                                                                  | Example                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `schema`        | The schema denotes the name of the entity or SDE that you would like to join, which should also be the name of the table that is in your warehouse.                                                          | `contexts_com_mycompany_click_1` |
| `prefix`        | The prefix that each field in the context will receive. E.g with a prefix of `my_click` and a field name of `id`, this field will be accessible in the events this run table under the `my_click_id` column. | `my_click`                       |
| `alias`         | The alias that is used for the context table join, for reference in your custom SQL queries.                                                                                                                 | `mc`                             |
| `single_entity` | A boolean to say whether this is a single entity or whether there can be multiple for each event. Should always be set to `true`.                                                                            | `true`                           |

An example with two custom contexts would be:

```yaml  title=dbt_project.yml
...
vars:
  snowplow_<package_name>:
    snowplow__entities_or_sdes: [
        {'schema': 'contexts_com_mycompany_click_1', 'prefix': 'click', 'alias': 'mc', 'single_entity': true},
        {'schema': 'contexts_com_mycompany_submit_1', 'prefix': 'submit', 'alias': 'sub', 'single_entity': true}
        ]
...
```

### Multi-valued Entities
In the case of a mutli-valued entity, you must make use of custom models and the `snowplow_utils.get_sde_or_context` to manage de-duplication. See the [using multi-valued entities](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/examples/using-mulit-valued-entities/index.md) custom model example page for more information.
