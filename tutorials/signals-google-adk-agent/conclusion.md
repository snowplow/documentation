---
title: "Try out the integration"
sidebar_label: "Conclusion"
position: 6
description: "Run the full stack, debug common issues, and explore extensions like interventions, richer attributes, generative UI, multi-agent routing, and Vertex AI deployment."
keywords: ["debugging", "interventions", "generative UI", "multi-agent", "Vertex AI Agent Engine"]
date: "2026-04-17"
---



## Interventions

Signals also includes [interventions](/docs/signals/concepts/#interventions). These are push-based triggers that fire when a user crosses a behavioral threshold.

Rather than waiting for the user to open the chat, you can proactively provide context to your agent when something significant happens — for example, a user who has viewed pricing five times without converting. Combine this with CopilotKit's `useCopilotChatSuggestions` to surface contextual prompts in the sidebar.

Try exploring how you could use interventions within this application.

## Richer attributes

The Basic Web template covers session-level behavior. For further personalization, try extending your attribute group with product affinity (views per category), engagement scoring (session depth and intent), return visitor detection, or funnel stage tracking.

## Generative UI

CopilotKit's `useCopilotAction` lets the agent render React components instead of plain text. Combine it with Signals attributes to build contextual UI — for example, a pricing comparison card that only renders for users Signals has flagged as high-intent enterprise browsers.

## Multi-agent routing

Google ADK supports `SequentialAgent`, `ParallelAgent`, and `LoopAgent` for composing multi-step workflows. You can route users to different sub-agents based on their Signals profile — a support specialist for confused new users, a technical deep-dive agent for developers in the docs.

## Multi-dimensional context

The injection happens in a plain Python callback, so you can pull context from as many sources as you need. Combine Signals real-time attributes with batch data from your warehouse — user profiles, CRM attributes, product usage history — and compose them into a single system instruction.

## Deploy to Vertex AI Agent Engine

`ag_ui_adk` supports deployment to [Vertex AI Agent Engine](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview) — Google's managed runtime for ADK agents. Set `GOOGLE_GENAI_USE_VERTEXAI=True`, swap your API key for a service account, and deploy.

## Other Signals tutorials

Check out these other Signals tutorials and solution accelerators for inspiration:

* [Set up Signals for real-time calculation](/tutorials/signals-quickstart/start)
* [Implement real-time interventions using Signals](/tutorials/signals-interventions/start)
* [Score prospects in real time using Signals and ML](/tutorials/signals-ml-prospect-scoring/intro)
* [Use AWS BedRock to supplement Signals with persistent user context](/tutorials/signals-agentic-accelerator/intro)
