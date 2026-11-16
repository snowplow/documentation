---
title: "Inspect your Snowplow pipeline with an AI assistant"
sidebar_label: "Pipeline infrastructure"
sidebar_position: 4
description: "Use the Snowplow pipeline infrastructure skill to check pipeline health, Collector configuration, enrichments, and loaders, plus Snowplow Micro instances, from a coding agent such as Claude Code, Cursor, or Codex, without changing anything."
keywords: ["snowplow pipeline", "pipeline health", "snowplow collector", "collector configuration", "collector endpoint", "CNAME", "cookie policy", "snowplow enrichment", "enrichment latency", "loader", "snowplow micro", "Snowplow MCP", "AI assistant", "Claude Code", "Cursor", "Codex"]
date: "2026-11-16"
content_type: concept
---

The pipeline infrastructure skill helps your AI assistant answer questions about your Snowplow pipelines: what you have deployed, how each pipeline is configured, and how it's performing. You ask in plain language. The assistant reads your pipelines, [Collector](/docs/pipeline/collector/index.md) configuration, [enrichments](/docs/pipeline/enrichments/index.md), and health metrics from Console, then summarizes what it finds and points out settings worth a second look.

The skill is part of the Snowplow plugin and works through the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md). To install it, see [Install the skills](/docs/ai/skills/index.mdx#install-the-skills). Your assistant loads the skill on its own when you ask about pipeline status, Collector endpoints, enrichments, loaders, or throughput. You don't need to run a command.

## Decide when to use the skill

Use the pipeline infrastructure skill when you need to know how your pipeline is set up or how it's running, for example before you add a new tracker, after a configuration change, or when data looks late. It's built for the questions teams ask about their pipelines, such as:

- Which pipelines do I have, which ones are production, and which Collector endpoints should my trackers send to?
- Is my pipeline healthy, and has anything degraded in the last week?
- Is the loader keeping up, or is the data in my warehouse behind?
- Is enrichment slow, and is the pipeline dropping any events?
- Which enrichments are switched on, and which are switched off?
- Is a custom CNAME configured for the Collector, and which cookie attributes does the Collector set?
- Which app IDs, platforms, and tracker versions are sending events, and are any of them out of date or unexpected?
- Does Enrich pass on enriched events that fail validation against the atomic schema, or send them to failed events?
- Which Snowplow Micro instances do I have for testing?

The skill only reads. It never changes a pipeline, the Collector configuration, or an enrichment. To change enrichment configuration, data quality alerts, source applications, or tracking plans, use the [console operations skill](/docs/ai/skills/console-operations/index.md). To dig into why specific events failed, use the [troubleshooting skill](/docs/ai/skills/troubleshooting/index.md).

## Understand how the skill works

The skill starts with the big picture and goes into detail only where your question needs it. It works in four steps:

1. Show the infrastructure: the assistant lists your pipelines with their status, label, and Collector endpoints. If it's relevant, it also lists your [Snowplow Micro](/docs/testing/snowplow-micro/index.md) instances and any older [Snowplow Mini](/docs/api-reference/snowplow-mini/index.md) pipelines.
2. Check health: for questions about health or performance, the assistant reads the pipeline's metrics for the last seven days by default, or for the time range you ask about.
3. Inspect the details: depending on the question, the assistant reads the Collector configuration, the list of enrichments and whether each one is enabled, the pipeline's validation settings, or the breakdown of events by app.
4. Recommend: the assistant points out settings and metrics that may need attention, and explains why.

A pipeline's status is one of `creating`, `ready`, `updating`, or `deleting`. Only `ready` means the pipeline is fully operational. Labels such as `dev`, `staging`, and `prod` help you organize pipelines, but they don't change how a pipeline behaves.

:::note[The skill doesn't change anything]
The pipeline infrastructure skill uses read tools only. It inspects pipelines, Collector configuration, enrichments, and health metrics, and leaves them as they are.
:::

The assistant works with the permissions of your Console login, or of the API key if you connect with one, so it can see only the pipelines those allow. See [Authentication](/docs/ai/snowplow-mcp/index.md#authentication).

## Review what the skill produces

For a health question, the assistant summarizes each layer of the pipeline:

- The Collector: status, request volume, error rate, and current requests per second
- Enrich: status, latency (average, minimum, maximum, and current), dropped events, and events broken down by app ID, platform, and tracker version
- The loaders: events loaded and the last loaded time for each destination, with failed events loaders shown apart from the loaders for good events
- [Failed events](/docs/fundamentals/failed-events/index.md): the total count for the time range

The assistant then gives an overall rating, using the skill's own rules of thumb rather than product limits. Green means every component is ok, with no dropped events and no stale loaders. Yellow means high latency, some failed events, or a loader that is slightly behind. Red means errors, dropped events, a loader that is well behind, or a component that isn't ok.

For a configuration question, the assistant highlights the settings that matter most:

- Collector domains: whether a custom CNAME is configured, which affects how browsers treat the cookie the Collector sets
- Cookie attributes: the `secure`, `sameSite`, and `httpOnly` settings
- Request paths: any custom `POST`, webhook, or redirect paths
- Encryption: whether the Collector blocks unencrypted traffic
- Enrichments: which ones are active, and what each one does
- Validation: whether Enrich passes on enriched events that fail validation against the atomic schema, instead of sending them to failed events

For field-level detail on the Collector settings, see the [Collector configuration reference](/docs/pipeline/collector/configuration-reference/index.md).

### Read the recommendations

After it shows the state of your pipeline, the assistant suggests what to check or change. The skill flags these conditions:

- No custom CNAME: the assistant suggests setting one up for better first-party cookie support. Safari still limits the cookie to seven days when the Collector's CNAME resolves to a third-party host. See [Cookie Lifetime Extension service](/docs/sources/web-trackers/cookies-and-local-storage/cookie-extension/index.md).
- The `secure` cookie attribute is `false`: the assistant suggests turning it on for HTTPS-only sites.
- `sameSite` is `None`: the assistant suggests `Lax`, unless the Collector needs the cookie on cross-site requests.
- Enrich accepts invalid events: enriched events that fail atomic schema validation pass through instead of becoming failed events, so the assistant asks you to confirm that's intended.
- Average enrichment latency over 1,000 milliseconds: this can point to heavy enrichments or resource limits.
- A loader more than an hour behind: the loader may be struggling.
- A growing failed events count: the assistant suggests looking at the failed events metrics for the error types and schemas involved.
- Dropped events: events are being lost in enrichment, and the assistant tells you to investigate right away.

The assistant suggests these changes but doesn't make them. To change an enrichment, ask your assistant to use the console operations skill. The skills can't change Collector or validation settings.

## Try example prompts

Ask about your pipeline in your own words. Name the pipeline or its label if you have more than one. Try prompts like these:

- "What pipelines do I have, and what's the status of each one? Include any Micro instances."
- "How is my production pipeline doing this week? Give me a traffic light summary."
- "Is the loader on my prod pipeline up to date, or is my warehouse behind?"
- "Is there a custom CNAME on my Collector, and what cookie attributes does it set?"
- "Which enrichments are enabled on my production pipeline, and does it accept invalid events?"
- "Which app IDs and tracker versions sent events to production in the last day?"
- "How many failed events has my production pipeline had this week, and which errors are behind them?"

To plan new tracking, see the [tracking design skill](/docs/ai/skills/tracking-design/index.md). To add or update trackers in your application, see the [implementation guidance skill](/docs/ai/skills/implementation-guidance/index.md).
