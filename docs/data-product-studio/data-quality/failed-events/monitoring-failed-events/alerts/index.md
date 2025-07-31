---
title: "Setting up failed event alerts"
date: "2025-01-14"
sidebar_label: "Alerts"
sidebar_position: 2500
---


Snowplow can alert you when a new failed event has occurred. There are two different implementations available to choose from.

- **[Failed event alerts](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/alerts/failed-event-alerts/index.md)**
Driven by the [Data quality dashboard](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#data-quality-dashboard) deployment

- **[Classic alerts](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/alerts/classic-alerts/index.md)**
Driven by the [Snowplow infrastructure](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#default-view), these are cheaper to run

## Feature comparison

| Feature                                       | Classic alerts | Failed event alerts |
| :-------------------------------------------- | :------------: | :-----------------: |
| Can alert on new failed events                |       ✅        |          ✅          |
| Can send a digest of failed events for a week |       ✅        |          ✅          |
| Notify via Email                              |       ✅        |          ✅          |
| Notify via Slack                              |       ❌        |          ✅          |
| Filters                                       |       ❌        |          ✅          |
| Does not affect pipeline cost                 |       ✅        |          ❌          |
