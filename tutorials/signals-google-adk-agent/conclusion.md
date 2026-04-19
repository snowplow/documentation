---
title: "See it in action and next steps"
sidebar_label: "Conclusion"
position: 6
description: "Run the full stack, debug common issues, and explore extensions like interventions, richer attributes, generative UI, multi-agent routing, and Vertex AI deployment."
keywords: ["debugging", "interventions", "generative UI", "multi-agent", "Vertex AI Agent Engine"]
date: "2026-04-17"
---

Double-check your `.env` has real credentials — particularly `GOOGLE_API_KEY`, `NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL`, and the four `SNOWPLOW_SIGNALS_*` variables. Then run the stack:

```bash
npm run dev
```

This starts the Python agent on `:8000` and the React dev server on `:3000`. Open [http://localhost:3000](http://localhost:3000) and browse around for a minute — visit different pages, click some links. Snowplow is tracking these interactions and Signals is computing your attributes in real time.

Now open the CopilotKit sidebar and ask a question. The agent has your Signals context from the first message — its response will reflect what you've been browsing.

## Debug the integration

The `main.py` above already logs each callback invocation via `log.info(...)` to stderr. When you run `npm run dev`, watch the `[agent]` prefix. You should see the session ID present from the very first turn:

```
[agent] before_model_callback: state_keys=['snowplowDomainSessionId', '_ag_ui_thread_id', '_ag_ui_app_name', '_ag_ui_user_id'] snowplow_session_id='472f97c1-eec1-45fe-b081-3ff695c30415'
[agent] injecting signals block (287 chars)
```

Common issues:

- **Empty session ID** — the Snowplow tracker never initialized. Check the browser Network tab for requests to your Collector; check that your Collector URL env var is set and exposed to the browser (`NEXT_PUBLIC_` prefix in the scaffold, or `VITE_` in Vite). Also verify the `SnowplowProvider` wraps `CopilotProvider` in `layout.tsx` (not the other way around) — the tracker must set the cookie before the provider reads it.
- **Empty Signals block but session ID present** — the attribute group hasn't been published, the service name in `.env` doesn't match the Console, or the session hasn't generated enough events for Signals to compute yet (give it 30–60 seconds of browsing).

## What's next

You've built an agent that knows what the user has been doing. The next step is an agent that acts on that knowledge without waiting to be asked.

### Interventions — agents that reach out first

This tutorial covered the pull side: the agent fetches context when the user starts a conversation. Signals interventions add the push side — triggers that fire when a user crosses a behavioral threshold. A user who has viewed pricing five times without converting, a new visitor who's been stuck on the docs for ten minutes, a returning user who just landed on a page they've never seen before — interventions let you define those moments and have the agent proactively start a conversation. Combine this with CopilotKit's `useCopilotChatSuggestions` to surface contextual prompts in the sidebar at exactly the right time.

### Richer attributes

The Basic Web template covers session-level behavior. For deeper personalization, extend your attribute group with product affinity (views per category), engagement scoring (session depth and intent), return visitor detection, or funnel stage tracking.

### Generative UI with CopilotKit

CopilotKit's `useCopilotAction` lets the agent render React components instead of plain text. Combine it with Signals attributes to build contextual UI — for example, an "Enterprise pricing comparison" card that only renders for users Signals has flagged as high-intent enterprise browsers.

### Multi-agent routing

Google ADK supports `SequentialAgent`, `ParallelAgent`, and `LoopAgent` for composing multi-step workflows. You can route users to different sub-agents based on their Signals profile — a support specialist for confused new users, a technical deep-dive agent for developers in the docs.

### Multi-dimensional context

The injection happens in a plain Python callback, so you can pull context from as many sources as you need. Combine Signals real-time attributes with batch data from your warehouse — user profiles, CRM attributes, product usage history — and compose them into a single system instruction.

### Deploy to Vertex AI Agent Engine

Once you're happy locally, `ag_ui_adk` supports deployment to [Vertex AI Agent Engine](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview) — Google's managed runtime for ADK agents. Set `GOOGLE_GENAI_USE_VERTEXAI=True`, swap your API key for a service account, and deploy.

## Further reading

- [Snowplow Signals documentation](/docs/signals/)
- [Snowplow Signals Python SDK](https://pypi.org/project/snowplow-signals/)
- [Snowplow Browser Tracker](/docs/sources/web-trackers/)
- [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs/)
- [ADK + AG-UI integration guide](https://google.github.io/adk-docs/integrations/ag-ui/)
- [CopilotKit ADK integration](https://docs.copilotkit.ai/adk)
- [AG-UI Protocol](https://docs.ag-ui.com/)
