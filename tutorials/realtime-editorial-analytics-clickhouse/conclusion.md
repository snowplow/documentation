---
position: 3
title: "Conclusions and next steps from the Real-time Editorial Analytics accelerator"
sidebar_label: "Conclusion"
description: "Complete your real-time event-driven architecture for editoral analytics with Snowplow and Clickhouse for real-time insights."
keywords: ["clickhouse real-time analytics", "media publisher analytics snowplow", "editorial analytics"]
---

In this tutorial, you've explored the **real-time editorial analytics** solution accelerator for gaining practical experience into building, deploying, and extending real-time, event-driven architectures using Snowplow and Clickhouse.

You have successfully built a real time system for processing event data including:
- **Web tracking application** for collecting article interaction and ad performance events
- **Snowplow Micro and Snowbridge** for event processing and forwarding
- **Clickhouse** for processing and storing real-time event-level data
- **Editoral Analytics Dashboard front-end** for visualizing real-time content engagement behaviour on the web tracking application

![Real-time analytics dashboard](images/realtime-dashboard.png)

This architecture highlights how real-time insights can be achieved using event-driven systems in a streaming context.

## What you achieved

You explored how to:
1. Use Snowplow Micro to emulate a full Snowplow pipeline for local development and testing
2. Launch and interact with the system components, such as the Clickhouse UI and Micro UI
3. View and verify the real-time event data from the browser using Snowplow's granular content tracking capabilities

This tutorial can be extended to utilize Snowplow event data for other real-time use cases, such as:
- Web Engagement analytics
- Personalized content recommendations
- Ad performance tracking
- Search and Content Re-ranking

## Next steps

- **Extend tracking:** extend the solution to track more granular user interactions or track on a new platform such as mobile
- **Personalize Content Recommendations:** extend the solution to change the Featured Article on the homepage based on the most-viewed article from the last 30 minutes
- **Exclude Content:** extend the solution to exclude any content already viewed by the current user
- **Real-time Content Scoring:** extend the solution to compute a real-time score for each article, based on the latest engagement


By completing this tutorial, you're equipped to harness the power of event-driven systems and Snowplow's analytics framework to build dynamic, real-time solutions tailored to your streaming and analytics needs.
