---
title: "Manage Snowplow Signals conversationally with the MCP server"
position: 1
sidebar_label: "Introduction"
description: "Connect the Snowplow MCP server to your AI coding assistant and manage Snowplow Signals conversationally: define, test, publish, and verify a real-time attribute group."
keywords: ["snowplow mcp", "model context protocol", "ai assistant", "snowplow signals", "attribute groups"]
date: "2026-07-30"
---

The [Snowplow MCP server](/docs/llms-support/snowplow-mcp/) lets AI assistants work with your Snowplow account through natural language. For [Signals](/docs/signals/introduction/), that means you can define, test, publish, and query real-time attributes by describing what you want, while the assistant makes the API calls for you.

In this tutorial you'll use an MCP-capable AI assistant to build the same attribute group as the [Signals quick start](/tutorials/signals-quickstart/start), conversationally instead of through the Console UI. You'll:

* Connect the Snowplow MCP server to your assistant and authenticate
* Define a stream attribute group that calculates three session metrics from page view events
* Test the definition, then publish it to Signals
* Verify the results in Snowplow Console, and watch the live attribute values in the Snowplow Inspector
* Ask for a change, and publish the new version it creates

The assistant handles the mechanics, but you stay in control: Signals saves new attribute groups as drafts, so nothing is calculated until you review the definition and publish it. Every step ends with a check you can make yourself in Console or in the [Snowplow Inspector](/docs/testing/snowplow-inspector/), rather than relying on the assistant's own description of what it did.

This tutorial uses [Claude Code](https://claude.com/product/claude-code) in the examples, because Snowplow ships a plugin for it that bundles the MCP server with Signals-aware skills. Any MCP-capable assistant works, and the prompts are the same.

This tutorial should take around 20 minutes to complete.

If you'd rather not set up an MCP client at all, the [Snowplow Assistant](/docs/llms-support/console-agent/) built into Console offers the same Signals capabilities with no configuration. This tutorial focuses on the MCP server because it works in your own tools, where your code and workflows live.

## Prerequisites

This tutorial assumes that you have:

* A Snowplow account with a running pipeline, and page view tracking on a web application, so Signals has events to calculate from
* [Signals enabled](/docs/signals/setup/) on your account
* An MCP-capable AI assistant, such as Claude Code, Claude Desktop, or Cursor
* Permission to create API keys in [Snowplow Console](https://console.snowplowanalytics.com), for authentication
* The [Snowplow Inspector](/docs/testing/snowplow-inspector/) browser extension, to check the calculated attribute values

:::note[A full pipeline is required]
Signals computes attributes from real events flowing through your pipeline, so this tutorial can't be completed with [Snowplow Micro](/docs/testing/snowplow-micro/) or in a purely local setup. You need a running Snowplow pipeline with Signals enabled.

If you don't have one, you can deploy and use a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial) to follow along.
:::
