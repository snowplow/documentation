---
title: "Managing alerts"
description: "Manage and maintain failed event alert configurations for ongoing behavioral data quality monitoring."
schema: "TechArticle"
keywords: ["Alert Management", "Managing Alerts", "Alert Administration", "Alert Control", "Notification Management", "Alert Operations"]
sidebar_position: 2
---

This page explains how to edit, delete, or review existing failed event alerts.

## View alerts

1. Navigate to **Data Quality** in the left sidebar
2. Click **Manage alerts** in the top-right corner
3. View all configured alerts with their destinations

![Manage alerts interface](images/dq_list_alerts.png)

## Edit an alert

1. Click the arrow next to the alert name
2. Modify destination, filters, or recipients
3. Click **Save** to update

## Delete an alert

1. Click the arrow next to the alert name
2. Click on the three dots button
3. Click **Delete**
4. Confirm deletion

## Multiple notifications

Alerts trigger when new failed events match your filters. You may receive multiple notifications for the same failed events in the following scenarios:
- Rolling window detection: alerts use rolling time windows to detect failed events. The same failed event type will continue triggering notifications as each consecutive window passes and detects the events again.
- Overlapping alert configurations: multiple alerts may capture the same failed events when their filter criteria overlap. This results in duplicate notifications, especially when alerts are configured to send to the same destination (same Slack channel or email address).
