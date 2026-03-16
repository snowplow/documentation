---
title: "Working with AI"
sidebar_label: "Working with AI"
description: "How Snowplow supports LLM and AI-powered workflows, from real-time behavioral context to tracking plan management and AI-readable documentation."
keywords: ["LLMs", "AI", "MCP", "Signals", "agentic applications", "AI assistant", "agentic"]
date: "2026-03-04"
sidebar_position: 2.5
---

Snowplow supports agentic and LLM-powered workflows in several ways.

## Snowplow CLI MCP server

The [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md) includes a Model Context Protocol (MCP) server that [connects AI assistants to your Snowplow tracking plans](/docs/llms-support/mcp-server/index.md). This can help you design tracking plans faster and more consistently.

## Documentation index in `llms.txt`

This documentation follows the [`llms.txt` standard](https://llmstxt.org/), providing structured information to help an LLM use the site.

An index is available at [`llms.txt`](pathname:///llms.txt).

A full-content version is also available at [`llms-full.txt`](pathname:///llms-full.txt), that includes the complete text of every page. This file is very large. It might be more effective to access individual pages as needed, using the Markdown access method described below.

## Documentation pages as Markdown

Every documentation page is available as Markdown. To download a page's content, use the **Download** or **Copy Markdown** buttons above the page title.

To access the Markdown page directly, change the trailing `/` in the URL to `.md`. For example:

- HTML: `https://docs.snowplow.io/docs/signals/concepts/`
- Markdown: `https://docs.snowplow.io/docs/signals/concepts.md`

Let your LLM know that this format is available, so it can retrieve content efficiently.

## Signals

Use [Signals](/docs/signals/concepts/index.md) to provide real-time behavioral context to your AI applications. It computes user attributes from your event stream and warehouse data, and makes them available to your applications via the [Profiles Store](/docs/signals/concepts/index.md#profiles-store) API.
