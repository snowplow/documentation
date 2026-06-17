---
title: "Set up the Next.js project"
position: 2
sidebar_label: "Set up the project"
description: "Scaffold a Next.js project and install the required dependencies for Snowplow tracking, Signals, and the Vercel AI SDK."
keywords: ["next.js setup", "vercel ai sdk", "snowplow browser tracker", "project scaffold"]
date: "2026-04-10"
---

First, you'll need to create a Next.js project. You could also use an existing project.

## Scaffold the app

Run the following commands to set up the project and install the required dependencies:

```bash
npx create-next-app@latest signals-agent --yes --typescript --tailwind --app
cd signals-agent
npm install ai @ai-sdk/react @snowplow/browser-tracker @snowplow/browser-plugin-link-click-tracking @snowplow/signals-node
```

This will create a new Next.js app using TypeScript and Tailwind CSS.

As well as installing the Vercel AI SDK, it'll add the Snowplow browser tracker and link click plugin for client-side tracking, and the Signals Node client to fetch user attributes server-side.

:::note[Existing projects]
The code in this tutorial uses the `@/*` path alias (e.g. `@/lib/snowplow`, `@/components/chat-widget`). This is configured by default by `create-next-app`. If you're adding to an existing project, make sure your `tsconfig.json` has `"@/*": ["./*"]` in `compilerOptions.paths`.
:::

## Install AI Elements

This tutorial uses [AI Elements](https://ai-sdk.dev/elements), Vercel's component library built on shadcn/ui, for the chat UI.

First, initialize shadcn/ui. This creates the `components.json` config that AI Elements needs:

```bash
npx shadcn@latest init --defaults --yes
```

Then install the AI Elements components:

```bash
npx ai-elements@latest add conversation message
```

This installs the `Conversation` and `Message` component families into `@/components/ai-elements/`. You'll build a lightweight input component yourself in the Build the AI integration step, rather than using the AI Elements `prompt-input` component.

## Verify the scaffold builds

Confirm everything is set up correctly:

```bash
npm run build
```

You should see a successful build with no errors.

## Add environment variables

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
```

Note the `NEXT_PUBLIC_` prefix on the Collector URL: this makes it available to the Browser tracker on the client-side.

You'll find your Snowplow Collector URL in [Snowplow Console](https://console.snowplowanalytics.com) > **Pipelines** > select your pipeline > **Configuration** > **Collector Domains**.

You'll find your Signals base URL (also known as Profiles API URL) and credentials in [Snowplow Console](https://console.snowplowanalytics.com) > **Signals** > **Overview**.

## Add more pages

The scaffolded project starts with only a single page.

To see Signals in action, you'll need multiple pages so there's meaningful browsing behavior to track. The easiest way to add pages is to ask an AI coding assistant (Claude, Cursor, etc.) to generate some.

Example prompt:

```txt
Add pages to this Next.js project for a fictional store called "Signal Shop". Add:
- A homepage with featured products
- A `/products` page listing at least 8 products across different categories
- Individual product detail pages at `/products/[id]`

Use product categories "electronics", "clothing", and "home".
Use Tailwind for styling.
Keep it minimal — static content is fine, no database or real checkout needed.
```
