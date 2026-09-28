---
title: "Snowplow + AI"
sidebar_position: -1
sidebar_label: "Snowplow + AI"
sidebar_class_name: "ai-hub-sidebar"
sidebar_custom_props:
  plus_icon: true
description: "Snowplow's AI capabilities, including the Console assistant, MCP servers, Signals, and skills."
keywords: ["AI", "LLMs", "generative AI"]
date: "2026-06-22"
---

import { CardGrid, CallToActionCard } from '@site/src/components/CardGrid'

Snowplow supports agentic and LLM-powered workflows in several ways.

:::tip[Snowplow Signals]

Looking for real-time behavioral context and profile data for your AI use cases?
Check out [Signals](/docs/signals/index.md).

:::

<CardGrid cols={3}>
  <CallToActionCard
    title="Snowplow Assistant"
    description="Manage your tracking plans, pipelines, and data quality through natural language."
    href="/docs/ai/console-agent/"
  />
  <CallToActionCard
    title="Snowplow MCP server"
    description={<>Connect your own AI assistant to your <em>Snowplow Console</em> account.</>}
    href="/docs/ai/snowplow-mcp/"
  />
  <CallToActionCard
    title="Command-line MCP server"
    description={<>Connect your own AI assistant to <em>tracking plan files on your machine</em>.</>}
    href="/docs/ai/cli-mcp-server/"
  />
  <CallToActionCard
    title="Skills library"
    description="Browse Snowplow skills for Claude and other AI assistants."
    href="/docs/ai/skills/"
  />
  <CallToActionCard
    title="Applied AI field notes"
    description="Updates, announcements, and articles about AI work in Snowplow."
    href="/docs/ai/field-notes/"
  />
  <CallToActionCard
    title="Documentation for LLMs"
    description="Give LLMs efficient access to the Snowplow documentation."
    href="/docs/ai/llm-docs/"
  />
</CardGrid>
