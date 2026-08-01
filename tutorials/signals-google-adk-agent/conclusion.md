---
title: "Conclusion and next steps"
sidebar_label: "Conclusion"
position: 6
description: "Run the full stack, debug common issues, and explore extensions like interventions, richer attributes, generative UI, multi-agent routing, and Vertex AI deployment."
keywords: ["debugging", "interventions", "agentic context", "generative UI", "multi-agent", "Vertex AI Agent Engine"]
date: "2026-07-31"
---

In this tutorial, you've built a Next.js app with a Google ADK agent that uses Snowplow Signals to deliver personalized, context-aware responses based on live user behavior.

Here's what you set up:

* Snowplow Browser tracker capturing page views, page pings, and link clicks
* A Signals attribute group computing real-time session-level attributes
* A Signals service exposing those attributes via API
* A Signals agentic context buffering the session's recent events as an LLM-ready narrative
* A CopilotKit sidebar that passes the Snowplow session ID with every request
* A Google ADK agent whose `before_model_callback` fetches both kinds of context and injects them into its system instruction each turn

## Next steps

- **Interventions**: Signals also includes [interventions](/docs/signals/concepts/#interventions), push-based triggers that fire when a user crosses a behavioral threshold. Rather than waiting for the user to open the chat, you can proactively provide context to your agent when something significant happens, such as a user who has viewed pricing five times without converting. Combine this with CopilotKit's `useCopilotChatSuggestions` to surface contextual prompts in the sidebar.
- **Richer attributes**: the Basic Web template covers session-level behavior. Extend your attribute group with product affinity (views per category), an engagement score, a return visitor flag, or a funnel stage.
- **Generative UI**: CopilotKit's `useCopilotAction` lets the agent render React components instead of plain text. Combine it with Signals attributes to build contextual UI, such as a pricing comparison card that renders only for users Signals has flagged as high-intent enterprise browsers.
- **Multi-agent routing**: Google ADK supports `SequentialAgent`, `ParallelAgent`, and `LoopAgent` for composing multi-step workflows, so you can route users to different sub-agents based on their Signals profile.
- **Multi-dimensional context**: the injection happens in a plain Python callback, so you can pull context from as many sources as you need. Combine Signals real-time attributes with batch data from your warehouse, such as user profile data, CRM attributes, or product usage history.
- **Deploy to Vertex AI Agent Engine**: the ADK integration supports deployment to [Vertex AI Agent Engine](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview), Google's managed runtime for ADK agents. Set `GOOGLE_GENAI_USE_VERTEXAI=True`, swap your API key for a service account, and deploy.

## Other Signals tutorials

Check out these other Signals tutorials and solution accelerators for inspiration:

* [Set up Signals for real-time calculation](/tutorials/signals-quickstart/start)
* [Implement real-time interventions using Signals](/tutorials/signals-interventions/start)
* [Score prospects in real time using Signals and ML](/tutorials/signals-ml-prospect-scoring/intro)
* [Use AWS BedRock to supplement Signals with persistent user context](/tutorials/signals-agentic-accelerator/intro)
