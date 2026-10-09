---
title: "Define agentic attributes in Signals"
sidebar_position: 23
sidebar_label: "Define agentic attributes"
description: "Configure agentic attributes in Snowplow Signals to have an LLM classify a user's session from their recent activity, and read the result and its reasoning in your application."
keywords: ["agentic attribute", "llm", "ai classification", "session intent", "agentic context", "signals api"]
date: "2026-10-09"
---

:::note[Private preview]
Agentic attributes are in private preview. Contact Snowplow to enable them for your Signals deployment. The configuration and API described here may change.
:::

An agentic attribute is a value that an LLM decides for a user's session, together with its reasoning. You write a goal, for example "classify this session's booking intent from recent funnel activity", and list the answers the model can choose from. When the session matches your trigger criteria, Signals sends the user's recent activity to the model and stores its answer.

Use an agentic attribute when a judgment is too nuanced for a threshold rule. Questions such as "is this visitor hesitating, comparing options, or about to give up?" are hard to express as criteria on a stream attribute, but a model can answer them from the user's recent events. Each answer comes with a justification, for example "hesitating: entered checkout twice, no booking completed, keeps returning to the same trip".

Before you start, define and publish at least one [agentic context](/docs/signals/agentic-contexts/index.md). It selects the events the model reviews.

## How agentic attributes are evaluated

Signals evaluates an agentic attribute in four steps:

1. The streaming engine checks your trigger criteria every time an event updates one of the session's [attributes](/docs/signals/attributes/index.md)
2. If the criteria hold, it queues an evaluation for that session
3. An evaluation worker sends the model your goal, the allowed values, the session's agentic contexts, and its published stream attributes
4. The model's answer, justification, and evaluation time are stored against the session's `domain_sessionid`, ready for your application to read

