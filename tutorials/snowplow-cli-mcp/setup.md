---
position: 3
title: "Configure the MCP client"
sidebar_label: "Configure the MCP client"
description: "Configure MCP clients including Claude Desktop, VS Code, and Cursor for AI-powered data structure management. Step-by-step setup guide for both Homebrew and npx installation methods."
keywords: ["snowplow cli installation", "claude desktop mcp configuration"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The MCP server allows AI assistants to interact with the [Snowplow CLI](/docs/data-product-studio/snowplow-cli) using the `snowplow-cli mcp` command.

It can be used with any MCP-compatible client. Below are configuration examples for popular clients:

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
