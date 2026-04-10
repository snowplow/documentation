---
title: "Learn how to build an AI agent with real-time user context"
position: 1
sidebar_label: "Introduction"
description: "Build a Next.js AI agent that uses Snowplow Signals to understand what your users are doing in real time."
keywords: ["snowplow signals", "ai agent", "vercel ai sdk", "real-time context", "next.js"]
date: "2026-04-10"
---

In this tutorial, you'll build a Next.js AI agent that uses [Snowplow Signals](/docs/signals/introduction/) to understand what your users are doing in real time. Instead of responding generically to every user, the agent will have live awareness of the current user's session behavior — which pages they've visited, what they've been exploring, and how long they've been on the site.

## What you'll build

A chat agent embedded in a Next.js app that:

1. Tracks user behavior automatically using the [Snowplow Browser Tracker](/docs/sources/web-trackers/quick-start-guide/)
2. Computes live user attributes with Snowplow Signals
3. Injects those attributes into the AI agent's system prompt using the Vercel AI SDK
4. Delivers contextually aware responses that respond to what the user is actually doing

## The difference this makes

Without Signals context:

> User: "Can you help me understand your pricing?"
> Agent: "Sure! We offer three plans: Starter, Pro, and Enterprise..."

With Signals context (user has spent 20 minutes on the enterprise pricing page):

> User: "Can you help me understand your pricing?"
> Agent: "I can see you've been exploring our Enterprise plan — happy to help. Are you mainly comparing SSO requirements, infrastructure options, or SLA tiers?"

Same model. Same question. Dramatically better response.

## Prerequisites

This tutorial requires:

* A Snowplow account with [Signals deployed](/docs/signals/connection/)
* Node.js 18+ and npm/pnpm
* A [Vercel AI Gateway API key](https://vercel.com/docs/ai-gateway/getting-started) (this tutorial uses `openai/gpt-4o-mini` via AI Gateway, but any supported model works)
* Basic familiarity with Next.js and TypeScript

This tutorial should take approximately 30 minutes to complete.
