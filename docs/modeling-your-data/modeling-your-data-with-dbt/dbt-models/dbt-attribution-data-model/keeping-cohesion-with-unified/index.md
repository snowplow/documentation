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
Although auto-deployed packages managed via Console run in separate projects, for others there may be use cases when it is more practical to run both the Unified Digital and Attribution dbt packages from the same project. We purposefully did not directly link the two packages to allow for flexibility but there is a way to run them from the same project. When specifying the sources just make sure you change the default source references to: ref('')  instead of hard coding the schema.table_name for these variables in order for dbt to establish a proper lineage graph to process things in order:

```yml
snowplow__conversion_path_source: "{{ ref('snowplow_unified_views') }}"
snowplow__conversions_source: "{{ ref('snowplow_unified_conversions') }}"
snowplow__user_mapping_source: "{{ ref('snowplow_unified_user_mapping') }}"
```

Keep in mind that the manifest tables are still not linked, therefore both projects' statefulness is dictated by their own set of tables and values. For instance, you might want to keep in mind how you use the time specific variables that dictate the scope of processing the data:

```yml project.yml
vars:
  snowplow_unified:
    snowplow__start_date: '2024-06-03'
  snowplow_attribution:
    snowplow__attribution_start_date: '2024-09-03'
```
The snowplow_start_date variable used for the unified package dictates since when to process web and mobile events into views, session, users and conversions tables. You may have been running the package for a long time and only lately you decided to carry out marketing attribution analysis, and you are only interested in the most recent dataset. In this case it is perfectly fine to set a much later date as the start date.
