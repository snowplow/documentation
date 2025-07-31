---
title: "Setting up data quality alerts"
date: "2025-01-14"
sidebar_label: "Alerts"
sidebar_position: 2500
---


Snowplow can alert you when a new failed event has occurred. There are two different implementations available to choose from.

### [Data quality alerts](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/alerts/data-quality-alerts/index.md)
Driven by the [Data Quality dashboard](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#data-quality-dashboard) deployment

### [Classic alerts](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/alerts/classic-alerts/index.md)
Driven by the [Snowplow infrastructure](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#default-view), cheaper to run

### Feature comparison

| Feature | Classic alerts | Data quality alerts |
| :------ | :------------: | :-----------------: |
| Can alert on new failed events | ✅ | ✅ |
| Can send a digest of failed events for a week | ✅ | ✅ |
| Notify via Email | ✅ | ✅ |
| Notify via Slack | ❌ | ✅ |
| Filters | ❌ | ✅ |
| Does not affect pipeline cost | ✅  | ❌ |
