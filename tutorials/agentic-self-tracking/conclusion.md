---
title: "Conclusion"
sidebar_label: "Conclusion"
position: 6
description: "See how all three tracking layers connect via shared identifiers, review the complete schema inventory, and learn what to build next."
keywords: ["snowplow", "agentic", "tracking", "ai", "data lineage", "next steps"]
date: "2026-03-26"
---

You've instrumented an AI chatbot with three layers of behavioral tracking. With all the tracking in place, you have the data to answer questions across new areas.

This client-server-agent model generalizes beyond travel chatbots. The generic Iglu Central schemas give you lifecycle observability out of the box, and the custom entities you create for your domain capture the business-specific data.

## Operational monitoring

Track the performance and reliability of the agent in production:

- Response latency by model: compare `total_duration_ms` in `agent_completion` across providers e.g. Anthropic vs OpenAI vs Google
- Token efficiency: track `total_tokens` per invocation and per step to optimize costs
- Tool reliability: monitor `success` rates in `tool_execution` and `execution_duration_ms` to catch degradation early
- Error rates: track `agent_completion` events where `success: false` to identify systemic issues

## User experience insights

Understand how users interact with the agent:

- Session engagement: count `message_sent` events per `session_id` to understand conversation depth
- Response quality signals: correlate `response_time_ms` with session length - do slow responses drive users away?
- Tool usage patterns: which business tools are called most? Which are never used?
- Conversation complexity: average `total_steps` per invocation - are users' requests getting more complex over time?

## Agent intelligence analysis

Examine how the agent interprets and responds to requests:

- Intent distribution: aggregate `intent_category` from `user_intent_detected` to understand what users want most
- Confidence calibration: compare `confidence` scores against successful outcomes - is the agent well-calibrated?
- Decision reasoning: analyze `reasoning` fields in `agent_decision_logged` to understand agent behavior patterns
- Constraint analysis: track `constraint_type` in `constraint_violation` to identify product gaps - if budget violations are frequent, maybe your pricing model needs work

## Agent improvement

Use the tracking data to improve agent behavior over time:

- Hallucination detection: compare extracted entities in `user_intent_detected` against actual tool parameters in `tool_execution` - mismatches may indicate hallucinated data
- Prompt optimization: use decision logs to identify cases where the agent's reasoning was sound but its actions were wrong
- Model comparison: run the same prompts against different models and compare intent confidence, decision quality, and constraint detection

## Next steps

This accelerator used [Snowplow Micro](/docs/testing/snowplow-micro/) for local validation and event collection.

To take this to production:
- Publish your custom entities as [data structures](/docs/event-studio/data-structures/) within [Snowplow Console](https://console.snowplowanalytics.com/), or to your own [Iglu registry](/docs/api-reference/iglu/), so your pipeline can validate them in production
- Within your application, replace the Micro Collector endpoint with a production Snowplow endpoint
- Build dashboards on top of the tracked and loaded data to monitor the metrics described above
- Use the data to improve agent performance, for example fine-tuning prompts, optimizing tool selection, and calibrating confidence thresholds

To explore related topics:

- [Build a personalized travel agent with Signals](/tutorials/signals-personalize-travel/intro) - use real-time behavioral attributes to personalize agent responses
- [Build a Signals-powered AI agent with AgentCore](/tutorials/signals-agentic-accelerator/intro) - combine Signals with persistent memory for customer-facing agents
- [Manage data structures with the Snowplow CLI MCP tool](/tutorials/snowplow-cli-mcp/introduction) - use AI assistants to create and validate schemas
