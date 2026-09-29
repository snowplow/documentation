---
title: "Snowplow Agent Analytics dbt package"
sidebar_label: "Agent Analytics"
sidebar_position: 80
description: "Transform CDN and client-side events into derived tables that show which AI agents crawl your site, which pages they request, and how many human page views their operators refer back."
keywords: ["agent analytics dbt", "AI crawler analytics", "AI agent traffic", "answer engine optimization", "AEO", "bot traffic modeling"]
date: "2026-09-28"
---

import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'addon']}
  helpContent="The Agent Analytics package is a part of the paid Agent Intelligence package for Snowplow CDI."
/>

**The package source code can be found in the [snowplow-incubator/dbt-snowplow-agent-analytics](https://github.com/snowplow-incubator/dbt-snowplow-agent-analytics/) repository, and the docs for the [model design here](https://snowplow-incubator.github.io/dbt-snowplow-agent-analytics/#!/overview/snowplow_agent_analytics).**

The Snowplow Agent Analytics dbt package transforms raw Snowplow [events](/docs/fundamentals/events/index.md) into derived tables for analyzing AI agent traffic. Use it to answer questions such as:

* Which AI agents request pages on your site, and who operates them?
* Which pages do agents request most, and for what purpose: training, search indexing, or fetching content on behalf of a user?
* Do the operators behind those agents, such as OpenAI or Anthropic, refer human page views and sessions back to your site?

The package combines two event sources. Events from [CDN trackers](/docs/sources/cdn-trackers/index.md) record every request, including requests from agents that don't run JavaScript. Client-side page view events from the [JavaScript tracker](/docs/sources/web-trackers/index.md) capture human page views, as well as page views from agents that do run JavaScript. The package identifies agents using the [bot detection](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md), [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md), and [agent classification](/docs/pipeline/enrichments/available-enrichments/agent-classification-enrichment/index.md) enrichments.

Currently, the package supports Snowflake only.

Check out the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/agent-analytics/index.md) and [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/agent-analytics/index.md) pages to get started.

:::note[Simple incremental strategy]
The package uses the incremental manifest from the [Utils package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/index.md) to process new events by load timestamp, rather than the session-based incremental logic used by other Snowplow dbt packages.

This means that the standard guidance around [package mechanics](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/index.md), [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md), and [dbt operations](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) doesn't apply to this package.
:::

## Output models

The package produces three daily fact tables and two summary tables. The daily tables are the source of truth for arbitrary slicing. The summary tables are scorecards built from the daily tables over rolling 7, 30, and 90 day windows.

All tables identify pages with `page_url_host_path`, the concatenation of `page_urlhost` and `page_urlpath`. Events with no page URL use the value `unknown`.

### `agent_pageviews_daily`

The agent fact table. Each row counts the requests from one agent to one page on one day.

