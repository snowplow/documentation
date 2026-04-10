---
title: "Set up the project"
position: 2
sidebar_label: "Project setup"
description: "Scaffold a Next.js project and install the required dependencies for Snowplow tracking, Signals, and the Vercel AI SDK."
keywords: ["next.js setup", "vercel ai sdk", "snowplow browser tracker", "project scaffold"]
date: "2026-04-10"
---

First, create (or use an existing) Next.js project and install all dependencies.

## Scaffold the app

```bash
npx create-next-app@latest signals-agent --yes --typescript --tailwind --app
cd signals-agent
npm install ai @ai-sdk/react @snowplow/browser-tracker @snowplow/browser-plugin-link-click-tracking @snowplow/signals-node
```

:::note[Existing projects]
The code in this tutorial uses the `@/*` path alias (e.g. `@/lib/snowplow`, `@/components/chat-widget`). This is configured by default by `create-next-app`. If you're adding to an existing project, make sure your `tsconfig.json` has `"@/*": ["./*"]` in `compilerOptions.paths`.
:::

## Install AI Elements

You'll use [AI Elements](https://ai-sdk.dev/elements) — Vercel's component library built on shadcn/ui — for the chat UI. First, initialize shadcn/ui (this creates the `components.json` config that AI Elements needs):

```bash
npx shadcn@latest init --defaults --yes
```

Then install the AI Elements components:

```bash
npx ai-elements@latest add conversation message
```

This installs the `Conversation` and `Message` component families into `@/components/ai-elements/`. You'll build a lightweight input component yourself in Step 4 — this avoids a known type incompatibility in the AI Elements `prompt-input` component.

## Verify the scaffold builds

Before writing any code, confirm everything is set up correctly:

```bash
npm run build
```

You should see a successful build with no errors.

## Environment variables

Create a `.env.local` file:

```bash
# Vercel AI Gateway — replace with your real key before testing the chat
# Create a key at: https://vercel.com/dashboard/ai-gateway/api-keys
AI_GATEWAY_API_KEY=your-vercel-ai-gateway-api-key

# Snowplow tracking
NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL=https://your-collector-url.com

# Snowplow Signals
SNOWPLOW_SIGNALS_BASE_URL=https://signals.snowplowanalytics.com
SNOWPLOW_SIGNALS_API_KEY=your-signals-api-key
SNOWPLOW_SIGNALS_API_KEY_ID=your-signals-api-key-id
SNOWPLOW_SIGNALS_ORG_ID=your-org-id
SNOWPLOW_SIGNALS_SERVICE_NAME=web-agent-context
```

Note the `NEXT_PUBLIC_` prefix on the collector URL — this makes it available to the Browser SDK on the client side.

You'll find your Snowplow Collector URL in **Snowplow Console** → **Pipeline** → select your pipeline → **Configuration** → **Collector Domains**.

You'll find your Signals base URL and credentials in **Snowplow Console** → **Signals** → **Overview**.

## Need a demo app?

The scaffolded project only has a single page. To see Signals in action, you need multiple pages so there's meaningful browsing behavior to track. If you don't already have a multi-page app, you can ask an AI coding assistant (Claude, Cursor, etc.) to generate a demo app with this prompt:

> Create a simple multi-page Next.js App Router e-commerce site for a fictional store called "Signal Shop". It should have: a homepage with featured products, a `/products` page listing at least 8 products across categories (electronics, clothing, home), individual product detail pages at `/products/[id]`. Use Tailwind for styling. Keep it minimal — static content is fine, no database or real checkout needed.
