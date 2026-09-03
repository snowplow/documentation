---
title: "Serve Signals data to your agent with the MCP server"
sidebar_position: 27
sidebar_label: "Signals MCP server"
description: "Connect an agent in your application to the Signals MCP server, so it can discover and read agentic contexts as tools."
keywords: ["signals mcp server", "model context protocol", "agent tools", "agentic contexts", "vercel ai sdk", "google adk", "openai agents sdk", "langchain", "mcp inspector"]
date: "2026-09-03"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Signals data can be fetched using the [Model Context Protocol](https://modelcontextprotocol.io/), the standard way an agent discovers and calls tools. Add the server to your agent's tool list, then the agent can list the [agentic contexts](/docs/signals/applications/agentic-contexts/index.md) your deployment has published and read the current user's activity for whichever ones the task warrants.

The server is part of your Signals deployment, so there's nothing to install or host. It serves the same agentic context data as the [SDKs and API](/docs/signals/connection/index.md), and every tool is read-only.

:::note[Two different MCP servers]
This page covers serving Signals *data* to an agent inside your own application at runtime. To manage Signals *configuration* conversationally from an AI assistant such as Claude Code or Cursor, use the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/index.md) instead.
:::

## When to use the MCP server

The MCP server is built for an agent to discover and select at runtime what context it needs. It lists the agentic contexts your deployment offers, reads each one's description, and fetches the ones that fit the task, so you don't write retrieval code for each agentic context. Use the [SDKs](/docs/signals/connection/index.md) instead when your application already knows what it needs, and your code can name the agentic context and handle the response.

Two properties are worth planning around:

* **Discovery**: you add the server URL once, and the agent discovers each agentic context you publish from then on, without any change to your application
* **Descriptions at call time**: each agentic context's description reaches the model as it decides what to call, so what you write when you define a context is what steers the agent toward or away from reading it

## Connect to the server

