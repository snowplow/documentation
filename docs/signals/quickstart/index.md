---
title: "Signals quickstart with your coding agent"
sidebar_label: "Quickstart"
sidebar_position: 3
description: "Sign up for Snowplow Signals, connect your coding agent with the Snowplow MCP server and skills, and run a starter prompt that adds tracking to your web app and publishes your first real-time attribute group."
keywords: ["signals quickstart", "snowplow mcp", "coding agent", "claude code", "cursor", "real-time attributes"]
date: "2026-10-14"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This quickstart takes you from no account to live, real-time attributes for your own browsing session in about 10 minutes. You give a coding agent one starter prompt. It adds Snowplow tracking to your web app, creates the Signals configuration in your account, and writes the code that reads the attributes back.

You'll need:
* A coding agent that supports MCP, such as Claude Code, Cursor, or Codex
* A web app you can run locally, open in the agent. If you don't have one, the agent can create a minimal one.
* Node.js 18 or later

If you'd rather click through Console, follow the [Signals quick start tutorial](/tutorials/signals-quickstart/start) instead. It builds similar attributes without an agent.

## Create your account

Sign up for the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral). It needs no credit card.

The free tier gives you a Snowplow Console account with a pipeline and Signals already enabled. You don't need any tracking in place: the starter prompt adds it.

If you already use Snowplow CDI, log in to [Snowplow Console](https://console.snowplowanalytics.com) and check that [Signals is enabled](/docs/signals/setup/index.md) for your organization.

## Connect your coding agent

The Snowplow plugin installs the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and a set of [skills](/docs/ai/skills/index.mdx), including the `signals` skill. The MCP server gives your agent tools to read and change your Console configuration. The skills tell it how to use those tools: `implementation-guidance` covers adding the tracker to your app, and `signals` covers attribute definitions and publishing.

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

Copy this prompt into your agent. It asks for page view tracking and one attribute group keyed on the session, so you can watch the values change as you browse.

```text
I'm new to Snowplow Signals. Using my connected Snowplow account and this project:

1. Check that Signals is enabled for my organization, and find my pipeline's
   collector endpoint.
2. Add the Snowplow browser tracker to this web app, sending to that collector,
   with page view tracking enabled. If there's no web app here, create a
   minimal one with a few pages.
3. Create a stream attribute group called quickstart_session, keyed on
   domain_sessionid, with these attributes calculated from page_view events:
   - page_view_count: how many page views in the last 30 minutes
   - first_referrer: the first non-empty referrer host
   - last_page_title: the title of the most recent page viewed
4. Save it as a draft, show me the definition, and wait for my approval
   before you publish it.
5. Add a server-side endpoint that fetches quickstart_session for the current
   session with the Signals Node.js or Python SDK. Read credentials from
   environment variables and never print them.
6. Start the app, and tell me which pages to visit.
7. Prove it works: after I've viewed a few pages, read the current values for
   my session from Signals and show them to me.
```

The agent shows you its plan and the code it adds to your app. For the attribute group, it picks the aggregations and the event and entity references, and saves the group as a draft. Signals calculates nothing until a group is published, so review the definition before you approve. The exact wording of the replies varies between agents and between runs.

After you approve, the agent publishes the group. Publishing tells the streaming engine to start calculating the attributes from new events. Fetching attributes needs Signals API credentials: the agent tells you which environment variables to set, and where to find each value in Console. See [Connect to Signals](/docs/signals/connection/index.md) for the full list.

## See your attributes update

Check that the configuration exists, then generate some data.

1. In [Snowplow Console](https://console.snowplowanalytics.com), go to **Signals** > **Attribute groups**. You should see `quickstart_session` with a published status.
2. Open your app in the browser and view a few pages.
3. Call the endpoint the agent added, or let the agent read the values for you as in step 7 of the prompt.

`page_view_count` should match the number of pages you viewed. To check the values without relying on the agent, use the [Signals integration](/docs/testing/snowplow-inspector/signals-integration/index.md) in the Snowplow Inspector browser extension, which reads them straight from the Profiles Store.

<details>
<summary>Troubleshooting</summary>

* **The browser login didn't open:** in Claude Code, run `/mcp`, select the Snowplow server, and choose **Authenticate**. For other clients, see [authentication](/docs/ai/snowplow-mcp/index.md#authentication).
* **The agent is connected to the wrong organization:** add an `X-Org-Id` header to the server configuration, as described in [OAuth](/docs/ai/snowplow-mcp/index.md#oauth).
* **The attribute values are empty:** Signals only calculates from events received after publishing, so view a few more pages. If they're still empty, open your browser's network tab and check that page view requests reach your collector endpoint. Ad blockers can stop them.

</details>

## Next steps

You now have tracking in your app, a published attribute group, and an endpoint that retrieves it. From here:
* Use the attributes to change what your app shows; see [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) for the SDK options
* Ask your agent to create an [intervention](/docs/signals/interventions/index.md) that fires when `page_view_count` passes a threshold
* Read the [Signals fundamentals](/docs/signals/concepts/index.md) to learn how attribute keys, attribute groups, services, and interventions fit together
* Follow the [conversational Signals tutorial](/tutorials/signals-mcp/introduction) for a longer walkthrough, including testing definitions against warehouse data
