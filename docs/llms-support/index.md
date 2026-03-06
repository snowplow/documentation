---
title: "LLMs and Snowplow"
sidebar_label: "LLMs support"
description: "How Snowplow supports LLM and AI-powered workflows, from real-time behavioral context to tracking plan management and AI-readable documentation."
keywords: ["LLMs", "AI", "MCP", "Signals", "agentic applications", "AI assistant", "agentic"]
date: "2026-03-04"
sidebar_position: 2.5
---

Snowplow supports agentic and LLM-powered workflows in several ways.

## Snowplow CLI MCP server

The [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md) includes a Model Context Protocol (MCP) server that [connects AI assistants to your Snowplow tracking plans](/docs/llms-support/mcp-server/index.md).

## Documentation site map

The documentation site map for LLMs is available at [`llms.txt`](pathname:///llms.txt). It's an index of all documentation pages with titles and descriptions, organized by section. Use this to help an LLM understand the structure of the documentation and navigate to relevant pages.

A full-content version is also available at [`llms-full.txt`](pathname:///llms-full.txt), which includes the complete text of every page. This file is very large. It might be more effective to access individual pages as needed, using the Markdown access method described below.

## Documentation pages as Markdown

Every documentation page is available as plain Markdown. To download a page's content, use the **Download** or **Copy Markdown** buttons under the page title.

To access the Markdown page directly, change the trailing `/` in the URL to `.md`. For example:

- HTML: `https://docs.snowplow.io/docs/signals/concepts/`
- Markdown: `https://docs.snowplow.io/docs/signals/concepts.md`

Let your LLM know that this format is available, so it can retrieve content efficiently.

## Signals

Use [Signals](/docs/signals/concepts/index.md) to provide real-time behavioral context to your AI applications. It computes user attributes from your event stream and warehouse data, and makes them available to your applications via the [Profiles Store](/docs/signals/concepts/index.md#profiles-store) API.
