---
title: "Configure Snowplow Signals"
sidebar_label: "Configure Signals"
position: 4
description: "Create an attribute group from the Basic Web template, publish it, and expose the attributes through a Signals service for lookup by session ID."
keywords: ["Signals", "attribute group", "service", "Basic Web", "domain_sessionid"]
date: "2026-04-17"
---

The next step is to define the user attributes you want to compute. You'll do this within [Snowplow Console](https://console.snowplowanalytics.com).

## Create a Basic Web attribute group

Use one of Signals' built-in [attribute group](/docs/signals/concepts/#attribute-groups) templates to define attributes. Use the `domain_sessionid` as attribute key to compute session-level attributes.

1. In [Console](https://console.snowplowanalytics.com), navigate to **Signals** > **Attribute Groups**
2. Click **Create attribute group** and choose **Basic Web**
3. Set the **Attribute Key** to `domain_sessionid`

The Basic Web template includes these attributes:

| Attribute               | Description                               |
| ----------------------- | ----------------------------------------- |
| `page_views_count`      | Total number of page views in the session |
| `unique_pages_viewed`   | A map of each distinct page path to the number of times it was viewed in the session (e.g. `{"/products/electronics/wireless-headphones": 3, "/pricing": 1}`) |
| `first_event_timestamp` | When the session started                  |
| `last_event_timestamp`  | When the most recent event was recorded   |

Test your attribute group by clicking **Run Preview** before saving, to verify it's computing correctly based on recent events in your pipeline. This runs a query against your event data in your data warehouse and shows the computed attributes for recent sessions.

Click **Create attribute group** when you're happy with the attribute group.

## Publish the attribute group

[Attribute groups](/docs/signals/concepts/#attribute-groups) need to be published before Signals will start computing:

1. Open your attribute group and click **Publish**
2. Confirm the publish to deploy the computation logic to the pipeline

Once published, Signals starts computing attributes for each user session as events arrive.

## Create a service

A [service](/docs/signals/concepts/#services) provides a pull-based API endpoint that exposes your computed attributes for a specific attribute (lookup) key.

Services allow you to combine multiple attribute groups if needed, but for this tutorial, use just the one you created in the last step.

Use this exact service name. It's the same as the `SNOWPLOW_SIGNALS_SERVICE_NAME` environment variable you configured in your `.env` file.

1. Navigate to **Signals** > **Services**
2. Click **Create service**
3. Configure:
   - **Name**: `web_agent_context`
   - **Attribute groups**: Select the attribute group you just published
4. Click **Create service**

The service returns attributes for a given session ID in this format:

```json
{
  "page_views_count": 12,
  "unique_pages_viewed": {
    "/": 1,
    "/products/electronics": 2,
    "/products/electronics/wireless-headphones": 4,
    "/products/electronics/smart-speaker-mini": 2,
    "/pricing": 3
  },
  "first_event_timestamp": "2026-04-09T14:23:01.000Z",
  "last_event_timestamp": "2026-04-09T14:41:03.000Z"
}
```

The `unique_pages_viewed` attribute is a map of page paths to view counts, showing the agent which pages the user has been browsing and how many times.
