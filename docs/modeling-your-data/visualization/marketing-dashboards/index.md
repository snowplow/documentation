---
title: "User and Marketing Analytics"
sidebar_position: 2
sidebar_label: "User and Marketing Analytics"
---

The User and Marketing Analytics visualization contains all the visuals you need to perform a high level analysis of your web and mobile performance. This includes dashboards covering:
- Reports on user acquisition
- Information relating to your traffic sources
- Insight into user retention
- Measurement of user engagement
- Deep dives into technology and user demographics

```mdx-code-block
import TrackedReactFilePlayer from '@site/src/components/TrackedReactFilePlayer'
import videoUrl from './images/umd_video.mp4'

<TrackedReactFilePlayer label="UMD" controls url={videoUrl} width='100%' height='100%'/>
<br/>
```


## Requirements

- [YAUAA enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) enabled
- [Campaign Attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) enabled
- [IP Lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) enabled
- [Referrer Parser enrichment](/docs/pipeline/enrichments/available-enrichments/referrer-parser-enrichment/index.md) enabled

- One of:
  - (**Recommended**) Running the [Snowplow Unified dbt Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) with:
    - `snowplow__enable_yauaa` set to `true`
    - `snowplow__list_event_counts` set to `true`
    - (optional) Conversion event(s) defined, with `snowplow__total_all_conversions` set to `true`
  - Running the [Snowplow Web dbt Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md) with:
    - `snowplow__enable_yauaa` set to `true`
    - `snowplow__list_event_counts` set to `true`
    - (optional) Conversion event(s) defined, with `snowplow__total_all_conversions` set to `true`
- Access to the derived tables granted to the role used when setting up the visualization

## Usage
All charts have help text to explain any definitions used, and have the SQL used to produce them available to download by clicking on the icon in their title.

### Filters
The data queried and displayed can be filtered using the filter in the sidebar. Note that these filters will apply to all visuals across all pages, and changing the filters will cause the dashboard to refresh all visuals which may take a few seconds. By default the last 30 days of sessions and page views are used.

The comparison option allows you to compare two different time periods, we provide default suggestions such as the preceding period matching the starting day of the week, but you can select a custom range. Note that it is possible to select a shorter or longer period for comparison than your main filter; this can lead to unexpected results in charts as for example bar charts will use the full range, but line charts will only display up to the main range. You will get a notification if your ranges are of different lengths.

Some charts are only related to new or returning users, not both, so depending on your filters these may be blank.

### Settings

All configurations can be found in the **Settings** page. Note that all these settings are global for all users, meaning if you change them they will be changed for everyone.

Configuration options:
- Select the currency symbol used throughout the visualization
- Toggle between using campaign or channel for reporting aggregation
- Use tables produced by the web package instead of the unified package, and select which tables to use
