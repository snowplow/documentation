---
title: "Introducing the Snowplow Workflows agent skills"
description: "A set of field-built agent skills for Claude Code, Cursor, and Codex that run multi-step Snowplow workflows, from tracking design to failed event recovery, alongside the Snowplow MCP server."
date: "2026-11-26"
category:
  - "Product news"
components:
  - "AI tools"
  - "Event Studio"
  - "Monitoring"
  - "Testing"
---
The Snowplow Workflows skills are a set of agent skills for coding agents such as Claude Code, Cursor, and Codex. They take your agent through multi-step Snowplow workflows in your own repository: turning a product spec into a tracking plan, instrumenting tracking and validating it locally with Snowplow Micro, debugging and recovering failed events, and writing SQL against your Snowplow data.

The skills run alongside the official Snowplow plugin, which installs the Snowplow MCP server and the Console-facing Snowplow skills. The Snowplow Workflows skills use the Snowplow MCP server whenever they need to read or write Console, so install both.

The Snowplow Workflows skills are field skills maintained by Snowplow's field team, not part of the supported Snowplow product. Support is best-effort, through issues on the [`snowplow-agent-skills`](https://github.com/snowplow-industry-solutions/snowplow-agent-skills) GitHub repository.

## What the skills cover

* **Design and implement tracking.** Turn a PRD into a data spec, design schemas and event specifications, install a tracker, generate typed code with Snowtype, and validate events in Snowplow Micro. The `implement-custom-events` skill runs the whole chain end to end.

* **Debug failed events.** Diagnose individual events that fail validation, from a pasted error, Micro, or a production pipeline, and get a suggested fix.

* **Recover failed events.** Generate validation-gated SQL that recovers schema validation failures from a warehouse failed events table back into the atomic events table, on Athena with Iceberg, BigQuery, Databricks, or Snowflake. You approve each step before anything is written.

* **Query Snowplow data.** Write dialect-correct SQL that handles entity unnesting, deduplication, bot filtering, timestamps, and sessions on Snowflake, BigQuery, Databricks, and Redshift.

## Get started

Install the official Snowplow plugin, then the Snowplow Workflows skills:

```bash
npx plugins add snowplow/skills
```

```bash
npx plugins add snowplow-industry-solutions/snowplow-agent-skills
```

Restart your agent, then ask it to "set up the Snowplow context for this project". The `setup-snowplow-context` skill records your schema vendor, Console organization, warehouse, and other settings once, so the other skills don't ask for them again.

You can read more here:

* [Install and use the Snowplow Workflows skills](/docs/ai/skills/workflow-skills/)

* [Skills library](/docs/ai/skills/)

* [Snowplow MCP server](/docs/ai/snowplow-mcp/)
