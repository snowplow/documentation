---
title: "Configure Snowplow Signals"
position: 4
sidebar_label: "Configure Signals"
description: "Create an attribute group, publish it, and set up a Signals service to serve real-time user attributes."
keywords: ["snowplow signals", "attribute group", "signals service", "real-time attributes", "profiles store"]
date: "2026-04-10"
---

The next step is to define the user attributes you want to compute. You'll do this within [Snowplow Console](https://console.snowplowanalytics.com).

## Create a Basic Web attribute group

Use one of Signals' built-in [attribute group](/docs/signals/concepts/#attribute-groups) templates to define attributes. Use the `domain_sessionid` as attribute key to compute session-level attributes.

1. In [Console](https://console.snowplowanalytics.com), navigate to **Signals** > **Attribute Groups**
2. Click **Create attribute group** and choose **Basic Web**
3. Set the **Attribute Key** to `domain_sessionid`

The Basic Web template includes these attributes:

| Attribute               | Description                                |
| ----------------------- | ------------------------------------------ |
| `page_views_count`      | Total number of page views in the session  |
| `unique_pages_viewed`   | List of unique URLs visited in the session |
| `first_event_timestamp` | When the session started                   |
| `last_event_timestamp`  | When the most recent event was recorded    |

Test your attribute group by clicking **Run Preview** before saving, to verify it's computing correctly based on recent events in your pipeline. This runs a query against your event data in your data warehouse and shows the computed attributes for recent sessions.

Click **Create attribute group** when you're happy with the attribute group.

## Publish the attribute group

[Attribute groups](/docs/signals/concepts/#attribute-groups) need to be published before Signals will start computing:

1. Open your attribute group and click **Publish**
2. Confirm the publish to deploy the computation logic to the pipeline

Once published, Signals will start computing attributes for each user session as events arrive.

## Create a service

A [service](/docs/signals/concepts/#services) provides a pull-based API endpoint that exposes your computed attributes for a specific attribute (lookup) key.

Services allow you to combine multiple attribute groups if needed, but for this tutorial, use just the one you created in the last step.

1. Navigate to **Signals** > **Services**
2. Click **Create service**
3. Configure:
   - **Name**: `web-agent-context`
   - **Attribute groups**: Select the attribute group you just published
4. Click **Create service**

The page will show you retrieval instructions for Node.js. You'll need these to set up your API client in the next step.
