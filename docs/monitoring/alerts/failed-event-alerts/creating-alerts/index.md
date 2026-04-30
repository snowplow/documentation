---
title: "Create failed event alerts in Console"
sidebar_position: 1
sidebar_label: "Creating alerts"
description: "Configure email or Slack alerts for failed events with custom filters and thresholds in the data quality dashboard."
keywords: ["failed event alerts setup", "data quality dashboard alerts", "Slack alert configuration"]
---

Set up failed event alerts to receive notifications when failed events occur in your data pipeline.


You'll need access to the [data quality dashboard](/docs/monitoring/index.md#data-quality-dashboard).

To create an alert, go to Snowplow Console:
1. Navigate to **Data Quality** in the left sidebar
2. Click **Manage alerts** in the top-right corner
3. Click **Create alert**

![Manage alerts page in an empty state showing "No alerts added" and a Create alert button](images/data_quality_create_alert.png)

## Configure destination

Choose how you want to receive notifications:

### Email notifications

1. Select **Email** as destination
2. Add recipient email addresses
3. Click **Add filters** to configure filters
4. Configure triggers as needed
5. Enter alert name (e.g., "mobile-app")

![Create alert form with Email selected as the destination, two recipient addresses added, trigger set to "When above value" with insights showing 750 failed events per day and a suggested threshold of 1.50k, delivery set to Daily, and the alert named "web-login"](images/data_quality_create_email_alert.png)

### Slack notifications

1. Select **Slack** as destination
2. Select Slack channel from dropdown
3. Click **Add filters** to configure filters
4. Configure triggers as needed
5. Enter alert name (e.g., "web-app")

![Create alert form with Slack selected as the destination and #slack-alerts-test chosen as the Slack channel](images/data_quality_create_slack_alert.png)

When no active Slack integration is found, a `Connect with Slack` button will appear instead of the list of channels.

![Destination section showing a "Connect with Slack" button, which appears when no active Slack integration is found](images/data_quality_connect_slack.png)

A Slack consent screen will appear.

![Slack permission screen requesting access for "Snowplow Notifications" to view channel content and perform actions in the Snowplow Slack workspace](images/data_quality_slack.png)

To select channels in the UI, first add the app to those channels. In Slack:

1. Open the channel where you want notifications
2. Type `@Snowplow Notifications` and send
3. Click "Add them" when prompted

![Slackbot message saying "You mentioned @Snowplow Notifications, but they're not in this channel," with Add them and Do nothing buttons](images/data_quality_slack_invite.png)

Once a Slack alert is configured you will see a confirmation notification in the selected Slack channel.

![Slack message from Snowplow Notifications confirming a successful integration, showing alert name "web-login" and active filters for ResolutionError and ValidationError issue types on the mobile-login data structure](images/data_quality_slack_confirmation.png)

## Set up filters

Configure when alerts should trigger:

1. **Issue types**: select `ValidationError`, `ResolutionError`, or both
2. **Data structures**: choose specific data structures (all versions will apply)
3. **App IDs**: filter by application identifiers

![Filters panel showing ResolutionError and ValidationError selected as issue types, the mobile-login data structure filtered, and no app IDs configured](images/data_quality_filters.png)

## Configure triggers

Set up when alerts should be triggered based on failed event conditions:

### Trigger types

Choose from the available trigger options:

- **When above value**: Set an absolute threshold for failed events (e.g., 1,500 failed events per hour)
- **On any issue**: Alert when any failed events are detected

![Alert trigger type selector with two options: "When above value" for setting an absolute failed event threshold, and "On any issue" for alerting whenever any failed events are detected](images/data_quality_trigger_types.png)

### Threshold configuration

When using "When above value" trigger:

1. **Value**: Enter the threshold number of failed events
2. **Time period**: Select the time window (10 minutes, hour, or day)
3. **Deliver**: Choose notification frequency (daily, weekly, or monthly)

![Alert threshold configuration panel showing Value, Time period, and Deliver fields, alongside an Insights panel with average event volume, a suggested threshold value, and an Apply suggestion button based on the last 7 days of data](images/data_quality_absolute_threshold.png)

#### Insights from recent data

When configuring a threshold alert, the Insights panel displays data from the last 7 days to help you choose an appropriate threshold:

- **Average events volume** - Shows the average counts of valid and failed events (per relevant time unit)
- **Suggested threshold** - Provides a recommended threshold value based on recent patterns
- **Apply suggestion** - Click to automatically populate the threshold value field with the suggested value

Use these insights to set realistic thresholds that reflect your actual event patterns.

**Alert delivery:** If the trigger condition is met, the alert is sent once per delivery interval you selected.

## Complete setup

1. Review your configuration
2. Click **Confirm** to create the alert
3. Your alert will appear in the alerts list

## Alert frequency

Alerts are checked every 10 minutes. You'll receive notifications when new failed events match your filter criteria.
