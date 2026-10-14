---
title: "Signals quickstart with your AI assistant"
sidebar_label: "Quickstart"
sidebar_position: 3
description: "Sign up for Snowplow Signals, connect your AI assistant to your account with the Snowplow MCP server and skills, and run a starter prompt that builds and publishes your first real-time attribute group."
keywords: ["signals quickstart", "snowplow mcp", "ai assistant", "claude code", "cursor", "real-time attributes"]
date: "2026-10-14"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This quickstart takes you from no account to live, real-time attributes for your own browsing session in about 10 minutes. You'll describe what you want to an AI assistant, and the assistant creates the Signals configuration in your account.

You'll need:
* An MCP-capable AI assistant, such as Claude Code, Cursor, Codex, or Claude Desktop
* Node.js 18 or later, to run the install command

If you'd rather click through Console, follow the [Signals quick start tutorial](/tutorials/signals-quickstart/start) instead. It builds similar attributes without an assistant.

## Create your account

Sign up for the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral). It needs no credit card.

{/* TODO: confirm with the Signals team what the free tier provisions on sign-up (pipeline, Signals enabled, demo site or tracking snippet), and replace this paragraph with the exact steps. */}
The free tier gives you a Snowplow Console account with a pipeline and Signals enabled. Signals calculates attributes from the events your pipeline receives, so make sure page view tracking is running on a website before you continue.

If you already use Snowplow CDI, log in to [Snowplow Console](https://console.snowplowanalytics.com) and check that [Signals is enabled](/docs/signals/setup/index.md) for your organization.

## Connect your AI assistant

The Snowplow plugin installs the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and a set of [skills](/docs/ai/skills/index.mdx), including the `signals` skill. The MCP server gives your assistant tools to read and change your Console configuration. The `signals` skill tells it how to use those tools for Signals work, such as which aggregation fits an attribute, and when to test before publishing.

<Tabs groupId="mcp-client" queryString>
  <TabItem value="any" label="Any assistant" default>

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
  <TabItem value="console" label="No install">

Use the [Snowplow Assistant](/docs/ai/console-agent/index.md) in Console. It has the same tools as the MCP server and uses your Console login, so there's nothing to install. An administrator may need to enable it in the **Settings** section of Console first.

  </TabItem>
</Tabs>

For Claude.ai, Claude Desktop, or another MCP client, add the server manually using the configurations on the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md#configure-the-mcp-server) page. You won't get the skills that way, but the Signals tools work the same.

Start a new session in your assistant and check the connection:

```text
Which Snowplow organization am I connected to?
```

The first call opens a browser window for you to log in to Console. The assistant then replies with your organization's name and ID. It acts with your Console permissions, so it can only see and change what you can.

## Run the starter prompt

Copy this prompt into your assistant. It asks for one attribute group keyed on the session, so you can watch the values change as you browse.

```text
I'm new to Snowplow Signals. Using my connected Snowplow account:

1. Check that Signals is enabled for my organization.
2. Create a stream attribute group called quickstart_session, keyed on
   domain_sessionid, with these attributes calculated from page_view events:
   - page_view_count: how many page views in the last 30 minutes
   - first_referrer: the first non-empty referrer host
   - last_page_title: the title of the most recent page viewed
3. Save it as a draft and show me the definition.
4. Wait for me to approve it, then publish it.
5. Once it's published, show me how to fetch these attributes for a session
   from a Node.js or Python application.
```

The assistant picks the aggregations and the event and entity references, and saves the group as a draft. Signals calculates nothing until a group is published, so review the definition before you approve. The exact wording of the reply varies between assistants and between runs.

After you approve, the assistant publishes the group. Publishing tells the streaming engine to start calculating the attributes from new events.

## See your attributes update

Check that the configuration exists, then generate some data.

1. In [Snowplow Console](https://console.snowplowanalytics.com), go to **Signals** > **Attribute groups**. You should see `quickstart_session` with a published status.
2. Open your tracked website and view a few pages.
3. Ask your assistant: `What are the current quickstart_session attributes for my latest session?`

`page_view_count` should match the number of pages you viewed. To check the values without relying on the assistant, use the [Signals integration](/docs/testing/snowplow-inspector/signals-integration/index.md) in the Snowplow Inspector browser extension, which reads them straight from the Profiles Store.

## Next steps

You now have a published attribute group and a snippet that retrieves it. From here:
* Use the snippet in your application to [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) and personalize the user experience
* Ask your assistant to create an [intervention](/docs/signals/interventions/index.md) that fires when `page_view_count` passes a threshold
* Read [Signals concepts](/docs/signals/concepts/index.md) to learn how attribute keys, attribute groups, services, and interventions fit together
* Follow the [conversational Signals tutorial](/tutorials/signals-mcp/introduction) for a longer walkthrough, including testing definitions against warehouse data
