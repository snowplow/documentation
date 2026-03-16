---
title: "View and filter events in the Snowplow Micro dashboard"
sidebar_position: 4
sidebar_label: "Explore events"
description: "Access the Micro dashboard to view, filter, and investigate good and bad events. Share the dashboard with colleagues through public domain names."
keywords: ["micro dashboard", "event inspection", "filter events", "view events"]
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
