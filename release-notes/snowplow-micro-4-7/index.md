---
title: "Snowplow Micro 4.7: filter on any column in Micro in Console"
description: "Micro 4.7.0 lets you filter events on any column, including self-describing event and entity fields, when events are stored in PostgreSQL, as in Micro in Console."
date: "2026-11-24"
category:
  - "Release notes"
components:
  - "Testing"
---

Snowplow Micro 4.7.0 is out. Here is what is new since 4.6.2.

## Filter on any column in Micro in Console

When Micro stores events in PostgreSQL, which is the case for [Micro in Console](/docs/testing/snowplow-micro/console/), the [dashboard](/docs/testing/snowplow-micro/ui/) used to let you filter on only a handful of columns, such as `app_id` and `event_name`. You can now filter on any column except timestamps, including fields of self-describing events and entities. For example, you can find the events whose product entity has a given SKU.

To keep the dashboard responsive on large datasets, filters on most columns only search the most recent 100,000 events. The filter placeholder tells you when this applies. The same filtering is available through the [`/micro/events` API](/docs/api-reference/snowplow-micro/api/#microevents).

## Other changes

Micro now runs Collector 3.10.0 and Enrich 6.15.0. We also bumped dependencies to their latest versions.
