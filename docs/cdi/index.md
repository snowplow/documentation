---
title: "Snowplow CDI overview"
sidebar_position: 1
sidebar_label: "CDI overview"
description: "Snowplow CDI tracks behavioral data from your apps, validates it against your schemas, enriches it, and loads it into your warehouse, lake, or stream. Find the docs for each stage."
keywords: ["snowplow cdi", "customer data infrastructure", "behavioral data pipeline", "event tracking", "data warehouse"]
date: "2026-11-06"
content_type: landing
---

Snowplow Customer Data Infrastructure (CDI) is a pipeline for behavioral data. You define the [events](/docs/fundamentals/events/index.md) and [entities](/docs/fundamentals/entities/index.md) you want, trackers in your apps send them to a Collector, and the pipeline checks each event against its [schema](/docs/fundamentals/schemas/index.md), enriches it, and loads it into your warehouse, lake, or stream. Events that don't match their schema become [failed events](/docs/fundamentals/failed-events/index.md), so they aren't loaded and aren't lost.

Use CDI when you need event-level data you control: for product and marketing analytics, for a composable CDP, or as the source for [Signals](/docs/signals/introduction/index.md).

## Start here

Most teams start on a hosted environment, then choose a deployment for production. The quickstart sets up tracking, schemas, and a first data load with your coding agent.

<CardGrid cols={3}>
  <Card variant="quickstart" eyebrow="Quickstart" time="30 min" title="Quickstart with your coding agent" href="/docs/get-started/quickstart/" description="Get a hosted environment and send validated events from your app." />
  <Card title="First steps" href="/docs/get-started/" description="Start a trial, then compare Cloud, Private Managed Cloud, and Self-Hosted." />
  <Card title="Fundamentals" href="/docs/fundamentals/" description="Events, entities, schemas, and how the pipeline processes them." />
</CardGrid>

## Explore by stage

The CDI sidebar follows the path an event takes, from design to data model. Each card opens the first page of a sidebar group.

<CardGrid cols={3}>
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
    title="Validate and enrich"
    href="/docs/pipeline/"
    description="Configure the Collector and enrichments, and test tracking before it reaches production."
    links={[
      { label: 'Enrichments', href: '/docs/pipeline/enrichments/' },
      { label: 'Snowplow Micro', href: '/docs/testing/snowplow-micro/' },
      { label: 'Collector', href: '/docs/pipeline/collector/' },
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
    title="Model and unify"
    href="/docs/modeling-your-data/"
    description="Build sessions, users, and attribution tables with dbt packages, and stitch identities."
    links={[
      { label: 'dbt packages', href: '/docs/modeling-your-data/modeling-your-data-with-dbt/' },
      { label: 'Identities', href: '/docs/identities/' },
    ]}
  />
  <Card
    variant="product"
    headingLevel={3}
    title="Monitor and operate"
    href="/docs/monitoring/"
    description="Find and fix failed events, and set up data quality alerts."
    links={[
      { label: 'Explore failed events', href: '/docs/monitoring/exploring-failed-events/' },
      { label: 'Alerts', href: '/docs/monitoring/alerts/' },
    ]}
  />
</CardGrid>

## Reference

Configuration options, API references, and component versions are in the Reference section, shared with Signals.

* [Tracker API reference](/docs/api-reference/trackers/index.md)
* [Component configuration](/docs/api-reference/index.md)
* [Versions and compatibility](/docs/api-reference/versions/index.md)