To authenticate you need your Snowplow API key and key ID, passed as the `X-API-Key-Id` and `X-API-Key` headers. Connections without both headers are rejected. See [connection credentials](/docs/signals/connection/index.md#connection-credentials) for where to find each value.

:::warning[Connect from server-side code]
The API key grants access to your organization's Signals data. Connect to the server from server-side code and keep the credentials in your environment secrets. Never ship them to a browser or a mobile app.
:::

<Tabs groupId="signals-mcp-client" queryString>
<TabItem value="ai-sdk" label="Vercel AI SDK" default>

MCP support lives in the `@ai-sdk/mcp` package, which is separate from `ai` and doesn't pull it in, so install both alongside your model provider:

```bash
npm install ai @ai-sdk/mcp @ai-sdk/openai
```

Create a client for the server, then pass its tools to your model call:

```typescript
import { createMCPClient } from '@ai-sdk/mcp';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const mcp = await createMCPClient({
  transport: {
    type: 'http',
    url: `${process.env.SIGNALS_DEPLOYED_URL}/mcp`,
    headers: {
      'X-API-Key-Id': process.env.CONSOLE_API_KEY_ID!,
      'X-API-Key': process.env.CONSOLE_API_KEY!,
    },
  },
});

// Read this from your app's session and pass it in
const domain_sessionid = '8c9104e3-c300-4b20-82f2-93b7fa0b8feb';

const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: `The current Signals session identifier is: ${domain_sessionid}.`,
  tools: await mcp.tools(),
});
```

</TabItem>
<TabItem value="google-adk" label="Google ADK">

ADK reaches MCP servers through `@modelcontextprotocol/sdk`, which it declares as an optional peer dependency, so install both:

```bash
npm install @google/adk @modelcontextprotocol/sdk
```

`MCPToolset` discovers the server's tools, and you pass the toolset itself to the agent:

```typescript
import { LlmAgent, MCPToolset } from '@google/adk';

const signals = new MCPToolset({
  type: 'StreamableHTTPConnectionParams',
  url: `${process.env.SIGNALS_DEPLOYED_URL}/mcp`,
  transportOptions: {
    requestInit: {
      headers: {
        'X-API-Key-Id': process.env.CONSOLE_API_KEY_ID!,
        'X-API-Key': process.env.CONSOLE_API_KEY!,
      },
    },
  },
});

export const rootAgent = new LlmAgent({
  name: 'signals_agent',
  model: 'gemini-flash-latest',
  tools: [signals],
});
```

Pass the credentials under `transportOptions.requestInit.headers`. The connection also takes a top-level `header` field, but it's deprecated and ignored whenever `transportOptions` is set.

</TabItem>
<TabItem value="openai-agents" label="OpenAI Agents SDK">

Install the SDK:

```bash
pip install openai-agents
```

Pass the server to an agent as one of its `mcp_servers`, and the agent picks up every tool the server publishes:

```python
from agents import Agent
from agents.mcp import MCPServerStreamableHttp

signals = MCPServerStreamableHttp(
    name="Snowplow Signals",
    params={
        "url": f"{SIGNALS_DEPLOYED_URL}/mcp",
        "headers": {
            "X-API-Key-Id": CONSOLE_API_KEY_ID,
            "X-API-Key": CONSOLE_API_KEY,
        },
    },
)

agent = Agent(name="Assistant", mcp_servers=[signals])
```

</TabItem>
<TabItem value="langchain" label="LangChain">

Install the MCP adapters alongside LangChain:

```bash
pip install langchain langchain-mcp-adapters
```

`MultiServerMCPClient` converts the server's tools into LangChain tools, which you then pass to an agent:

```python
import asyncio

from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient(
    {
        "snowplow_signals": {
            "transport": "streamable_http",
            "url": f"{SIGNALS_DEPLOYED_URL}/mcp",
            "headers": {
                "X-API-Key-Id": CONSOLE_API_KEY_ID,
                "X-API-Key": CONSOLE_API_KEY,
            },
        }
    }
)

tools = asyncio.run(client.get_tools())
```

</TabItem>
<TabItem value="json" label="MCP client config">

Most MCP clients take a remote server as a URL with headers. Add the server to your client's configuration file:

```json
{
  "mcpServers": {
    "snowplow-signals": {
      "type": "http",
      "url": "https://{{123abc}}.signals.snowplowanalytics.com/mcp",
      "headers": {
        "X-API-Key-Id": "<CONSOLE_API_KEY_ID>",
        "X-API-Key": "<CONSOLE_API_KEY>"
      }
    }
  }
}
```

Check your client's documentation for the exact key names: some use `transport` rather than `type`, and clients that only support local servers need a bridge such as [`mcp-remote`](https://www.npmjs.com/package/mcp-remote).

</TabItem>
</Tabs>

## Available tools

The server exposes two read-only tools: one to discover which agentic contexts your deployment has, and one to read a single user's activity for a named context.

| Tool                    | What it returns                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `list_agentic_contexts` | The name and description of each published agentic context. Discovery only, so it returns no user data  |
| `get_agentic_context`   | One user's recent activity for a named agentic context, as a narrative summary (default) or as JSON     |

A grounded answer usually takes two calls: the agent lists the available contexts, then reads whichever one fits the task. Only published contexts are listed, and a name that isn't one comes back as the list of valid names rather than an error, so the agent can correct itself in the same turn. Each read covers a single context and returns live activity together with any prompt configured on that context, so what you write into a context definition reaches the model alongside the data.

Fetching data also requires an `identifier`, so your agent has to be told which session it's acting for. Pass the `domain_sessionid` value, the only [attribute key](/docs/signals/attributes/attribute-keys/index.md) agentic contexts support, in your system prompt or as part of the user message. It's the same value you'd pass to the SDKs, and the responses match those described on the [retrieve agentic contexts](/docs/signals/applications/agentic-contexts/index.md) page.

Example to add in your system prompt:

```text
The current user's Signals session identifier is: ${domain_sessionid}.
```

## Inspect the server

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) shows the tools and their descriptions as your agent receives them, and lets you call them by hand. Use it to confirm your credentials work and to check what a tool returns, before you wire the server into an agent.

Launch the Inspector:

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI:

1. Set the transport to **Streamable HTTP**.
2. Set the URL to your Signals API URL followed by `/mcp`.
3. Under **Authentication**, add both headers using the **Header Name** and **Value** inputs: `X-API-Key-Id` and `X-API-Key`.
4. Click **Connect**.

The server is fully behind authentication, so without both headers the connection is rejected during `initialize`. Once connected, open the **Tools** tab to list the tools, read their descriptions and annotations, and run one with your own arguments.
