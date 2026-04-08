---
title: "Putting it all together"
sidebar_label: "Putting it all together"
position: 6
description: "See how all three tracking layers connect via shared identifiers, review the complete schema inventory, and learn what to build next."
keywords: ["snowplow", "agentic", "tracking", "ai", "data lineage", "schema inventory"]
date: "2026-03-26"
---

You've instrumented an AI chatbot with three layers of behavioral tracking. This section shows how the layers connect and what you can do with the data.

## Data lineage

Every event in the system connects to others through shared identifiers. A single user message triggers a cascade of events across all three layers, all traceable through two key IDs:

- `session_id` - generated once per browser session and stored in localStorage. It links all activity for a given user session.
- `invocation_id` - generated per API request. It links every event within a single agent lifecycle.

Here's how they connect:

```
session_id (browser localStorage UUID)
  └→ invocation_id (created per /api/chat request)
       ├→ message_sent (client) ────────── message_context
       ├→ agent_invocation (server) ────── agent_context
       ├→ user_intent_detected (agent) ─── agent_context + tool_context
       ├→ agent_decision_logged (agent) ── agent_context + tool_context
       ├→ agent_step (server) ──────────── agent_context
       ├→ tool_execution (server) ──────── agent_context + tool_context
       ├→ constraint_violation (agent) ─── agent_context + tool_context
       ├→ agent_completion (server) ────── agent_context
       └→ message_received (client) ────── message_context
```

This means you can start from any event and trace outward:

- From a `constraint_violation`, find the `user_intent_detected` in the same invocation to see what the user originally asked for
- From an `agent_completion` with high `total_tokens`, drill into the `agent_step` events to see which steps consumed the most tokens
- From a `message_received` with a long `response_time_ms`, trace the `tool_execution` events to find which tool was slow
- From a `user_intent_detected` with low `confidence`, check if the agent asked for clarification or guessed wrong

## Full schema inventory

| # | Schema | Type | Layer | Registry | Added in |
|---|--------|------|-------|----------|----------|
| 1 | `message_sent` | event | client | Iglu Central | `v0.1` |
| 2 | `message_received` | event | client | Iglu Central | `v0.1` |
| 3 | `message_context` | entity | client | Iglu Central | `v0.1` |
| 4 | `agent_invocation` | event | server | Iglu Central | `v0.2` |
| 5 | `agent_step` | event | server | Iglu Central | `v0.2` |
| 6 | `tool_execution` | event | server | Iglu Central | `v0.2` |
| 7 | `agent_completion` | event | server | Iglu Central | `v0.2` |
| 8 | `agent_context` | entity | server | Iglu Central | `v0.2` |
| 9 | `tool_context` | entity | server | Iglu Central | `v0.2` |
| 10 | `user_intent_detected` | event | agent | Iglu Central | `v0.3` |
| 11 | `agent_decision_logged` | event | agent | Iglu Central | `v0.3` |
| 12 | `constraint_violation` | event | agent | Iglu Central | `v0.3` |
| 13 | `tool_params` | entity | server | custom (iglu-local) | `v0.2` |
| 14 | `tool_results` | entity | server | custom (iglu-local) | `v0.2` |
| 15 | `intent_extraction` | entity | agent | custom (iglu-local) | `v0.3` |

10 events and six entities. The 12 Iglu Central schemas (vendor `com.snowplow.agent.tracking`) resolve automatically - you don't need to publish or maintain them. The three custom entities (vendor `com.snowplow.demo.travel`) are defined in `iglu-local` and validated by Snowplow Micro during development.

## What you can build with this data

With all three layers in place, you have the data foundation for:

### Operational monitoring
- Response latency by model: compare `total_duration_ms` in `agent_completion` across providers (Anthropic vs. OpenAI vs. Google)
- Token efficiency: track `total_tokens` per invocation and per step to optimize costs
- Tool reliability: monitor `success` rates in `tool_execution` and `execution_duration_ms` to catch degradation early
- Error rates: track `agent_completion` events where `success: false` to identify systemic issues

### User experience insights
- Session engagement: count `message_sent` events per `session_id` to understand conversation depth
- Response quality signals: correlate `response_time_ms` with session length - do slow responses drive users away?
- Tool usage patterns: which business tools are called most? Which are never used?
- Conversation complexity: average `total_steps` per invocation - are users' requests getting more complex over time?

### Agent intelligence analysis
- Intent distribution: aggregate `intent_category` from `user_intent_detected` to understand what users want most
- Confidence calibration: compare `confidence` scores against successful outcomes - is the agent well-calibrated?
- Decision reasoning: analyze `reasoning` fields in `agent_decision_logged` to understand agent behavior patterns
- Constraint analysis: track `constraint_type` in `constraint_violation` to identify product gaps - if budget violations are frequent, maybe your pricing model needs work

### Agent improvement
- Hallucination detection: compare extracted entities in `user_intent_detected` against actual tool parameters in `tool_execution` - mismatches may indicate hallucinated data
- Prompt optimization: use decision logs to identify cases where the agent's reasoning was sound but its actions were wrong
- Model comparison: run the same prompts against different models and compare intent confidence, decision quality, and constraint detection

## What's next

This tutorial used Snowplow Micro for local validation. To take this to production:

- The 12 generic schemas (vendor `com.snowplow.agent.tracking`) are already on Iglu Central - your Snowplow pipeline resolves them automatically with no publishing or configuration needed
- Publish your custom entities (vendor `com.snowplow.demo.travel`) to your own [Iglu registry](https://docs.snowplow.io/docs/pipeline-components-and-applications/iglu/) so your pipeline can validate them in production
- Connect to a Snowplow pipeline to collect events at scale with validation, enrichment, and warehouse loading
- Build dashboards on top of the landed data to monitor the metrics described above
- Use the data to improve agent performance - fine-tune prompts, optimize tool selection, and calibrate confidence thresholds

The three-layer model - client, server, agent - generalizes beyond travel chatbots. Any agentic application can benefit from this pattern. The generic Iglu Central schemas give you lifecycle observability out of the box. The custom entities you create for your domain - whether travel, support, finance, or anything else - capture the business-specific data that makes the tracking actionable.
