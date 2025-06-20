---
position: 1
title: Introduction
---

# Getting Started with Snowplow CLI MCP Tool

The Snowplow CLI MCP (Model Context Protocol) tool integrates Snowplow's data structure management capabilities directly into AI assistants like Claude. This enables natural language interaction for creating, validating, and managing your Snowplow tracking plans **locally**.

**Important**: The MCP tool creates and validates files on your local filesystem only. To sync changes to BDP Console, you'll use the regular CLI commands like `snowplow-cli ds publish` afterward.

## What You'll Learn

- How to set up the Snowplow CLI MCP tool with Claude Desktop
- Available MCP tools and their functions  
- Creating and validating data structures through conversation
- AI-powered analysis for strategic tracking plan development

## Prerequisites

- Snowplow CLI installed ([installation guide](/docs/data-product-studio/snowplow-cli/#install))
- Snowplow CLI configured with your BDP Console credentials ([configuration guide](/docs/data-product-studio/snowplow-cli/#configure))
- Claude Desktop or another MCP-compatible client
- **Filesystem access**: Claude needs to write files locally. Enable filesystem access in Claude Desktop settings, or run alongside an MCP filesystem server (e.g., `@modelcontextprotocol/server-filesystem`)

## Available MCP Tools

The Snowplow CLI MCP server provides these tools:

### Core Tools

**`get_context`** - Retrieves the built-in validation schemas and structural templates for Snowplow components. Always call this first before any Snowplow work.

**`get_uuid`** - Generates valid v4 UUIDs required by many Snowplow components.

### Validation Tools

**`validate_data_structures`** - Validates data structure files (events/entities). Must be called after creating or modifying any data structure.

**`validate_data_products`** - Validates data products and source applications. Must include both data product files AND their referenced source application files.