---
title: "New ways to use AI with Snowplow"
description: "Today we're announcing two new ways to work with Snowplow using natural language: Snowplow Assistant, an AI assistant built into Snowplow Console, and the Snowplow MCP server, a remote Model Context…"
date: "2026-05-28"
update_type:
  - "Product news"
components:
  - "Console"
  - "Event Studio"
  - "AI"
---
Today we're announcing two new ways to work with Snowplow using natural language: **Snowplow Assistant**, an AI assistant built into Snowplow Console, and the **Snowplow MCP server**, a remote Model Context Protocol server that connects your own AI assistant or agent to Snowplow.

The Snowplow MCP server is available from today. Snowplow Assistant rolls out to Console next week.

## What we're announcing

### **Snowplow Assistant**

The Snowplow Assistant is an agent inside the [Snowplow Console](https://console.snowplowanalytics.com). You describe what you want to do, and it calls the relevant Snowplow APIs on your behalf to design tracking, inspect pipelines, investigate failed events, manage data quality alerts, and configure Signals.

Snowplow Assistant is an **opt-in feature for Event Studio customers**. An organization admin is required to enable it from **Settings** in Console, and existing customers will need to accept new terms covering LLM usage on first activation.

### **The Snowplow MCP server**

The Snowplow MCP Server exposes the same tools as the Snowplow Assistant to any MCP-compatible client, including Claude.ai, Claude Desktop, Claude Code, Cursor, Codex. Authentication is via your Console account, so the assistant operates with your existing permissions.

## Why this is exciting

We've put a lot of effort into making Snowplow simpler to use and decreasing the time it takes to go from your newly provisioned Snowplow pipeline to high-quality behavioral data driving insights, powering real-time operational, or unlocking agentic use-cases.

The Assistant and the MCP server put Snowplow expertise directly into the tools your teams already use:

* **Tracking design.** A product manager can design a tracking plan in minutes within the Snowplow Console or Claude by sharing a screenshot, connecting to the Figma MCP server, or even linking to your website publicly.
* **Implementation.** A developer can implement Snowplow events from a tracking plan in Cursor without requiring an in-depth understanding of Snowplow SDKs or testing methodology.
* **Operations.** An engineer investigating a failed event spike can get a breakdown by app ID and tracker version, and update data quality alerts in the same conversation.
* **Bringing your own agent.** A customer's own internal AI agent can read tracking plans and pipeline state and suggest instrumentation code, through the MCP server.

## Coming soon

This is the first step in our effort to make AI a first-class way of working with Snowplow. Over the coming week and months, our Product and Professional Services teams will be publishing skills you can drop into Claude, Cursor, and other AI tools. These skills are designed to work alongside the Assistant and the MCP server, so the AI you're already using gets smarter about Snowplow.

## Get started

The Snowplow MCP server is available from today. Configuration instructions for each supported client are in the [Snowplow MCP server documentation](/docs/llms-support/snowplow-mcp/).

The Snowplow Assistant rolls out to Console next week. An organization admin can enable it from **Settings** in Console once it's available. Full documentation is on the [Snowplow Assistant page](/docs/llms-support/console-agent/).

Both features are available on Snowplow Cloud and Private Managed Cloud. Talk to your Customer Success Manager or Snowplow Support if you'd like help getting set up.
