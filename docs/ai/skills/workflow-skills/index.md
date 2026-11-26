---
title: "Install and use the Snowplow Workflows skills"
sidebar_label: "Snowplow Workflows skills"
sidebar_position: 10
description: "Install the Snowplow Workflows agent skills alongside the Snowplow MCP server and skills, set up your project context, and use the skills to design and implement tracking, debug and recover failed events, and query Snowplow data."
keywords: ["agent skills", "Snowplow Workflows", "Claude Code", "Cursor", "Codex", "coding agent", "failed event recovery"]
date: "2026-11-26"
content_type: how-to
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Snowplow Workflows skills are a set of agent skills for multi-step Snowplow field workflows: turning a product spec into a tracking plan, instrumenting and validating tracking locally with [Snowplow Micro](/docs/testing/snowplow-micro/index.md), debugging and recovering [failed events](/docs/fundamentals/failed-events/index.md), and writing SQL against your Snowplow data. The skills are published as the `snowplow-workflows` plugin in the [`snowplow-industry-solutions/snowplow-agent-skills`](https://github.com/snowplow-industry-solutions/snowplow-agent-skills) GitHub repository.

The Snowplow Workflows skills complement the official Snowplow plugin. They don't replace it. The official plugin, from [`snowplow/skills`](https://github.com/snowplow/skills), installs the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and the Console-facing Snowplow [skills](/docs/ai/skills/index.mdx). The Snowplow Workflows plugin ships skills only, with no MCP server of its own. Whenever a workflow skill needs to read or write Console, such as publishing a schema or creating an event specification, it calls the Snowplow MCP server's tools. Install both plugins.

Use the Snowplow Workflows skills when you want your coding agent to carry a task from start to finish in your repository, for example from "we should track checkout" through to validated events in Micro. For a single Console question or action, the official skills and the Snowplow MCP server are enough on their own.

## Before you begin

You need:

* A coding agent that supports skills: Claude Code, Cursor, or Codex.
* Node.js, to run the `npx` install commands.
* A [Snowplow Console](https://console.snowplowanalytics.com) account, for the skills that read or write Console through the Snowplow MCP server.
* Docker, if you want to validate tracking locally with Snowplow Micro.
* Access to your warehouse, if you want to query Snowplow data or recover failed events. The recovery skill supports Athena with Iceberg, BigQuery, Databricks, and Snowflake.

The [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md) is optional. The `design-tracking-plan` skill uses it for the git-backed schema workflow, which also works when the Snowplow MCP server isn't installed.

## Install and set up the skills

Install the official Snowplow plugin first, then the Snowplow Workflows plugin, then run the `setup-snowplow-context` skill once in each project. The `setup-snowplow-context` skill records how your project uses Snowplow, so every other skill reads your answers instead of asking for them again.

<Steps>

### Install the official Snowplow plugin

The official plugin installs the Snowplow MCP server and the Snowplow skills.

<Tabs groupId="skills-install" queryString>
  <TabItem value="plugins-cli" label="Any agent" default>

The [`plugins` CLI](https://www.npmjs.com/package/plugins) detects Claude Code, Cursor, and Codex on your machine and installs to each one.

```bash
npx plugins add snowplow/skills
```

  </TabItem>
  <TabItem value="claude-code" label="Claude Code marketplace">

Run these commands in the Claude Code prompt, not in your shell:

```text
/plugin marketplace add snowplow/skills
/plugin install snowplow@snowplow
```

  </TabItem>
</Tabs>

To configure the Snowplow MCP server by hand instead, see [Configure the MCP server](/docs/ai/snowplow-mcp/index.md#configure-the-mcp-server).

### Install the Snowplow Workflows skills

Install the `snowplow-workflows` plugin into the same agent.

<Tabs groupId="skills-install" queryString>
  <TabItem value="plugins-cli" label="Any agent" default>

```bash
npx plugins add snowplow-industry-solutions/snowplow-agent-skills
```

  </TabItem>
  <TabItem value="claude-code" label="Claude Code marketplace">

Run these commands in the Claude Code prompt:

```text
/plugin marketplace add snowplow-industry-solutions/snowplow-agent-skills
/plugin install snowplow-workflows@snowplow-workflows
```

  </TabItem>
  <TabItem value="skills-cli" label="Skills CLI">

The `skills` CLI runs an installation wizard, where you choose which skills to install and which agents to install them into.

```bash
npx skills@latest add https://github.com/snowplow-industry-solutions/snowplow-agent-skills
```

  </TabItem>
</Tabs>

### Restart your agent and authorize the MCP server

If your agent was running during the install, restart it so it loads the new skills. The first time a skill calls the Snowplow MCP server, your agent opens a browser window to log in to Console. The agent then has the same permissions as your Console user. To use an API key instead of OAuth, see [Authentication](/docs/ai/snowplow-mcp/index.md#authentication).

### Set up your project context

Open your agent in the root of the repository you want to work in, and ask it to set up the Snowplow context. For example:

```text
Set up the Snowplow context for this project.
```

This prompt triggers the `setup-snowplow-context` skill, which:

1. Scans the repository for evidence of your setup: tracker dependencies in files such as `package.json`, `Podfile`, or `build.gradle`, Iglu schema URIs and vendor directories, `snowtype.config.json`, dbt profiles, and Snowplow CLI usage in CI.
2. Checks whether the Snowplow MCP server's tools are available in the session.
3. Reports what it found, with the evidence for each value, and asks you about the remaining values in a single message. It always asks whether you want to design alongside the agent question by question (`co-design`) or have it prepare complete proposals for you to review (`review-only`).
4. Writes the answers to `.snowplow/agent-context.md`.
5. Adds a line to your `CLAUDE.md` or `AGENTS.md`, if either file exists, telling agents to read `.snowplow/agent-context.md` before any Snowplow work. If neither file exists, the skill tells you so. Add the line to the instructions file your agent reads, so that other agents and sessions find the context file.

The `setup-snowplow-context` skill suggests a schema vendor from your project, such as `com.acme` for `acme.com`. Trial Console organizations default to the `io.snowplow` vendor, which is a placeholder that belongs to Snowplow. Don't accept `io.snowplow` as your vendor, because every schema the skills design inherits it.

### Verify the context file

Open `.snowplow/agent-context.md` and check that it contains all eight keys:

```markdown
- schema-vendor: com.acme
- iglu-repositories: Iglu Central + Console registry
- console-org: Acme Corp (b2f4c8d0-1234-...)
- mcp-available: yes
- schema-workflow: console-managed
- warehouse: snowflake
- tracked-platforms: web, ios
- collaboration-mode: co-design
```

A key that the skill couldn't resolve has the value `unknown`. Commit `.snowplow/agent-context.md` so your team shares it. The file holds names and choices only. Keep API keys and other credentials out of it.

To change one value later, edit the file directly. Re-run `setup-snowplow-context` only when most values change, for example when you move to a different warehouse or from Console-managed to git-backed schemas.

</Steps>

## Use the skills

Your agent loads the skills on demand. There are no slash commands to remember: describe the task, and the agent picks the skill whose description matches it. To force a specific skill, name it in your prompt, for example "Use the `design-tracking-plan` skill to...".

Pick your starting point by what you already have:

| You have | Start with |
| --- | --- |
| A fresh repository, with no Snowplow work started | `setup-snowplow-context` |
| A product requirements document (PRD) or business goals, with tracking undecided | `create-data-spec` |
| Agreed events and entities that need schemas | `design-tracking-plan` |
| An application with no Snowplow tracker | `install-snowplow-tracking` |
| Event specifications in Console, and you want typed tracking code | `setup-snowtype` |
| A feature to instrument from start to finish | `implement-custom-events` |
| Tracking code that needs verifying | `setup-micro`, then `validate-snowplow-implementation` |
| Events failing validation | `debug-failed-events` |
| Schema validation failures already loaded in your warehouse | `recover-failed-events` |
| Snowplow data in your warehouse, and a question to answer with SQL | `query-snowplow-data` |

### Design and implement tracking

These skills take you from a business question to validated events. The `implement-custom-events` skill runs the whole chain: it discovers what to track, delegates to `create-data-spec` and `design-tracking-plan`, creates the schemas and event specifications in Console, instruments your code, and validates the events in Micro. Each skill also works on its own.

| Skill | What it does |
| --- | --- |
| `create-data-spec` | Turns a product spec, PRD, or business goals into a data spec of KPIs, events, entities, and identity, then restates it in Snowplow terms ready for tracking plan design. |
| `design-tracking-plan` | Designs [tracking plans](/docs/fundamentals/tracking-plans/index.md), [schemas](/docs/fundamentals/schemas/index.md), [entities](/docs/fundamentals/entities/index.md), and event specifications, with an entity-first approach to modeling, naming, and versioning. Works through the Snowplow MCP server (Console-managed) or the Snowplow CLI (git-backed). |
| `install-snowplow-tracking` | Installs and configures a tracker from scratch in web, iOS, Android, or server-side applications, including out-of-the-box events, user identification, and stitching server-side events to the client session. |
| `setup-snowtype` | Sets up [Snowtype](/docs/event-studio/implement-tracking/index.md) to generate typed tracking code from your event specifications, and keeps the generated code current. |
| `implement-custom-events` | Runs the end-to-end custom event workflow, delegating to the other skills in order. |
| `setup-micro` | Runs Snowplow Micro locally in Docker, with your custom schemas mounted, Iglu registries connected, and enrichments enabled. |
| `validate-snowplow-implementation` | Checks good and failed event counts in Micro, inspects attached entities, and surfaces validation errors before you deploy. |
| `fetch-snowplow-docs` | Fetches the current tracker documentation for any platform, so the agent writes code against the current tracker API rather than its training data. Other skills call it as a utility. |

Example prompts:

* "Here's the PRD for our new subscription flow. Turn it into a data spec with the KPIs and events we need."
* "Design a tracking plan for our checkout: add to cart, begin checkout, and purchase, with a product entity."
* "Add Snowplow tracking to this Next.js app, including page views and user identification."
* "Set up Snowtype in this repo and generate tracking code from our Console event specifications."
* "Add custom event tracking for the onboarding wizard end to end, and validate the events in Micro."
* "Start Snowplow Micro locally with the schemas in our `data-structures` directory."
* "Validate my tracking in Micro and tell me which events are failing."

The official Snowplow plugin has overlapping skills for lighter tasks. Its `tracking-design` skill handles quick schema design in Console without a local workflow, and its `implementation-guidance` skill helps with individual tracking calls in an application that already has a tracker.

### Debug failed events

The `debug-failed-events` skill diagnoses individual events that fail validation. It reads failed events from a pasted error, from Micro's `/bad` endpoint during local testing, or from a production pipeline through Console, the Snowplow MCP server, or a failed events table in your warehouse. The skill sorts each failure into one of four categories, schema resolution, schema validation, enrichment, or malformed event, and suggests a fix.

Example prompts:

* "Micro shows three failed events after my last change. Why are they failing?"
* "Here's a failed event from production. What's wrong with it and how do I fix the tracking?"
* "Pull the latest failed events from my production pipeline and explain each validation error."

For pipeline-wide problems, such as events missing entirely, enrichment latency, or loader failures, use the `troubleshooting` skill from the official Snowplow plugin.

### Recover failed events

The `recover-failed-events` skill recovers schema validation failures from a [failed events table in your warehouse](/docs/monitoring/exploring-failed-events/index.md) back into the atomic events table. It supports Athena with Iceberg, BigQuery, Databricks, and Snowflake. Redshift isn't supported. For the underlying approach, see [Recover failed events with SQL](/docs/monitoring/recovering-failed-events/recover-with-sql/index.md).

The skill builds the recovery SQL with you in an interactive flow of eight phases, one query at a time. It grounds each fix in the column types and data in your warehouse rather than guessing from the schema. You choose the schema to recover, confirm the fix, and approve a test `SELECT` before the skill writes anything. Each run recovers one schema from one source: a schema that failed both as an entity and as a self-describing event needs two runs.

Example prompts:

* "Recover the failed events for `com.acme/checkout_started` from last week into our Snowflake atomic events table."
* "Help me find recent schema validation failures in BigQuery and recover them."
* "We shipped a bad schema version on Monday. Reprocess those failed events with SQL in Databricks."

### Query Snowplow data

The `query-snowplow-data` skill writes and reviews SQL against the atomic events table in Snowflake, BigQuery, Databricks, and Redshift, including Iceberg and Delta tables written by the Lake Loader. The skill reads your warehouse from `.snowplow/agent-context.md` and applies the patterns that make Snowplow queries return the right answer: unnesting self-describing event and entity columns, deduplicating events, filtering bots, choosing the right timestamp, counting users and sessions correctly, and handling page pings. If your agent has a tool that connects to your warehouse, the skill runs the query. Otherwise, it gives you dialect-correct SQL to run yourself.

Example prompts:

* "How many unique users completed checkout each day last week? Exclude bots and duplicate events."
* "Write a query that unnests the product entity from our add-to-cart events in BigQuery."
* "Review this SQL and tell me why my session counts look too high."

For more on the warehouse tables, see [warehouses and lakes](/docs/destinations/warehouses-lakes/index.md).

To report a problem or request a skill, open an issue in the [`snowplow-agent-skills`](https://github.com/snowplow-industry-solutions/snowplow-agent-skills) repository. For the Console-facing skills, see the [skills library](/docs/ai/skills/index.mdx), and for the tools they use, see the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md).
