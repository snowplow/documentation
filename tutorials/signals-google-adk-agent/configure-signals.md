---
title: "Configure Snowplow Signals"
sidebar_label: "Configure Signals"
position: 4
description: "Create an attribute group, a service, and an agentic context to serve real-time profile attributes and session activity to your Google ADK agent."
keywords: ["Signals", "attribute group", "service", "agentic context", "Basic Web", "domain_sessionid"]
date: "2026-07-30"
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

Use one of Signals' built-in [attribute group](/docs/signals/concepts/#attribute-groups) templates to define attributes, with `domain_sessionid` as the attribute key so the attributes are scoped to a session.

1. In [Console](https://console.snowplowanalytics.com), navigate to **Signals** > **Attribute groups**
2. Click **Create attribute group**, then click **Use** on the **Basic Web** card
3. Set the **Attribute key** to `domain_sessionid`

Applying the template fills in the name `basic_web` and its four attributes. Rename it if you like, and leave **Source** as **Stream** so Signals computes from the event stream in real time.

| Attribute               | Type          | Aggregation   | Property                | Description                                    |
| ----------------------- | ------------- | ------------- | ----------------------- | ---------------------------------------------- |
| `page_views_count`      | `int32`       | `counter`     | none                    | Total number of page views in the session      |
| `unique_pages_viewed`   | `string_list` | `unique_list` | atomic `page_url`       | Full URLs of the pages visited in the session  |
| `first_event_timestamp` | `string`      | `first`       | atomic `derived_tstamp` | When the session started                       |
| `last_event_timestamp`  | `string`      | `last`        | atomic `derived_tstamp` | When the most recent event was recorded        |

Note the property behind `unique_pages_viewed`: the template reads `page_url`, so the values are full URLs rather than paths. The agentic context you define later reads `page_urlpath` instead, which is worth knowing when you compare the two in your agent's instruction.

Click **Create attribute group** when you're happy with it.

## Publish the attribute group

[Attribute groups](/docs/signals/concepts/#attribute-groups) need to be published before Signals will start computing. A new group starts as `v1 (Not published)`:

1. Open your attribute group and click **Publish**
2. Confirm the publish to deploy the group and its four attributes to the Profiles Store

The version label changes to `v1 (Published)`, and Signals starts computing attributes for each user session as events arrive.

## Create a service

A [service](/docs/signals/concepts/#services) provides a pull-based API endpoint that exposes your computed attributes for a specific attribute (lookup) key.

Services allow you to combine multiple attribute groups if needed, but for this tutorial, use just the one you created in the last step.

Use this exact service name. It's the same as the `SNOWPLOW_SIGNALS_SERVICE_NAME` environment variable you configured in your `.env` file. Service names take letters, numbers, and underscores only.

1. Navigate to **Signals** > **Services**
2. Click **Create service**
3. Configure:
   - **Name**: `web_agent_context`
   - **Attribute groups**: Select the attribute group you just published
4. Click **Create service**

The **Attribute groups** picker only lists published attribute groups, so publishing first isn't optional. If your group is still a draft, the picker reports no options.

The service returns attributes for a given session ID in this format:

```json
{
  "first_event_timestamp": "2026-07-30T14:02:53.477Z",
  "last_event_timestamp": "2026-07-30T14:03:12.840Z",
  "page_views_count": 6,
  "unique_pages_viewed": [
    "http://localhost:3000/",
    "http://localhost:3000/products/electronics",
    "http://localhost:3000/products/clothing/linen-overshirt",
    "http://localhost:3000/products/electronics/wireless-headphones",
    "http://localhost:3000/pricing"
  ]
}
```

In this six-page session, six page views produce five entries in `unique_pages_viewed`, because one product page was visited twice. That's the kind of pattern the aggregates flatten and the agentic context preserves.

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

Navigate to **Signals** > **Agentic contexts** and click **Create context**. The form is one scrolling page with four sections: **Details**, **Prompt**, **Lookback Window**, and **Events and Properties**.

Fill in **Details** and **Prompt**:

| Field | Value |
| ----- | ----- |
| Name | `web_agent_activity` |
| Primary owner | Your email address, filled in for you and read-only |
| Description | `Recent session activity for the Signal Shop support agent` |
| Prompt | `You are a helpful assistant for Signal Shop. Use this recent activity to understand what the user is exploring right now, and tailor your answers to it.` |

![The Create context form in Snowplow Console, with the Details section holding the name web_agent_activity, a greyed-out Primary owner field, and the description Recent session activity for the Signal Shop support agent, and the Prompt section below it holding the Signal Shop instructions under the helper text about adding them on top of the retrieved agentic context](./images/agentic-context-create-form.png)

Under **Lookback Window**, set **Max events** to `50` and **Max age** to `30` minutes. Console restates the window underneath the fields, so you can check it reads as the last 50 events within 30 minutes. The details page later shows the same setting as **Max Age (seconds)** `1800`.

Under **Events and Properties**, click **Add event** and choose `page_view` on the **Data structures** tab. The version fills in as `1-0-0`. Then use **Add property** three times to attach `event_name`, `page_urlpath`, and `page_title` from the **Atomic** tab.

Click **Create**. Your agentic context now has a details page showing **Status** **Draft**. Click **Publish** there and confirm, and the status changes to **Published**. Later changes go through **Edit** and start as a draft, so the published version stays live while you work on it.

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

To change the agentic context after publishing it, use **Edit** and **Publish** on its details page in Console, under **Signals** > **Agentic contexts**.

  </TabItem>
</Tabs>

The `prompt` text travels with the agentic context: Signals hands it to your agent alongside the captured activity, so you can refine the instructions later without touching your agent code.

With the attribute group, service, and agentic context all published, you're ready to wire them into the agent.
