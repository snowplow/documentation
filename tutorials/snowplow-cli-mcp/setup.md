---
position: 2
title: Installation & Setup
---

# Installation & Setup

## 1. Install Snowplow CLI

```bash
# Using Homebrew
brew install snowplow/taps/snowplow-cli

# Or download binary directly
curl -L -o snowplow-cli https://github.com/snowplow/snowplow-cli/releases/latest/download/snowplow-cli_linux_x86_64
chmod u+x snowplow-cli
```

If you have `node.js` setup then no need to install, you can run via `npx`.

## 2. Configure Claude Desktop

Add the Snowplow CLI MCP server to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

Or for `npx`
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

## 3. Restart Claude Desktop

After adding the configuration, restart Claude Desktop. You should see the Snowplow CLI MCP tool connected in a new conversation.
