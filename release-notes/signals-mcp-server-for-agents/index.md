---
title: "Introducing the Signals MCP server"
description: "Signals deployments now serve agentic contexts over the Model Context Protocol, so an agent in your application can discover them and read the current user's recent activity."
date: "2026-09-01"
category:
  - "Product news"
components:
  - "Signals"
  - "AI tools"
---

Signals deployments now expose their [agentic contexts](/docs/signals/applications/agentic-contexts/) over the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP). An agent in your application can connect to the server, list the contexts your deployment publishes, and read the current user's activity for whichever ones the task warrants, without you writing retrieval code for each one.

## What's new

The server is part of your existing Signals deployment, served at `/mcp` on your Signals API URL. There's nothing to install or host, and it authenticates with the Snowplow API key and key ID you already use.

It exposes two read-only tools: `list_agentic_contexts` for discovery, and `get_agentic_context` to read one user's recent activity for a named context. You publish agentic contexts from Console or the Python SDK and your agent can pick them up automatically.

Because the agent reads the tool descriptions at call time rather than at build time, the description you write when defining an agentic context is what steers the agent toward or away from reading it. Contexts you publish later become available to a connected agent without a change to your application.

This is not to be confused with the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/), which connects an assistant such as Claude Code or Cursor to your Snowplow account for managing resources like data structures, pipelines, and Signals configuration. The Signals MCP server is there to discover and fetch available Signals resources such as agentic contexts, for an agent running in your own product.

## Links

* [Serve Signals data to your agent with the MCP server](/docs/signals/applications/mcp-server/)
* [Retrieve agentic contexts](/docs/signals/applications/agentic-contexts/)
