---
title: "Manage Snowplow Signals conversationally with the Snowplow Assistant or the MCP server"
position: 1
sidebar_label: "Introduction"
description: "Manage Snowplow Signals conversationally, either with the Snowplow Assistant in Console or with your own MCP-connected assistant: define, test, publish, and verify a real-time attribute group."
keywords: ["snowplow assistant", "snowplow mcp", "model context protocol", "ai assistant", "snowplow signals", "attribute groups"]
date: "2026-08-04"
---

You can manage [Signals](/docs/signals/introduction/) by describing what you want in plain language and letting an AI assistant make the API calls for you: define, test, publish, and query real-time attributes conversationally. There are two routes, and this tutorial works with either:

* The [Snowplow Assistant](/docs/llms-support/console-agent/) built into Snowplow Console, where there's nothing to install
* The [Snowplow MCP server](/docs/llms-support/snowplow-mcp/), which connects the AI assistant you already work in to your Snowplow account

The prompts are the same either way. In this tutorial you'll build the same attribute group as the [Signals quick start](/tutorials/signals-quickstart/start), conversationally instead of through the Console UI. You'll:

* Open the Snowplow Assistant in Console, or connect the MCP server to your own assistant
* Define a stream attribute group that calculates three session metrics from page view events
* Test the definition, then publish it to Signals
* Verify the results in Snowplow Console, and watch the live attribute values in the Snowplow Inspector
* Ask for a change, and publish the new version it creates

The assistant handles the mechanics, but you stay in control: Signals saves new attribute groups as drafts, so nothing is calculated until you review the definition and publish it. Every step ends with a check you can make yourself in Console or in the [Snowplow Inspector](/docs/testing/snowplow-inspector/), rather than relying on the assistant's own description of what it did.

The transcripts in this tutorial come from a [Claude Code](https://claude.com/product/claude-code) session, because Snowplow ships a plugin that bundles the MCP server with Signals-aware skills.

This tutorial should take around 20 minutes to complete.

## Prerequisites

This tutorial assumes that you have:

* A Snowplow account with a running pipeline, and page view tracking on a web application, so Signals has events to calculate from
* [Signals enabled](/docs/signals/setup/) on your account
* Either the [Snowplow Assistant](/docs/llms-support/console-agent/) enabled on your organization, or an MCP-capable AI assistant such as Claude Code, Claude Desktop, or Cursor
* The [Snowplow Inspector](/docs/testing/snowplow-inspector/) browser extension, to check the calculated attribute values

:::note[You need a Snowplow account and pipeline]
Signals computes attributes from real events flowing through your pipeline, so you need a Snowplow account with a running pipeline and Signals enabled.

If you don't have one, you can deploy and use a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial) to follow along.
:::
