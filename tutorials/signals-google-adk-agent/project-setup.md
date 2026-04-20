---
title: "Set up the project"
sidebar_label: "Set up the project"
position: 2
description: "Scaffold a Google ADK agent and React frontend with the CopilotKit starter, install Snowplow dependencies, and configure environment variables."
keywords: ["CopilotKit", "Google ADK", "scaffold", "setup", "uv", "Next.js"]
date: "2026-04-17"
---

CopilotKit ships a starter that scaffolds both the ADK Python backend and a React frontend in one command.

## Scaffold the app

```bash
npx copilotkit@latest create -f adk -n signals-adk-agent
cd signals-adk-agent
```

This creates:

- `agent/` — Python ADK agent entrypoint at `agent/main.py` and `pyproject.toml`
- `src/` — React frontend with CopilotKit wired up and a demo agent
- `scripts/` — `setup-agent.sh` (runs `uv sync`) and `run-agent.sh`
- `package.json` scripts: `dev:ui`, `dev:agent`, and `dev` (runs both concurrently)

The scaffold's Python side uses `uv` — not pip — and the agent venv lives at `agent/.venv`.

:::note[Framework note]
The scaffold uses Next.js as a convenience — it provides a dev server, routing, and an API endpoint to host the CopilotKit proxy. CopilotKit itself is a React library that works with any framework (Vite, Remix, CRA, etc.). The three pieces that matter in this tutorial are CopilotKit (React), Google ADK (Python), and Snowplow Signals (API) — the framework around them is your choice.
:::

## Install frontend and backend dependencies

```bash
npm install
```

Add the packages the tutorial needs on top of the scaffold:

```bash
# Snowplow Browser SDK for the frontend
npm install @snowplow/browser-tracker @snowplow/browser-plugin-link-click-tracking

# Snowplow Signals Python SDK for the agent
cd agent && uv add snowplow-signals && cd ..
```

## Configure environment variables

Create your `.env` at the project root (not inside `agent/`):

```bash
# Gemini / Google AI Studio
GOOGLE_API_KEY=your-google-ai-studio-api-key
GOOGLE_GENAI_USE_VERTEXAI=False

# AG-UI bridge — where the CopilotKit proxy forwards agent requests to
AGENT_URL=http://localhost:8000

# Snowplow tracking — NEXT_PUBLIC_ prefix exposes the var to the browser
NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL=https://your-collector-url.com

# Snowplow Signals (consumed server-side by the Python agent)
SNOWPLOW_SIGNALS_BASE_URL=https://signals.snowplowanalytics.com
SNOWPLOW_SIGNALS_API_KEY=your-signals-api-key
SNOWPLOW_SIGNALS_API_KEY_ID=your-signals-api-key-id
SNOWPLOW_SIGNALS_ORG_ID=your-org-id
SNOWPLOW_SIGNALS_SERVICE_NAME=web_agent_context
```

You'll find your Snowplow Collector URL in [Snowplow Console](https://console.snowplowanalytics.com) > **Pipelines** > select your pipeline > **Configuration** > **Collector Domains**.

You'll find your Signals base URL (also known as Profiles API URL) and credentials in [Snowplow Console](https://console.snowplowanalytics.com) > **Signals** > **Overview**.

## Verify the scaffold runs

Confirm the scaffold runs. Set `GOOGLE_API_KEY` to a real Google AI Studio key in `.env`, then:

```bash
npm run dev
```

This uses `concurrently` to launch FastAPI on `http://localhost:8000` and the React dev server on `http://localhost:3000`, with agent logs prefixed `[agent]` and UI logs prefixed `[ui]`. Open the frontend, open the CopilotKit sidebar, and confirm you can chat with the Gemini-backed agent. Exit the dev server with Ctrl+C before moving on.

## Strip the scaffold's demo content

Remove the demo components and types the scaffold ships with:

```bash
rm src/components/proverbs.tsx src/components/weather.tsx src/lib/types.ts
```

After this, `src/app/page.tsx` will fail to compile because it still imports those deleted files — you'll replace it with a plain homepage in the agent integration step. Don't run `npm run dev` again until then.

## Add more pages

The scaffolded project starts with only a single page.

To see Signals in action, you'll need multiple pages so there's meaningful browsing behavior to track. The easiest way to add pages is to ask an AI coding assistant (Claude, Cursor, etc.) to generate some.

Example prompt:

```txt
Create a simple multi-page e-commerce site for a fictional store called "Signal Shop". It should have:
- A homepage with featured products
- Category landing pages at `/products/[category]` for at least three categories (electronics, clothing, home)
- Individual product detail pages at `/products/[category]/[slug]` (e.g. `/products/electronics/wireless-headphones`) with at least 8 distinct products spread across the categories
- A `/pricing` page

Every product must have a descriptive, human-readable slug — never a numeric ID. The product name, category, and price should be prominent in the page `<title>`, an `<h1>`, and the visible content.
Use Tailwind for styling. Keep it minimal — static content is fine, no database or real checkout needed.
Preserve the existing `CopilotKit` provider in the root layout.
```
