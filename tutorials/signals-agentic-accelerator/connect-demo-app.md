---
title: "Connect the SEA Explorer demo app"
sidebar_label: "Connect the demo app"
position: 5
description: "Connect the SEA Explorer travel demo app to your Bedrock agent with Signals and AgentCore Memory integration."
keywords: ["SEA Explorer", "demo app", "Bedrock", "Signals", "AgentCore Memory", "Docker"]
date: "2026-03-27"
---

Now that you have a working agent with Signals attributes and AgentCore Memory, you can connect it to a frontend application. The SEA Explorer demo app is a Next.js travel site that calls Bedrock directly using the same model and credentials from the notebook.

The app includes a chat interface where users can ask travel questions. As users browse destinations and experiences, Snowplow tracking generates the behavioral events that Signals processes into the attributes your agent uses for personalization. AgentCore Memory persists context across chat sessions.

## Prerequisites

Before connecting the demo app, ensure you have:

* Completed the previous steps in this accelerator (agent, Signals attributes, and memory)
* Your AWS credentials (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) with Bedrock access
* Your AWS region (the same one used in the notebook)
* Your AgentCore Memory ID (printed when you created the memory resource)

## Run the demo app

Create a file called `.env` with your credentials from the notebook:

```bash
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AGENTCORE_MEMORY_ID=your_memory_id
```

Pull and run the published Docker image, passing your credentials via the env file:

```bash
docker run --env-file .env -p 3000:3000 snowplow/agentic-accelerator-demo
```

Open `http://localhost:3000` in your browser.

You can also pass credentials inline:

```bash
docker run \
  -e AWS_REGION=us-west-2 \
  -e AWS_ACCESS_KEY_ID=your_access_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret_key \
  -e AGENTCORE_MEMORY_ID=your_memory_id \
  -p 3000:3000 snowplow/agentic-accelerator-demo
```

## Configure Signals

The app needs your Signals credentials to fetch behavioral attributes. Click **Signals Settings** in the app header and enter your connection details.

For **Signals Sandbox**, enter your sandbox URL and token. For **CDI**, enter your API URL, API key, API key ID, and organization ID. These are the same values you configured in the notebook's credentials cell.

Alternatively, add these to your `.env` file before starting the container:

```bash
NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=https://you.signals.snowplowanalytics.com
SNOWPLOW_SIGNALS_TRIAL_TOKEN=your_token
```

## Test the integration

1. **Chat with the agent** - Click the chat icon in the bottom right corner and ask a travel question. The agent calls Bedrock directly with the same model used in the notebook (`us.anthropic.claude-sonnet-4-20250514-v1:0`).

2. **Test memory** - Ask the agent for destination recommendations. Because you seeded customer history in the notebook, the agent should reference preferences for warm, adventurous, family-friendly destinations without you needing to state them.

3. **Test Signals** - Browse some destination and experience pages to generate tracking events. Then ask the agent "Based on my browsing behavior, what experiences would suit me?" The agent fetches your behavioral profile from Signals and personalizes its response.

## Runtime configuration

The **AgentCore** dropdown in the app header lets you override settings at runtime without restarting:

* **AWS Region** - change the Bedrock region
* **AgentCore Memory ID** - switch to a different memory resource
* **AI Model Provider** - switch between `bedrock`, `agentcore`, or `openai`
* **AI Model Name** - change the foundation model

These changes take effect on the next chat message and do not persist across server restarts.

:::note
AWS credentials (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) must be set via environment variables in your `.env` file. They cannot be configured through the UI.
:::
