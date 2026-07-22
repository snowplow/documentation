---
title: "Retrieve agentic contexts in your application"
sidebar_position: 25
sidebar_label: "Agentic contexts"
description: "Fetch an agentic context from Snowplow Signals as structured JSON or a plain-language narrative to ground your agents in real-time user activity."
keywords: ["agentic context", "event log", "llm context", "signals python sdk", "signals node sdk"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Once an agentic context is [published](/docs/signals/agentic-contexts/index.md), fetch it in your application to inspect real-time events or ground an agent in a user's recent activity, using the Python SDK or Node.js SDK.

An agentic context tracks a single user's activity within their current session, so you retrieve it for a specific `domain_sessionid` value. Start by [connecting to Signals](/docs/signals/connection/index.md).

## Get the session identifier

Fetching an agentic context happens server-side, so you'll need to pass your backend the current `domain_sessionid`. Read it client-side with the browser tracker's [`getDomainSessionId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md#domain-session-id) method, then send it to your server, for example as a request parameter.

## Retrieve an agentic context

You can read the same agentic context as JSON, for programmatic use, or as a readable narrative summary, well-suited to dropping straight into an LLM's context or showing a human.

<Tabs groupId="signals-retrieve" queryString>
<TabItem value="python" label="Python" default>

Use `get_agentic_context()` to retrieve an agentic context. With `format="json"` Signals returns the captured activity along with the prompt; with `format="narrative"` it returns a plain-text context block as a string.

```python
# The Signals connection object has been created as sp_signals

# structured -> AgenticContextResponse (context.events is list[dict])
context = sp_signals.get_agentic_context(name="my_agentic_context", identifier="session-123")

# LLM-ready plain text -> str
text = sp_signals.get_agentic_context(
    name="my_agentic_context", identifier="session-123", format="narrative"
)
```

| Argument     | Description                                          | Type     | Required? |
| ------------ | ----------------------------------------------------- | -------- | --------- |
| `name`       | The name of the agentic context                       | `string` | ✅         |
| `identifier` | The `domain_sessionid` value to read the log for      | `string` | ✅         |
| `format`     | The output format: `json` (default) or `narrative`    | `string` |           |

</TabItem>
<TabItem value="nodejs" label="Node.js">

Use `getAgenticContext()` to retrieve an agentic context. Signals will return the captured activity along with the prompt.

```typescript
// The Signals connection object has been created as signals

// structured -> AgenticContextResponse (context.events is Record<string, unknown>[])
const context = await signals.getAgenticContext({
  name: "my_agentic_context",
  identifier: "8c9104e3-c300-4b20-82f2-93b7fa0b8feb",
  format: "json",
});

// LLM-ready plain text -> string
const text = await signals.getAgenticContext({
  name: "my_agentic_context",
  identifier: "8c9104e3-c300-4b20-82f2-93b7fa0b8feb",
  format: "narrative",
});
```

| Argument     | Description                                          | Type     | Required? |
| ------------ | ----------------------------------------------------- | -------- | --------- |
| `name`       | The name of the agentic context                       | `string` | ✅         |
| `identifier` | The `domain_sessionid` value to read the log for      | `string` | ✅         |
| `format`     | The output format: `json` (default) or `narrative`    | `string` |           |

</TabItem>
</Tabs>

## Response format

### JSON

Use `format="json"` when you need to work with the activity programmatically, for example to build your own prompt, apply custom logic, or store the result.

The response contains the captured events along with the prompt and a human-readable summary:

| Field           | Description                                                     | Type      |
| --------------- | ----------------------------------------------------------------- | --------- |
| `summary`       | Time on the current page, session age, and the configured limits | `string`  |
| `attribute_key` | The attribute key the log is scoped to                            | `string`  |
| `identifier`    | The attribute key value the log was read for                      | `string`  |
| `name`          | The name of the agentic context                                   | `string`  |
| `version`       | Schema version, currently always `1`                               | `integer` |
| `prompt`        | The free-text instruction attached to the agentic context         | `string`  |
| `started_at_ms` | When the session buffer started, in epoch milliseconds            | `integer` |
| `events`        | The captured events, ordered oldest to most recent                | `array`   |

Here's an example response:

```json
{
  "summary": "45 seconds on the current page. Session started 90 seconds ago. Based on last 50 recorded events for the last 1800 seconds.",
  "attribute_key": "domain_sessionid",
  "identifier": "8c9104e3-c300-4b20-82f2-93b7fa0b8feb",
  "name": "my_agentic_context",
  "version": 1,
  "prompt": "You are a checkout-recovery assistant. Use the recent activity to help the user complete their purchase.",
  "started_at_ms": 1737549000000,
  "events": [
    { "page_url": "https://example.com/checkout", "my_field": "blue" },
    { "page_url": "https://example.com/cart" }
  ]
}
```

### Narrative

Use `format="narrative"` when you want a ready-made plain-text summary to drop straight into an LLM's context, or to show a human, without writing your own formatting logic.

The block opens with a short summary: how long the user has been on their current page, how long ago the session started, and the agentic context's configured `max_events`/`max_age_seconds` limits. Events follow as a table, ordered oldest to most recent: seconds since the start of the session, the event name, the URL path, and any other captured properties as a JSON-like `event_context`. Select the `event_name` and `page_urlpath` atomic properties if you want those columns populated; anything else you capture appears in `event_context`.

Here's an example response:

```text
[START CONTEXT]
45 seconds on the current page. Session started 90 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
## Real-time user behaviour
Events are ordered from oldest to most recent.
seconds_since_start_of_session, event, url, event_context
0, page_view, /checkout, {}
45, add_to_cart, /cart, {sku: 'SKU123'}
[END CONTEXT]
```
