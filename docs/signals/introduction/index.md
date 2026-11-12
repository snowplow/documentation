---
title: "Snowplow Signals overview"
sidebar_label: "Signals overview"
sidebar_position: 1
description: "Snowplow Signals computes attributes from your behavioral data in real time and serves them to your applications over an API. Use it for in-session personalization, customer-aware agents, real-time triggers, and machine learning features."
keywords: ["real-time customer context", "real-time personalization", "behavioral data", "signals", "agentic applications", "real-time feature store"]
content_type: landing
---

Snowplow Signals computes user attributes from your behavioral data in real time, and serves them to your applications over an API. Attributes are calculated from your Snowplow event stream as events arrive, or synced from tables in your warehouse.

Use Signals to:
* Personalize content, recommendations, and pricing based on what the user is doing in their current session
* Give chatbots and AI agents context about the user they're interacting with
* Trigger actions automatically when users meet criteria you define, such as offering a discount when a high-value cart is abandoned
* Serve up-to-date behavioral features to ML models, for use cases like lead scoring

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```

To see Signals working with your own data, follow the [quickstart](/docs/signals/quickstart/index.md). A coding agent asks what you want to build, then adds the tracking and Signals configuration to your web app. It uses the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and the Snowplow [skills](/docs/ai/skills/index.mdx), which you install in your coding agent with `npx plugins add snowplow/skills`. To do the same steps yourself in Console, follow the [step-by-step quickstart](/docs/signals/get-started/quickstart-tutorial/index.md).

## How Signals works

Signals reads the events your Snowplow pipeline collects, calculates attributes from them, and stores the latest values in the Profiles Store. Your application, agent, or model then reads the values, or Signals pushes a message to it when a user meets criteria you define.

![Signals component flow showing Snowplow events and batch sources feeding attribute groups, which are calculated into the Profiles Store and consumed by applications through services and interventions](../images/overview-components.svg)

The same flow, as steps:

1. A Snowplow tracker sends events from your app or website to your pipeline.
2. Signals evaluates each event against your published **attribute groups**, and updates the attribute values in the Profiles Store. Warehouse attribute groups sync pre-calculated values from your warehouse tables instead.
3. Your application reads the values it needs through a **service**, or an agent reads them through an **agentic context** or the Signals MCP server.
4. When updated values meet the criteria of an **intervention**, Signals pushes it to the applications that subscribe to it.

These are the components you configure:

* **Attribute**: a fact about user behavior, such as `product_view_count_last_10_min` or `first_mkt_source`. Attributes exist only inside attribute groups.
* **Attribute group**: a versioned set of attributes, with the data source they're calculated from and the attribute key they're calculated for.
* **Attribute key**: the identifier that attributes are calculated for, such as `domain_userid` for a user or `domain_sessionid` for a session.
* **Service**: a stable interface for applications, made of attribute groups pinned to specific versions.
* **Intervention**: an if-then rule on attribute values. When a user first meets the criteria, Signals sends the intervention to subscribed applications.
* **Agentic context**: a rolling record of a user's activity in the current session, up to 100 events or 1 hour, with a prompt, returned as JSON or a plain-language narrative.

[How Signals works](/docs/signals/concepts/index.md) covers each component in detail, and [pull and push](/docs/signals/concepts/pull-and-push/index.md) compares services with interventions.

## Requirements and interfaces

Signals runs alongside a Snowplow pipeline, and reads events from it:

* **Pipeline**: the [free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral) includes a hosted pipeline. Snowplow CDI Cloud and Private Managed Cloud customers deploy Signals from Console in the AWS region they choose, after their account team enables it. See [Set up Signals](/docs/signals/setup/index.md).
* **Data sources**: the real-time event stream, optionally backfilled from your warehouse, or pre-calculated values in warehouse tables. Snowflake, BigQuery, and Databricks are supported.
* **Defining configuration**: Console, the Python SDK, or the Snowplow MCP server.
* **Reading values**: the Python SDK (`snowplow-signals`), the Node.js SDK (`@snowplow/signals-node`), the Signals API over HTTP, and the Signals MCP server. The browser plugin subscribes to interventions.
* **Authentication**: a Snowplow API key. Use a key with the **View** permission to read attributes, and **Edit** to also create and publish configuration. Keep keys on the server.

## Retrieve attributes in your application

This example reads the attributes of a service called `my_service` for one user, identified by their `domain_userid`. Find the four connection values in Console, as described in [Connect to Signals](/docs/signals/connection/index.md).

<CodeGroup groupId="signals-sdk">

```typescript title="Node.js"
import { Signals } from '@snowplow/signals-node';

