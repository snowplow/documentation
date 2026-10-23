---
title: "Snowplow quickstart with your coding agent"
sidebar_label: "Quickstart"
sidebar_position: 1
description: "Sign up for a hosted Snowplow environment, connect your coding agent with the Snowplow MCP server and skills, and run a starter prompt that designs your tracking, creates the schemas, adds the tracker, and checks the events."
keywords: ["snowplow quickstart", "getting started", "snowplow mcp", "coding agent", "claude code", "cursor", "codex", "tracking setup"]
date: "2026-10-23"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Add Snowplow tracking to your application with one prompt. Your coding agent asks what you want to measure, then designs the tracking plan, creates the schemas in your Snowplow account, adds the tracker, and checks that the events arrive and pass validation.

You'll need a coding agent that supports MCP, such as Claude Code, Cursor, or Codex. If you don't have an application to track, the agent can create one.

## Sign up

Start a [free trial](https://snowplow.io/get-started/snowplow-free-trial) of Snowplow CDI Cloud, or create an account on the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral) for a hosted environment with no end date. Neither needs a credit card.

Your environment is provisioned automatically. You'll receive access instructions within around 20 minutes, and there's no infrastructure to set up. See the [free trial](/docs/get-started/free-trial/index.md) page for the limits that apply.

Already on Snowplow CDI? Log in to [Console](https://console.snowplowanalytics.com) and skip to the next step.

## Install the Snowplow plugin

The plugin adds the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and [skills](/docs/ai/skills/index.mdx) to your agent.

<Tabs groupId="mcp-client" queryString>
  <TabItem value="any" label="Any agent" default>

```bash
npx plugins add snowplow/skills
```

  </TabItem>
  <TabItem value="claude-code" label="Claude Code">

```text
/plugin marketplace add snowplow/skills
/plugin install snowplow@snowplow
```

  </TabItem>
</Tabs>

The first time the agent uses a Snowplow tool, a browser window opens for you to log in to Console. The agent then works with the permissions of your Console account.

Prefer not to install anything? The [Snowplow Assistant](/docs/ai/console-agent/index.md) in Console has the same tools, and can design the tracking plan, create the schemas, and generate the tracker code for you to add to your application.

## Run the starter prompt

Open your project in the agent and paste this prompt:

```text
Help me add Snowplow tracking to this project, using my connected Snowplow account.

Look at the project first, including any analytics or tracking that's already in
place. Ask me what I want to measure, with a few examples that fit this app. Then
propose a tracking plan: the events, the entities, and the schemas, with what
each one is for. Wait for my approval before you create anything in Console.

Once approved, create the schemas and the tracking plan in my account, add the
Snowplow tracker to the app, and send a test event for each event in the plan.
Check for failed events and fix any validation errors. If there's no app here,
create a minimal one. When you're done, list the files you changed, the
schemas you created, and how I can see the events arriving.
```

When the agent asks what you want to measure, describe it in the words of your product. For example, "product views, add to basket, each checkout step, and purchase, with the product and the basket on every event".

The agent loads the relevant skill on its own: `tracking-design` plans the [events](/docs/fundamentals/events/index.md), [entities](/docs/fundamentals/entities/index.md), and [schemas](/docs/fundamentals/schemas/index.md), `implementation-guidance` adds and configures the [tracker](/docs/sources/index.md), and `troubleshooting` reads [failed events](/docs/fundamentals/failed-events/index.md) and proposes a fix.

## Check that it works

The agent finishes by listing what it created and changed. To check for yourself, open [Console](https://console.snowplowanalytics.com) to see the schemas and the tracking plan, and open the [Snowplow Micro](/docs/testing/snowplow-micro/index.md) instance included with your environment to inspect each event and its validation result as it arrives. The [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) browser extension shows the same events as you use your app.

<details>
<summary>Troubleshooting</summary>

* If the browser login doesn't open, run `/mcp` in Claude Code, select the Snowplow server, and choose **Authenticate**. For other clients, see [authentication](/docs/ai/snowplow-mcp/index.md#authentication).
* If events show up as failed, ask the agent to read the failed events and fix the schema or the tracking call. The validation error names the property and the rule it broke.
* If no events arrive, check your browser's network tab for tracking requests to the Collector endpoint. If an ad blocker stops them, turn it off for local testing. In production, serve the Collector from your own domain, or proxy the requests through your backend. See [cookies and ad blockers](/docs/get-started/tracking/cookies-and-ad-blockers/index.md).

</details>

## Connect a destination

When the events look right in Micro, connect a [warehouse or lake destination](/docs/destinations/warehouses-lakes/index.md) in Console so validated events load into it. The trial allows one warehouse or lake destination and one [event forwarding](/docs/destinations/forwarding-events/index.md) destination. From there you can [query your data](/docs/get-started/querying/index.md) and [model it](/docs/get-started/modeling/index.md) with the dbt packages.

## Next steps

These pages explain what the agent built and other ways to work with Snowplow:
* Read about [events](/docs/fundamentals/events/index.md), [entities](/docs/fundamentals/entities/index.md), and [schemas](/docs/fundamentals/schemas/index.md) to understand the tracking plan the agent created
* Follow the [Signals quickstart](/docs/signals/quickstart/index.md) to compute real-time attributes from the events you now collect
* Prefer working step by step? Continue with [tracking](/docs/get-started/tracking/index.md) and the rest of this guide
