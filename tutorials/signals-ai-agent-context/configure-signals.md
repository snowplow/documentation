---
title: "Configure Snowplow Signals"
position: 4
sidebar_label: "Configure Signals"
description: "Create an attribute group, publish it, and set up a Signals service to serve real-time user attributes."
keywords: ["snowplow signals", "attribute group", "signals service", "real-time attributes", "profiles store"]
date: "2026-04-10"
---

Signals takes your event stream and computes live user attributes. You define which attributes you want, and Signals keeps them current as events arrive.

## Use a templated attribute group

Instead of building an [attribute group](/docs/signals/concepts/#attribute-groups) from scratch, use one of Signals' built-in templates. Templates are pre-configured sets of attributes for common use cases — they're the fastest way to get meaningful context into your agent.

1. In **Snowplow Console**, navigate to **Signals** → **Attribute Groups**
2. Click **Create attribute group** and choose **Basic Web** (or a template suited to your use case)
3. Set the **Attribute Key** to `domain_sessionid` to aggregate attributes at the session level

The Basic Web template includes these attributes:

| Attribute | Description |
| --- | --- |
| `page_views_count` | Total number of page views in the session |
| `unique_pages_viewed` | Number of distinct pages visited |
| `first_event_timestamp` | When the session started |
| `last_event_timestamp` | When the most recent event was recorded |

You can add or remove attributes after selecting the template.

It is recommended to test your attribute group by clicking **Run Preview** before saving, to verify it's computing correctly based on recent events in your pipeline. This runs a query against your event data in your data warehouse and shows the computed attributes for recent sessions.

Click **Save** when you're happy with the attribute group.

## Publish the attribute group

[Attribute groups](/docs/signals/concepts/#attribute-groups) need to be published before they start computing:

1. Open your attribute group and click **Publish**
2. Confirm the publish — this deploys the computation logic to the pipeline

Once published, Signals will start computing attributes for each user session as events arrive.

## Create a service

A [service](/docs/signals/concepts/#services) is a pull-based API endpoint that exposes your computed attributes for a specific lookup key. You'll use this to fetch attributes by `domain_sessionid`. It allows you to combine multiple attribute groups if needed, but for this tutorial you'll use the one you just created.

1. Navigate to **Signals** → **Services**
2. Click **New Service**
3. Configure:
   - **Name**: `web-agent-context` (you'll reference this by name in code)
   - **Attribute Group**: Select the attribute group you just published
4. Click **Create**

Retrieval instructions are available in the service details — you'll need these to set up your API client in the next step.

The response format from the service looks like this:

```json
{
  "page_views_count": 12,
  "unique_pages_viewed": 5,
  "first_event_timestamp": "2026-04-09T14:23:01.000Z",
  "last_event_timestamp": "2026-04-09T14:41:03.000Z"
}
```
