---
title: "Connect the MCP server"
position: 2
sidebar_label: "Connect the MCP server"
description: "Install the Snowplow MCP server in Claude Code or any MCP client, and authenticate with OAuth or Console API credentials."
keywords: ["snowplow mcp install", "claude code plugin", "mcp authentication", "console api key", "mcp-remote"]
date: "2026-07-30"
---

The Snowplow MCP server is a remote server, hosted by Snowplow: there's no server for you to deploy or maintain. Connecting your assistant to it means pointing your MCP client at the server URL and authenticating with your Snowplow Console account.

## Install with the Claude Code plugin marketplace

If you use Claude Code, install the Snowplow plugin from its native marketplace. Run these two commands inside Claude Code:

```text
/plugin marketplace add snowplow/skills
/plugin install snowplow@snowplow
```

This installs the Snowplow MCP server plus six bundled skills, including the `signals` skill that guides the assistant through Signals workflows like the one in this tutorial. The skills are loaded on demand: when you ask about attribute groups, the assistant automatically engages the `signals` skill, so there's no slash command to run.

The plugin source lives in the [`snowplow/skills` repository](https://github.com/snowplow/skills), and Claude Code updates it automatically when the repository changes.

### Other MCP clients

Any MCP-capable client can connect to the server directly. For example, using [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) in a JSON-based client configuration such as Claude Desktop or Cursor:

```json
{
  "mcpServers": {
    "snowplow-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://console.snowplowanalytics.com/api/agent/mcp",
        "3334",
        "--static-oauth-client-info",
        "{\"client_id\":\"NxCcdyu13Cr4umnIYw70evvUyRXRvyWf\"}"
      ]
    }
  }
}
```

See [Snowplow MCP server](/docs/llms-support/snowplow-mcp/) for tested configurations for Claude.ai, Claude Desktop, Claude Code, Codex, and Cursor. You won't get the bundled skills this way, but all the Signals tools work the same.

## Authenticate with your Console account

The configurations above use OAuth: the first time your assistant calls a Snowplow tool, a browser window opens for you to log in to [Snowplow Console](https://console.snowplowanalytics.com). The assistant then operates with the same permissions as your user account, and can only access your organization's resources.

OAuth tokens expire, which means occasional re-authentication prompts. For a connection that keeps working without a browser, authenticate with a Console API key instead. You'll need three values:

1. Your organization ID, from the **Manage organization** page in Console settings
2. An API key ID, which you get when you [create an API key in Console](/docs/account-management/#create-an-api-key)
3. The API key itself, which Console shows only once, at creation

Then pass them as headers in your MCP client configuration:

```json
{
  "mcpServers": {
    "snowplow-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://console.snowplowanalytics.com/api/agent/mcp",
        "--header",
        "X-Org-Id:<ORGANIZATION_ID>",
        "--header",
        "X-Api-Key-Id:<API_KEY_ID>",
        "--header",
        "X-Api-Key:<API_KEY>"
      ]
    }
  }
}
```

:::warning[API keys use admin permissions by default]
By default, API keys are created with all permissions, which may be broader than you intend for an assistant. If you want the assistant to operate with your user account's more limited permissions, use OAuth instead. Store the key securely, and never paste credentials into the assistant's chat.
:::

See [Connect to Snowplow Signals](/docs/signals/connection/) for the full list of connection credentials and where to find each one.

## Check the connection

Start a new session in your assistant and ask it something that requires a Snowplow tool call:

```text
Which Snowplow organization am I connected to?
```

The assistant should call the `get_organization` tool and reply with your organization's name and ID. If you're authenticating with OAuth, this first call triggers the browser login. Confirm the organization ID matches the one in Console before continuing: it's worth being certain the assistant is pointed at the right account before you start creating resources.
