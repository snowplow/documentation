---
title: "Creating alerts"
sidebar_position: 1
---

Set up failed event alerts to receive notifications when failed events occur in your data pipeline.


You'll need access to the [data quality dashboard](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#data-quality-dashboard).

To create an alert, go to Snowplow Console:
1. Navigate to **Data Quality** in the left sidebar
2. Click **Manage alerts** in the top-right corner
3. Click **Create alert**

![Create alert form](images/dq_create_alert.png)

## Configure destination

Choose how you want to receive notifications:

### Email notifications

1. Select **Email** as destination
2. Enter alert name (e.g., "mobile-app")
3. Add recipient email addresses
4. Click **Add filters** to configure triggers

![Email destination configuration](images/dq_create_email_alert.png)

### Slack notifications

1. Select **Slack** as destination
2. Enter alert name (e.g., "web-app")
3. Select Slack channel from dropdown
4. Click **Add filters** to configure triggers

![Slack destination configuration](images/dq_create_slack_alert.png)

When no active Slack integration is found, a `Connect with Slack` button will appear instead of the list of channels.

![Connect to Slack](images/dq_connect_slack.png)

A Slack consent screen will appear.

![Slack consent](images/dq_slack.png)

To select channels in the UI, first add the app to those channels. In Slack:

1. Open the channel where you want notifications
2. Type `@Snowplow Notifications` and send
3. Click "Add them" when prompted

![Invite to Slack](images/dq_slack_invite.png)

Once a Slack alert is configured you will see a confirmation notification in the selected Slack channel.

![Slack confirmation](images/dq_slack_confirmation.png)

## Set up filters

Configure when alerts should trigger:

1. **Issue types**: select `ValidationError`, `ResolutionError`, or both
2. **Data structures**: choose specific data structures (all versions will apply)
3. **App IDs**: filter by application identifiers

![Filter configuration](images/dq_filters.png)

## Complete setup

1. Review your configuration
2. Click **Confirm** to create the alert
3. Your alert will appear in the alerts list

## Alert frequency

Alerts are checked every 10 minutes. You'll receive notifications when new failed events match your filter criteria.
