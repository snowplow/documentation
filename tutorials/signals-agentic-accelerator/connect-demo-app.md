---
title: "Connect the SEA Explorer demo app"
sidebar_label: "Connect the demo app"
position: 5
description: "Connect the SEA Explorer travel demo app to your Bedrock agent with Signals and AgentCore Memory integration."
keywords: ["SEA Explorer", "demo app", "Bedrock", "Signals", "AgentCore Memory", "Docker"]
date: "2026-03-27"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Now that you have a working agent with Signals attributes and AgentCore Memory, you can connect it to a frontend application. The SEA Explorer demo app is a Next.js travel site that calls Bedrock directly using the same model and credentials from the notebook.

The app includes a chat interface where users can ask travel questions. As users browse destinations and experiences, Snowplow tracking generates the behavioral events that Signals processes into the attributes your agent uses for personalization. AgentCore Memory persists context across chat sessions.

## Prerequisites

Before connecting the demo app, ensure you have:

* Completed the previous steps in this accelerator (agent, Signals attributes, and memory)
* Your AWS credentials - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` - with Bedrock access
* Your AWS region - the same one used in the notebook
* Your AgentCore Memory ID - printed when you created the memory resource
* Your Signals credentials - the same values you configured in the notebook's credentials cell

## Run the demo app

Create a file called `.env` with your credentials from the notebook. Include your AWS credentials, memory ID, and Signals connection:

<Tabs groupId="cloud" queryString>
  <TabItem value="cdi" label="CDI" default>

```bash
AI_MODEL_PROVIDER=bedrock
AI_MODEL_NAME=us.anthropic.claude-sonnet-4-20250514-v1:0
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AGENTCORE_MEMORY_ID=your_memory_id

NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=https://example.signals.snowplowanalytics.com
SNOWPLOW_SIGNALS_API_KEY=your_api_key
SNOWPLOW_SIGNALS_API_KEY_ID=your_api_key_id
SNOWPLOW_SIGNALS_ORGANIZATION_ID=your_org_id
SNOWPLOW_SIGNALS_SERVICE_NAME=travel_service
```

  </TabItem>
  <TabItem value="sandbox" label="Sandbox">

```bash
AI_MODEL_PROVIDER=bedrock
AI_MODEL_NAME=us.anthropic.claude-sonnet-4-20250514-v1:0
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AGENTCORE_MEMORY_ID=your_memory_id

NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=https://you.signals.snowplowanalytics.com
SNOWPLOW_SIGNALS_TRIAL_TOKEN=your_token
SNOWPLOW_SIGNALS_SERVICE_NAME=travel_service
```

  </TabItem>
</Tabs>

Pull and run the published Docker image, passing your credentials via the env file:

```bash
docker run --env-file .env -p 3000:3000 snowplow/demo-travel-site:accelerator
```

Open `http://localhost:3000` in your browser.

## Verify configuration

The app header includes two read-only status dropdowns:

* **Signals** — shows whether Signals is connected in CDI or Sandbox mode, and which credentials are configured
* **AgentCore** — shows the current Bedrock model, AWS region, and memory ID

If either dropdown shows "Not set" for required fields, check that the corresponding environment variables are present in your `.env` file and restart the container.

## Test the integration

1. **Chat with the agent**: click the chat icon in the bottom right corner and ask a travel question. The agent will call Bedrock directly with the same model used in the notebook (`us.anthropic.claude-sonnet-4-20250514-v1:0`).

2. **Test memory**: ask the agent for destination recommendations. Because you seeded customer history in the notebook, the agent should reference preferences for warm, adventurous, family-friendly destinations without you needing to state them.

3. **Test Signals**: browse some destination and experience pages to generate tracking events. Then ask the agent "Based on my browsing behavior, what experiences would suit me?" The agent will fetch your behavioral profile from Signals and personalize its response.

:::tip
All configuration is managed through environment variables. To change settings, update your `.env` file and restart the container.
:::
