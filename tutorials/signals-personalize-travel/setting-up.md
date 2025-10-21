---
title: "Install the demo travel website"
position: 2
description: "Set up and run the demo travel website using Docker and Snowplow Local."
keywords: ["Docker", "Snowplow Local", "travel website", "setup", "installation"]
date: "2025-01-21"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

You'll now install and run the example travel website that you'll use to test Snowplow Signals personalization. This website represents a typical e-commerce travel platform where users browse destinations, read content, and interact with various features.

The demo website is part of the [Snowplow Local](https://github.com/snowplow-incubator/snowplow-local) repository. It's a React application.

## Clone Snowplow Local

Clone the Snowplow Local repository to your machine:

```
git clone git@github.com:snowplow-incubator/snowplow-local.git
```

Change directory into the `snowplow-local` folder:

```
cd snowplow-local
```

## Configure environment variables

Create an `.env` file based on the example file:

```
cp .env.example .env
```

Edit the `.env` file with your Signals connection credentials:

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="cdi" label="BDP" default>

```bash
NEXT_PUBLIC_SNOWPLOW_SIGNALS_API_URL=signals.snowplow.com
SNOWPLOW_SIGNALS_API_KEY=
SNOWPLOW_SIGNALS_API_KEY_ID=
SNOWPLOW_SIGNALS_ORGANIZATION_ID=
NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL=
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

If you plan to use the AI agent, add either an OpenAI API key (`OPENAI_API_KEY`) or an AWS Bearer token for Bedrock (`AWS_BEARER_TOKEN_BEDROCK`).

## Run the travel website

Run the following Docker command:

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="cdi" label="BDP" default>

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

## Test the website

Open the travel website in your browser at [http://localhost:8086](http://localhost:8086). You should see the homepage of the travel site.

Open your browser's developer console (Ctrl+Shift+I or equivalent) and go to the Snowplow Inspector tab. Generate some events by clicking on filters on the [destinations](http://localhost:8086/destinations) page. You should see self-describing events firing into your Snowplow pipeline.

Explore the site to get familiar with its features before you define the attributes in the next step.
