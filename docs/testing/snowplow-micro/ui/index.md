---
title: "View and filter events in the Snowplow Micro dashboard"
sidebar_position: 4
sidebar_label: "Explore events"
description: "Access the Micro dashboard to view, filter, and investigate good and bad events. Share the dashboard with colleagues through public domain names."
keywords: ["micro dashboard", "event inspection", "filter events", "view events"]
content_type: how-to
---

Micro provides a user interface that helps you explore events sent to it, including [failed events](/docs/fundamentals/failed-events/index.md).

If you are [running Micro through Console](/docs/testing/snowplow-micro/console/index.md), navigate to the **Pipelines** side menu and select your Micro. Then click **Open dashboard**. You will need the _View environments_ permission to access the dashboard.

If you are [running Micro locally](/docs/testing/snowplow-micro/local/index.md), head to [http://localhost:9090/micro/ui](http://localhost:9090/micro/ui) in your web browser.

Here’s an overview of the dashboard functionality:

```mdx-code-block
import TrackedReactFilePlayer from '@site/src/components/TrackedReactFilePlayer'
import videoUrl from '../images/ui-tour.mp4'
```

<TrackedReactFilePlayer label="Micro dashboard" controls url={videoUrl} width='100%' height='100%' />

## Filter events

Filterable columns in the events table have a filter box under their header. Type a value and press Enter, or pick one of the suggested values. When you select several values, the table shows events matching any of them. To filter by time, use the time range filter instead.

When you [run Micro through Console](/docs/testing/snowplow-micro/console/index.md) or [persist events in PostgreSQL](/docs/testing/snowplow-micro/local/advanced-usage/index.md#persisting-events-across-restarts), filters use exact matching. Since version 4.7.0, you can filter on any column except timestamps, including fields of self-describing events and entities. A filter on an entity field matches events where at least one entity of that type has the value.

Most columns are read from the stored event, so filtering on them only searches the most recent 100,000 events. Their filter placeholder reads **Filter (last 100k events)...**. The columns `event_id`, `app_id`, `event_name`, `platform`, `name_tracker`, `user_id`, `domain_userid`, `network_userid`, and `v_tracker` search all events.

When Micro stores events in memory, filters use case-insensitive substring matching and search all events.