const signals = new Signals({
  baseUrl: SIGNALS_API_URL,
  apiKey: SNOWPLOW_API_KEY,
  apiKeyId: SNOWPLOW_API_KEY_ID,
  organizationId: SNOWPLOW_ORG_ID,
});

const attributes = await signals.getServiceAttributes({
  name: "my_service",
  attribute_key: "domain_userid",
  identifier: "218e8926-3858-431d-b2ed-66da03a1cbe5",
});
```

```python title="Python"
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=SIGNALS_API_URL,
    api_key=SNOWPLOW_API_KEY,
    api_key_id=SNOWPLOW_API_KEY_ID,
    org_id=SNOWPLOW_ORG_ID,
)

attributes = sp_signals.get_service_attributes(
    name="my_service",
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

</CodeGroup>

To define the service first, see [Services](/docs/signals/applications/services/index.md). [Retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) covers batch lookups, reading an attribute group directly, and the Signals API.

## Find the right page

Use this table to find the page for what you want to do:

| I want to | Page |
| --- | --- |
| Try Signals on my own web app | [Quickstart](/docs/signals/quickstart/index.md) |
| Enable Signals on an existing Snowplow CDI account | [Set up Signals](/docs/signals/setup/index.md) |
| Send events for Signals to calculate from | [Send events to Signals](/docs/signals/data-sources/events/index.md) |
| Calculate attributes from events or warehouse tables | [Define attributes](/docs/signals/attributes/index.md) |
| Read attributes in my application | [Services](/docs/signals/applications/services/index.md), then [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) |
| Ground an AI agent in the user's current session | [Define agentic contexts](/docs/signals/agentic-contexts/index.md) |
| Let an agent read Signals data as tools | [Signals MCP server](/docs/signals/applications/mcp-server/index.md) |
| React when a user meets criteria | [Define interventions](/docs/signals/interventions/index.md), then [subscribe to them](/docs/signals/applications/subscribe/index.md) |
| Build training data for an ML model | [Create ML training datasets](/docs/signals/ml-training-datasets/index.md) |

To manage Signals from a chat instead, connect your assistant to the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md), or use the [Snowplow Assistant](/docs/ai/console-agent/index.md) in Console.

## Try a tutorial

Each tutorial builds a working demo on top of Signals. [See all tutorials](/tutorials), or visit the [Developer Hub](https://snowplow.io/developer-hub/) for videos, blog posts, and workshops.

<CardGrid cols={3} breakout>
  <Card
    title="Build a personalized travel agent"
    description="Set up a demo travel site, and personalize content and chatbot responses based on user behavior."
    href="/tutorials/signals-personalize-travel/intro/"
  />
  <Card
    title="Train and serve a purchase propensity model"
    description="Build a training dataset from Signals attributes, train a model, and score live sessions."
    href="/tutorials/signals-ml-purchase-propensity/introduction/"
  />
  <Card
    title="Implement real-time interventions"
    description="Explore Signals interventions in a demo ecommerce app."
    href="/tutorials/signals-interventions/start/"
  />
</CardGrid>

For a comparison of Signals with feature stores, CDPs, and building the same thing in-house, see [Evaluate Signals](https://signals.snowplow.io/evaluate?utm_source=docs.snowplow.io&utm_medium=referral).
