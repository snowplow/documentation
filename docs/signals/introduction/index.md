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

To see Signals working with your own data, follow the [quickstart](/docs/signals/quickstart/index.md). A coding agent asks what you want to build, then adds the tracking and Signals configuration to your web app.

The quickstart uses the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) and the Snowplow [skills](/docs/ai/skills/index.mdx), which you install in your coding agent with `npx plugins add snowplow/skills`. Once connected, your assistant can also answer questions about your Signals setup, and create and publish attribute groups, services, and interventions as you describe them. To do this from Console instead, use the [Snowplow Assistant](/docs/ai/console-agent/index.md). See the [conversational Signals tutorial](/tutorials/signals-mcp/introduction) for a walkthrough.

## Choose your path

Signals serves the same attributes to both kinds of consumer. The path through the docs depends on what reads them.

<CardGrid cols={2}>
  <Card
    variant="product"
    headingLevel={3}
    eyebrow="For product and web teams"
    title="Personalize an app"
    href="/docs/signals/applications/"
    description="Change content, offers, or flows while the user is still in the session, based on what they've done."
    links={[
      { label: 'Define attribute groups', href: '/docs/signals/attributes/attribute-groups/' },
      { label: 'Group attributes into a service', href: '/docs/signals/applications/services/' },
      { label: 'Retrieve attributes in your app', href: '/docs/signals/applications/retrieve-attributes/' },
      { label: 'React to interventions', href: '/docs/signals/applications/subscribe/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    eyebrow="For AI and agent teams"
    title="Feed an AI agent"
    href="/docs/signals/agentic-contexts/"
    description="Ground a chatbot or agent in what the user is doing right now, as structured JSON or a short narrative."
    links={[
      { label: 'Define agentic contexts', href: '/docs/signals/agentic-contexts/' },
      { label: 'Retrieve agentic contexts', href: '/docs/signals/applications/agentic-contexts/' },
      { label: 'Serve attributes through the MCP server', href: '/docs/signals/applications/mcp-server/' },
      { label: 'Build an agent with Google ADK', href: '/tutorials/signals-google-adk-agent/introduction/' },
    ]}
  />
</CardGrid>

If you want features for a machine learning model instead, see [create ML training datasets](/docs/signals/ml-training-datasets/index.md).

## Explore Signals

The Signals sidebar follows the order you set Signals up in: set up and connect, send data, define attributes, serve them, then feed agents or trigger interventions.

<CardGrid cols={3} breakout>
  <Card
    variant="product"
    headingLevel={3}
    title="Attributes"
    href="/docs/signals/attributes/"
    description="Calculate user attributes in real time or from warehouse tables."
    links={[
      { label: 'How attributes work', href: '/docs/signals/concepts/#attribute-groups' },
      { label: 'Define attributes', href: '/docs/signals/attributes/' },
      { label: 'Retrieve attributes', href: '/docs/signals/applications/retrieve-attributes/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Interventions"
    href="/docs/signals/interventions/"
    description="Trigger actions automatically when a user meets your criteria."
    links={[
      { label: 'How interventions work', href: '/docs/signals/concepts/#interventions' },
      { label: 'Define interventions', href: '/docs/signals/interventions/' },
      { label: 'Subscribe to interventions', href: '/docs/signals/applications/subscribe/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="SDKs and API"
    href="/docs/signals/connection/"
    description="Connect to Signals from Python, Node.js, the browser, or over HTTP."
    links={[
      { label: 'Signals Python SDK', href: '/docs/signals/connection/reference/#python-sdk' },
      { label: 'Define attributes in code', href: '/docs/signals/attributes/' },
      { label: 'Define interventions in code', href: '/docs/signals/interventions/' },
    ]}
  />
</CardGrid>

## Try a tutorial

Each tutorial builds a working demo on top of Signals. Visit the [Developer Hub](https://snowplow.io/developer-hub/) for videos, blog posts, and workshops.

<CardGrid cols={3} breakout>
  <Card
    title="Build a personalized travel agent"
    description="Set up a demo travel site, and personalize content and chatbot responses based on user behavior."
    href="/tutorials/signals-personalize-travel/intro/"
  />
  <Card
    title="Score prospects in real time"
    description="Use Signals and a machine learning model for live prospect scoring."
    href="/tutorials/signals-ml-prospect-scoring/intro/"
  />
  <Card
    title="Implement real-time interventions"
    description="Explore Signals interventions in a demo ecommerce app."
    href="/tutorials/signals-interventions/start/"
  />
</CardGrid>

[See all tutorials](/tutorials). For a comparison of Signals with feature stores, CDPs, and building the same thing in-house, see [Evaluate Signals](https://signals.snowplow.io/evaluate?utm_source=docs.snowplow.io&utm_medium=referral).
