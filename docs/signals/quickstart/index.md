---
title: "Signals quickstart with your coding agent"
sidebar_label: "Quickstart"
sidebar_position: 3
description: "Sign up for Snowplow Signals, connect your coding agent with the Snowplow MCP server and skills, and run a starter prompt that asks what you want to build, then adds tracking and Signals configuration to your web app."
keywords: ["signals quickstart", "snowplow mcp", "coding agent", "claude code", "cursor", "real-time attributes"]
date: "2026-10-14"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Add Signals to your web app with one prompt. Your coding agent asks what you want to build, then adds the tracking, the Signals configuration, and the code that uses it.

You'll need a coding agent that supports MCP, such as Claude Code, Cursor, or Codex, and Node.js 18 or later. If you don't have a web app, the agent can create one.

## Sign up

Create an account on the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral). It comes with a pipeline and Signals enabled, and needs no credit card.

Already on Snowplow CDI? Log in to [Console](https://console.snowplowanalytics.com) and check that [Signals is enabled](/docs/signals/setup/index.md).

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

The first time the agent uses a Snowplow tool, a browser window opens for you to log in to Console.

## Run the starter prompt

Open your project in the agent and paste this prompt:

```text
Help me add Snowplow Signals to this project, using my connected Snowplow account.

Look at the project first, including any Snowplow tracking that's already in
place. Ask me what I want Signals to do, with a few examples that fit this app.
Then propose a plan, including what I'll see when it works, and wait for my
approval. If there's no web app here, create a minimal one.

Wait for my approval again before you publish anything. Keep API credentials
on the server, in environment variables, and never print them. When you're
done, show me it working with live values from Signals, and list the files
you changed and the Signals resources you created.
```

When the agent asks what you want, describe the outcome. For example, "show a different banner to visitors who've viewed pricing twice this session".

The agent will ask you to add Signals API credentials to your environment. Add them to your `.env` file yourself, rather than pasting them into the chat.

## Check that it works

The agent finishes by showing live values and listing what it changed. To check for yourself, open the **Signals** section in [Console](https://console.snowplowanalytics.com) to see the published configuration, or use the [Snowplow Inspector](/docs/testing/snowplow-inspector/signals-integration/index.md) to see attribute values as you use your app.

<details>
<summary>Troubleshooting</summary>

* If the browser login doesn't open, run `/mcp` in Claude Code, select the Snowplow server, and choose **Authenticate**. For other clients, see [authentication](/docs/ai/snowplow-mcp/index.md#authentication).
* If the attribute values are empty, generate a few more events in your app. Signals only calculates from events received after publishing. If they're still empty, check your browser's network tab for tracking requests to the Collector endpoint.
* If an ad blocker stops the tracking requests, turn it off for local testing. In production, serve the Collector from your own domain, or proxy the requests through your backend. See [cookies and ad blockers](/docs/get-started/tracking/cookies-and-ad-blockers/index.md).

</details>

## Next steps

These pages explain what the agent built and other ways to work with Signals:
* Read the [Signals fundamentals](/docs/signals/concepts/index.md) to understand the configuration the agent created
* Follow the [conversational Signals tutorial](/tutorials/signals-mcp/introduction) for a longer walkthrough
* Prefer working in Console? Try the [Console quickstart tutorial](/tutorials/signals-quickstart/start)
