---
title: "Create your first custom events"
sidebar_position: 8
sidebar_label: "Define custom events"
description: "How to define your own events and entities"
keywords: ["custom events", "self-describing events", "custom entities", "event schemas"]
content_type: tutorial
---

While Snowplow provides various [events](/docs/fundamentals/events/index.md) and [entities](/docs/fundamentals/entities/index.md) out of the box, you can define your own to match your business more closely.

The documentation on [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) provides a high-level view of how you might create and track one. For more guidance, check out [this tutorial](/tutorials/data-products-base-tracking/start/).

You can also ask an AI assistant connected to the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) to design your custom events and entities and create their schemas in your account. Run `npx plugins add snowplow/skills` to install the MCP server and the Snowplow [skills](/docs/ai/skills/index.mdx) in your coding agent.
