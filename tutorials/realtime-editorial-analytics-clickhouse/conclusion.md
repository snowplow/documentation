---
position: 3
title: "Conclusions and next steps from the Real-time Editorial Analytics accelerator"
sidebar_label: "Conclusion"
description: "Complete your real-time event-driven architecture for editorial analytics with Snowplow and ClickHouse for real-time insights."
keywords: ["clickhouse real-time analytics", "media publisher analytics snowplow", "editorial analytics"]
date: "2025-09-09"
---

You've completed the real-time editorial analytics solution accelerator. You've gained practical experience building, deploying, and extending real-time, event-driven architectures using Snowplow and ClickHouse.

You have successfully built a real-time system for processing event data including:
- **Web tracking application** for collecting article interaction and ad performance events.
- **Snowplow Micro and Snowbridge** for event processing and forwarding. You explored how to use Snowplow Micro to emulate a full Snowplow pipeline for local development and testing.
- **ClickHouse** for processing and storing real-time event-level data.
- **Editorial Analytics Dashboard front-end** for visualizing real-time content engagement behavior on the web tracking application.

![The Daily Query Analytics Dashboard showing Trending Articles, Trending Categories, and Ad Performance sections, each with metrics for the last 30 minutes including impressions, views, scroll depth, and engaged time](images/realtime-dashboard.png)

This architecture highlights how real-time insights can be achieved using event-driven systems in a streaming context.

This accelerator can be extended to use Snowplow event data for other real-time use cases, such as:
- Web engagement analytics
- Personalized content recommendations
- Ad performance tracking
- Search and content re-ranking

## Next steps

The following extensions are a good starting point for building on this accelerator:

- **Extend tracking:** extend the solution to track more granular user interactions or track on a new platform such as mobile
- **Personalize content recommendations:** extend the solution to change the Featured Article on the homepage based on the most-viewed article from the last 30 minutes
- **Exclude content:** extend the solution to exclude any content already viewed by the current user
- **Real-time content scoring:** extend the solution to compute a real-time score for each article, based on the latest engagement

By completing this tutorial, you're equipped to build event-driven systems that deliver real-time analytics tailored to your streaming needs.
