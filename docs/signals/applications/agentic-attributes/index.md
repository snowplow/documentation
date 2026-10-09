---
title: "Retrieve agentic attributes in your application"
sidebar_position: 27
sidebar_label: "Agentic attributes"
description: "Fetch the value an LLM decided for a user's session from Snowplow Signals, together with the model's reasoning, to personalize your application."
keywords: ["agentic attribute", "llm", "session intent", "signals api", "justification"]
date: "2026-10-09"
---

:::note[Private preview]
Agentic attributes are in private preview. Contact Snowplow to enable them for your Signals deployment. The configuration and API described here may change.
:::

Once an agentic attribute is [published](/docs/signals/agentic-attributes/index.md), fetch its value in your application to react to the model's judgment of a user's session, for example to offer help to a user the model classifies as stuck. Each value comes with the model's reasoning.

An agentic attribute is stored per session, so you retrieve it for a specific `domain_sessionid` value. Retrieve it using the [Signals API](/docs/signals/connection/index.md#signals-api). Every request needs a Bearer token, as described in [Authenticate to the Signals API](/docs/signals/connection/index.md#authenticate-to-the-signals-api).

## Get the session identifier

Fetching an agentic attribute happens server-side, so you'll need to pass your backend the current `domain_sessionid`. Read it client-side with the browser tracker's [`getDomainSessionId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md#domain-session-id) method, then send it to your server, for example as a request parameter.

## Retrieve an agentic attribute

Read the most recent value for a session from the `agentic_attribute` endpoint. Pass the session's `domain_sessionid` as `identifier` and the agentic attribute's name as `name`:

```bash
curl \
  --header 'Authorization: Bearer <JWT>' \
  '{{API_URL}}/api/v1/agentic_attribute?identifier=<DOMAIN_SESSIONID>&name=session_state'
```

The endpoint returns `404` if the session has no value yet, for example because its triggers haven't fired. Values are kept for seven days after they're written.

## Response format

The response contains the model's answer and its reasoning:

```json
{
  "value": "stuck",
  "version": 1,
  "justification": "Ran the same search five times with small changes and opened no results.",
  "available_options": ["progressing", "stuck", "exploring"],
  "decided_at": "2026-10-09T14:03:12Z"
}
```

The table below describes each field in the response.

| Field               | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `value`             | The model's answer: a string for `enum`, a boolean for `boolean`, or a number for `number`    |
| `version`           | The published version of the agentic attribute that produced the value                        |
| `justification`     | The model's reasoning for the answer                                                          |
| `available_options` | The values the model could choose from. `[true, false]` for `boolean`, and empty for `number` |
| `decided_at`        | When the value was written, in UTC                                                            |

An agentic attribute can be re-evaluated several times during a session, so the value can change. Use `decided_at` to tell how recent the answer is.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
