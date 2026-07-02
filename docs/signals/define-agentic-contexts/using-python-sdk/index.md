---
title: "Defining agentic contexts using the Python SDK"
sidebar_position: 200
sidebar_label: "Using the Python SDK"
description: "Use the Snowplow Signals Python SDK to programmatically create, publish, and delete agentic contexts via code."
---

This page describes how to use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) to manage agentic contexts. For a conceptual overview, see the [agentic contexts](/docs/signals/define-agentic-contexts/index.md) page.

Start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` object. You'll need this connection to publish configurations to Signals.

## Defining an agentic context

Create an agentic context by specifying its name, the attribute key it's scoped to, the events to capture, the limits on how much recent activity to keep, and the prompt to hand to the agent.

Event logs are the building block for an agentic context for now, so the SDK exposes them as the structures to manage an agentic context.

```python
from snowplow_signals import (
    EventLog, EventSelection, EventLogEvent,
    EventLogAtomicProperty, EventLogEventProperty,
    domain_sessionid,
)

my_agentic_context = EventLog(
    name="my_agentic_context",
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
                EventLogAtomicProperty(name="page_url"),
                EventLogEventProperty(
                    vendor="com.acme", name="my_field", major_version=1, path="$.foo"
                ),
            ],
        )
    ],
)
```

The table below lists the main fields of an agentic context.

| Field             | Description                                                     | Required? |
| ----------------- | -------------------------------------------------------------- | --------- |
| `name`            | The unique name of the agentic context                        | ✅         |
| `attribute_key`   | The attribute key the log is scoped to (`domain_sessionid`)   | ✅         |
| `events`          | The events to capture, and the properties to project from each | ✅         |
| `max_events`      | Maximum number of events retained in the buffer (up to 100)   | ✅         |
| `max_age_seconds` | Maximum age, in seconds, of events retained (up to 3600)      | ✅         |
| `description`     | A human-readable description                                  |           |
| `owner`           | The email of the primary maintainer                          |           |
| `prompt`          | Free-text instruction handed to the agent on read             |           |

## Publishing and deleting

Use the same object management methods as for other Signals resources:
* Use `publish()` to make the agentic context live. Publishing takes effect within a few seconds and replaces whatever was previously live for that name.
* Use `unpublish()` to take the agentic context out of effect without losing its definition.
* Use `delete()` to permanently remove it. An agentic context must be unpublished before it can be deleted.

```python
# The Signals connection object has been created as sp_signals

# 1. Publish the agentic context
sp_signals.publish([my_agentic_context])

# 2. Unpublish it
sp_signals.unpublish([my_agentic_context])

# 3. Delete it permanently - must unpublish first
sp_signals.delete([my_agentic_context])
```

Read more about [retrieving an agentic context](/docs/signals/define-agentic-contexts/retrieving/index.md) in your application.
