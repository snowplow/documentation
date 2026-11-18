---
title: "Signals quickstart with your coding agent"
sidebar_label: "Quickstart with your coding agent"
sidebar_position: 3
description: "Sign up for Snowplow Signals, run one Snowplow CLI command to set up your project and coding agent, then let the agent add tracking, Signals configuration, and the code that uses it."
keywords: ["signals quickstart", "snowplow cli", "snowplow mcp", "coding agent", "claude code", "cursor", "codex", "real-time attributes"]
date: "2026-10-14"
content_type: tutorial
pagination_next: signals/get-started/quickstart-tutorial/index
---

Add Signals to your web app with one command. The command sets up your project and your coding agent, and the agent then adds the tracking, the Signals configuration, and the code that uses it.

You'll need Node.js 18 or later, and a coding agent such as Claude Code, Cursor, or Codex. If you don't have a web app, the agent can create one.

## Sign up

Create an account on the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral). It comes with a pipeline and Signals enabled, and needs no credit card.

Already on Snowplow CDI? Check that [Signals is enabled](/docs/signals/setup/index.md).

## Run the setup command

Run this in your project's root directory:

```bash
npx @snowplow/snowplow-cli signals setup
```

The command does the following:

1. Opens a browser window for you to log in to Console
2. Asks which Signals environment to use, if you have more than one
3. Creates an API key with Signals permissions only and writes it to `.env`
4. Installs the Snowplow plugin, with the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and [skills](/docs/ai/skills/index.mdx), in Claude Code, Cursor, or Codex
5. Offers to start your agent with a prompt that sets up Signals, or prints the prompt for you to paste

Keep `.env` out of version control. The command stops if it's already committed. For all options, see the [command reference](/docs/api-reference/snowplow-cli/reference/index.md#signals-setup).

The agent asks what you want Signals to do. Describe the outcome, for example "show a different banner to visitors who've viewed pricing twice this session". It proposes a plan and waits for your approval, then asks again before it publishes anything. The first time it uses a Snowplow tool, a browser window opens for you to log in to Console.

### Set up without the CLI

To set up by hand, install the plugin:

```bash
npx plugins add snowplow/skills
```

Get the four [connection credentials](/docs/signals/connection/index.md#get-your-connection-credentials) and add them to `.env` as `SNOWPLOW_SIGNALS_API_URL`, `SNOWPLOW_SIGNALS_ORG_ID`, `SNOWPLOW_SIGNALS_API_KEY_ID`, and `SNOWPLOW_SIGNALS_API_KEY`. Then start your agent and send:

```txt
Use the signals-setup skill to set up Snowplow Signals in this project.
```

## Check that it works

The agent finishes by showing live values and listing what it changed. To check for yourself, open the **Signals** section in [Console](https://console.snowplowanalytics.com) to see the published configuration, or use the [Snowplow Inspector](/docs/testing/snowplow-inspector/signals-integration/index.md) to see attribute values as you use your app.

To check the credentials in `.env`, run:

```bash
npx @snowplow/snowplow-cli signals status
```

<details>
<summary>Troubleshooting</summary>

* If the browser login doesn't open, run `/mcp` in Claude Code, select the Snowplow server, and choose **Authenticate**. For other clients, see [authentication](/docs/ai/snowplow-mcp/index.md#authentication).
* If `signals status` reports a problem, run the setup command again. It keeps credentials that work and replaces a rejected key.
* If the setup command can't ask which Signals environment to use, for example when an agent runs it, pass `--pipeline` with the pipeline's name or ID.
* If the attribute values are empty, generate a few more events in your app. Signals only calculates from events received after publishing. If they're still empty, check your browser's network tab for tracking requests to the Collector endpoint.
* If an ad blocker stops the tracking requests, turn it off for local testing. In production, serve the Collector from your own domain, or proxy the requests through your backend. See [cookies and ad blockers](/docs/get-started/tracking/cookies-and-ad-blockers/index.md).

</details>

## Next steps

These pages explain what the agent built and other ways to work with Signals:
* Read [How Signals works](/docs/signals/concepts/index.md) to understand the configuration the agent created
* Follow the [conversational Signals tutorial](/tutorials/signals-mcp/introduction) for a longer walkthrough
* Prefer working in Console? Try the [Console quickstart tutorial](/docs/signals/get-started/quickstart-tutorial/index.md)
