---
title: "Introducing the Signals MCP server"
description: "Signals deployments now serve calculated attributes and agentic contexts over the Model Context Protocol, so an agent in your application can discover what is published and read the current user's data."
date: "2026-10-02"
category:
  - "Product news"
components:
  - "Signals"
  - "AI tools"
---

Signals deployments now expose their read APIs over the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP). An agent in your application can connect to the server, list what your deployment publishes, and read the current user's data for whichever parts the task warrants, without you writing retrieval code for each one.

## What's new

The server is part of your existing Signals deployment, served at `/mcp` on your Signals API URL. There's nothing to install or host, and it authenticates with the Snowplow API key and key ID you already use.

It exposes four read-only tools, in two families. `list_attribute_groups` and `get_attributes` cover the values Signals keeps calculated, reading up to 25 attribute groups in a single call. `list_agentic_contexts` and `get_agentic_context` cover the raw recent events in order. The server tells the agent to list both families before reading either, and to prefer a calculated value when one answers the question. You publish attribute groups and agentic contexts from Console or the Python SDK, and your agent picks them up.

Because the agent reads the tool descriptions at call time rather than at build time, the descriptions you write when defining attributes and agentic contexts are what steer the agent toward or away from reading them. Anything you publish later becomes available to a connected agent without a change to your application.

This is not to be confused with the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/), which connects an assistant such as Claude Code or Cursor to your Snowplow account for managing resources like data structures, pipelines, and Signals configuration. The Signals MCP server is there to discover and fetch available Signals resources, such as calculated attributes and agentic contexts, for an agent running in your own product.

## Links

* [Serve Signals data to your agent with the MCP server](/docs/signals/applications/mcp-server/)
* [Retrieve attributes](/docs/signals/applications/retrieve-attributes/)
* [Retrieve agentic contexts](/docs/signals/applications/agentic-contexts/)
