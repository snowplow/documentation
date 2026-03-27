---
title: "The starter app"
sidebar_label: "The starter app"
position: 2
description: "Explore the travel booking chatbot before any Snowplow tracking is added. Understand the app architecture, tools, and what's missing without observability."
keywords: ["snowplow", "agentic", "tracking", "ai", "starter", "chatbot"]
date: "2026-03-26"
---

# The starter app

Before adding any tracking, take a tour of the application. This is the baseline - a fully functional AI travel assistant with zero observability.

:::tip Code-along / Read-along
If you're coding along, you should already be on the starter tag from the setup step. If you're reading along, check out the tag now:
```bash
git checkout v0.0-starter
npm install
```
:::

## App overview

The travel assistant is built with:

- **Next.js 16** with React 19 and TypeScript
- **Vercel AI SDK** for multi-provider LLM support (Anthropic Claude, OpenAI GPT, Google Gemini)
- **Three business tools:** `search_flights`, `book_flight`, `check_calendar`
- **A mock flights API** with realistic airline and route data (no external API keys needed for the tools themselves)
- **Streaming responses** with inline tool call visualization

## Key files

| File | What it does |
|------|-------------|
| `src/app/page.tsx` | Main chat UI - message list, input, model selector, demo scenarios |
| `src/app/api/chat/route.ts` | Chat API route - receives messages, calls the LLM with tools, streams the response |
| `src/lib/tools/business-tools.ts` | Three tool definitions with Zod input schemas |
| `src/lib/external/flights-api.ts` | Mock flight database - 8 airlines, 9 airports, realistic pricing |
| `src/lib/model-config.ts` | LLM provider configuration - models across 3 providers |
| `src/app/components/` | UI components: `ModelSelector`, `DemoScenarios`, `ToolCallIndicator`, `LiveTrackingPanel` (disabled) |

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

The tools work with generated mock data - 8 airlines, 9 airports, realistic pricing with cabin class multipliers, and randomized schedules. No external flight API is needed.

## Try it out

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try:

1. **Send a message:** "Find flights from London to Paris tomorrow"
2. **Try a demo scenario:** Click one of the six pre-built prompts at the top of the page
3. **Switch models:** Use the dropdown to select a different LLM provider and observe how response styles differ (if you have access to multiple providers)
4. **Watch tool calls:** Notice the inline tool call indicators showing `search_flights` or `check_calendar` being invoked with parameters and results

The app works. The agent searches for flights, presents results, and can book them. You can have multi-turn conversations and use different models.

## What's missing

The app is fully functional, but you have zero visibility into what's happening. You can't answer:

- How many messages do users send per session?
- How long do agent responses take?
- Which tools get called most often? Do they succeed or fail?
- How many LLM steps and tokens does each request use?
- Why did the agent give that particular answer?
- When can't the agent meet a user's request, and how often does that happen?

Right now, the only way to know any of this is to manually watch the chat UI or read server logs. That doesn't scale.

---

> **Summary**
> **Files:** 0 added, 0 modified | **Events:** none | **Schemas:** none
> **Key takeaway:** A fully functional AI chatbot with zero observability.

In the next section, you'll add the first layer of tracking: client-side events that capture what the user does in the browser.
