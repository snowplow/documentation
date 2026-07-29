---
title: "Build the Signals AI integration using the Vercel AI SDK"
position: 5
sidebar_label: "Connect Signals and AI agent"
description: "Connect Snowplow Signals to a Vercel AI SDK agent by fetching profile attributes and the agentic context narrative, and injecting both into the system prompt."
keywords: ["vercel ai sdk", "system prompt", "signals context", "agentic context", "ai agent", "streaming", "next.js api route"]
date: "2026-07-29"
---

The next step is to connect Signals to your AI agent, via the Vercel AI SDK.

## Fetch Signals context

Your agent will fetch two kinds of context from Signals on every chat request, using the same session ID for both:

* Profile attributes, from the service: computed aggregates that you format into a prompt section yourself
* Recent session activity, from the [agentic context](/docs/signals/applications/agentic-contexts/): fetched with `format: "narrative"`, which returns a ready-made text block, so there's no formatting code to write

Create the module that fetches both:

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
const AGENTIC_CONTEXT_NAME = "web_agent_activity";

// Profile attributes: computed aggregates, served by the Signals service
async function getProfileSection(
  signals: Signals,
  domainSessionId: string,
): Promise<string> {
  const attributes = await signals.getServiceAttributes({
    name: SERVICE_NAME,
    attribute_key: "domain_sessionid",
    identifier: domainSessionId,
  });

  if (!attributes || Object.keys(attributes).length === 0) {
    return "";
  }

  const lines = Object.entries(attributes).map(
    ([key, value]) => `- ${key}: ${JSON.stringify(value)}`,
  );
  return [
    "## User profile (Snowplow Signals attributes)",
    "Computed attributes describing the current user's session so far:",
    ...lines,
  ].join("\n");
}

// Session activity: LLM-ready narrative, served by the agentic context
async function getActivitySection(
  signals: Signals,
  domainSessionId: string,
): Promise<string> {
  const narrative = await signals.getAgenticContext({
    name: AGENTIC_CONTEXT_NAME,
    identifier: domainSessionId,
    format: "narrative",
  });

  if (!narrative) return "";

  return [
    "## Recent session activity (Snowplow Signals agentic context)",
    narrative,
  ].join("\n");
}

export async function getSignalsContext(
  domainSessionId: string,
): Promise<string> {
  const signals = getSignalsClient();
  if (!signals) return "";

  // Fetch both in parallel; if one fails, the other is still used
  const [profile, activity] = await Promise.allSettled([
    getProfileSection(signals, domainSessionId),
    getActivitySection(signals, domainSessionId),
  ]);

  const sections: string[] = [];
  for (const result of [profile, activity]) {
    if (result.status === "fulfilled" && result.value) {
      sections.push(result.value);
    } else if (result.status === "rejected") {
      console.error("[signals-context] Signals fetch failed:", result.reason);
    }
  }

  return sections.join("\n\n");
}
```

The profile fetch returns raw attribute values from the service, which `getProfileSection()` formats into a markdown list:

```json
{
  "page_views_count": 12,
  "unique_pages_viewed": 5,
  "first_event_timestamp": "2026-04-09T14:23:01.000Z",
  "last_event_timestamp": "2026-04-09T14:41:03.000Z"
}
```

The activity fetch needs no formatting at all. With `format: "narrative"`, `getAgenticContext()` returns the prompt you configured, followed by a block delimited by `[START CONTEXT]` and `[END CONTEXT]`. Here's a real capture from a five-page browsing session:

```text
You are a helpful assistant for the Signal Shop web store. Use this recent activity to understand what the user is exploring right now, and tailor your answers to it.
[START CONTEXT]
10 seconds on the current page. Session started 132 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
## Real-time user behaviour
Events are ordered from oldest to most recent.
seconds_since_start_of_session, event, url, event_context
0, page_view, /, {page_title: 'Signal Shop'}
25, page_view, /products, {page_title: 'All products | Signal Shop'}
56, page_view, /products/3, {page_title: 'Aurora Wireless Headphones | Signal Shop'}
91, page_view, /products/7, {page_title: 'Linen Overshirt | Signal Shop'}
122, page_view, /products/3, {page_title: 'Aurora Wireless Headphones | Signal Shop'}
[END CONTEXT]
```

The opening summary and the event table are generated by Signals from the events you selected when defining the agentic context. Notice the difference between the two sections: the attributes summarize the session in aggregate, while the narrative shows the user's actual path through the site, oldest event first. An aggregate count can tell the agent the user is engaged; only the narrative can tell it they came back to `/products/3` after looking at something else.

If Signals isn't configured or both fetches fail, the `getSignalsContext()` function returns an empty string. The agent still works without the Signals context.

## Build the agent

Create the function that constructs the system prompt with the Signals context appended:

```tsx
// lib/agent.ts
const BASE_INSTRUCTIONS = `You are a helpful assistant for this application.
Help users understand features, answer questions, and guide them through their journey.

When real-time user context is available below, use it to personalize your responses.
The user profile section describes the session in aggregate. The recent session
activity section lists what the user has just been doing, oldest event first.
Reference what the user has been looking at to give more relevant answers.`;

export function createAgent(signalsContext?: string) {
  const systemPrompt =
    BASE_INSTRUCTIONS + (signalsContext ? "\n\n" + signalsContext : "");

  return { systemPrompt };
}
```

The model treats both Signals sections as factual context about the current user. No special prompting is needed beyond including them: LLMs naturally incorporate provided context when formulating responses. The agentic context's own `prompt` instructions arrive at the top of the narrative string, ahead of `[START CONTEXT]`, so you can steer the agent from your Signals configuration as well as from `BASE_INSTRUCTIONS`.

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

  // Fetch real-time user context from Signals:
  // profile attributes + the session activity narrative
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

The `ChatWidget` sits alongside `SnowplowTracker` in the layout.
