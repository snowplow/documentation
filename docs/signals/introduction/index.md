---
title: "Snowplow Signals Documentation"
sidebar_label: "Introduction"
sidebar_position: 1
description: "Snowplow Signals is a real-time personalization engine that computes and acts on behavioral data from your pipeline. It enables in-session stream and historical user data access for personalized experiences, recommendations, and dynamic pricing."
keywords: ["real-time personalization", "customer intelligence", "behavioral data", "signals", "agentic applications"]
---

**Give your AI agents the context they need to act intelligently with Snowplow Signals**.

<CardGrid cols={2}>
  <CallToActionCard
    title="Get started with Signals"
    description="Try out Signals for free without a Snowplow account"
    href="https://try-signals.snowplow.io/"
  />

  <CallToActionCard
    title="Snowplow for Composable Analytics"
    description="Learn about the Customer Data Infrastructure that's the foundation for Signals"
    href="/docs/"
  />
</CardGrid>

## Explore Signals

<CardGrid cols={3} breakout>

  <FeaturedSection
    title="Attributes"
    description="Calculate user attributes in real time"
  >
    [Learn about attributes](/docs/signals/concepts/index.md#attribute-groups)
    [Define attributes](/docs/signals/attributes/attribute-groups/index.md)
    [Retrieve attributes](/docs/signals/attributes/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Interventions"
    description="Trigger actions automatically"
  >
    [Learn about interventions](/docs/signals/concepts/index.md#interventions)
    [Define interventions](/docs/signals/interventions/index.md)
    [Subscribe to interventions](/docs/signals/interventions/subscribe/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Signals Python SDK"
    description="Use Signals within a notebook"
  >
    [Connect to Signals](/docs/signals/connection/index.md#signals-python-sdk)
    [Define attributes](/docs/signals/attributes/using-python-sdk/index.md)
    [Define interventions](/docs/signals/interventions/using-python-sdk/index.md)
  </FeaturedSection>

</CardGrid>

## Get hands on with Signals

:::tip More resources

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