| Column               | Description                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `event_date`         | Date of the requests, based on `derived_tstamp`                                                                       |
| `agent_name`         | Name of the agent, for example `GPTBot`                                                                               |
| `agent_operator`     | Organization operating the agent, from the [agent classification](/docs/pipeline/enrichments/available-enrichments/agent-classification-enrichment/index.md) entity; `unknown` when the agent isn't classified     |
| `agent_purpose`      | Purpose of the agent, from the [agent classification](/docs/pipeline/enrichments/available-enrichments/agent-classification-enrichment/index.md#configuration) entity, for example `AI_TRAINING`; `NULL` when unclassified       |
| `purpose_group`      | `AI` for `AI_TRAINING`, `AI_USER_FETCH`, and `AI_SEARCH_INDEX`; `SEARCH` for `SEARCH_INDEX`; `OTHER` otherwise. See the [agent categories](/docs/pipeline/enrichments/available-enrichments/agent-classification-enrichment/index.md#configuration).         |
| `source_channel`     | Channel the agent is counted from: `cdn` or `client`. See [How agent traffic is counted](#how-agent-traffic-is-counted) |
| `page_url_host_path` | Page requested                                                                                                        |
| `hits`               | Number of requests                                                                                                    |
| `first_seen_tstamp`  | Timestamp of the first request in the row                                                                             |
| `last_seen_tstamp`   | Timestamp of the last request in the row                                                                              |

### `human_pageviews_daily`

The human fact table. Each row counts the client-side page views not flagged as bots, per page and day.

| Column               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `event_date`         | Date of the page views                         |
| `page_url_host_path` | Page viewed                                    |
| `human_pageviews`    | Number of human page views                     |
| `first_seen_tstamp`  | Timestamp of the first page view in the row    |
| `last_seen_tstamp`   | Timestamp of the last page view in the row     |

### `human_referrals_daily`

Human page views referred by an AI product, per operator, page, and day. The package attributes a referral to an operator by matching the referrer source and medium against the `operator_referral_sources` seed. It uses the `utm_referrer` entity from the [referrer parser enrichment](/docs/pipeline/enrichments/available-enrichments/referrer-parser-enrichment/index.md#identifying-referrers-from-utm_source) when present, and the `refr_source` and `refr_medium` fields otherwise.

| Column               | Description                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `event_date`         | Date of the page views                                                                                       |
| `referring_operator` | Operator whose product referred the human page view, for example `OpenAI` for ChatGPT                                |
| `page_url_host_path` | Page viewed                                                                                                  |
| `referred_pageviews` | Number of referred page views                                                                                |
| `referred_sessions`  | Number of distinct `domain_sessionid` values. Summing across days over-counts sessions that span midnight.   |
| `first_seen_tstamp`  | Timestamp of the first page view in the row                                                                  |
| `last_seen_tstamp`   | Timestamp of the last page view in the row                                                                   |

### `page_summary`

A per-page scorecard. Each row summarizes one page as of one snapshot date, set by `as_of_date`. The `summary_snapshot_mode` variable controls how often the package takes a snapshot.

| Column                                                           | Description                                                                                                                              |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `page_url_host_path`                                             | Page                                                                                                                                     |
| `as_of_date`                                                     | Snapshot date. All windows end on this date, inclusive.                                                                                  |
| `agent_hits_7d`, `agent_hits_30d`, `agent_hits_90d`              | Agent requests in each window                                                                                                            |
| `distinct_agent_operators_30d`, `distinct_agent_names_30d`       | Number of distinct operators and agents requesting the page in the last 30 days                                                          |
| `ai_training_hits_30d`, `ai_user_fetch_hits_30d`, `ai_search_index_hits_30d`, `search_index_hits_30d` | Agent requests in the last 30 days, by purpose                                                      |
| `first_agent_visit_tstamp`, `last_agent_visit_tstamp`            | First and last agent requests within the last 90 days                                                                                    |
| `human_pageviews_7d`, `human_pageviews_30d`, `human_pageviews_90d` | Human page views in each window                                                                                                        |
| `ai_referral_pageviews_30d`, `ai_referral_sessions_30d`          | AI-referred page views and sessions in the last 30 days                                                                                  |
| `is_orphaned_agent_interest`                                     | `true` when agents request the page often but it gets few human page views. Controlled by the `orphan_agent_hits_threshold` and `orphan_human_pageviews_threshold` variables. |
| `cite_through_rate_proxy_30d`                                    | `ai_referral_pageviews_30d` divided by the sum of `ai_user_fetch_hits_30d` and `ai_search_index_hits_30d`. This is a proxy, not true attribution. |

### `operator_summary`

A per-operator scorecard that compares how much an operator's agents request against how many human sessions its products refer. Each row summarizes one operator as of one snapshot date.

| Column                                                                  | Description                                                                                          |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `agent_operator`                                                        | Operator                                                                                             |
| `as_of_date`                                                            | Snapshot date. All windows end on this date, inclusive.                                              |
| `crawl_hits_7d`, `crawl_hits_30d`, `crawl_hits_90d`                     | Agent requests in each window                                                                        |
| `distinct_agent_names_30d`, `distinct_pages_crawled_30d`                | Number of distinct agents and pages in the last 30 days                                              |
| `ai_training_hits_30d`, `ai_user_fetch_hits_30d`, `ai_search_index_hits_30d`, `other_purpose_hits_30d` | Agent requests in the last 30 days, by purpose                                      |
| `referred_pageviews_7d`, `referred_pageviews_30d`, `referred_pageviews_90d` | Referred page views in each window                                                               |
| `referred_sessions_7d`, `referred_sessions_30d`, `referred_sessions_90d`    | Referred sessions in each window. These are an upper bound on unique sessions.                   |
| `distinct_referred_pages_30d`                                           | Number of distinct pages receiving referrals in the last 30 days                                     |
| `crawl_to_referral_ratio_30d`                                           | `crawl_hits_30d` divided by `referred_sessions_30d`. A high value means the operator requests many more pages than it refers human sessions to. |
| `is_new_operator_7d`                                                    | `true` when the operator's first request or referral happened in the last 7 days                     |

## How agent traffic is counted

This section describes how the package decides which events count as agent traffic, and how it avoids counting the same agent twice.

### Source channels

The package reads two subsets of events from your atomic events table:

* CDN events: events from [CDN trackers](/docs/sources/cdn-trackers/index.md) with an `app_id` listed in the `cdn_app_ids` variable. Every request counts as a hit, whether or not the client runs JavaScript. The package deduplicates these events on `event_fingerprint`, so enable the [event fingerprint enrichment](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md). Without it, deduplication falls back to `event_id`.
* Client events: `page_view` events from the `web` platform, optionally restricted to the `app_id` values in `client_app_ids`.

Agents that run JavaScript appear in both subsets. To avoid double counting, the package assigns each agent a single source channel. An agent is counted from `client` events once it has ever been seen client-side, because client-side tracking handles single-page applications better. Otherwise it's counted from `cdn` events. Once an agent is assigned to `client`, it never moves back to `cdn`.

The package only includes an agent in the agent tables if the bot detection enrichment flagged it on a CDN event at some point. CDN events only carry the user agent string, so a CDN bot flag means the agent can be identified by name. Agents flagged only client-side, for example by ASN lookups or the client-side bot detection plugin, don't have a reliable identity.

### Agent identity

The package takes `agent_name` from the `agentName` field of the YAUAA entity, and `agent_operator` and `agent_purpose` from the agent classification entity.

Some crawlers send a user agent string that imitates a browser, for example:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 (compatible; meta-externalagent/1.1; +https://...)
```

YAUAA reports this agent as `Chrome`, and the agent classification enrichment leaves `operator` and `purpose` empty. Two seeds correct for this:

| Seed                     | Purpose                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent_ua_overrides`     | Replaces `agent_name`, and fills `agent_operator` and `agent_purpose` when the enrichment left them empty, for user agents matching `ua_pattern` with `ILIKE` |
| `agent_name_ignore_list` | Agent names too generic to identify an agent, such as `Chrome`. The package excludes them from the agent tables.                                |

Add a row to `agent_ua_overrides` for each crawler that YAUAA misidentifies. The ignore list is a safeguard for crawlers the overrides don't cover: without it, a single bot-flagged CDN event reported as `Chrome` would pull every client-side `Chrome` event from a datacenter IP address into the agent tables.

## Query the models

The examples below show common questions you can answer with the output tables.

Find the top agents visiting your site in the last 30 days:

```sql
select agent_name, agent_operator, sum(hits) as hits
from agent_pageviews_daily
where event_date >= current_date - 30
  -- and purpose_group = 'AI'
group by 1, 2
order by hits desc
limit 20;
```

Find the pages that one operator's agents request most:

```sql
select page_url_host_path, sum(hits) as hits
from agent_pageviews_daily
where event_date >= current_date - 30
  and agent_operator = 'OpenAI'
group by 1
order by hits desc
limit 20;
```

Find agents first seen in the last 7 days:

```sql
select agent_name, agent_operator, min(event_date) as first_seen_date
from agent_pageviews_daily
group by 1, 2
having min(event_date) >= current_date - 7;
```

Find pages that agents request often but that get few human page views:

```sql
select *
from page_summary
where as_of_date = (select max(as_of_date) from page_summary)
  and is_orphaned_agent_interest
order by agent_hits_30d desc;
```

Compare how much each operator requests against how many human sessions it refers:

```sql
select agent_operator, crawl_hits_30d, referred_sessions_30d, crawl_to_referral_ratio_30d
from operator_summary
where as_of_date = (select max(as_of_date) from operator_summary)
order by crawl_to_referral_ratio_30d desc nulls first;
```

## Query with a Snowflake semantic view

The package can build a [Snowflake semantic view](https://docs.snowflake.com/en/sql-reference/sql/create-semantic-view) over the three daily fact tables. This lets Cortex Analyst, or any other natural language interface, query the package without custom prompts. See the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/agent-analytics/index.md#enable-the-semantic-view-optional) to enable it.

The semantic view, `agent_analytics_semantic_view`, joins the fact tables through three shared dimension tables, `dim_date`, `dim_page`, and `dim_operator`, so that each metric aggregates within its own table before the join:

```text
agent_pageviews_daily ─┬─> dim_date ────┐
human_pageviews_daily ─┼─> dim_page ────┼─> agent_analytics_semantic_view
human_referrals_daily ─┴─> dim_operator ┘
```

For example, to compare operators by crawl-to-referral ratio:

```sql
select * from semantic_view(
  snowplow_agent_analytics.agent_analytics_semantic_view
  METRICS total_agent_hits, total_referred_sessions, crawl_to_referral_ratio
  DIMENSIONS operator
) order by crawl_to_referral_ratio desc nulls last;
```

The view includes instructions for SQL generation that describe the caveats of the data. For example, agent hits and human page views come from different channels and don't form a funnel, and summing `referred_sessions` across days over-counts sessions.

The semantic view doesn't cover `page_summary` or `operator_summary`, since they summarize the same data.

## Known limitations

Keep these limitations in mind when interpreting the output tables:

* Once an agent is counted from `client` events, the package drops its CDN requests. If the agent runs JavaScript on some pages but not others, for example when it requests a JSON API endpoint, those requests aren't counted.
* CDN hit counts are a lower bound. Two distinct CDN requests with identical payloads share an event fingerprint and count as one hit. CDN events that share an `event_id` but have different fingerprints also count as one hit.
* Summary windows end on `as_of_date`. In `weekly` snapshot mode, `as_of_date` is the Monday of the current week, so data from Tuesday onward appears in the following week's snapshot.
* Referred session counts in the summary tables are an upper bound on unique sessions, because sessions that span midnight are counted once per day.
* `cite_through_rate_proxy_30d` is a proxy, not true attribution.
