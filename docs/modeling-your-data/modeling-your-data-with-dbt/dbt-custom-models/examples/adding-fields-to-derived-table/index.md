---
title: "Adding Fields to a Derived Table"
sidebar_position: 10
---

RHTODO

<details>
<summary>Custom SDEs or Contexts in Redshift</summary>

Since version 0.16.0 of `snowplow_web` it has been possible to include custom SDE or contexts in the `snowplow_web_base_events_this_run` table by making use of the `snowplow__entities_or_sdes` variable. See the section on Utilizing custom contexts or SDEs for details of the structure, but as an example to include the values from the `contexts_com_mycompany_click_1` context you would use:

```yml title="dbt_project.yml"
vars:
    ...
    snowplow__entities_or_sdes: [{'schema': 'contexts_com_mycompany_click_1', 'prefix': 'click', 'alias': 'mc', 'single_entity': true}]
    ...
...
```

which will add all fields from that context, with field names prefixed by `click_` to the `snowplow_web_base_events_this_run` table, available to then use in any custom model. Note that you should only join _single entity_ context tables (i.e. those that only have a single object per event, rather than multiple) to avoid duplicates being generated in your base events table, which would then lead to incorrect processing of the rest of the package. Any multi-valued contexts should be joined directly in your custom model, making use of our `get_sde_or_context()` macro.

We plan to add this feature to our other packages in the future.

</details>
