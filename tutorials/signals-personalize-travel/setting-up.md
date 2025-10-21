---
title: "Set up the travel demo website"
position: 2
description: "Configure and run the demo travel website that you'll use to test Snowplow Signals personalization features."
keywords: ["Docker", "setup", "travel website", "Snowplow Local", "configuration"]
date: "2025-01-21"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
```

You'll now set up and run the example travel website that serves as the foundation for testing Snowplow Signals personalization. This website represents a typical ecommerce travel platform where users browse destinations, read content, and interact with various features. The site will capture behavioral data that you'll later use to create personalized experiences.

The website includes features like destination browsing, filtering, content pages, and an integrated chatbot. These components generate the behavioral events that Signals will process into meaningful attributes for personalization.

The demo website is part of the [Snowplow Local](https://github.com/snowplow-incubator/snowplow-local) repository.

## Installing Snowplow Local

Clone the Snowplow Local repository to your machine:

```
git clone git@github.com:snowplow-incubator/snowplow-local.git
```

Change directory into the `snowplow-local` folder:

```
cd snowplow-local
```

## Connecting to Signals

Create an `.env` file based off the example file in the `snowplow-local` folder:
```
cp .env.example .env
```

Follow the instructions in the [Signals documentation](/docs/signals/connection/) to get your connection credentials.

If you'll be using an agent, you will also need either a OpenAI API key (`OPENAI_API_KEY`) or an AWS Bearer token for Bedrock (`AWS_BEARER_TOKEN_BEDROCK`). If using Bedrock, please ensure the Claude Sonnet model has been enabled, and that you've accepted the terms of service in the AWS Console.

<!-- TODO: where do they get the collector url? why does it say next public? -->

Edit the `.env` file with the following variables:

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="cdi" label="CDI" default>

```bash
NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=signals.snowplow.com
SNOWPLOW_SIGNALS_API_KEY=
SNOWPLOW_SIGNALS_API_KEY_ID=
SNOWPLOW_SIGNALS_ORGANIZATION_ID=
NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL= TODO maybe not?
```

  </TabItem>
  <TabItem value="sandbox" label="Sandbox">

```bash
NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=sandbox.signals.snowplow.com
SNOWPLOW_SIGNALS_INGEST_URL=
SNOWPLOW_SIGNALS_TRIAL_TOKEN=
```

  </TabItem>
</Tabs>

## Running the travel website

Run the following Docker command:

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="cdi" label="CDI" default>

```bash
docker compose --profile travel-site up
```

  </TabItem>
  <TabItem value="sandbox" label="Sandbox">

```bash
docker compose --profile travel-site --profile signals up
```

  </TabItem>
</Tabs>

Open the travel website in your browser at [http://localhost:8086](http://localhost:8086). You should see the homepage of the travel site.

<!-- TODO image -->

Open your browser's Developer console (Ctrl+Shift+I or equivalent), and go to the Snowplow Inspector tab. Generate some events by clicking on filters on the [destinations](http://localhost:8086/destinations) page, e.g., "Food". You should see self-describing events firing into your Snowplow pipeline.

Explore the site a little bit, and think about what attributes might be useful to define in Signals to customize the site towards the behavior and preferences of a user.
