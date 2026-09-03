---
title: "Serve Signals data to your agent with the MCP server"
sidebar_position: 27
sidebar_label: "Signals MCP server"
description: "Connect an agent in your application to the Signals MCP server, so it can discover and read calculated attributes and agentic contexts as tools."
keywords: ["signals mcp server", "model context protocol", "agent tools", "calculated attributes", "agentic contexts", "vercel ai sdk", "google adk", "openai agents sdk", "langchain", "mcp inspector"]
date: "2026-09-03"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Your agent can fetch Signals data using the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP), the standard way an agent discovers and calls tools. Once you add the server to your agent's tool list, the agent can list what your deployment has published and read whichever parts the task warrants: [calculated attribute](/docs/signals/applications/retrieve-attributes/index.md) values and the raw recent activity in an [agentic context](/docs/signals/applications/agentic-contexts/index.md).

The server is part of your Signals deployment, so there's nothing to install or host. It serves the same data as the [SDKs and API](/docs/signals/connection/index.md), and every tool is read-only.

:::note[Two different MCP servers]
This page covers serving Signals *data* to an agent inside your own application at runtime. To manage Signals *configuration* conversationally from an AI assistant such as Claude Code or Cursor, use the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/index.md) instead.
:::

## When to use the MCP server

The MCP server suits an agent that discovers and selects at runtime what context it needs. It lists the attribute groups and agentic contexts your deployment offers, reads each one's description, and fetches the ones that fit the task, so you don't write retrieval code for each of them. Use the [SDKs](/docs/signals/connection/index.md) instead when your application already knows what it needs, and your code can name the attribute group or agentic context and handle the response.

Two properties are worth planning around:

* **Discovery**: you add the server URL once, and the agent discovers each attribute group and agentic context you publish from then on, without any change to your application
* **Descriptions at call time**: the descriptions you write reach the model as it decides what to call, so what you put on an attribute or a context is what steers the agent toward or away from reading it

## Connect to the server

To authenticate you need your Snowplow API key and key ID, passed as the `X-API-Key-Id` and `X-API-Key` headers. The server rejects connections that don't send both headers. See [connection credentials](/docs/signals/connection/index.md#connection-credentials) for where to find each value.

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

The server exposes four read-only tools in two families. Attributes are the values Signals keeps calculated; agentic contexts are the raw recent events in order. Each family has one discovery tool that returns definitions only, and one that reads a user's data.

| Tool                    | What it returns                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `list_attribute_groups` | Each published attribute group, with its version, the attribute key it's read by, and the attributes it holds. Discovery only, so it returns no user data |
| `get_attributes`        | Calculated attribute values, for one or more attribute groups in a single call                                           |
| `list_agentic_contexts` | The name and description of each published agentic context. Discovery only, so it returns no user data                   |
| `get_agentic_context`   | One user's recent activity for a named agentic context, as a narrative summary (default) or as JSON                      |

A grounded answer takes at least two calls: the agent lists what your deployment publishes, then reads whichever part fits the task. The server lists only published groups and contexts. If the agent asks for a name that isn't published, the response names the valid ones rather than returning an error, so it can correct itself in the same turn. The server returns any prompt you configure on an agentic context alongside the activity, so what you write into a context definition reaches the model with the data.

### Choose attributes or agentic contexts

Prefer an attribute whenever a calculated value answers the question: how often, how many, how much, when last, what usually. Working the same figure out from raw events is error-prone, and an attribute is computed over its own window, which can reach further back than the event buffer holds. Reach for an agentic context when the answer depends on what the user just did, or in what order.

The server passes this guidance to the agent itself, along with an instruction to list both families before reading either, so the agent can answer an events-shaped question with an attribute when a better one exists.

### Identifiers

You have to tell your agent which user or session it's acting for, because it never asks the user. The two families take identifiers differently:

* `get_agentic_context` takes a single `identifier`: the `domain_sessionid` value, the only [attribute key](/docs/signals/attributes/attribute-keys/index.md) agentic contexts support
* `get_attributes` takes `identifiers`, a set of values labelled by attribute key name, such as `{"domain_userid": "abc123"}`, and each group picks out the one it needs. Most keys identify a user, but a custom key can identify a product, a campaign, or a region.

Pass whichever values you hold in your system prompt or as part of the user message. A wrong value doesn't raise an error: it reads a key that was never written, and comes back empty.

Example to add in your system prompt:

```text
The current user's Signals session identifier is: ${domain_sessionid}.
```

### Limits on a read

A single `get_attributes` call covers at most 25 attribute groups and 100 attributes, and names and identifier values are capped at 128 characters. The server reports each group on its own, so some can return values while others return an error, and a group none of your identifiers cover comes back unread rather than read against the wrong value. A null value means Signals never calculated that attribute for that identifier, which is not the same as zero.

Responses otherwise match those described on the [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) and [retrieve agentic contexts](/docs/signals/applications/agentic-contexts/index.md) pages.

## Inspect the server

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) shows the tools and their descriptions as your agent receives them, and lets you call them by hand. Use it to confirm your credentials work and to check what a tool returns, before you wire the server into an agent.

Launch the Inspector:

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI:

1. Set the transport to **Streamable HTTP**
2. Set the URL to your Signals API URL followed by `/mcp`
3. Under **Authentication**, add both headers using the **Header Name** and **Value** inputs: `X-API-Key-Id` and `X-API-Key`
4. Click **Connect**

The server is fully behind authentication, so without both headers it rejects the connection during `initialize`. Once connected, open the **Tools** tab to list the tools, read their descriptions and annotations, and run one with your own arguments.
