---
title: "Snowplow + AI"
sidebar_position: -1
sidebar_label: "Snowplow + AI"
sidebar_class_name: "ai-hub-sidebar"
sidebar_custom_props:
  plus_icon: true
description: "Snowplow's AI capabilities, including the Console assistant, MCP servers, Signals, and skills."
keywords: ["AI", "LLMs", "generative AI", "AGENTS.md", "coding agent"]
date: "2026-06-22"
content_type: landing
---

import AgentSetup from '@site/src/components/home/AgentSetup'

Snowplow supports agentic and LLM-powered workflows in several ways. New to Snowplow? [Snowplow quickstart with your coding agent](/docs/get-started/quickstart/index.md) goes from a hosted environment to validated events with the assistant doing the setup.

To connect your own coding agent, such as Claude Code, Cursor, or Codex, to your Snowplow account, run `npx plugins add snowplow/skills`. This installs the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and the Snowplow [skills](/docs/ai/skills/index.mdx). Your agent can then answer questions about your account, design and implement tracking, configure your pipeline, and troubleshoot failed events.

:::tip[Snowplow Signals]

Looking for real-time behavioral context and profile data for your AI use cases?
Check out [Signals](/docs/signals/index.md).

:::

<CardGrid cols={3}>
  <Card
    title="Snowplow Assistant"
    description="Manage your tracking plans, pipelines, and data quality through natural language."
    href="/docs/ai/console-agent/"
  />
  <Card
    title="Snowplow MCP server"
    description={<>Connect your own AI assistant to your <em>Snowplow Console</em> account.</>}
    href="/docs/ai/snowplow-mcp/"
  />
  <Card
    title="Command-line MCP server"
    description={<>Connect your own AI assistant to <em>tracking plan files on your machine</em>.</>}
    href="/docs/ai/cli-mcp-server/"
  />
  <Card
    title="Skills library"
    description="Browse Snowplow skills for Claude and other AI assistants."
    href="/docs/ai/skills/"
  />
  <Card
    title="Applied AI field notes"
    description="Updates, announcements, and articles about AI work in Snowplow."
    href="/docs/ai/field-notes/"
  />
  <Card
    title="Documentation for LLMs"
    description="Give LLMs efficient access to the Snowplow documentation."
    href="/docs/ai/llm-docs/"
  />
</CardGrid>

## Connect your coding agent

Coding agents only read the Snowplow documentation index, `llms.txt`, when something tells them to. Install the Snowplow MCP server and skills, then add the snippet to the instructions file your agent reads, so it fetches current versions and terminology before it writes Snowplow code. The docs home shows the same snippet.

<AgentSetup />

See [documentation for LLMs](/docs/ai/llm-docs/index.md) for the indexes and Markdown files the snippet points to.

