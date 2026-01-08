---
position: 1
title: "Learn how to set up the Snowplow CLI MCP tool"
sidebar_label: "Introduction"
---

The [Snowplow CLI](/docs/data-product-studio/snowplow-cli) [MCP (Model Context Protocol) tool](/docs/data-product-studio/mcp-server) integrates Snowplow's data structure management capabilities directly into AI assistants. This enables natural language interaction for creating, validating, and managing your Snowplow tracking plans locally.

## What you'll learn

- How to set up the Snowplow CLI [MCP tool](/docs/data-product-studio/mcp-server) with AI assistants like Claude Desktop, Cursor, or Copilot
- Creating and validating data structures through conversation
- AI-powered analysis for strategic tracking plan development

## Demo: using the Snowplow CLI MCP with Claude Desktop

<div style={{position: "relative", width: "100%", height: "0", paddingBottom: "56.25%", overflow: "hidden"}}>
  <iframe
    title="vimeo-player"
    src="https://player.vimeo.com/video/1096253323?h=37276f4852"
    frameborder="0"
    mozallowfullscreen webkitallowfullscreen allowfullscreen
    allow="autoplay; fullscreen; picture-in-picture"
    style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0}}
  ></iframe>
</div>

## Prerequisites

- Snowplow CLI [installed](/docs/data-product-studio/snowplow-cli/#install) and [configured](/docs/data-product-studio/snowplow-cli/#configure).
- Claude Desktop or another MCP-compatible client such as Cursor or Copilot.
- **Filesystem access**: if using Claude Desktop, you must run alongside an MCP filesystem server (e.g., `@modelcontextprotocol/server-filesystem`) to enable file operations. Other MCP clients (Cursor, Copilot, etc.) have filesystem access by default.
