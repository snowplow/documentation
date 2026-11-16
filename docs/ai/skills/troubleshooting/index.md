---
title: "Troubleshoot failed events and missing events with an AI assistant"
sidebar_label: "Troubleshooting"
sidebar_position: 6
description: "Use the Snowplow troubleshooting skill to diagnose failed events, schema validation errors, enrichment failures, and missing events in a coding agent such as Claude Code, Cursor, or Codex, and get a suggested fix."
keywords: ["failed events", "schema validation error", "missing events", "enrichment failures", "troubleshooting", "debug tracking", "Collector configuration", "Snowplow MCP", "AI assistant", "Claude Code", "Cursor", "Codex"]
date: "2026-11-16"
content_type: concept
---

The troubleshooting skill helps your AI assistant work out why events are failing or not arriving, and what to change to fix it. You describe what you're seeing in plain language, or paste an error message or screenshot. The assistant checks your pipeline's health, reads your [failed events](/docs/fundamentals/failed-events/index.md), works out whether the cause is a schema, an enrichment, the Collector, or the tracker, and suggests a specific fix.

The skill is part of the Snowplow plugin and works through the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md). To install it, see [Install the skills](/docs/ai/skills/index.mdx#install-the-skills). Your assistant loads the skill on its own when you report missing events, validation failures, or pipeline errors, even if you only say that something is wrong with your pipeline. You don't need to run a command.

## Decide when to use the skill

Use the troubleshooting skill when events don't reach your warehouse, arrive as failed events, or arrive without the data you expect. It's built for the questions teams ask when tracking breaks, such as:

- Why did events start failing after a release, and which schema is causing it?
- What does a schema validation error about a missing required field mean, and what do I change?
- Is this schema version deployed to production, or only to my development environment?
- Which error accounts for most of my failed events?
- Events look valid in testing, so why aren't they showing up in my warehouse?
- Does my Collector domain match the endpoint my tracker sends to?
- An enrichment is failing for some events. Which one, and why?
- It was working yesterday. Why is it failing now?

The skill diagnoses problems and suggests fixes. It doesn't recover or replay failed events. To reprocess failed events, see [Recovering failed events](/docs/monitoring/recovering-failed-events/index.md). For every page about failed events, from alerts to recovery, see the [failed events hub](/docs/failed-events/index.md).

## Understand how the skill works

The skill works through the problem in four phases, in this order:

1. Gather symptoms: the assistant asks what you're seeing, one question at a time, starting with which pipeline is affected. If you share an error message or screenshot, it reads that first. It works out which kind of problem it is, such as events not arriving at all, events failing validation, events arriving with missing data, or enrichment errors.
2. Check pipeline health: the assistant checks that the pipeline's status is "ready", reads its health metrics, such as Collector errors, enrichment latency, Loader status, and dropped events, and checks for failed events. It summarizes what it finds before going further.
3. Diagnose the cause: the assistant follows the path for the kind of problem you have. For validation failures, it reads the error detail and the failing schema. For enrichment failures, it reads your enrichment configuration. When no events arrive at all, it inspects the [Collector configuration](/docs/pipeline/collector/index.md). When events arrive without expected data, it checks that the entity schemas exist and that the right enrichments are on, and asks you to confirm that the tracker attaches the entities.
4. Resolve: the assistant explains what's wrong and why, and suggests a specific fix with concrete steps.

By default, the assistant looks at failed events from the last week. If you say it was working yesterday, it narrows the range, for example to the last 24 hours. It checks both validation and enrichment failures, because both can happen at once. When there are many different errors, it starts with the one that affects the most events.

:::note[Changes need your approval]
The skill reads your pipeline, schemas, and failed events, and suggests fixes. It asks for your approval before it updates an enrichment or creates a schema.
:::

The assistant works with the permissions of your Console login, or of the API key if you connect with one, so it can see and change only what those allow. See [Authentication](/docs/ai/snowplow-mcp/index.md#authentication).

## Review what the skill finds

The assistant reports the pipeline's health first, then the root cause. The causes it checks for depend on the kind of problem.

For a schema validation error, the assistant names the failing schema from the error and compares the error with the schema definition. Common causes are:

- The schema is deployed to your development environment but not to production. See [Promote data structures to production](/docs/event-studio/test-and-publish/index.md#promote-data-structures-to-production).
- The event is missing a field the schema marks as required
- A field has the wrong type, such as a string where the schema expects a number
- The event includes a property the schema doesn't define, and the schema doesn't allow additional properties
- The tracker sends events against a schema version that doesn't exist

For an enrichment failure, common causes are an [API enrichment](/docs/pipeline/enrichments/available-enrichments/custom-api-request-enrichment/index.md) whose external API is slow or unreachable, a lookup source that's misconfigured, a runtime error in a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md), or wrong parameters in the enrichment configuration.

When events don't arrive at all and there are no failed events either, the assistant checks the Collector configuration for a domain that doesn't match what the tracker points at, `blockUnencrypted` set to `true` while the tracker sends over HTTP, custom `POST` paths that the tracker doesn't use, and a cookie `sameSite` value of `None` without `secure` set to `true`, which browsers reject. It also asks you to confirm the endpoint in your tracker configuration, that the tracker sends requests at all, and whether a firewall or ad blocker is in the way. If events appear neither in your data nor in failed events, the problem is likely before the pipeline, in the tracker, the network, or DNS.

### Act on the fix

The suggested fix depends on where the problem is. For a schema problem, the assistant suggests creating the right schema version or updating the tracker. For an enrichment problem, it suggests the configuration change. For a tracker problem, it explains what the developer needs to change. It can also point you to the relevant page in Console, so you can see the problem yourself.

To make a change, the assistant uses another Snowplow skill. To create a new schema version, use the [tracking design skill](/docs/ai/skills/tracking-design/index.md). To change an enrichment's configuration, use the [console operations skill](/docs/ai/skills/console-operations/index.md). To fix tracking code, use the [implementation guidance skill](/docs/ai/skills/implementation-guidance/index.md). To inspect pipelines without a specific problem in mind, use the [pipeline infrastructure skill](/docs/ai/skills/pipeline-infrastructure/index.md).

## Try example prompts

Describe the problem in your own words, and include any error message you have. The assistant asks follow-up questions where it needs more detail. Try prompts like these:

- "Events from our website stopped arriving this morning. Can you check the production pipeline?"
- "Show me the failed events from the last 24 hours, grouped by error, and tell me what's causing them."
- "We're getting a schema validation error on `checkout_completed` since yesterday's release. What's wrong, and how do I fix it?"
- "Is the `product` entity deployed to production, or only to development?"
- "Some events land without geolocation fields. Is the IP lookup enrichment turned on?"
- "Our tracker sends to a custom Collector domain. Check the Collector configuration for anything that would block events."

To get alerts when failed events appear, rather than asking for them, see [Failed event alerts](/docs/monitoring/alerts/failed-event-alerts/index.md). For the full list of failed event types, see the [failed events API reference](/docs/api-reference/failed-events/index.md).
