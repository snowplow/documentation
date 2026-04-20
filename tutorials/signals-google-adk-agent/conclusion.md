---
title: "Conclusion and next steps"
sidebar_label: "Conclusion"
position: 6
description: "Run the full stack, debug common issues, and explore extensions like interventions, richer attributes, generative UI, multi-agent routing, and Vertex AI deployment."
keywords: ["debugging", "interventions", "generative UI", "multi-agent", "Vertex AI Agent Engine"]
date: "2026-04-17"
---

In this tutorial, you've built a Next.js app with a Google ADK agent that uses Snowplow Signals to deliver personalized, context-aware responses based on live user behavior.

Here's what you set up:

* Snowplow Browser tracker capturing page views, page pings, and link clicks
* A Signals attribute group computing real-time session-level attributes
* A Signals service exposing those attributes via API
* A CopilotKit sidebar that passes the Snowplow session ID with every request
* A Google ADK agent that fetches and injects those attributes into its system prompt

Here are some next steps ideas for extending what you've built.

## Interventions

Signals also includes [interventions](/docs/signals/concepts/#interventions). These are push-based triggers that fire when a user crosses a behavioral threshold.

Rather than waiting for the user to open the chat, you can proactively provide context to your agent when something significant happens. For example, a user who has viewed pricing five times without converting. Combine this with CopilotKit's `useCopilotChatSuggestions` to surface contextual prompts in the sidebar.

Try exploring how you could use interventions within this application.

## Richer attributes

The Basic Web attribute group template covers session-level behavior. For further personalization, try extending your attribute group with:
- **Product affinity**: count of views per product category to understand user interest
- **Engagement score**: a computed signal of session depth and intent
- **Return visitor flag**: whether this is a new or returning user
- **Funnel stage**: where the user is in a defined conversion journey

## Generative UI

CopilotKit's `useCopilotAction` lets the agent render React components instead of plain text. Combine it with Signals attributes to build contextual UI. For example, a pricing comparison card that only renders for users Signals has flagged as high-intent enterprise browsers.

## Multi-agent routing

Google ADK supports `SequentialAgent`, `ParallelAgent`, and `LoopAgent` for composing multi-step workflows. You can route users to different sub-agents based on their Signals profile. For example, a support specialist for confused new users, or a technical deep-dive agent for developers in the docs.

## Multi-dimensional context

The injection happens in a plain Python callback, so you can pull context from as many sources as you need. Combine Signals real-time attributes with batch data from your warehouse. This could include attributes such as user profile data, CRM attributes, or product usage history.

## Deploy to Vertex AI Agent Engine

The ADK integration supports deployment to [Vertex AI Agent Engine](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview), Google's managed runtime for ADK agents. Set `GOOGLE_GENAI_USE_VERTEXAI=True`, swap your API key for a service account, and deploy.

## Other Signals tutorials

Check out these other Signals tutorials and solution accelerators for inspiration:

* [Set up Signals for real-time calculation](/tutorials/signals-quickstart/start)
* [Implement real-time interventions using Signals](/tutorials/signals-interventions/start)
* [Score prospects in real time using Signals and ML](/tutorials/signals-ml-prospect-scoring/intro)
* [Use AWS BedRock to supplement Signals with persistent user context](/tutorials/signals-agentic-accelerator/intro)
