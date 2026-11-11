---
title: "Choose how to use Signals attributes"
sidebar_position: 30
sidebar_label: "Use in your application"
description: "Choose how your application, agent, or model reads Signals data: services, agentic contexts, the Signals MCP server, interventions, or training datasets."
keywords: ["retrieve attributes", "subscribe interventions", "agentic contexts", "signals mcp server", "real-time personalization"]
date: "2026-06-11"
content_type: landing
---

Once you've [defined and published attribute groups](/docs/signals/attributes/index.md), several kinds of consumer can read what Signals calculates. Applications can pull values when they need them, or Signals can push an intervention when a user meets your criteria. [Pull and push](/docs/signals/concepts/pull-and-push/index.md) compares the two patterns.

Use this table to find the page for what reads the data:

| What reads it | What it gets | Use | Interfaces |
| --- | --- | --- | --- |
| Application code | Calculated attribute values for a user or session | [Services](/docs/signals/applications/services/index.md), then [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md). Services are recommended for production. | Python SDK, Node.js SDK, Signals API |
| Browser code on your website | Selected attribute values for the current user, without exposing API credentials | [Proxy attributes to the browser](/docs/signals/applications/proxy-attributes/index.md) through a server-side or edge endpoint | Node.js SDK, Signals API |
| An agent that needs recent session activity and a prompt | The session's latest events, up to 100 events or 1 hour, as JSON or a narrative | [Agentic contexts](/docs/signals/applications/agentic-contexts/index.md), scoped to `domain_sessionid` | Python SDK, Node.js SDK, Signals MCP server |
| An agent that chooses what to read at runtime | Published attribute groups and agentic contexts, as tools | [Signals MCP server](/docs/signals/applications/mcp-server/index.md) | Any MCP client |
| An application that reacts when criteria are met | An intervention payload, pushed as soon as the criteria are met | [Define interventions](/docs/signals/interventions/index.md), then [subscribe to them](/docs/signals/applications/subscribe/index.md) | Python SDK, browser plugin, Signals API |
| Offline model training | Point-in-time attribute values for labeled anchors, in a warehouse table | [Build training datasets](/docs/signals/ml-training-datasets/index.md) | Python SDK |

## Agents

An agent can read Signals data in two ways. To ground it in what the user is doing in the current session, retrieve an [agentic context](/docs/signals/applications/agentic-contexts/index.md) and pass it to the model. To let the agent list and read published attribute groups and agentic contexts itself, add the [Signals MCP server](/docs/signals/applications/mcp-server/index.md) to its tools.

For context about a logged-in user across sessions, use an attribute group keyed on `user_id` or `domain_userid`; see [identity resolution](/docs/signals/attributes/identity-resolution/index.md).
