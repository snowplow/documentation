---
title: "Snowplow documentation"
slug: "/"
layout: home
displayed_sidebar: null
hide_table_of_contents: true
sidebar_position: 0
sidebar_label: "Docs home"
description: "Documentation for Snowplow CDI, which collects, validates, and models behavioral data in your own cloud, and Snowplow Signals, which serves real-time attributes to applications and AI agents."
keywords: ["customer data infrastructure", "cdi", "behavioral data", "event-level data", "real-time personalization", "signals", "coding agent"]
pagination_next: null
pagination_prev: null
---

import { HomeSearch, Quickstarts } from '@site/src/components/home'

<div className="home-hero breakout">
<div className="home-hero__intro">

Snowplow CDI collects, validates, and models behavioral data from your apps, and delivers it to your warehouse, lake, or stream. Signals calculates attributes from that data in real time and serves them to your applications and AI agents.

<HomeSearch />

<p className="home-hero__note">Using a coding agent? <a href="/docs/ai/#connect-your-coding-agent">Connect it to the docs</a>.</p>

</div>
<div className="home-hero__agent">

<p className="home-hero__agent-title">Evaluating or running Snowplow?</p>

* [How the pipeline works](/docs/fundamentals/index.md)
* [Deployment options](/docs/get-started/deployment-options/index.md)
* [Try Snowplow free](/docs/get-started/free-trial/index.md)
* [Coming from Segment, GA, Adobe, or Mixpanel](/docs/migration-guides/index.md)

</div>
</div>

## Choose a product

Both products use the same events, entities, and schemas, so you can start with either.

<CardGrid cols={2} breakout>
  <Card
    variant="product"
    eyebrow="Customer data infrastructure"
    title="Snowplow CDI"
    href="/docs/cdi/"
    headingLevel={3}
    description="Track events from any platform, validate them against your schemas, load them into your warehouse, and model them into tables for analysis."
    links={[
      { label: 'Quickstart', href: '/docs/get-started/quickstart/' },
      { label: 'Trackers and SDKs', href: '/docs/sources/' },
    ]}
  >

```js
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
newTracker('sp', '{{collector_url}}', { appId: 'my-app' });
trackPageView();
```

  </Card>
  <Card
    variant="product"
    eyebrow="Real-time customer context"
    title="Signals"
    href="/docs/signals/introduction/"
    headingLevel={3}
    description="Calculate user attributes as events arrive, and read them from your app or agent with one API call."
    links={[
      { label: 'Quickstart', href: '/docs/signals/quickstart/' },
      { label: 'Connect with the SDKs', href: '/docs/signals/connection/' },
    ]}
  >

```ts
import { Signals } from '@snowplow/signals-node';
const signals = new Signals({ baseUrl, apiKey, apiKeyId, organizationId });
const attributes = await signals.getServiceAttributes({ name: 'my_service', attribute_key: 'domain_userid', identifier });
```

  </Card>
</CardGrid>

Deploying or administering Snowplow? See the [platform overview](/docs/platform/index.md).

## Find a task

If you know what you want to do, start from the page in this table.

| I want to                                           | Start here                                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Add tracking to a website                           | [Set up the web tracker](/docs/sources/web-trackers/tracker-setup/index.md)                                 |
| Add tracking to a mobile app                        | [Set up the mobile trackers](/docs/sources/mobile-trackers/installation-and-set-up/index.md)                |
| Define a custom event                               | [Create a data structure](/docs/event-studio/data-structures/index.md)                                       |
| Find out why events failed validation               | [See failed events in Console](/docs/monitoring/index.md)                                   |
| Test tracking on my machine                         | [Run Snowplow Micro locally](/docs/testing/snowplow-micro/local/index.md)                                    |
| Load events into Snowflake, BigQuery, or Databricks | [Warehouse and lake destinations](/docs/destinations/warehouses-lakes/index.md)                              |
| Build sessions and users tables                     | [Unified Digital dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) |
| Give an AI agent real-time context about a user     | [Choose how to feed an agent](/docs/signals/applications/index.md)                                           |
| Check which component versions I need               | [Versions and compatibility](/docs/api-reference/versions/index.md)                                          |

## Start with a quickstart

Each quickstart ends with events or attributes you can see. Times assume you have the prerequisites listed on the page.

<Quickstarts />
