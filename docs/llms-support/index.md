---
title: "Working with AI"
sidebar_label: "Working with AI"
description: "How Snowplow supports LLM and AI-powered workflows, from real-time behavioral context to tracking plan management and AI-readable documentation."
keywords: ["LLMs", "AI", "MCP", "Signals", "agentic applications", "AI assistant", "agentic"]
date: "2026-03-04"
sidebar_position: 2.5
---

Snowplow supports agentic and LLM-powered workflows in several ways.

## Snowplow Assistant

The [Snowplow Assistant](/docs/llms-support/console-agent/index.md) is an AI assistant embedded in Snowplow Console. It lets you manage your tracking implementation, monitor pipelines, troubleshoot issues, and configure Signals through natural language conversation, using your existing Console permissions.

## Snowplow MCP server

The [Snowplow MCP server](/docs/llms-support/snowplow-mcp/index.md) is a remote MCP server that connects AI assistants to your Snowplow Console account. It provides broad access to Console functionality, including pipelines, failed events, event specifications, the data catalog, and more.

## CLI MCP server

The [Snowplow CLI MCP server](/docs/llms-support/cli-mcp-server/index.md) runs locally and connects AI assistants to your tracking plan files on disk. It is included in the [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md) and is focused on tracking plan design and validation.

## Documentation index in `llms.txt`

This documentation follows the [`llms.txt` standard](https://llmstxt.org/), providing structured information to help an LLM use the site.

An index is available at [`llms.txt`](pathname:///llms.txt).

An extended version is also available at [`llms-full.txt`](pathname:///llms-full.txt), that includes the complete text of the current pages. For token efficiency, sections relating to older versions of components aren't included in this file. These sections are still listed in the `llms.txt` index, labeled as `[previous version]`.

The `llms-full.txt` file is very large. It might be more effective to access individual pages as needed, using the Markdown access method described below.

## Documentation pages as Markdown

Every documentation page is available as Markdown. To download a page's content, use the **Download** or **Copy Markdown** buttons above the page title.

Following the `llms.txt` standard, you can access the Markdown page directly by changing the trailing `/` in the URL to `.md`. For example:

- HTML: `https://docs.snowplow.io/docs/signals/concepts/`
- Markdown: `https://docs.snowplow.io/docs/signals/concepts.md`

Let your LLM know that this format is available, so it can retrieve content efficiently.

## Signals

Use [Signals](/docs/signals/concepts/index.md) to provide real-time behavioral context to your AI applications. It computes user attributes from your event stream and warehouse data, and makes them available to your applications via the [Profiles Store](/docs/signals/concepts/index.md#profiles-store) API.
