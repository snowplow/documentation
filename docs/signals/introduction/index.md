---
title: "Snowplow Signals Documentation"
sidebar_label: "Introduction"
sidebar_position: 1
description: "Snowplow Signals computes attributes from your behavioral data in real time and serves them to your applications over an API. Use it for in-session personalization, customer-aware agents, real-time triggers, and machine learning features."
keywords: ["real-time customer context", "real-time personalization", "behavioral data", "signals", "agentic applications", "real-time feature store"]
---

Snowplow Signals computes user attributes from your behavioral data in real time, and serves them to your applications over an API. Attributes are calculated from your Snowplow event stream as events arrive, or synced from tables in your warehouse.

Use Signals to:
* Personalize content, recommendations, and pricing based on what the user is doing in their current session
* Give chatbots and AI agents context about the user they're interacting with
* Trigger actions automatically when users meet criteria you define, such as offering a discount when a high-value cart is abandoned
* Serve up-to-date behavioral features to ML models, for use cases like lead scoring

```mdx-code-block
import SignalsTrial from "@site/docs/reusable/signals-trial/_index.md"

<SignalsTrial/>
```

## Explore Signals

<CardGrid cols={3} breakout>

  <FeaturedSection
    title="Attributes"
    description="Calculate user attributes in real time"
  >
    [Learn about attributes](/docs/signals/concepts/index.md#attribute-groups)
    [Define attributes](/docs/signals/attributes/index.md)
    [Retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Interventions"
    description="Trigger actions automatically"
  >
    [Learn about interventions](/docs/signals/concepts/index.md#interventions)
    [Define interventions](/docs/signals/interventions/index.md)
    [Subscribe to interventions](/docs/signals/applications/subscribe/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Signals Python SDK"
    description="Use Signals within a notebook"
  >
    [Connect to Signals](/docs/signals/connection/index.md#signals-python-sdk)
    [Define attributes](/docs/signals/attributes/index.md)
    [Define interventions](/docs/signals/interventions/index.md)
  </FeaturedSection>

</CardGrid>

## Get hands on with Signals

:::tip[More resources]

Visit our [Developer Hub](https://snowplow.io/developer-hub/) for demo videos, blog posts, workshops, and more.

:::

<CardGrid cols={3} breakout>
  <LinkCard
    title="Build a personalized travel agent"
    description="Set up a demo travel site, and integrate with Snowplow Signals to personalize content and chatbot responses based on user behavior"
    href="/tutorials/signals-personalize-travel/intro/"
  />

  <LinkCard
    title="Score prospects in real time using Signals and ML"
    description="Try out Signals for live prospect scoring with machine learning"
    href="/tutorials/signals-ml-prospect-scoring/intro/"
  />

  <LinkCard
    title="Implement real-time interventions in an ecommerce app"
    description="Explore Signals interventions in a demo e-shop application"
    href="/tutorials/signals-interventions/start/"
  />
</CardGrid>

[See all tutorials ->](/tutorials)

For a comparison of Signals with feature stores, CDPs, and building the same thing in-house, see [Evaluate Signals](https://signals.snowplow.io/evaluate).
