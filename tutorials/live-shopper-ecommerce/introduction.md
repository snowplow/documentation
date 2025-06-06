---
position: 1
title: Introduction
---

Welcome to the **Snowplow Live Shopper** solution accelerator for ecommerce.

This accelerator demonstrates how to leverage **Snowplow's behavioral data** to monitor and act on shopper behavior **while they're still navigating** your site.

Traditional analytics stacks focus on deriving insights after the fact—business intelligence dashboards that show what happened. With real-time monitoring, it's possible to unlock new opportunities to convert sales by proactively initiating a live chat, sending a unique discount code, or detecting surges in shopper activity or product views.

In this accelerator, you'll learn how to calculate key metrics based on behavioral data that can power other systems in near real-time. This data is stored in fast, low-cost infrastructure, enabling machine learning features, dashboards, notifications, chat systems, and more to understand shopper behavior and take the best next action at any moment.

After you set up the project, you can explore the system via three tools:
- [**Snowplow ecommerce store**](https://github.com/snowplow-industry-solutions/ecommerce-nextjs-example-store) (left)
- [**AKHQ**](https://akhq.io/) a Kafka visualization tool (center)
- [**Redis Insights**](https://redis.io/insight/) a Redis visualization tool (right)

All interactions on the store flow through [**Snowplow Local**](https://github.com/snowplow-incubator/snowplow-local) and are streamed into Kafka, where they are processed using Flink.

![live-shopper-introduction.webp](./images/live-shopper-introduction.webp)

These metrics can also feed longer-term dashboards and promote a shift-left approach to analytics—processing metrics in the data pipeline itself to create a single source of truth for computations and aggregation logic. This enhances the quality and reusability of your data.

Real-time behavioral data creates new opportunities in retail, social and video networks, gaming, gambling, and other engagement-driven industries. It allows you to analyze individual users as well as platform-wide trends as they unfold.

## Prerequisites

This accelerator is fully Dockerized. The only prerequisite is **Docker 28+**.

## Solution accelerator code

The code for this accelerator [is available on GitHub](https://github.com/snowplow-industry-solutions/flink-live-shopper).
