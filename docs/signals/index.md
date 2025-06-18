---
title: "Snowplow Signals"
sidebar_position: 8
description: "An overview of Signals concepts."
sidebar_label: "Signals"
---

Snowplow Signals is a personalization engine built on Snowplow's behavioral data pipeline.

Signals allows you to capture aggregate data attributes about the entities you track events for (such as users, sessions, products, pages, etc), and influence future behavior by sending interventions to users that are currently interacting with those entities.

The technical core of Signals is the Profile API used for defining and managing attributes and delivering interventions.
The Profile API is hosted in your BDP cloud and can be interacted with using the Signals APIs and SDKs. <!-- TODO: link to API/SDK references -->
Signals also provides infrastructure for working with Snowplow event data in the real-time event stream, and historical data located in your data warehouse.

![](./images/signals.png)

Signals allows you to enhance your applications by aggregating historical attributes and providing near real-time visibility into customer behavior.
Use the aggregated attributes and interventions to power in-product personalization and recommendations engines, adaptive user interfaces, and agentic applications like AI copilots and chat-bots.
