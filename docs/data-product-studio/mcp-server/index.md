---
title: "MCP server"
sidebar_label: "MCP server"
sidebar_position: 10
description: "Use the Snowplow CLI MCP server to interact with your tracking plans through AI assistants."
keywords: ["mcp", "model context protocol", "ai", "cli", "tracking plan"]
date: "2026-01-08"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) includes a local Model Context Protocol (MCP) server that enables natural language interaction with AI assistants for creating, validating, and managing your Snowplow tracking plans. This allows you to:

- Create and validate data structures through conversation
- Analyze tracking requirements and suggest implementations
- Validate data products and source applications

:::info Read more
For a step-by-step guide to using the Snowplow MCP server, see the [MCP tutorial](/tutorials/snowplow-cli-mcp/introduction).
:::


## Install the MCP server

The MCP server is included with [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md). Start by installing the CLI and authenticating to your Snowplow account.

To connect your AI client to the MCP server, provide a configuration object. The exact structure depends which client you are using, and whether you're connecting to the Snowplow CLI installed locally or via npx. For example:

<Tabs groupId="mcp-client" queryString>
  <TabItem value="claude" label="Claude Desktop" default>

Add the following to your Claude Desktop configuration file, found at:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

For direct Snowplow CLI connection:
```json
{
  "mcpServers": {
    "snowplow-cli": {
      "command": "snowplow-cli",
      "args": ["mcp"]
    }
  }
}
```

Using npx:
```json
{
  "mcpServers": {
    "snowplow-cli": {
      "command": "npx",
      "args": ["-y", "@snowplow/snowplow-cli", "mcp"]
    }
  }
}
```
:::note Filesystem access
Claude Desktop requires additional filesystem access to create and modify files.
:::

  </TabItem>
  <TabItem value="vscode" label="VS Code">

Add to `.vscode/mcp.json` in your workspace.

For direct Snowplow CLI connection:
```json
{
  "servers": {
    "snowplow-cli": {
      "type": "stdio",
      "command": "snowplow-cli",
      "args": ["mcp"]
    }
  }
}
```

Using npx:
```json
{
  "servers": {
    "snowplow-cli": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@snowplow/snowplow-cli", "mcp"]
    }
  }
}
```

  </TabItem>
  <TabItem value="cursor" label="Cursor">

Add to `.cursor/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "snowplow-cli": {
      "command": "snowplow-cli",
      "args": ["mcp", "--base-directory", "."]
    }
  }
}
```

  </TabItem>
</Tabs>

After adding the configuration, restart the client. The Snowplow CLI MCP tools should be available for use.

## Provided tools

The Snowplow CLI MCP server provides these tools to your AI assistant:
- `get_context`: to call at the start of each conversation, this tool retrieves the underlying Snowplow rules that define how Snowplow components should be structured
- `get_uuid`: generates valid v4 UUIDs that are required by many Snowplow components
- `validate_data_structures`: the assistant will use this validation tool after creating or modifying any data structure.
- `validate_data_products`: the assistant will use this validation tool after creating or modifying any data product or source application file

The `get_context` tool is the only one you might need to call manually.

## Using the tools

To get AI support with your Snowplow tracking plans, start a new conversation and ask the assistant to call `get_context`. It might call this tool automatically if it realises it needs the Snowplow knowledge.

You can then ask it for help. It has access to your existing data structures, data products, or source application definitions. The assistant will automatically validate any file changes using the included validation tools.

Use the standard [Snowplow CLI commands](/docs/data-product-studio/snowplow-cli/reference/index.md) to publish your changes to [Console](https://console.snowplowanalytics.com) when ready, using the standard Snowplow CLI commands such as `snowplow-cli ds publish`.

:::note Publish separately
The MCP server creates and validates files on your local filesystem only.
:::
