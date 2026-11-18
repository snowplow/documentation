---
title: "Snowplow CDI overview"
sidebar_position: 1
sidebar_label: "CDI overview"
description: "Snowplow CDI tracks behavioral data from your apps, validates and enriches it, and loads it into your warehouse, lake, or stream. Find the docs for each stage."
keywords: ["snowplow cdi", "customer data infrastructure", "behavioral data pipeline", "event tracking", "data warehouse"]
date: "2026-11-06"
content_type: landing
---

Snowplow Customer Data Infrastructure (CDI) is a pipeline for behavioral data. You define the [events](/docs/fundamentals/events/index.md) and [entities](/docs/fundamentals/entities/index.md) you want, trackers in your apps send them to a Collector, and the pipeline checks each event against its [schema](/docs/fundamentals/schemas/index.md), enriches it, and loads it into your warehouse, lake, or stream. Events that don't match their schema become [failed events](/docs/fundamentals/failed-events/index.md), so they aren't loaded and aren't lost.

Use CDI when you need event-level data you control: for product and marketing analytics, for a composable CDP, or as the source for [Signals](/docs/signals/introduction/index.md).

## Start here

You can start on a hosted environment that Snowplow provisions for you, with no infrastructure to deploy. The [free trial](/docs/get-started/free-trial/index.md) is 14 days of Snowplow CDI Cloud, and you usually receive access instructions within moments of verifying your email address. Once the environment exists, either hand the setup to your coding agent with the quickstart, or follow the steps yourself to track your first events and query them. When you're ready for production, see [Choose a Snowplow deployment](/docs/get-started/deployment-options/index.md).

<CardGrid cols={2}>
  <Card variant="quickstart" eyebrow="Quickstart" time="30 min" title="Quickstart with your coding agent" href="/docs/get-started/quickstart/" description="Get a hosted environment and send validated events from your app." />
  <Card title="Step by step" href="/docs/get-started/free-trial/" description="Get access to Console, track your first events, and query them." />
  <Card title="Already have data in your warehouse?" href="/docs/destinations/warehouses-lakes/querying-data/" description="Query the atomic events table, then build sessions and users tables with Unified Digital." />
  <Card title="Core concepts" href="/docs/fundamentals/" description="Events, entities, schemas, and how the pipeline processes them." />
</CardGrid>

Coming from Segment, Google Analytics, Adobe Analytics, or Mixpanel? See [Migrate from another tool](/docs/migration-guides/index.md).

## Explore by stage

The CDI sidebar follows the path an event takes, from design to data model. Each card opens the first page of a sidebar group.

<CardGrid cols={2}>
  <Card
    variant="product"
    headingLevel={3}
    title="Design tracking"
    href="/docs/event-studio/"
    description="Plan events and entities in Event Studio, and generate tracking code with Snowtype."
    links={[
      { label: 'Tracking plans', href: '/docs/event-studio/tracking-plans/' },
      { label: 'Data structures', href: '/docs/event-studio/data-structures/' },
      { label: 'Snowtype', href: '/docs/event-studio/implement-tracking/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Collect events"
    href="/docs/sources/"
    description="Trackers for web, mobile, server, and games, and webhooks for third-party tools."
    links={[
      { label: 'Compare trackers', href: '/docs/sources/#compare-trackers' },
      { label: 'Web trackers', href: '/docs/sources/web-trackers/' },
      { label: 'Built-in events and entities', href: '/docs/events/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Test your tracking"
    href="/docs/testing/"
    description="Check the events your tracking sends before they reach production."
    links={[
      { label: 'Snowplow Inspector', href: '/docs/testing/snowplow-inspector/' },
      { label: 'Snowplow Micro', href: '/docs/testing/snowplow-micro/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Enrich events"
    href="/docs/pipeline/enrichments/"
    description="Add data to events in the pipeline, such as location, parsed user agents, and campaign details, or mask personal data."
    links={[
      { label: 'Available enrichments', href: '/docs/pipeline/enrichments/available-enrichments/' },
      { label: 'IP anonymization', href: '/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Identities"
    href="/docs/identities/"
    description="Stitch a user's identifiers into one Snowplow ID in real time, across devices and logins."
    links={[
      { label: 'How merges work', href: '/docs/identities/concepts/merges/' },
      { label: 'Choose identifiers', href: '/docs/identities/configuration/choosing-identifiers/' },
      { label: 'Erase identity data', href: '/docs/identities/erasure/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Load and forward"
    href="/docs/destinations/"
    description="Load into warehouses and lakes, forward events to other tools, or stream them to your own targets."
    links={[
      { label: 'Destinations catalog', href: '/docs/destinations/#destinations-catalog' },
      { label: 'Warehouses and lakes', href: '/docs/destinations/warehouses-lakes/' },
      { label: 'Event forwarding', href: '/docs/destinations/forwarding-events/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Query and model data"
    href="/docs/destinations/warehouses-lakes/querying-data/"
    description="Query the atomic events table, and build sessions, users, and attribution tables with dbt packages."
    links={[
      { label: 'Atomic event fields', href: '/docs/fundamentals/canonical-event/' },
      { label: 'dbt packages', href: '/docs/modeling-your-data/modeling-your-data-with-dbt/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Monitor data quality"
    href="/docs/failed-events/"
    description="Find and fix failed events, and set up data quality alerts."
    links={[
      { label: 'See failed events in Console', href: '/docs/monitoring/' },
      { label: 'Alerts', href: '/docs/monitoring/alerts/' },
    ]}
  />
</CardGrid>

## Reference

Configuration options, API references, and component versions are in the Reference section, shared with Signals.

* [Tracker API reference](/docs/api-reference/trackers/index.md)
* [Component configuration](/docs/api-reference/index.md)
* [Versions and compatibility](/docs/api-reference/versions/index.md)
* [Tracker versions](/docs/api-reference/versions/index.md#trackers)
