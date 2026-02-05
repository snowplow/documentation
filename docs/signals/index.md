---
title: "Snowplow for Agentic AI Documentation"
sidebar_position: 8
description: "Snowplow Signals streams enriched user context to AI agents and applications in real time. Integrate with LangChain, Bedrock, Vertex AI, and Vercel to ground agent responses in governed customer data."
keywords: ["real-time personalization", "agentic ai", "customer context", "signals", "langchain", "ai agents"]
sidebar_label: "Introduction"
custom_edit_url: null
pagination_next: null
pagination_prev: null
is_landing_page: true
---

**Give your AI agents the context they need to act intelligently with Snowplow Signals**.

<CardGrid cols={2}>
  <CallToActionCard
    title="Get started with Signals"
    description="Try out Signals for free without a Snowplow account"
    href="https://try-signals.snowplow.io"
  />

  <CallToActionCard
    title="Snowplow for Composable Analytics"
    description="Learn more about the Customer Data Infrastructure that's the foundation for Signals"
    href="/docs"
  />
</CardGrid>

## Explore Signals

<CardGrid cols={3} breakout>

  <FeaturedSection
    title="Attributes"
    description="Calculate user attributes in real time"
  >
    [Learn about attributes](/docs/signals/concepts/attributes/index.md)
    [Define attributes](/docs/signals/define-attributes/index.md)
    [Retrieve attributes](/docs/signals/retrieve-attributes/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Interventions"
    description="Trigger actions automatically"
  >
    [Learn about interventions](/docs/signals/concepts/interventions/index.md)
    [Define interventions](/docs/signals/define-interventions/index.md)
    [Subscribe to interventions](/docs/signals/receive-interventions/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Signals Python SDK"
    description="Use Signals within a notebook"
  >
    [Define attributes](/docs/signals/define-attributes/using-python-sdk/index.md)
    [Define interventions](/docs/signals/define-interventions/using-python-sdk/index.md)
    [Subscribe to interventions](/docs/signals/receive-interventions/index.md#using-the-signals-python-sdk)
  </FeaturedSection>

</CardGrid>

## Get hands on with Signals

<CardGrid cols={3} breakout>
  <LinkCard
    title="Build a personalized travel agent"
    description="Set up a demo travel site, and integrate with Snowplow Signals to personalize content and chatbot responses based on user behavior"
    href="/tutorials/signals-personalize-travel/intro"
  />

  <LinkCard
    title="Score prospects in real time using Signals and ML"
    description="Try out Signals for live prospect scoring with machine learning"
    href="/tutorials/signals-ml-prospect-scoring/intro"
  />

  <LinkCard
    title="Implement real-time interventions in an ecommerce app"
    description="Explore Signals interventions in a demo e-shop application"
    href="/tutorials/signals-interventions/start/"
  />
</CardGrid>

[See all tutorials](/tutorials)
