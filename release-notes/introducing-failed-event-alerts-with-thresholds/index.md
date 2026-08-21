---
title: "Introducing failed event alerts with thresholds"
description: "We are excited to announce threshold-based alerting for Failed Events, a new enhancement to the Data Quality Dashboard."
date: "2025-11-06"
category:
  - "Product news"
components:
  - "Console"
  - "Monitoring"
---
We are excited to announce threshold-based alerting for Failed Events, a new enhancement to the Data Quality Dashboard. This feature allows you to set volume thresholds for your failed event alerts, helping you distinguish between minor data quality issues and critical problems that require immediate attention.

By configuring alerts to trigger only when failed events exceed a specific threshold within a defined time interval, you can reduce alert fatigue and ensure your team focuses on the issues that truly impact your data pipelines and downstream applications.

## What's New

### Volume-Based Alert Triggers

You can now configure alerts to fire when failed events exceed a specific count within a chosen time interval. Available time intervals include:

* 10 minutes
* Hour
* Daily

### Intelligent Threshold Recommendations

When configuring a threshold-based alert, the Data Quality Dashboard analyzes your pipeline's failed event patterns from the past 7 days and provides a recommended threshold value. This suggestion is calculated as twice your average failed event rate, helping you set a threshold that accounts for normal variance while catching genuine spikes.

### Flexible Delivery Schedules

Configure how frequently alerts are sent when threshold conditions are met:

* Daily: Receive one alert per day if the trigger condition is detected
* Weekly: Receive one alert per week if the trigger condition is detected
* Monthly: Receive one alert per month if the trigger condition is detected

This ensures you maintain awareness of ongoing issues without overwhelming your team with repeated notifications.

## Key Benefits

**Reduced Alert Noise**: Focus on volume spikes that indicate real problems rather than individual failed events that may be expected or insignificant.

**Data-Driven Threshold Setting**: Use your own pipeline's historical behavior to set appropriate thresholds instead of guessing at reasonable values.

**Flexible Monitoring Cadence**: Choose delivery frequencies that match your team's operational rhythms and response capabilities.

**Faster Issue Detection**: Quickly identify when failed event volumes spike above normal levels, enabling faster investigation and resolution.

## Prerequisites

This feature requires the Data Quality Dashboard add-on to be enabled for your pipeline. The Data Quality Dashboard, which is part of the Data Product Studio, is supported for pipelines using:

* BigQuery V2 Failed Events Loaders
* Snowflake Failed Events Loaders

## Learn More

* [Data Quality Dashboard documentation](/docs/monitoring/)
* [Failed Event Alerts documentation](/docs/monitoring/alerts/failed-event-alerts/)
