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

This quickstart takes you from no account to Signals running in your own web app. You give a coding agent one starter prompt. It asks what you want Signals to do, adds Snowplow tracking to your app, creates the Signals configuration in your account, and writes the code that uses it.

You'll need:
* A coding agent that supports MCP, such as Claude Code, Cursor, or Codex
* A web app you can run locally. If you don't have one, the agent can create one.
* Node.js 18 or later

If you'd rather click through Console, follow the [Signals quick start tutorial](/tutorials/signals-quickstart/start) instead. It builds a set of session attributes without an agent.

## Create your account

Sign up for the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral). It needs no credit card.

The free tier gives you a Snowplow Console account with a pipeline and Signals already enabled. You don't need any tracking in place: the starter prompt adds it.

If you already use Snowplow CDI, log in to [Snowplow Console](https://console.snowplowanalytics.com) and check that [Signals is enabled](/docs/signals/setup/index.md) for your organization.

## Connect your coding agent

The Snowplow plugin installs the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and a set of [skills](/docs/ai/skills/index.mdx). The MCP server gives your agent tools to read and change your Console configuration. The skills tell it how to use those tools: `implementation-guidance` covers adding the tracker to your app, and `signals` covers the Signals configuration and the code that uses it. That's why the starter prompt can stay short.

<Tabs groupId="mcp-client" queryString>
  <TabItem value="any" label="Any agent" default>

Run this in a terminal. The CLI detects Claude Code, Cursor, and Codex on your machine and installs the plugin into each one.

```bash
npx plugins add snowplow/skills
```

  </TabItem>
  <TabItem value="claude-code" label="Claude Code">

Run these two commands inside Claude Code:

```text
/plugin marketplace add snowplow/skills
/plugin install snowplow@snowplow
```

  </TabItem>
</Tabs>

For other MCP clients, add the server manually using the configurations on the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md#configure-the-mcp-server) page. You won't get the skills that way, so the agent has less guidance on tracker setup.

Open your web app's project in the agent, start a new session, and check the connection:

```text
Which Snowplow organization am I connected to?
```

The first call opens a browser window for you to log in to Console. The agent then replies with your organization's name and ID. It acts with your Console permissions, so it can only see and change what you can. Don't paste API keys or other credentials into the chat: OAuth handles authentication.

## Run the starter prompt

Copy this prompt into your agent. The agent asks what you want Signals to do in your app, then plans and builds that.

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

When the agent asks what you want to do, describe the outcome in your own words. For example:
* "Show a different homepage banner to visitors who've looked at pricing twice this session."
* "Give our support chatbot a summary of what the user did before they opened the chat."
* "Offer a discount when someone adds three items to their cart and then goes idle."

The agent turns your answer into a plan, including what you'll see when it works. It picks which [attributes](/docs/signals/concepts/index.md#attribute-groups), [interventions](/docs/signals/concepts/index.md#interventions), or [agentic contexts](/docs/signals/concepts/index.md#agentic-contexts) to use, so you don't need to know the Signals concepts first. Check the plan before you approve it.

Signals saves new configuration as drafts and calculates nothing until it's published, so you review every definition before it goes live. After you approve, the agent publishes it, and the streaming engine starts calculating from new events.

Code that calls the Signals API needs API credentials, and runs on your server so the credentials stay out of the browser. The agent tells you which environment variables to set, and where to find each value in Console. See [Connect to Signals](/docs/signals/connection/index.md) for the full list.

## Check that it works

The agent finishes by showing live values from Signals, and listing the files it changed and the Signals resources it created. Review that list before you commit the changes. To check for yourself:

1. In [Snowplow Console](https://console.snowplowanalytics.com), open the **Signals** section. You should see the configuration the agent created, with a published status.
2. Open your app in the browser and do what the agent told you to, such as viewing a few pages.
3. Check that you see what the plan said you would.

To see the attribute values without relying on the agent or your app code, use the [Signals integration](/docs/testing/snowplow-inspector/signals-integration/index.md) in the Snowplow Inspector browser extension, which reads them straight from the Profiles Store.

<details>
<summary>Troubleshooting</summary>

* **The browser login didn't open:** in Claude Code, run `/mcp`, select the Snowplow server, and choose **Authenticate**. For other clients, see [authentication](/docs/ai/snowplow-mcp/index.md#authentication).
* **The attribute values are empty:** Signals only calculates from events received after publishing, so generate a few more events in your app. If they're still empty, open your browser's network tab and check that your tracking requests reach your collector endpoint.
* **Ad blockers stop the tracking requests:** ad blockers often block requests to a collector endpoint. Turn off your ad blocker for local testing. In production, serve the collector from your own domain, or proxy the requests through your backend. See [cookies and ad blockers](/docs/get-started/tracking/cookies-and-ad-blockers/index.md).

</details>

## Next steps

You now have tracking in your app, published Signals configuration, and code that uses it. From here:
* Run the prompt again with a different goal, or ask the agent to extend what it built
* Read the [Signals fundamentals](/docs/signals/concepts/index.md) to learn how attribute keys, attribute groups, services, and interventions fit together
* See [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) and [subscribe to interventions](/docs/signals/applications/subscribe/index.md) for the SDK options your app code can use
* Follow the [conversational Signals tutorial](/tutorials/signals-mcp/introduction) for a longer walkthrough, including testing definitions against warehouse data
