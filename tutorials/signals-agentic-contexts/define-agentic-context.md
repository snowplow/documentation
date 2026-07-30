---
position: 2
title: "Define and publish a Signals agentic context"
sidebar_label: "Define the agentic context"
description: "Define a Signals agentic context that buffers page views for the current session, choose the properties to keep, and publish it using Snowplow Console or the Python SDK."
keywords: ["agentic context", "event log", "signals python sdk", "publish", "event selection"]
date: "2026-07-30"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

You'll define an agentic context that keeps the last 50 page views of a session, for up to 30 minutes, and attaches a prompt telling an agent how to read them. Signals scopes the buffer to a single session using the `domain_sessionid` [attribute key](/docs/signals/concepts/#attribute-keys), so each session gets its own rolling record.

Do this in Snowplow Console or with the Signals Python SDK. Both produce the same thing, so pick whichever you prefer.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Go to **Signals** > **Agentic contexts** in Snowplow Console and create a new agentic context. On the **Create context** form, fill in the **Details** and **Prompt** sections:

| Field | Value |
| ----- | ----- |
| Name | `session_context` |
| Primary owner | Your email address |
| Description | `Rolling record of the pages a user has viewed in their current session` |
| Prompt | The prompt text below |

Use this as the prompt:

```text
You are a support assistant on a product website. The activity below is what the
user has just been doing. Use it to work out what they are trying to achieve,
then answer their question in that context. If the activity is too thin to tell,
say so rather than guessing.
```

![The Create context form in Snowplow Console, with the Details section filled in with the name session_context and a description of the rolling record, and the Prompt section holding the support assistant instructions](./images/agentic-context-create-form.png)

Under **Lookback Window**, set **Max events** to `50` and **Max age** to `30` minutes. Console restates the window underneath the fields, so you can check it reads as the last 50 events within 30 minutes.

Under **Events and Properties**, click **Add event** and choose `page_view` at version `1-0-0`. Then use **Add property** to attach `event_name`, `page_urlpath`, and `page_title` to it.

![The Lookback Window section of the form set to 50 max events and 30 minutes max age, and the Events and Properties section below it showing page_view version 1-0-0 with the three attached properties event_name, page_urlpath, and page_title](./images/agentic-context-event-selection.png)

</TabItem>
<TabItem value="sdk" label="Python SDK">

Install the SDK:

```bash
pip install snowplow-signals
```

The SDK models an agentic context as an `EventLog`, so that's the class you import. Store your [connection credentials](/docs/signals/connection/) in the environment first, then define and publish the agentic context:

```python
import os
from snowplow_signals import (
    Signals,
    EventLog,
    EventSelection,
    EventLogEvent,
    EventLogAtomicProperty,
    domain_sessionid,
)

sp_signals = Signals(
    api_url=os.environ["SP_API_URL"],
    api_key=os.environ["SP_API_KEY"],
    api_key_id=os.environ["SP_API_KEY_ID"],
    org_id=os.environ["SP_ORG_ID"],
)

session_context = EventLog(
    name="session_context",
    description="Rolling record of the pages a user has viewed in their current session",
    owner="you@example.com",
    prompt=(
        "You are a support assistant on a product website. "
        "The activity below is what the user has just been doing. "
        "Use it to work out what they are trying to achieve, then answer their "
        "question in that context. If the activity is too thin to tell, say so "
        "rather than guessing."
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
        )
    ],
)

sp_signals.publish([session_context])
```

`SP_API_URL` is your Signals API URL, in the form `https://YOUR_ID.signals.snowplowanalytics.com`.

</TabItem>
</Tabs>

## Choose which properties to keep

An agentic context doesn't store whole events. For each event you select, you list the properties to project, and only those reach the agent. Keeping the list short keeps the context cheap to read and easy for a model to reason over. Properties can come from the [atomic](/docs/fundamentals/canonical-event/) event, the event's own schema, or its entities.

Here you keep three atomic properties of each page view:

| Property | Why |
| -------- | --- |
| `event_name` | Fills the `event` column of the narrative output |
| `page_urlpath` | Fills the `url` column of the narrative output |
| `page_title` | Carries the human-readable page name into the context |

:::tip[Select `event_name` and `page_urlpath` explicitly]
The narrative format has dedicated `event` and `url` columns, but Signals only fills them from properties you actually selected. If you leave `event_name` and `page_urlpath` out, those columns stay empty. Everything else you select, such as `page_title`, appears in the narrative's `event_context` field instead.
:::

For the full range of selection options, including schema and entity properties, see [selecting events](/docs/signals/agentic-contexts/#selecting-events).

## Publish it

Publishing sends the definition to your Signals infrastructure and starts the buffering. Until you publish, nothing is captured.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Click **Publish**. Every edit you make in Console starts as a draft, and the version that's live stays live while you work, so a half-finished change can't reach your agents. Discarding a draft leaves the published version untouched.

</TabItem>
<TabItem value="sdk" label="Python SDK">

The `publish()` call in the code above both registers the agentic context and sends it to your Signals infrastructure.

To change an agentic context you've already published, edit it in Console and publish the draft, as you'll do later in this tutorial.

</TabItem>
</Tabs>

Buffering begins once your streaming infrastructure picks up the new configuration, shortly after you publish. Events from before that point aren't captured retroactively, so publish first and browse afterwards.

:::note[No versions to manage]
Unlike other Signals resources, you don't manage versions of an agentic context. There's one live agentic context per name, and publishing replaces whatever was live before.
:::
