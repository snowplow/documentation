---
title: "AI hub"
sidebar_position: 2.1
sidebar_label: "AI hub"
description: "Snowplow's AI capabilities, including the Console assistant, MCP servers, Signals, and skills."
keywords: ["AI", "LLMs", "generative AI"]
date: "2026-06-22"
---

import { CardGrid, LinkCard } from '@site/src/components/CardGrid'


Snowplow supports agentic and LLM-powered workflows in several ways.

<CardGrid cols={3}>
  <LinkCard
    title="Snowplow Assistant"
    description="Learn about the embedded AI assistant in Snowplow Console and how it helps manage tracking, monitor pipelines, and troubleshoot."
    href="/docs/llms-support/console-agent/"
  />
  <LinkCard
    title="Snowplow MCP Server"
    description="The remote MCP server connects AI assistants to your Snowplow Console account."
    href="/docs/llms-support/snowplow-mcp/"
  />
  <LinkCard
    title="CLI MCP Server"
    description="The local CLI MCP server connects AI assistants to your tracking plan files on disk."
    href="/docs/llms-support/cli-mcp-server/"
  />
  <LinkCard
    title="Documentation index in llms.txt"
    description="Use the generated llms.txt index to help LLMs explore your Snowplow docs efficiently."
    href="/docs/llms-support/#documentation-index-in-llmstxt"
  />
  <LinkCard
    title="Documentation pages as Markdown"
    description="Learn how individual docs pages can be accessed directly as markdown for LLM-friendly retrieval."
    href="/docs/llms-support/#documentation-pages-as-markdown"
  />
  <LinkCard
    title="Signals"
    description="Signals delivers real-time behavioral context and profile data for AI use cases."
    href="/docs/signals/"
  />
  <LinkCard
    title="Skills marketplace"
    description="Browse practical AI skills and implementation guidance for Snowplow workflows."
    href="/docs/ai/skills/"
  />
  <LinkCard
    title="Applied AI blog"
    description="Read blog posts that show you how to apply Snowplow's AI solutions to your own workflows."
    href="/docs/ai/blog/"
  />
</CardGrid>