Unlike [interventions](/docs/signals/interventions/index.md), which fire only the first time their criteria are met, an agentic attribute is re-evaluated every time its criteria hold. This keeps the value current as the session develops. The [evaluation policy](#configure-the-evaluation-policy) caps how often this happens.

An agentic attribute isn't a stream attribute. You can't use it in intervention criteria or in other attribute definitions. Your application reads it directly.

## Create an agentic attribute

You define agentic attributes through the [Signals API](/docs/signals/connection/index.md#signals-api). Every request needs a Bearer token, as described in [Authenticate to the Signals API](/docs/signals/connection/index.md#authenticate-to-the-signals-api).

This example classifies whether a session is progressing, stuck, or exploring. It's evaluated once the session has run at least four searches:

```bash
curl \
  --request POST \
  --header 'Authorization: Bearer <JWT>' \
  --header 'Content-Type: application/json' \
  {{API_URL}}/api/v1/registry/agentic_attributes/ \
  --data '{
    "name": "session_state",
    "description": "Classifies whether a session is progressing, stuck, or exploring",
    "owner": "owner@example.com",
    "attribute_key": {"name": "domain_sessionid"},
    "output_type": "enum",
    "values": [
      {"name": "progressing", "description": "Moving through a task"},
      {"name": "stuck", "description": "Looping or repeating searches"},
      {"name": "exploring", "description": "Browsing broadly"}
    ],
    "goal": "Decide whether the user is progressing, stuck, or exploring.",
    "contexts": ["session_log"],
    "triggers": [
      {
        "type": "criteria",
        "criteria": {
          "attribute": "search_behavior:search_count",
          "operator": ">=",
          "value": 4
        }
      }
    ],
    "evaluation_policy": {"cooldown_seconds": 600, "max_per_session": 3},
    "agent_config": {"model_tier": "fast"}
  }'
```

The table below lists the fields of an agentic attribute.

| Field               | Description                                                                                                                 | Required?  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `name`              | The unique name of the agentic attribute                                                                                    | ✅          |
| `attribute_key`     | The attribute key the value is stored under. Must be `domain_sessionid`                                                     | ✅          |
| `output_type`       | The kind of value the model produces: `enum`, `boolean`, or `number`                                                        | ✅          |
| `values`            | The values the model can choose between, each with a `name` and a `description`. Required for `enum`, not allowed otherwise | For `enum` |
| `goal`              | The instruction the model follows when it reviews the session (up to 3800 characters)                                       | ✅          |
| `contexts`          | Names of the published agentic contexts the model reviews (one to five)                                                     | ✅          |
| `triggers`          | When to evaluate the attribute (one to five). The attribute is evaluated when any trigger holds                             | ✅          |
| `evaluation_policy` | Caps on how often the attribute is re-evaluated                                                                             |            |
| `agent_config`      | How the model runs. `model_tier` is `fast` (default) or `advanced`                                                          |            |
| `description`       | A human-readable description                                                                                                |            |
| `owner`             | The email of the primary maintainer                                                                                         |            |

### Choose an output type

The output type controls what the model can return:

* `enum`: one of the names in `values`. Define at least two, and up to 20. The model reads each value's `description` verbatim, so use it to say what choosing that value means
* `boolean`: `true` or `false`
* `number`: any number

### Define triggers

Each trigger has `type` set to `criteria` and a `criteria` tree over your published stream attributes. Criteria use the same syntax as [intervention criteria](/docs/signals/interventions/index.md#criteria), including nested `all`, `any`, and `none` conditions. Every attribute you reference must exist in a published version of its attribute group.

Triggers fire on new activity only. A session that stops sending events isn't evaluated again, however long its criteria continue to hold. Triggers can't fire on the absence of events, such as an abandoned cart.

### Configure the evaluation policy

The evaluation policy caps how often the model runs for each session. Neither setting schedules an evaluation: a trigger still has to fire.

| Field              | Description                                                                                           | Default | Range       |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------- | ----------- |
| `cooldown_seconds` | Minimum time between evaluations for the same session, measured from when the last value was written | 600     | 10 to 86400 |
| `max_per_session`  | Maximum number of values written per session. Failed evaluations don't count toward this limit        | 3       | 1 to 100    |

Each evaluation is a call to an LLM, so these limits also control cost. The model receives every event in the referenced agentic contexts and every published stream attribute for the session, so keep your agentic contexts focused on the events the goal needs.

## Publish an agentic attribute

A new agentic attribute is a draft. Signals doesn't evaluate it until you publish it:

```bash
curl \
  --request POST \
  --header 'Authorization: Bearer <JWT>' \
  --header 'Content-Type: application/json' \
  {{API_URL}}/api/v1/engines/publish \
  --data '{"agentic_attributes": [{"name": "session_state"}]}'
```

Publishing fails if any of these are true:

* A referenced agentic context isn't published, or is scoped to a different attribute key
* A trigger references an attribute group with no published version, or an attribute that the group's published version doesn't include
* Your deployment already has 20 published agentic attributes

To change an agentic attribute, send the full definition to `PUT {{API_URL}}/api/v1/registry/agentic_attributes/<name>`. This creates a new draft version, and the published version stays live until you publish the draft. To discard the draft instead, send `DELETE {{API_URL}}/api/v1/registry/agentic_attributes/<name>/draft`.

To stop evaluating an agentic attribute, unpublish it with `POST {{API_URL}}/api/v1/engines/unpublish` and the same request body as publishing. You can delete an agentic attribute with `DELETE {{API_URL}}/api/v1/registry/agentic_attributes/<name>` only once it's unpublished. Deleting removes every version.

## Read the result in your application

Read the most recent value for a session from the `agentic_attribute` endpoint. Pass the session's `domain_sessionid` as `identifier` and the agentic attribute's name as `name`. To get the session ID from the browser, see [Get the session identifier](/docs/signals/applications/agentic-contexts/index.md#get-the-session-identifier).

```bash
curl \
  --header 'Authorization: Bearer <JWT>' \
  '{{API_URL}}/api/v1/agentic_attribute?identifier=<DOMAIN_SESSIONID>&name=session_state'
```

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

| Field               | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `value`             | The model's answer: a string for `enum`, a boolean for `boolean`, or a number for `number` |
| `version`           | The published version of the agentic attribute that produced the value                     |
| `justification`     | The model's reasoning for the answer                                                       |
| `available_options` | The values the model could choose from. `[true, false]` for `boolean`, and empty for `number` |
| `decided_at`        | When the value was written, in UTC                                                         |

The endpoint returns `404` if the session has no value yet, for example because its triggers haven't fired. Values are kept for seven days after they're written.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
