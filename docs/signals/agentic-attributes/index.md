---
title: "Define agentic attributes in Signals"
sidebar_position: 23
sidebar_label: "Define agentic attributes"
description: "Configure agentic attributes in Snowplow Signals to have an LLM classify a user's session from their recent activity, and read the result and its reasoning in your application."
keywords: ["agentic attribute", "llm", "ai classification", "session intent", "agentic context", "signals api"]
date: "2026-10-09"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

:::note[Private preview]
Agentic attributes are in private preview. Contact Snowplow to enable them for your Signals deployment. The configuration and API described here may change.
:::

An agentic attribute is a value that an LLM decides for a user's session, together with its reasoning. You write a goal, for example "classify this session's booking intent from recent funnel activity", and list the answers the model can choose from. When the session matches your trigger criteria, Signals sends the user's recent activity to the model and stores its answer.

Use an agentic attribute when a judgment is too nuanced for a threshold rule. Questions such as "is this visitor hesitating, comparing options, or about to give up?" are hard to express as criteria on a stream attribute, but a model can answer them from the user's recent events. Each answer comes with a justification, for example "hesitating: entered checkout twice, no booking completed, keeps returning to the same trip".

Before you start, define and publish at least one [agentic context](/docs/signals/agentic-contexts/index.md). It selects the events the model reviews.

Once defined and published, [retrieve an agentic attribute](/docs/signals/applications/agentic-attributes/index.md) in your application.

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

## Analyze agentic attribute values in your warehouse

Every time Signals writes an agentic attribute value, it also tracks an `agentic_attribute` [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) into your Snowplow pipeline. The event records the value, the model's justification, and the data the model was shown. Use it to analyze the model's decisions alongside the rest of your behavioral data, or to audit why it chose a value.

Signals sends these events server-side, with `platform` set to `srv` and, by default, `app_id` set to `signals`. Two rules decide which values reach your warehouse:

* Only written values are tracked: an evaluation skipped by the evaluation policy, or one the model declines to answer, produces no event
* Tracking is best-effort: Signals stores the value before sending the event, and drops the event without retrying if the Collector can't be reached

The `context` field holds the stream attribute values and agentic context events the model received, as a JSON document. It's capped at 65,535 characters. If the context is longer, Signals drops whole events from it until it fits and sets `context_truncated` to `true`.

<SchemaProperties
  overview={{event: true}}
  example={{
    "attribute_name": "session_state",
    "attribute_version": 1,
    "attribute_key_name": "domain_sessionid",
    "attribute_key_value": "c6ef3124-b53a-4b13-a233-0088f79dcbcb",
    "output_type": "enum",
    "value": "stuck",
    "available_options": [
      "progressing",
      "stuck",
      "exploring"
    ],
    "justification": "Ran the same search five times with small changes and opened no results.",
    "model_tier": "fast",
    "agentic_contexts": [
      "session_log_v1"
    ],
    "context": "{\"attributes\": {\"search_count\": 5}, \"event_logs\": {\"session_log\": [...]}}",
    "context_truncated": false,
    "model_identifier": "<MODEL_ID>",
    "decided_at": "2026-10-09T14:03:12Z"
  }}
  schema={{"$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "An agentic attribute evaluated by Snowplow Signals.", "self": {"vendor": "com.snowplowanalytics.signals", "name": "agentic_attribute", "format": "jsonschema", "version": "1-0-0"}, "type": "object", "properties": {"attribute_name": {"description": "Name of the published agentic attribute that was evaluated.", "type": "string", "minLength": 1, "maxLength": 255}, "attribute_version": {"description": "Version of the published agentic attribute that produced this result.", "type": "integer", "minimum": 1, "maximum": 32767}, "attribute_key_name": {"description": "Name of the attribute key identifying the profile the attribute was made for, e.g. domain_userid.", "type": "string", "minLength": 1, "maxLength": 255}, "attribute_key_value": {"description": "Value of the attribute key identifying the profile the attribute was made for.", "type": "string", "minLength": 1, "maxLength": 1024}, "output_type": {"description": "Type of the attribute's output contract, which tells the consumer how to interpret value.", "type": "string", "enum": ["enum", "boolean", "number"]}, "value": {"description": "The attribute result, rendered as a string. Interpret it according to output_type: the chosen name for enum, \"true\"/\"false\" for boolean, a decimal literal for number.", "type": "string", "maxLength": 1024}, "available_options": {"description": "The options the attribute allowed, rendered as strings. Empty for number types.", "type": "array", "items": {"type": "string", "maxLength": 512}, "maxItems": 64}, "justification": {"description": "The model's stated reasoning for the result.", "type": ["string", "null"], "maxLength": 4096}, "model_tier": {"description": "Model tier the attribute was evaluated with, as configured on the attribute's agent config.", "type": "string", "enum": ["fast", "advanced"]}, "agentic_contexts": {"description": "The event logs that fed this evaluation, each as name_vN (e.g. session_log_v2).", "type": ["array", "null"], "items": {"type": "string", "maxLength": 512}, "maxItems": 64}, "context": {"description": "The context supplied to the model, as a JSON document: {\"attributes\": {name: value}, \"event_logs\": {context_name: [event, ...]}}. When truncation occurred context_truncated is true.", "type": ["string", "null"], "maxLength": 65535}, "context_truncated": {"description": "Whether entries were dropped from context to fit its length cap. False means context is the complete set of values the model was given.", "type": "boolean"}, "model_identifier": {"description": "Identifier of the model that produced the attribute.", "type": "string", "minLength": 1, "maxLength": 255}, "decided_at": {"description": "When the attribute was written, UTC.", "type": "string", "format": "date-time"}}, "required": ["attribute_name", "attribute_version", "context_truncated", "attribute_key_name", "attribute_key_value", "output_type", "value", "available_options", "model_tier", "model_identifier", "decided_at"], "additionalProperties": false}} />

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
