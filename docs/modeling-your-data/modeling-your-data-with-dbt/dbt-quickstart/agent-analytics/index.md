---
title: "Agent Analytics Quickstart"
sidebar_label: "Agent Analytics"
sidebar_position: 80
description: "Quick start guide for the Snowplow Agent Analytics dbt package to model AI agent traffic and AI-referred human page views."
keywords: ["agent analytics quickstart", "agent analytics setup", "dbt agent analytics installation"]
date: "2026-09-28"
---

This guide walks you through setting up the [Snowplow Agent Analytics dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-agent-analytics-data-model/index.md).

## Requirements

- dbt 1.10.6 or later
- Snowflake warehouse
- Events from a [CDN tracker](/docs/sources/cdn-trackers/index.md) loaded into your atomic events table, with a dedicated `app_id`
- Client-side page view events from the [JavaScript tracker](/docs/sources/web-trackers/index.md)
- These enrichments enabled on your pipeline:
  - [Bot detection](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md), to separate agent requests from human page views
  - [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md), to identify agents by name
  - [Agent classification](/docs/pipeline/enrichments/available-enrichments/agent-classification-enrichment/index.md), to identify each agent's operator and purpose
  - [Referrer parser](/docs/pipeline/enrichments/available-enrichments/referrer-parser-enrichment/index.md), to attribute human page views to AI products
  - [Event fingerprint](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md), strongly recommended, to deduplicate CDN events

## Installation

Add the package from [GitHub](https://github.com/snowplow-incubator/dbt-snowplow-agent-analytics) to your `packages.yml`:

```yaml title="packages.yml"
packages:
  - git: "https://github.com/snowplow-incubator/dbt-snowplow-agent-analytics.git"
    revision: "main"
```

Then run:

```bash
dbt deps
```

## Configure the package

The steps below walk through each variable you need to set in your `dbt_project.yml` to get the package running. Check out the [configuration reference](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/agent-analytics/index.md) for more details.

### 1. Override the dispatch order

To take advantage of the optimized upserts that the Snowplow packages offer, ensure that certain macros are called from `snowplow_utils` before `dbt-core`. Add the following to the top level of your `dbt_project.yml`:

```yaml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

### 2. Set the start date

Set `snowplow__start_date` to the date from which you want to begin processing events, and `dbt_start_date` to the earliest event date to include in the daily tables:

```yaml title="dbt_project.yml"
vars:
  snowplow_agent_analytics:
    snowplow__start_date: 'yyyy-mm-dd'
    dbt_start_date: 'yyyy-mm-dd'
```

### 3. Check source data

The package reads from your atomic events table. By default, it assumes the `atomic` schema in your `target.database`. To override this, add the following to your `dbt_project.yml`:

```yaml title="dbt_project.yml"
vars:
  snowplow_agent_analytics:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
```

### 4. Identify your event sources

Set `cdn_app_ids` to the `app_id` values of your [CDN tracker](/docs/sources/cdn-trackers/index.md) events. For [CloudFront](/docs/sources/cdn-trackers/cloudfront/index.md), use `cloudfront`. For [Cloudflare](/docs/sources/cdn-trackers/cloudflare/index.md), use the same `appId` you set in the Worker script.

If your pipeline also receives client-side events from other properties that you don't want to analyze, set `client_app_ids` to the `app_id` values of your website. By default, the package includes client-side page views from every `app_id`.

```yaml title="dbt_project.yml"
vars:
  snowplow_agent_analytics:
    cdn_app_ids: ['my_cdn']
    client_app_ids: ['my_website']
```

### 5. Map operators to referral sources *(optional)*

This step is optional. The package attributes human page views to AI operators using the `operator_referral_sources` seed. The seed maps each operator to the `source` and `medium` values that the referrer parser enrichment assigns to its products, for example `OpenAI` to `ChatGPT` and `chatbot`. Operator names must match the `operator` values from the agent classification enrichment exactly.

The `operators_without_referrals` seed lists operators that run crawlers but have no product that refers human sessions, such as `Common Crawl Foundation`. The `assert_no_orphan_operators` test warns about any AI operator that appears in neither seed.

To replace the default seed contents, disable the package seed and add a seed with the same name and columns to your own project:

```yaml title="dbt_project.yml"
seeds:
  snowplow_agent_analytics:
    operator_referral_sources:
      +enabled: false
```

### 6. Run the package

Load the seeds, then run the package:

```bash
dbt seed --select snowplow_agent_analytics
dbt run --select snowplow_agent_analytics
```

The package includes data tests that warn about identity or deduplication issues, for example when CDN events are missing an event fingerprint. Run them with:

```bash
dbt test --select snowplow_agent_analytics
```

## Enable the semantic view *(optional)*

To build the [Snowflake semantic view](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-agent-analytics-data-model/index.md#query-with-a-snowflake-semantic-view), add the [`Snowflake-Labs/dbt_semantic_view`](https://github.com/Snowflake-Labs/dbt_semantic_view) package to your `packages.yml`. The Agent Analytics package doesn't install it for you, because the semantic view is disabled by default.

```yaml title="packages.yml"
packages:
  - package: Snowflake-Labs/dbt_semantic_view
    version: [">=1.0.6", "<2.0.0"]
```

Then set `enable_semantic_views` to `true`:

```yaml title="dbt_project.yml"
vars:
  snowplow_agent_analytics:
    enable_semantic_views: true
```

Run `dbt deps` and `dbt run` again. If you enable the semantic view without adding the package, dbt fails when it parses the project.

## Full refresh

By default, running `dbt run --full-refresh` won't drop the incremental manifest, `base_events`, or `int_agent_source_lookup`, as this would reset all incremental processing. To allow a full reset, set `snowplow__allow_refresh` to `true` before running:

```yaml title="dbt_project.yml"
vars:
  snowplow_agent_analytics:
    snowplow__allow_refresh: true
```

On development targets, the manifest is always dropped on full refresh without needing this flag. Development targets are identified by the `snowplow__dev_target_name` variable, which you can set to match your development target name if it's not the default `dev`.

To reprocess a single model from scratch without a full refresh, remove it from the manifest:

```bash
dbt run --select snowplow_agent_analytics --vars '{models_to_remove: [agent_pageviews_daily]}'
```
