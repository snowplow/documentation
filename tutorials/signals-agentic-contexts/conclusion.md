---
position: 5
title: "Next steps after building a Signals agentic context"
sidebar_label: "Conclusion"
description: "Review what you built with Signals agentic contexts, then combine them with attribute services or add them to a full agent framework."
keywords: ["agentic context", "signals", "ai agent", "attribute services", "next steps"]
date: "2026-07-29"
---

You've built an agentic context end to end. You defined which events to capture and which properties to keep, published it, read the same session back as both JSON and a narrative, and used the prompt to change how a model interpreted the activity without touching what was captured.

Nothing in this tutorial was framework-specific, which is the point. Any agent that can read a string can use what you just built.

## Combine it with attributes

An agentic context gives an agent the raw recent activity. [Attributes](/docs/signals/attributes/) give it computed values over longer windows, such as a lifetime order count or a running cart total, which no amount of reading recent page views will tell it.

Most production agents want both. Group your attributes into a [service](/docs/signals/applications/services/) so your application can [retrieve them in one call](/docs/signals/applications/retrieve-attributes/), then pass the attributes and the agentic context narrative to the model together: the aggregates say who this user is, and the agentic context says what they're doing right now.

You can also let Signals start the conversation rather than waiting for the user, by triggering an [intervention](/docs/signals/interventions/) when behavior crosses a threshold you define.

## Build it into an agent

These tutorials take the same building block into real frameworks, each with a working application at the end:

* [Build an AI agent with real-time user context using Signals and Vercel AI SDK](/tutorials/signals-ai-agent-context/introduction), for a Next.js and Vercel AI SDK agent
* [Build a real-time context-aware agent with Signals, Google ADK, and CopilotKit](/tutorials/signals-google-adk-agent/introduction), for a Google ADK agent embedded in React
* [Build a Signals-powered AI agent with AWS Bedrock AgentCore](/tutorials/signals-agentic-accelerator/intro), for Strands Agents with Bedrock AgentCore Memory

You can also keep working conversationally: the [Snowplow Assistant](/docs/llms-support/console-agent/) in Console and the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/) manage agentic contexts alongside the rest of your Signals configuration.

## Tidy up

If you built this only to try it out, unpublish the agentic context, then delete it, from the `⋮` menu on its details page in Console.

Your assistant can do it for you:

```text
Unpublish and delete my session_context agentic context.
```
