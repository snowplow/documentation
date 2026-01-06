---
position: 2
title: "Install the Snowplow CLI and configure an MCP client"
sidebar_label: "Install the Snowplow CLI"
---

To use the MCP tools with your AI assistant, you'll need to install the Snowplow CLI and configure your chosen MCP client. This guide walks you through both steps.

## 1. Install Snowplow CLI

```bash
# Using Homebrew
brew install snowplow/taps/snowplow-cli

# Or download binary directly
curl -L -o snowplow-cli https://github.com/snowplow/snowplow-cli/releases/latest/download/snowplow-cli_linux_x86_64
chmod u+x snowplow-cli
```

If you have `node.js` set up then no need to install, you can run via `npx`.

## 2. Configure your MCP client

The Snowplow CLI MCP server can be used with any MCP-compatible client. Below are configuration examples for popular clients. For a complete list of supported clients and their configurations, see the [MCP reference](/docs/data-product-studio/snowplow-cli/reference/#mcp).

### Claude desktop

**Config location**:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

### VS code

Add to `.vscode/mcp.json` in your workspace:

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

### Cursor

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

### Using with npx

If using via `npx`, use this configuration format instead:

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

For VS Code, adjust the `type` field accordingly:

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

## 3. Start using MCP

After configuring your chosen client, start a new conversation or session. The Snowplow CLI MCP tools should be available for use.
