---
title: "Set up the agentic Next.js application"
sidebar_label: "Set up the app"
position: 2
description: "Explore the travel booking chatbot before any Snowplow tracking is added. Understand the app architecture, tools, and what's missing without observability."
keywords: ["snowplow", "agentic", "tracking", "ai", "starter", "chatbot"]
date: "2026-03-26"
---

Start by downloading the travel assistant application and setting up environment variables.

The app is built with:
- Next.js 16 with React 19 and TypeScript
- Vercel AI SDK for multi-provider LLM support
- Three business tools: `search_flights`, `book_flight`, `check_calendar`
- A mock flights API with realistic airline and route data
- Streaming responses with inline tool call visualization

## Clone the repository

Run this in your terminal to clone the repository, check out the starter branch, and install dependencies:

```bash
git clone https://github.com/snowplow-industry-solutions/agentic-app-tracking-tutorial.git
cd agentic-app-tracking-tutorial
git checkout v0.0-starter
npm install
```

## Configure environment variables

Create your environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add at least one LLM API key. The chatbot calls a real language model. The flight search, booking, and calendar tools all use mock data, so you don't need any external travel API keys. The file looks like this:

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

:::warning[Valid API key required]
The app will start even if you use the wrong key or leave placeholder values (like `sk-ant-...` from the example file), but **LLM requests will fail silently**: the UI may look healthy while the model never responds correctly.
:::

The environment variables break down by accelerator stage:


| Variable                                                                | Used from | Purpose                                                            |
| ----------------------------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` | v0.0      | LLM provider authentication                                        |
| `NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL`                                    | v0.1      | Snowplow collector endpoint; client-side, exposed to browser       |
| `NEXT_PUBLIC_SNOWPLOW_APP_ID`                                           | v0.1      | Application identifier; client-side, exposed to browser            |
| `SNOWPLOW_COLLECTOR_URL`                                                | v0.2      | Snowplow collector endpoint; server-side, never exposed to browser |
| `SNOWPLOW_APP_ID`                                                       | v0.2      | Application identifier; server-side, never exposed to browser      |


:::note[Why two sets of Snowplow variables?]
Next.js exposes `NEXT_PUBLIC_*` variables to the browser bundle. Server-only variables, without the prefix, stay on the server.

You need both because client-side and server-side trackers initialize independently. The client tracker runs in the browser, the server tracker runs in the Node.js process.
:::

## Key application files

This table shows the key files:

| File                              | What it does                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/app/page.tsx`                | Main chat UI: message list, input, model selector, demo scenarios                         |
| `src/app/api/chat/route.ts`       | Chat API route: receives messages, calls the LLM with tools, streams the response         |
| `src/lib/tools/business-tools.ts` | Three tool definitions with Zod input schemas                                             |
| `src/lib/external/flights-api.ts` | Mock flight database: eight airlines, nine airports, realistic pricing                    |
| `src/lib/model-config.ts`         | LLM provider configuration: models across three providers                                 |
| `src/app/components/`             | UI components: `ModelSelector`, `DemoScenarios`, `ToolCallIndicator`, `LiveTrackingPanel` |


The heart of the app is `src/app/api/chat/route.ts`. It receives messages from the front-end, passes them to the LLM via the Vercel AI SDK's `streamText`, and returns a streaming response.

The LLM has access to three tools, and decides when to call them:

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

## Run the application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try:

1. Send a message: "Find flights from London to Paris tomorrow"
2. Try a demo scenario: click one of the six pre-built prompts at the top of the page
3. If you have access to multiple LLM providers, switch models: use the dropdown to select a different LLM provider and observe how response styles differ
4. Watch tool calls: notice the inline tool call indicators showing `search_flights` or `check_calendar` being invoked with parameters and results
