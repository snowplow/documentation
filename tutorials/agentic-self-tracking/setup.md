---
title: "Set up the agentic Next.js application"
sidebar_label: "Set up the app"
position: 2
description: "Explore the travel booking chatbot before any Snowplow tracking is added. Understand the app architecture, tools, and what's missing without observability."
keywords: ["snowplow", "agentic", "tracking", "ai", "starter", "chatbot"]
date: "2026-03-26"
---

Start by cloning the repository and installing dependencies:

```bash
git clone https://github.com/snowplow-industry-solutions/agentic-app-tracking-tutorial.git
cd agentic-app-tracking-tutorial
git checkout v0.0-starter
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add at least one LLM API key. The flight search, booking, and calendar tools all use mock data, so you do not need any external travel API keys. You do need a valid LLM key because the chatbot calls a real language model. The file looks like this:

```bash title=".env.example"
# --- LLM Provider API Keys (configure at least one) ---
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# --- Snowplow Client-Side Tracking (active from v0.1-client-tracking) ---
NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL=http://localhost:9090
NEXT_PUBLIC_SNOWPLOW_APP_ID=travel-agent-demo

# --- Snowplow Server-Side Tracking (active from v0.2-server-tracking) ---
SNOWPLOW_COLLECTOR_URL=http://localhost:9090
SNOWPLOW_APP_ID=travel-agent-demo
```

:::warning[Check your API key]
Replace the placeholder values (`sk-ant-...`, `sk-...`) with your real key. If the value is still a placeholder, the app starts but the chatbot silently fails to respond. The UI lets you select any model regardless of which keys are configured - if you pick a provider without a valid key, the request fails without a visible error.
:::

The environment variables break down by stage:


| Variable                                                                | Used from | Purpose                                                             |
| ----------------------------------------------------------------------- | --------- | ------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` | v0.0      | LLM provider authentication                                         |
| `NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL`                                    | v0.1      | Snowplow collector endpoint (client-side, exposed to browser)       |
| `NEXT_PUBLIC_SNOWPLOW_APP_ID`                                           | v0.1      | Application identifier (client-side)                                |
| `SNOWPLOW_COLLECTOR_URL`                                                | v0.2      | Snowplow collector endpoint (server-side, never exposed to browser) |
| `SNOWPLOW_APP_ID`                                                       | v0.2      | Application identifier (server-side)                                |


:::note[Why two sets of Snowplow variables?]
Next.js exposes `NEXT_PUBLIC_*` variables to the browser bundle. Server-only variables (without the prefix) stay on the server. You need both because client-side and server-side trackers initialize independently - the client tracker runs in the browser, the server tracker runs in the Node.js process.
:::

You're ready to start. The next section explores the starter app before any tracking is added.

---


Before adding any tracking, take a tour of the application to understand what you're working with.

:::tip[Read-along]
If you're reading along, check out the tag:

```bash
git checkout v0.0-starter
npm install
```

:::

## App overview

The travel assistant is built with:

- Next.js 16 with React 19 and TypeScript
- Vercel AI SDK for multi-provider LLM support (Anthropic Claude, OpenAI GPT, Google Gemini)
- Three business tools: `search_flights`, `book_flight`, `check_calendar`
- A mock flights API with realistic airline and route data (no external API keys needed for the tools themselves)
- Streaming responses with inline tool call visualization

## Key files


| File                              | What it does                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/app/page.tsx`                | Main chat UI - message list, input, model selector, demo scenarios                                   |
| `src/app/api/chat/route.ts`       | Chat API route - receives messages, calls the LLM with tools, streams the response                   |
| `src/lib/tools/business-tools.ts` | Three tool definitions with Zod input schemas                                                        |
| `src/lib/external/flights-api.ts` | Mock flight database - eight airlines, nine airports, realistic pricing                              |
| `src/lib/model-config.ts`         | LLM provider configuration - models across three providers                                           |
| `src/app/components/`             | UI components: `ModelSelector`, `DemoScenarios`, `ToolCallIndicator`, `LiveTrackingPanel` (disabled) |


### The chat route

The heart of the app is `src/app/api/chat/route.ts`. It receives messages from the frontend, passes them to the LLM via the Vercel AI SDK's `streamText`, and returns a streaming response. The LLM has access to three tools and decides when to call them.

```typescript title="src/app/api/chat/route.ts"
const result = streamText({
  model: model,
  messages: modelMessages,
  system: `You are a helpful travel assistant...`,
  tools: {
    search_flights: createSearchFlightsTool(),
    book_flight: createBookFlightTool(),
    check_calendar: createCheckCalendarTool(),
  },
});

return result.toUIMessageStreamResponse();
```

### The business tools

Each tool is defined using the Vercel AI SDK's `tool()` function with a [Zod schema](https://zod.dev/) for input validation. The `search_flights` tool calls a mock API that generates realistic flight data:

```typescript title="src/lib/tools/business-tools.ts"
export function createSearchFlightsTool() {
  return tool({
    description: 'Search for flights between two cities on a specific date',
    inputSchema: searchFlightsSchema,
    execute: async (params) => {
      const results = await searchFlights(params);
      return results;
    },
  });
}
```

The tools work with generated mock data - eight airlines, nine airports, realistic pricing with cabin class multipliers, and randomized schedules. No external flight API is needed.

## Try it out

Before starting, confirm that `.env.local` has at least one valid LLM API key (not a placeholder value like `sk-ant-...`).

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try:

1. Send a message: "Find flights from London to Paris tomorrow"
2. Try a demo scenario: click one of the six pre-built prompts at the top of the page
3. Switch models: use the dropdown to select a different LLM provider and observe how response styles differ (if you have access to multiple providers)
4. Watch tool calls: notice the inline tool call indicators showing `search_flights` or `check_calendar` being invoked with parameters and results

The app works. The agent searches for flights, presents results, and can book them. You can have multi-turn conversations and use different models.

## What's missing

The app is fully functional, but you have zero visibility into what's happening. You can't answer:

- How many messages do users send per session?
- How long do agent responses take?
- Which tools get called most often? Do they succeed or fail?
- How many LLM steps and tokens does each request use?
- Why did the agent give that particular answer?
- When can't the agent meet a user's request, and how often does that happen?

At this point, the only way to know any of this is to manually watch the chat UI or read server logs. That doesn't scale.

:::note[Stage summary]
- Files: zero added, zero modified
- Events: none
- Schemas: none
:::

In the next section, you'll add the first layer of tracking: client-side events that capture what the user does in the browser.
