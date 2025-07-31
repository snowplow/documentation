---
title: "Setting up failed event alerts"
date: "2025-01-14"
sidebar_label: "Alerts"
sidebar_position: 2500
---


Snowplow can alert you when a new failed event has occurred. There are two different implementations available to choose from:

- [Failed event alerts](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/alerts/failed-event-alerts/index.md)
    Run queries directly against the customer's data warehouse as frequent as every 10 minutes. 
    This approach keeps warehouse workers continuosly active, resulting in higher compute costs compared to classic alerts, but provides faster detection, more configurable and richer alert context.

- [Classic alerts](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/alerts/classic-alerts/index.md)
    Offer cost-effective monitoring by executing queries against our internal telemetry data warehouse tables. 
    This approach minimizes customer infrastructure costs since the computational load runs on our systems.

## Feature comparison

| Feature                                       | Classic alerts | Failed event alerts |
| :-------------------------------------------- | :------------: | :-----------------: |
| Can alert on new failed events                |       ✅        |          ✅          |
| Can send a digest of failed events for a week |       ✅        |          ✅          |
| Notify via Email                              |       ✅        |          ✅          |
| Notify via Slack                              |       ❌        |          ✅          |
| Filters                                       |       ❌        |          ✅          |
| Does not affect pipeline cost                 |       ✅        |          ❌          |
