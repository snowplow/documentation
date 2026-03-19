---
title: "Keep cohesion between the Unified and Attribution packages"
sidebar_label: "Keeping cohesion with Unified"
description: "Run Unified Digital and Attribution dbt packages together with proper lineage and source references for cohesive analysis."
keywords: ["Unified and Attribution", "package cohesion", "dbt lineage", "package dependencies"]
sidebar_position: 10
---

In case there are data issues (e.g. you may want to reprocess the analysis based on the latest user stitching status) the Attribution package produced data models can be reprocessed fully without the need to refresh the Unified package, but not the other way round as it is used as one of the primary sources to rely on when creating the incremental tables. If the underlying data source changed which impacted the views or conversions source data, you would need to refresh the attribution package as well.

There is, however, no dependency between the packages when it comes to syncing them. You may want to run your Unified package once an hour for the more business critical tables to get updated, while you can process the Attribution package once a month, if that's what makes sense for your business. There is no concept of backfill limits or partials reprocessing for the Attribution package, regardless of the last run, the package will reprocess all the data since the last processed conversion event that became available in the source tables.

### Running both Unified and Attribution dbt packages from the same project

It might be practical to run both the Unified Digital and Attribution dbt packages from the same project.

When specifying the sources, make sure you change the default source references to `ref('...')` instead of hard hardcoding the `schema.table_name` for these variables.
This allows dbt to establish a proper lineage graph to process things in order:

```yml
snowplow__conversion_path_source: "{{ ref('snowplow_unified_views') }}"
snowplow__conversions_source: "{{ ref('snowplow_unified_conversions') }}"
snowplow__user_mapping_source: "{{ ref('snowplow_unified_user_mapping') }}"
```

Keep in mind that each model keeps its own state. This means that you can, for example, set a different `start_date` for the attribution model if you add it at a later point.

```yml project.yml
vars:
  snowplow_unified:
    snowplow__start_date: '2024-06-03'
  snowplow_attribution:
    snowplow__attribution_start_date: '2024-09-03'
```
