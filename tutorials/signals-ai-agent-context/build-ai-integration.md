---
title: "Build the Signals AI integration using the Vercel AI SDK"
position: 5
sidebar_label: "Connect Signals and AI agent"
description: "Connect Snowplow Signals to a Vercel AI SDK agent by fetching user attributes and injecting them into the system prompt."
keywords: ["vercel ai sdk", "system prompt", "signals context", "ai agent", "streaming", "next.js api route"]
date: "2026-04-10"
---

The next step is to connect Signals to your AI agent, via the Vercel AI SDK.

## Fetch Signals context

Create the module that fetches and formats user attributes from Signals:

```tsx
// lib/signals-context.ts
import { Signals } from "@snowplow/signals-node";

let signalsInstance: Signals | null = null;

function getSignalsClient(): Signals | null {
  if (signalsInstance) return signalsInstance;

  const baseUrl = process.env.SNOWPLOW_SIGNALS_BASE_URL;
  const apiKey = process.env.SNOWPLOW_SIGNALS_API_KEY;
  const apiKeyId = process.env.SNOWPLOW_SIGNALS_API_KEY_ID;
  const organizationId = process.env.SNOWPLOW_SIGNALS_ORG_ID;

  if (!baseUrl || !apiKey || !apiKeyId || !organizationId) {
    return null;
  }

  signalsInstance = new Signals({ baseUrl, apiKey, apiKeyId, organizationId });
  return signalsInstance;
}

const SERVICE_NAME = "web-agent-context";

function formatAttributes(attributes: Record<string, unknown>): string {
  const lines = Object.entries(attributes).map(
    ([key, value]) => `- ${key}: ${JSON.stringify(value)}`,
  );
  return [
    "## Real-Time User Context (Snowplow Signals)",
    "The following attributes describe the current user's session behavior on this application:",
    ...lines,
  ].join("\n");
}

export async function getSignalsContext(
  domainSessionId: string,
): Promise<string> {
  const signals = getSignalsClient();
  if (!signals) return "";

  try {
    const attributes = await signals.getServiceAttributes({
      name: SERVICE_NAME,
      attribute_key: "domain_sessionid",
      identifier: domainSessionId,
    });

    if (!attributes || Object.keys(attributes).length === 0) {
      return "";
    }

    return formatAttributes(attributes);
  } catch (error) {
    console.error(
      "[signals-context] Failed to fetch signals attributes:",
      error,
    );
    return "";
  }
}
```

The raw response format from the service, pulled using `signals.getServiceAttributes()`, looks like this:

```json
{
  "page_views_count": 12,
  "unique_pages_viewed": 5,
  "first_event_timestamp": "2026-04-09T14:23:01.000Z",
  "last_event_timestamp": "2026-04-09T14:41:03.000Z"
}
```

The `formatAttributes()` function converts that into a markdown section that can be appended to the agent's system prompt, for example:

```markdown
## Real-Time User Context (Snowplow Signals)
The following attributes describe the current user's session behavior on this application:
- page_views_count: 12
- unique_pages_viewed: 5
- first_event_timestamp: "2026-04-09T14:23:01.000Z"
- last_event_timestamp: "2026-04-09T14:41:03.000Z"
```

If Signals isn't configured or a fetch fails, the `getSignalsContext()` function returns an empty string. The agent still works without the Signals context.

## Build the agent

Create the function that constructs the system prompt with the Signals context appended:

```tsx
// lib/agent.ts
const BASE_INSTRUCTIONS = `You are a helpful assistant for this application.
Help users understand features, answer questions, and guide them through their journey.

When you have real-time user context available (provided below), use it to personalize
your responses. Reference what the user has been looking at to give more relevant answers.`;

export function createAgent(signalsContext?: string) {
  const systemPrompt =
    BASE_INSTRUCTIONS + (signalsContext ? "\n\n" + signalsContext : "");

  return { systemPrompt };
}
```

The model treats the Signals block as factual context about the current user. No special prompting is needed beyond including it: LLMs naturally incorporate provided context when formulating responses.

## Build the chat API route

Create the API route that ties everything together:

```tsx
// app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages, gateway } from "ai";
import { createAgent } from "@/lib/agent";
import { getSignalsContext } from "@/lib/signals-context";

export async function POST(request: Request) {
  const {
    messages,
    pageContext,
  }: {
    messages: UIMessage[];
    pageContext?: { snowplowDomainSessionId?: string };
  } = await request.json();

  // Extract the Snowplow session ID passed from the frontend
  const snowplowDomainSessionId = pageContext?.snowplowDomainSessionId || "";

  // Fetch real-time user attributes from Signals
  let signalsContext = "";
  if (snowplowDomainSessionId) {
    signalsContext = await getSignalsContext(snowplowDomainSessionId);
  }

  // Build the agent system prompt with Signals context injected
  const { systemPrompt } = createAgent(signalsContext);

  // Stream the response
  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

:::note[Model providers]
This example uses [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), which routes requests to any supported model provider with a single API key.

To use a different model, change the model string e.g. `gateway("anthropic/claude-sonnet-4.5")` or `gateway("google/gemini-2.5-pro")`.

See the [full list of supported models](https://vercel.com/ai-gateway/models). The Signals integration works identically regardless of which model you choose.
:::

## Build the chat frontend

Create a floating chat widget using [AI Elements](https://ai-sdk.dev/elements) components. The widget renders as a button in the bottom-right corner that expands into a chat panel.

The widget accesses the current Snowplow session ID using the helper from `lib/snowplow.ts`.

```tsx
// components/chat-widget.tsx
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { getDomainSessionId } from "@/lib/snowplow";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage } = useChat({
    // Pass the Snowplow session ID as body on every request.
    // We use a function so it reads the current session ID at send time.
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({
        pageContext: { snowplowDomainSessionId: getDomainSessionId() },
      }),
    }),
  });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[400px] h-[500px] rounded-xl border shadow-lg bg-white flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold text-sm">Chat</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            >
              &times;
            </button>
          </div>

          {/* Conversation */}
          <Conversation className="flex-1 overflow-hidden">
            <ConversationContent className="p-4">
              {messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>
                      {message.parts
                        .filter((part) => part.type === "text")
                        .map((part) => part.text)
                        .join("")}
                    </MessageResponse>
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
          </Conversation>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              sendMessage({ text: input });
              setInput("");
            }}
            className="flex gap-2 border-t p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 flex items-center justify-center text-xl"
          aria-label="Open chat"
        >
          &#x1f4ac;
        </button>
      )}
    </div>
  );
}
```

## Load the widget

Since the chat widget floats over page content, the best place to render it is in your root layout, alongside `SnowplowTracker`. This way the widget is available on every page:

```tsx
// app/layout.tsx — add the ChatWidget import and render it inside <body>:

// 1. Add this import alongside the SnowplowTracker import
import { ChatWidget } from "@/components/chat-widget";

// 2. Render it inside the <body> tag, alongside SnowplowTracker:
<body className={/* ...keep existing classes... */}>
  <SnowplowTracker />
  {children}
  <ChatWidget />
</body>
```

The `ChatWidget` sits alongside `SnowplowTracker` in the layout. If the tracker hasn't initialized yet when the chat sends its first request, `getDomainSessionId()` returns an empty string and the agent responds without Signals context.
