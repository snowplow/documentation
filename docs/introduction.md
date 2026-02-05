---
title: "Snowplow for Analytics Documentation"
slug: "/"
sidebar_position: 0
sidebar_label: "Introduction"
description: "Snowplow CDI delivers validated, enriched event-level data to your warehouse, lake, or stream in real time. Define custom events with flexible schemas and distinguish AI agent traffic from human visitors."
keywords: ["customer data infrastructure", "cdi", "behavioral data", "event-level data", "composable analytics", "data warehouse"]
custom_edit_url: null
pagination_next: null
is_landing_page: true
---

<head>
  <meta name='zd-site-verification' content='fly2zzu1qcv51s1ma9jds' />
</head>

**Deliver validated, enriched event data to your warehouse, lake, or stream in real time with Snowplow**.

<CardGrid cols={2}>
  <CallToActionCard
    title="Get started with Snowplow CDI"
    description="Choose to run Snowplow in your cloud or ours"
    href="/docs/get-started"
  />

  <CallToActionCard
    title="Snowplow for Agentic AI"
    description="Real-time customer context for your AI agents and applications"
    href="/docs/signals"
  />
</CardGrid>

## Explore Snowplow

<CardGrid cols={3} breakout>
  <FeaturedSection
    title="Fundamentals"
    description="Learn about core Snowplow concepts"
    href="/docs/fundamentals"
  >
    [Events](/docs/fundamentals/events/index.md)
    [Entities](/docs/fundamentals/entities/index.md)
    [Schemas](/docs/fundamentals/schemas/index.md)
    [Atomic event fields reference](/docs/fundamentals/canonical-event/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Event collection"
    description="Manage your tracking"
    href="/docs/event-studio"
  >
    [Tracking plans](/docs/event-studio/tracking-plans/index.md)
    [Source applications](/docs/event-studio/source-applications/index.md)
    [Create a data structure](/docs/event-studio/data-structures/manage/index.md)
    [Snowtype](/docs/event-studio/snowtype/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Destinations"
    description="Send data to warehouses, lakes, and third-party tools"
    href="/docs/destinations"
  >
    [Warehouse and lake destinations](/docs/destinations/warehouses-lakes/index.md)
    [Event forwarding](/docs/destinations/forwarding-events/index.md)
    [Google Tag Manager Server-Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md)
    [How to query Snowplow data](/docs/destinations/warehouses-lakes/querying-data/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Trackers"
    description="Instrument 20+ SDKs for web, mobile, and servers"
    href="/docs/sources"
  >
    [Get started on web](/docs/sources/web-trackers/tracker-setup/index.md)
    [Track page views on web](/docs/sources/web-trackers/tracking-events/page-views/index.md)
    [Get started on mobile](/docs/sources/mobile-trackers/installation-and-set-up/index.md)
    [Track screen views on mobile](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Pipeline"
    description="Configure your Collector and enrichments"
    href="/docs/pipeline"
  >
    [Collector](/docs/pipeline/collector/index.md)
    [Enrichments](/docs/pipeline/enrichments/index.md)
    [IP Lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md)
    [Campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md)
  </FeaturedSection>

  <FeaturedSection
    title="Data modeling"
    description="Transform raw events into analytics-ready tables"
    href="/docs/modeling-your-data"
  >
    [Unified Digital dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md)
    [Attribution dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md)
    [Incremental processing logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md)
    [Identity stitching](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/identity-stitching/index.md)
  </FeaturedSection>

</CardGrid>

## Build with Snowplow

<CardGrid cols={3} breakout>
  <LinkCard
    title="Implement an abandoned browse system with composable CDP"
    description="Engage with customers that show intent to purchase but leave without buying"
    href="/tutorials/abandoned-browse-ccdp/introduction"
  />

  <LinkCard
    title="Set up the Unified Digital dbt package"
    description="Transform your raw web and mobile event data into derived tables"
    href="/tutorials/unified-digital/intro"
  />

  <LinkCard
    title="Use the Snowplow CLI MCP tool"
    description="Let Claude or other MCP clients help with your data structure management"
    href="/tutorials/snowplow-cli-mcp/introduction"
  />
</CardGrid>

[See all tutorials](/tutorials)
