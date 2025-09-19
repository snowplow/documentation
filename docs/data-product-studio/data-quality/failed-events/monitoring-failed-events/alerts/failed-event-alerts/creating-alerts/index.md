---
title: "Creating alerts"
sidebar_position: 1
---

Set up failed event alerts to receive notifications when failed events occur in your data pipeline.


You'll need access to the [data quality dashboard](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#data-quality-dashboard).

To create an alert, go to the BDP Console:
1. Navigate to **Data Quality** in the left sidebar
2. Click **Manage alerts** in the top-right corner
3. Click **Create alert**

![Create alert form](images/data_quality_create_alert.png)

## Configure destination

Choose how you want to receive notifications:

### Email notifications

1. Select **Email** as destination
2. Add recipient email addresses
3. Click **Add filters** to configure filters
4. Configure triggers as needed
5. Enter alert name (e.g., "mobile-app")

![Email destination configuration](images/data_quality_create_email_alert.png)

### Slack notifications

1. Select **Slack** as destination
2. Select Slack channel from dropdown
3. Click **Add filters** to configure filters
4. Configure triggers as needed
5. Enter alert name (e.g., "web-app")

![Slack destination configuration](images/data_quality_create_slack_alert.png)

When no active Slack integration is found, a `Connect with Slack` button will appear instead of the list of channels.

![Connect to Slack](images/data_quality_connect_slack.png)

A Slack consent screen will appear.

![Slack consent](images/data_quality_slack.png)

To select channels in the UI, first add the app to those channels. In Slack:

1. Open the channel where you want notifications
2. Type `@Snowplow Notifications` and send
3. Click "Add them" when prompted

![Invite to Slack](images/data_quality_slack_invite.png)

Once a Slack alert is configured you will see a confirmation notification in the selected Slack channel.

![Slack confirmation](images/data_quality_slack_confirmation.png)

## Set up filters

Configure when alerts should trigger:

1. **Issue types**: select `ValidationError`, `ResolutionError`, or both
2. **Data structures**: choose specific data structures (all versions will apply)
3. **App IDs**: filter by application identifiers

![Filter configuration](images/data_quality_filters.png)

## Configure triggers

Set up when alerts should be triggered based on failed event conditions:

### Trigger types

Choose from the available trigger options:

- **When above value**: Set an absolute threshold for failed events (e.g., 1,500 failed events per hour)
- **On any issue**: Alert when any failed events are detected

![Trigger configuration showing trigger type selection](images/data_quality_trigger_types.png)

### Threshold configuration

When using "When above value" trigger:

1. **Value**: Enter the threshold number of failed events
2. **Time period**: Select the time window (10 minutes, hour, or day)
3. **Deliver**: Choose notification frequency (daily, weekly, or monthly)

![Value threshold configuration with insights panel](images/data_quality_absolute_threshold.png)

An alert will be sent once per the selected delivery frequency if the trigger condition is met.

## Complete setup

1. Review your configuration
2. Click **Confirm** to create the alert
3. Your alert will appear in the alerts list

## Alert frequency

Alerts are checked every 10 minutes. You'll receive notifications when new failed events match your filter criteria.
