---
title: "Configure Snowplow Signals"
sidebar_label: "Configure Signals"
position: 4
description: "Create an attribute group, a service, and an agentic context to serve real-time profile attributes and session activity to your Google ADK agent."
keywords: ["Signals", "attribute group", "service", "agentic context", "Basic Web", "domain_sessionid"]
date: "2026-07-29"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The next step is to define the real-time context you want Signals to serve. You'll set up two complementary resources:

* An [attribute group](/docs/signals/concepts/#attribute-groups) and [service](/docs/signals/concepts/#services) that compute and serve profile attributes: aggregate metrics that describe the session, such as how many pages the user has viewed
* An [agentic context](/docs/signals/agentic-contexts/) that captures recent session activity: the user's latest events, readable as an LLM-ready narrative

The two work together. Attributes tell your agent what the session adds up to, while the agentic context tells it what the user has just been doing, event by event. Both are scoped to the same `domain_sessionid` attribute key, so your agent can fetch both with the session ID it already reads from the tracker cookie.

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
  "unique_pages_viewed": [
    "http://localhost:3000/",
    "http://localhost:3000/products/electronics",
    "http://localhost:3000/products/electronics/wireless-headphones",
    "http://localhost:3000/products/electronics/smart-speaker-mini",
    "http://localhost:3000/pricing"
  ],
  "first_event_timestamp": "2026-04-09T14:23:01.000Z",
  "last_event_timestamp": "2026-04-09T14:41:03.000Z"
}
```

The `unique_pages_viewed` attribute is a list of URLs the user has visited during the session, showing the agent which pages they have been browsing.

## Create an agentic context

The service you just created serves computed aggregates. To also give your agent a play-by-play of what the user is doing right now, [define an agentic context](/docs/signals/agentic-contexts/): a rolling record of the user's recent events that Signals can return as a plain-language narrative, ready to drop into your agent's instruction.

For this app, capture page view events, keeping three properties from each one:

| Property       | Why                                                              |
| -------------- | ---------------------------------------------------------------- |
| `event_name`   | Populates the event column of the narrative table                 |
| `page_urlpath` | Populates the URL column of the narrative table                   |
| `page_title`   | Extra detail, included in the narrative's `event_context` column |

The `event_name` and `page_urlpath` atomic properties feed the narrative's dedicated columns. Any other property you select appears in its `event_context` column.

Your app also tracks page pings and link clicks. Leave the page pings out: the buffer holds a limited number of events, and heartbeat pings would crowd out the meaningful activity. Link clicks are worth adding once you've seen the narrative working.

Use this exact agentic context name. It's the same as the `SNOWPLOW_SIGNALS_AGENTIC_CONTEXT_NAME` environment variable you configured in your `.env` file.

<Tabs groupId="signals-impl" queryString>
  <TabItem value="console" label="Console" default>

1. Navigate to **Signals** > **Agentic contexts**
2. Click to create a new agentic context, and configure the basics:
   - **Name**: `web_agent_activity`
   - **Description**: `Recent session activity for the Signal Shop support agent`
   - **Prompt instructions**: `You are a helpful assistant for Signal Shop. Use this recent activity to understand what the user is exploring right now, and tailor your answers to it.`
   - **Owner**: your email address
3. Select the events to capture: choose the `page_view` event, keeping the `event_name`, `page_urlpath`, and `page_title` atomic properties
4. Set the limits: retain a maximum of 50 events, with a maximum age of 1800 seconds (30 minutes)
5. Click **Publish** to send the configuration to your Signals infrastructure

  </TabItem>
  <TabItem value="sdk" label="Python SDK">

You can also define agentic contexts programmatically with the [Signals Python SDK](https://pypi.org/project/snowplow-signals/), where the `EventLog` class is the building block. You already added this SDK to the agent's dependencies during project setup.

Start by [connecting to Signals](/docs/signals/connection/) to create a `Signals` object, then define the agentic context:

```python
from snowplow_signals import (
    EventLog,
    EventSelection,
    EventLogEvent,
    EventLogAtomicProperty,
    domain_sessionid,
)

web_agent_activity = EventLog(
    name="web_agent_activity",
    description="Recent session activity for the Signal Shop support agent",
    owner="user@company.com",
    prompt=(
        "You are a helpful assistant for Signal Shop. "
        "Use this recent activity to understand what the user is exploring "
        "right now, and tailor your answers to it."
    ),
    attribute_key=domain_sessionid,
    max_events=50,
    max_age_seconds=1800,
    events=[
        EventSelection(
            event=EventLogEvent(
                name="page_view",
                vendor="com.snowplowanalytics.snowplow",
                version="1-0-0",
            ),
            properties=[
                EventLogAtomicProperty(name="event_name"),
                EventLogAtomicProperty(name="page_urlpath"),
                EventLogAtomicProperty(name="page_title"),
            ],
        ),
    ],
)
```

Publish it to send the configuration to your Signals infrastructure:

```python
sp_signals.publish([web_agent_activity])
```

Run this as a one-off script, separately from the agent. Defining Signals resources is a setup task, not something your agent does at runtime.

  </TabItem>
</Tabs>

The `prompt` text travels with the agentic context: Signals hands it to your agent alongside the captured activity, so you can refine the instructions later without touching your agent code.

With the attribute group, service, and agentic context all published, you're ready to wire them into the agent.
