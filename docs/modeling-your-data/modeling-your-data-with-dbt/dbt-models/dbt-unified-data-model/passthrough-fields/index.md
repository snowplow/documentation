---
title: "Passthrough Fields"
description: "Details for how to pass additional fields through to the derived tables."
sidebar_position: 400
---

:::info

Passthrough fields are a feature only available in the web package versions 0.16.0 and higher

:::

Passthrough fields are the term used to define any field from your `snowplow_unified_base_events_this_run` table that you want available _as is_ in a derived table, i.e. these fields are *passed through* the processing to be available in your derived tables. There are many use cases for this, but the most common is the need to add a field from a custom context to the e.g. the page views table to use as an additional dimension in analysis. Previously you would have to write a custom model to join this field on, or join the original page view event at the time of the analysis, but with passthrough fields this is now far easier (and cheaper) to achieve.

Which event the field(s) are taken from depends on the derived table:

- Page Views uses the field value from the `page_view` event itself, _not_ the pings
- Sessions uses the field value from the _first_ `page_view` or `page_ping` event (order is based on `derived_tstamp`, `dvce_created_tstamp`, then `event_id` in case of a tie)
- Users uses the first and last sessions for that user, which means if you want a field passed through to the users table, you must first make it available in the sessions table

As mentioned, the fields are passed through _as is_, which means it is not currently possible aggregate the value of a field across a page view or session as we do some other fields in the table, in the case where this is required, you should build a [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) as in older versions of the package.

To enable the passthrough fields, you need to set the relevant variable in your root `dbt_project.yml` file; `snowplow__view_passthroughs`, `snowplow__session_passthroughs`, `snowplow__user_first_passthroughs`, and `snowplow__user_last_passthroughs` for page views, sessions, and users (first and lasts) respectively. The variables are lists of fields; either the name of the field or a dictionary specifying the SQL and alias for the field e.g.

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

Note that how to extract a field from your context column will depend on your warehouse (see our [querying guide](/docs/storing-querying/querying-data/index.md?warehouse=snowflake#entities) for more information), and you are unable to use dbt macros in this variable. For the users table, any basic field will have `first_` or `last_` prefixed to the field name automatically to avoid clashes, however if you are using the SQL approach, you will need to add these prefixes as part of your alias.

:::caution

It is unlikely, although not impossible, that when using the SQL approach you may need to provide a table alias to avoid ambiguous references, in this case please see the model sql file for the specific alias used for the `snowplow_unified_base_events_this_run` table in each case.

:::
