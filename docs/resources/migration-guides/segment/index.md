---
title: "Segment to Snowplow"
date: "2025-08-04"
sidebar_position: 0
---

This guide is to help technical implementers migrate from Segment to Snowplow.

## Platform differences

There are a [number of differences](https://snowplow.io/comparisons/snowplow-vs-segment) between Segment and Snowplow as a data platform. For migration, it's important to be aware of how Snowplow structures events differently from Segment. This affects how you'll implement tracking and how you'll model the warehouse data.

This table shows some key differences:

| Feature                 | Segment                                   | Snowplow                                                                                                                                                                    |
| ----------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capturing user behavior | Uses `track` events                       | Choose from the built-in event types, or use `trackSelfDescribingEvent` to track a custom [event](/docs/fundamentals/events/index.md)                                       |
| Contextual event data   | Included in the event `properties` object | Included in the event as reusable [entities](/docs/fundamentals/entities/index.md)                                                                                          |
| User identity           | Tracked separately as an `identify` event | Included in the event as a reusable entity                                                                                                                                  |
| Warehouse tables        | One table per custom event type           | In [most warehouses](/docs/destinations/warehouses-lakes/index.md), one big table with columns for every event or entity; in Redshift, one table per custom event or entity |
| Data validation         | Optional Tracking Plan                    | All events and entities defined by JSON schemas                                                                                                                             |

### Event structure

Segment's core method for tracking user behavior is `track`. Here's an example custom web ecommerce Segment event. The event name is `Transaction Completed`, describing the action taken. The properties object provides contextual information about the specific transaction, including an array of product objects:

```javascript
analytics.track('Transaction Completed', {
  transaction_id: 'T_12345',
  revenue: 99.99,
  currency: 'USD',
  products: [{
    id: 'ABC123',
    name: 'Widget',
    price: 99.99,
    quantity: 1
  }]
})
```

This event would be loaded into a `Transaction Completed` warehouse table. Analysts must `UNION` tables together to reconstruct user journeys.

To track the same behavior with Snowplow, you could use the [web ecommerce](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) `trackTransaction` event. The tracking code looks very similar:

```javascript
snowplow('trackTransaction', {
  transaction_id: 'T_12345',
  revenue: 99.99,
  currency: 'USD',
  products: [{
    id: 'ABC123',
    name: 'Widget',
    price: 99.99,
    quantity: 1
  }]
})
```

The differences are in the warehouse loading and data modeling:
* Snowplow processes this as a `transaction` [event](/docs/fundamentals/events/index.md) with one `product` [entity](/docs/fundamentals/entities/index.md)
* The Snowplow [tracker SDKs](/docs/sources/index.md) and pipeline add additional contextual entities to each event, for example information about the specific page or screen view, the user's session, or the browser
* In BigQuery or Snowflake, the event will be loaded into the single `atomic.events` table, with a column for the `transaction` event and a column for each entity
  * Columns have type `OBJECT` in Snowflake, and `REPEATED RECORD` in BigQuery
  * In Redshift, each event and entity is loaded into its own table

You can add the same `product` entity to any other relevant event, such as `add_to_cart` or `view_product`. This simplifies analysis of product lifecycles, from initial product view to purchase.

Snowplow tracker SDKs provide built-in methods for tracking page views and screen views, along with many other kinds of events. For example, button clicks, form submissions, page pings (activity), or media interactions. The additional entities added depend on which Snowplow SDK you're using, and which [enrichments](/docs/pipeline/enrichments/index.md) you've configured.

Snowplow provides out-of-the-box [dbt data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for initial modeling and common analytics use cases.

### Tracking comparison

This table shows how example Segment tracking calls could be mapped to Snowplow tracking:

| Segment API Call | Segment Example                                                 | Snowplow Implementation                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `track()`        | `track('Order Completed', {revenue: 99.99, currency: 'USD'})`   | Use one of the built-in event types, or define a custom `order_completed` schema containing `revenue` and `currency` properties, and track  `trackSelfDescribingEvent`.      |
| `page()`         | `page('Pricing')`                                               | Use `trackPageView`. The tracker SDK will automatically capture details such as `title` and `url`.                                                                           |
| `screen()`       | `screen('Home Screen')`                                         | Use `trackScreenView`.                                                                                                                                                       |
| `identify()`     | `identify('user123', {plan: 'pro', created_at: '2024-01-15'})`  | Call `setUserId('user123')` to track the ID in all events. Attach a custom `user` entity with schema containing `plan` and `created_at` properties.                          |
| `group()`        | `group('company-123', {name: 'Acme Corp', plan: 'Enterprise'})` | No direct equivalent. Attach a custom `group` entity to your events, or track group membership changes as custom events with `group_joined` or `group_updated` schemas.      |
| `alias()`        | `alias('new-user-id', 'anonymous-id')`                          | No direct equivalent. Track identity changes as custom events with `user_alias_created` schema. Use `setUserId` to update the current user identifier for subsequent events. |

### Data validation

You've presumably defined Tracking Plans for your Segment implementation. The suggested Segment approach for creating a Tracking Plan is to first track some events, then use those events as the basis for a template. You choose how to handle future validation failures: filter out events that don't match their specification, allow with warnings, or pass after autocorrecting minor issues. Using a Tracking Plan is optional.

Schematic event specification isn't optional for Snowplow. Every event and entity is defined by a [JSON schema](/docs/fundamentals/schemas/index.md), called a data structure. The data payload itself contains a reference to the specific data structure and version that defines it. The events are always validated as they're processed through the Snowplow pipeline, and events that fail validation are filtered out. There's no pass-with-warning or autocorrection feature.

Snowplow provides [monitoring](/docs/monitoring/index.md) and alerting for failed events. You can choose to load failed events into a separate table in your warehouse, or to analyze them in temporary buckets. This strict approach ensures high data quality.

Snowplow also provides event data management tools for defining and managing tracking plans. Each Snowplow [tracking plan](/docs/fundamentals/tracking-plans/index.md) contains a set of related event specifications. Each event specification has one event data structure, and any number of entity data structures.

You can use the Snowplow Console, API, or CLI to [define your tracking data structures](/docs/event-studio/tracking-plans/index.md). For each event you can specify when it should be tracked, and which entities should be added. Once you've defined your event specifications, use [Snowtype](/docs/event-studio/snowtype/index.md) to automatically generate the tracking code snippets.


## Migration phases

We recommend using a parallel-run migration approach. This process can be divided into three phases:
1. Assess and plan
2. Implement and validate
3. Cutover and finalize

### 1. Assess and plan

Your existing Segment Tracking Plans will serve as the foundations for your new Snowplow implementation. Before migration, we advise auditing your tracking calls and Tracking Plans. Are all the events and properties still relevant?

Start documenting all downstream data consumers, such as BI dashboards, dbt models, ML pipelines, or marketing automation workflows, that may need updating after migration.

Export your Tracking Plans using one of these methods:
* Programmatic API export (recommended): use the [Segment Public API](https://segment.com/docs/api/public-api/) to retrieve the full JSON definition of each Tracking Plan
* Manual CSV download: download a CSV file from the Segment UI for a less nested but potentially incomplete inventory of your events and properties
* Warehouse inference: if you no longer have access to your Segment account, you can infer the events and properties from your warehouse data

You'll need to translate your Segment Tracking Plans into Snowplow [tracking plans](/docs/fundamentals/tracking-plans/index.md). Some things to consider:
* Which platforms will you be tracking on? Different Snowplow tracker SDKs include different built-in event types. The [web](/docs/sources/web-trackers/index.md) and [native mobile](/docs/sources/mobile-trackers/index.md) trackers are the most fully featured.
* Which Tracking Plan events can be migrated to built-in Snowplow events, and which should be custom [self-describing events](/docs/fundamentals/events/index.md#self-describing-events)?
* Are there sets of event properties used in multiple places that could be defined as [entities](/docs/fundamentals/entities/index.md) instead?
* What's the best combination of event properties and entities to capture the same data as the non-`track` Segment events?

The goal is to create a set of JSON data structures for all your events and entities, organized into tracking plans and [event specifications](/docs/event-studio/event-specifications/index.md). The best way to import your new tracking plans into Snowplow is to use the [Snowplow CLI](/docs/event-studio/snowplow-cli/index.md).

:::info Snowplow CLI MCP server
The Snowplow CLI includes an [MCP server](/docs/event-studio/snowplow-cli/index.md#mcp-server) to help you translate your Segment Tracking Plans into Snowplow tracking plans.
:::

In this phase, you'll also need to decide what to do with historical data. There are two main choices:
* Coexistence: leave historical Segment data in existing tables. Write queries that `UNION` data from both systems, using a transformation layer (for example, in dbt) to create compatible structures.
* Unification: transform and backfill historical Segment data into the Snowplow format. This requires a custom engineering project to export Segment data, reshape it into the Snowplow enriched event format, and load it into the warehouse. The result is a unified historical dataset.

### 2. Implement and validate

This phase involves three main tasks:
* Set up your Snowplow infrastructure
* Implement and test your new tracking plan
* Set up data models

Follow the [Snowplow CDI getting started instructions](/docs/get-started/private-managed-cloud/index.md) to set up your Snowplow infrastructure.

If you haven't done this yet, use the [Snowplow CLI](/docs/event-studio/snowplow-cli/index.md) to import your new tracking plans into Snowplow. You can also inspect and edit tracking plans using the Snowplow Console. They'll be available to the Snowplow pipeline for data validation on publishing.
Use the Snowplow CLI or Console to publish.

Add Snowplow tracking in parallel with your existing Segment tracking:
* If you have a web platform, we recommend starting here
  * The [Snowplow Inspector browser extension](/docs/testing/snowplow-inspector/index.md) is a useful manual testing tool
  * Start with non-critical pages or features
* Implement a tracker SDK, and track a small number of built-in events, such as [page views](/docs/sources/web-trackers/quick-start-guide/index.md)
  * Use the Snowplow Inspector to confirm that the tracker is generating the expected events
  * Use [Snowplow Micro](/docs/testing/snowplow-micro/index.md) to test and validate locally
  * Finally, confirm that the tracker can also send events to your warehouse
* Use [Snowtype](/docs/event-studio/snowtype/index.md) to generate custom tracking code for your tracking plans
* Test and validate your custom tracking using Micro as before
* Gradually continue this process until you have a complete Segment and Snowplow dual tracking implementation
* Gradually roll out tracking to production

:::info Snowplow Micro
[Snowplow Micro](/docs/testing/snowplow-micro/index.md) is a Dockerized local pipeline. It uses the same schema registry as your production pipeline, allowing developers to quickly confirm that the tracked events are valid.
:::

Use the Snowplow data quality [monitoring tools](/docs/monitoring/index.md) for confidence in your tracking implementation.

Set up your analytics:
* Configure the Snowplow [dbt models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for initial modeling
* Update your existing data models to handle the new data structures
* Create queries to reconcile your old and new data
* Compare high-level metrics between systems e.g. daily event counts, or unique users

By the end of this phase, you'll have a validated Snowplow implementation that recreates your Segment tracking and modeling. The goal is to be confident that the new Snowplow pipeline is capturing all critical business logic correctly.

### 3. Cutover and finalize

In the final phase, you'll update downstream data consumers, and decommission Segment.

Use Snowplow [event forwarding](/docs/destinations/forwarding-events/index.md) to integrate with third-party destinations. Update all your data consumers to query the new Snowplow data tables.

Remove the Segment tracking from your codebases. Keep the Segment sources active for a short time as a final fallback before fully decommissioning. Finally, close your Segment account.
