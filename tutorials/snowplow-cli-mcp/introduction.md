---
position: 1
title: Getting started with the Snowplow MCP server for tracking design
---

The Snowplow CLI MCP (Model Context Protocol) tool integrates Snowplow's data structure management capabilities directly into AI assistants like Claude. This enables natural language interaction for creating, validating, and managing your Snowplow tracking plans **locally**.

**Important**: the MCP tool creates and validates files on your local filesystem only. To sync changes to Console, you'll use the regular CLI commands like `snowplow-cli ds publish` afterward.

## What you'll learn

- How to set up the Snowplow CLI MCP tool with AI assistants like Claude Desktop, Cursor, or Copilot
- Available MCP tools and their functions
- Creating and validating data structures through conversation
- AI-powered analysis for strategic tracking plan development

## Demo: Using the Snowplow CLI MCP with Claude Desktop

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

- Snowplow CLI installed ([installation guide](/docs/data-product-studio/snowplow-cli/#install))
- Snowplow CLI configured with your Console credentials ([configuration guide](/docs/data-product-studio/snowplow-cli/#configure))
- Claude Desktop or another MCP-compatible client (Cursor or Copilot)
- **Filesystem access**: if using Claude Desktop, you must run alongside an MCP filesystem server (e.g., `@modelcontextprotocol/server-filesystem`) to enable file operations. Other MCP clients (Cursor, Copilot, etc.) have filesystem access by default.

## Available MCP tools

The Snowplow CLI MCP server provides these tools:

### Core tools

- **`get_context`** - Retrieves the built-in schema and rules that define how Snowplow data structures, data products, and source applications should be structured.
- **`get_uuid`** - Generates valid v4 UUIDs required by many Snowplow components.

### Validation tools

- **`validate_data_structures`** - Validates data structure files (events/entities). Must be called after creating or modifying any data structure.
- **`validate_data_products`** - Validates data products and source applications. Must include both data product files AND their referenced source application files.
