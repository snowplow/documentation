---
title: "Migrate from Mixpanel to Snowplow"
date: "2025-01-09"
sidebar_position: 5
sidebar_label: "Mixpanel to Snowplow"
description: "Migrate from Mixpanel to Snowplow with guidance on event tracking, user profiles, super properties, and warehouse modeling."
keywords: ["mixpanel", "migration", "tracking plan", "user profiles", "super properties", "event tracking"]
---

This guide is to help technical implementers migrate from Mixpanel to Snowplow.

## Platform differences

There are significant differences between Mixpanel and Snowplow as data platforms. For migration, it's important to be aware of how Snowplow structures events differently from Mixpanel. This affects how you'll implement tracking and how you'll model the warehouse data.

This table shows some key differences:

| Feature                 | Mixpanel                                                                   | Snowplow                                                                                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capturing user behavior | Tracked as named events with properties                                    | Tracked as structured events with built-in types or custom [events](/docs/fundamentals/events/index.md) with validated schemas                                              |
| Contextual event data   | Attached as properties within the event                                    | Attached as separate reusable [entities](/docs/fundamentals/entities/index.md)                                                                                              |
| User and group data     | Tracked separately                                                         | Attached to events as part of the event payload or as reusable entities                                                                                                     |
| Warehouse tables        | Events in single or per-event-type tables; user profiles in separate table | In [most warehouses](/docs/destinations/warehouses-lakes/index.md), one big table with columns for every event or entity; in Redshift, one table per custom event or entity |
| Data validation         | Optional Tracking Plans                                                    | All events and entities defined by JSON schemas                                                                                                                             |

### Event structure

Mixpanel tracks user behavior with `track()`. Here's an example custom web ecommerce Mixpanel event. The event name is `Product Purchased`, describing the action taken. The properties object provides contextual information about the specific purchase:

```javascript
mixpanel.track('Product Purchased', {
  product_id: 'SKU_123',
  product_name: 'Widget',
  price: 49.95,
  quantity: 2,
  category: 'Electronics'
});
```

This event loads into Mixpanel's events warehouse table with properties as columns. The table structure depends on your Mixpanel warehouse export configuration.

To track the same behavior with Snowplow, you could use the [web ecommerce](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) `trackTransaction` event. Alternatively, you could define a custom `product_purchased` schema and track it as a [self-describing event](/docs/fundamentals/events/index.md#self-describing-events):

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme/product_purchased/jsonschema/1-0-0',
    data: {
      product_id: 'SKU_123',
      product_name: 'Widget',
      price: 49.95,
      quantity: 2,
      category: 'Electronics'
    }
  }
});
```

The differences are in the warehouse loading and data modeling:
* Snowplow processes this as a self-describing [event](/docs/fundamentals/events/index.md) with validated [schema](/docs/fundamentals/schemas/index.md)
* The Snowplow [tracker SDKs](/docs/sources/index.md) and pipeline add additional contextual entities to each event, for example information about the specific page or screen view, the user's session, or the browser
* In BigQuery, Databricks, or Snowflake, the event will be loaded into the single `atomic.events` table, with a column for each entity
  * Columns have type `OBJECT` in Snowflake, and `REPEATED RECORD` in BigQuery
  * In Redshift, each event and entity is loaded into its own table

Snowplow tracker SDKs provide built-in methods for tracking page views and screen views, along with many other kinds of events. The additional entities added depend on which Snowplow SDK you're using, and which [enrichments](/docs/pipeline/enrichments/index.md) you've configured.

Snowplow provides out-of-the-box [dbt data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for initial modeling and common analytics use cases.

### Events and users

Mixpanel separates timestamped events from persistent user profiles. Events capture actions with timestamps, while user profiles store persistent attributes like name, email, or subscription tier. Here's the Mixpanel pattern:

```javascript
// Track event
mixpanel.track('Page Viewed');

// Set user profile properties
mixpanel.people.set({
  'name': 'Jane Doe',
  'email': 'jane@example.com',
  'plan': 'Premium'
});
```

In Mixpanel, events and user profiles are typically stored in separate tables. Analysts must join these tables to analyze user behavior with profile attributes.

There's no separate user profile system in Snowplow. You can set a user identifier as part of every event, and attach user attribute entities to events as needed:

```javascript
// Set user ID
snowplow('setUserId', 'user_123');

// Track event with user context entity
snowplow('trackPageView', {
  context: [{
    schema: 'iglu:com.acme/user/jsonschema/1-0-0',
    data: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      plan: 'Premium'
    }
  }]
});
```

This event-centric approach means you can reconstruct user state from the events in the warehouse. This provides a complete audit trail of all attribute changes over time.


### Super properties

In Mixpanel, super properties are event properties that are automatically attached to every event you track. They're used to capture contextual information that applies across all events, such as user plan type, app version, or environment.

```javascript
// Register super properties in Mixpanel
mixpanel.register({
  app_version: '2.1.0',
  environment: 'production',
  user_plan: 'premium'
});

// All subsequent events include these properties
mixpanel.track('Page Viewed');
mixpanel.track('Image Expanded');
```

There's no direct Snowplow equivalent to super properties. Instead, you attach "global context" [entities](/docs/fundamentals/entities/index.md) to every event. This approach provides the same functionality with stronger typing and validation through schemas.

Here's how to implement the same pattern with the [JavaScript tracker](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md):

```javascript
// Define your global context entity
const appContext = {
  schema: 'iglu:com.acme/app_context/jsonschema/1-0-0',
  data: {
    app_version: '2.1.0',
    environment: 'production',
    user_plan: 'premium'
  }
};

// Add as global context - attached to all events
snowplow('addGlobalContexts', [appContext]);

// All subsequent events include this entity
snowplow('trackPageView');
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme/image_expanded/jsonschema/1-0-0',
    data: { button_id: 'submit' }
  }
});
```

You can also update the global context properties dynamically during runtime. This is useful when values change during the session.

### Tracking comparison

This table shows how example Mixpanel tracking calls could be mapped to Snowplow tracking:

| Mixpanel API Call      | Mixpanel Example                                                         | Snowplow Implementation                                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `track()`              | `mixpanel.track('Order Completed', {revenue: 99.99})`                    | Use one of the built-in event types, or define a custom `order_completed` schema containing `revenue` property and track with `trackSelfDescribingEvent`.                     |
| `identify()`           | `mixpanel.identify('user_123')`                                          | Use `setUserId('user_123')` to set user ID for all subsequent events.                                                                                                         |
| `alias()`              | `mixpanel.alias('user_123', 'anon_456')`                                 | No direct equivalent. Track identity changes as custom events with `user_alias_created` schema if needed for analysis. Use `setUserId` to update the current user identifier. |
| `register()`           | `mixpanel.register({plan: 'premium'})`                                   | Attach as entities to all events.                                                                                                                                             |
| `.people.set()`        | `mixpanel.people.set({email: 'user@example.com'})`                       | Attach custom user entities to events.                                                                                                                                        |
| `.people.increment()`  | `mixpanel.people.increment('page_views')`                                | No direct equivalent. Track events and calculate aggregates in warehouse.                                                                                                     |
| `.track_with_groups()` | `mixpanel.track_with_groups('Button Clicked', {groupId: 'company-123'})` | Attach custom group entities to events containing group identifiers and relevant group properties.                                                                            |
| `reset()`              | `mixpanel.reset()`                                                       | Clear user ID with `setUserId(null)` or equivalent, depending on tracker. The tracker will generate a new anonymous identifier.                                               |

### Data validation

You've presumably defined Tracking Plans for your Mixpanel implementation. The suggested Mixpanel approach is to create and maintain an external spreadsheet of events and properties to track. Within Mixpanel, the Lexicon feature allows you to manage definitions, and hide or drop events. There's no built-in validation of tracked events.

Snowplow requires schematic specification for all data. Every event and entity is defined by a [JSON schema](/docs/fundamentals/schemas/index.md), called a data structure. The data payload itself contains a reference to the specific data structure and version that defines it. The events are always validated as they're processed through the Snowplow pipeline, and events that fail validation are filtered out.

To help maintain high data quality, Snowplow provides [monitoring](/docs/monitoring/index.md) and alerting for failed events. You can choose to load failed events into a separate table in your warehouse, or to analyze them in temporary buckets.

Snowplow includes in-product management and tools for [tracking plans](/docs/fundamentals/data-products/index.md). Each tracking plan contains a set of related event specifications. Each event specification has one event data structure, and any number of entity data structures.

You can use the Snowplow Console, API, or CLI to [define your tracking data structures](/docs/data-product-studio/data-products/index.md). For each event you can specify when it should be tracked, and which entities should be added. Once you've defined your event specifications, use [Snowtype](/docs/data-product-studio/snowtype/index.md) to automatically generate the tracking code snippets.

:::info Snowplow CLI MCP server
The Snowplow CLI includes an [MCP server](/docs/data-product-studio/mcp-server/index.md) to help you translate your Mixpanel Tracking Plans into Snowplow tracking plans.
:::

## Migration phases

Use a parallel-run migration approach. This process can be divided into three phases:
1. Assess and plan
2. Implement and validate
3. Cutover and finalize

### 1. Assess and plan

Use your existing Mixpanel Tracking Plans as the foundation for your new Snowplow implementation. Before migration, audit your tracking calls and Tracking Plans. Are all the events and properties still relevant?

Start documenting all downstream data consumers, such as BI dashboards, dbt models, ML pipelines, or marketing automation workflows, that may need updating after migration.

Export your Tracking Plans using one of these methods:
* Programmatic API export (recommended): use the [Mixpanel Public API](https://developer.mixpanel.com/reference/overview) to retrieve the full definition of each Tracking Plan
* Manual CSV download: download a CSV file from the Mixpanel UI for a less detailed but quick inventory of your events and properties
* Warehouse inference: if you no longer have access to your Mixpanel account, you can infer the events and properties from your warehouse data

You'll need to translate your Mixpanel Tracking Plans into Snowplow [tracking plans](/docs/fundamentals/data-products/index.md). Some things to consider:
* Which platforms will you be tracking on? Different Snowplow tracker SDKs include different built-in event types. The [web](/docs/sources/web-trackers/index.md) and [native mobile](/docs/sources/mobile-trackers/index.md) trackers are the most fully featured.
* Which Tracking Plan events can be migrated to built-in Snowplow events, and which should be custom [self-describing events](/docs/fundamentals/events/index.md#self-describing-events)?
* How should you migrate Mixpanel super properties? These are typically best represented as global context [entities](/docs/fundamentals/entities/index.md) that are attached to all events.
* Which user profile properties should be captured as user entities? You might not need to attach user entities to every event, only those where the user context is relevant for analysis.
* Which events use group analytics? You'll need to define group entities for these.
* Are there sets of event properties used in multiple places that could be defined as reusable entities instead?

The goal is to create a set of JSON data structures for all your events and entities, organized into tracking plans and [event specifications](/docs/data-product-studio/event-specifications/index.md). The best way to import your new tracking plan tracking plans into Snowplow is to use the [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md).

In this phase, you'll also need to decide what to do with historical data. There are two main choices:
* Coexistence: leave historical Mixpanel data in existing tables. Write queries that combine data from both systems, using a transformation layer (for example, in dbt) to create compatible structures.
* Unification: transform and backfill historical Mixpanel data into the Snowplow format. This requires a custom engineering project to export Mixpanel data, reshape it into the Snowplow enriched event format, and load it into the warehouse. The result is a unified historical dataset. Note that this is more complex for Mixpanel than other platforms due to the separation of events and user profiles.

### 2. Implement and validate

This phase involves three main tasks:
* Set up your Snowplow infrastructure
* Implement and test your new tracking plan
* Set up data models

Follow the [Snowplow CDI getting started instructions](/docs/get-started/private-managed-cloud/index.md) to set up your Snowplow infrastructure.

If you haven't done this yet, use the [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) to import your new tracking plans into Snowplow. You can also inspect and edit tracking plans using the Snowplow Console. They'll be available to the Snowplow pipeline for data validation on publishing. Use the Snowplow CLI or Console to publish.

Add Snowplow tracking in parallel with your existing Mixpanel tracking:
* If you have a web platform, start here
  * The [Snowplow Inspector browser extension](/docs/testing/snowplow-inspector/index.md) is a useful manual testing tool
  * Start with non-critical pages or features
* Implement a tracker SDK, and track a small number of built-in events, such as [page views](/docs/sources/web-trackers/quick-start-guide/index.md)
  * Use the Snowplow Inspector to confirm that the tracker is generating the expected events
  * Use [Snowplow Micro](/docs/testing/snowplow-micro/index.md) to test and validate locally
  * Finally, confirm that the tracker can also send events to your warehouse
* Use [Snowtype](/docs/data-product-studio/snowtype/index.md) to generate custom tracking code for your tracking plans
* Test and validate your custom tracking using Micro as before
* Gradually continue this process until you have a complete Mixpanel and Snowplow dual tracking implementation
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

By the end of this phase, you'll have a validated Snowplow implementation that recreates your Mixpanel tracking and modeling. The goal is to be confident that the new Snowplow pipeline is capturing all critical business logic correctly.

### 3. Cutover and finalize

In the final phase, you'll update downstream data consumers, and decommission Mixpanel.

Use Snowplow [event forwarding](/docs/destinations/forwarding-events/index.md) to integrate with third-party destinations. Update all your data consumers to query the new Snowplow data tables.

Remove the Mixpanel tracking from your codebases. Finally, close your Mixpanel account.
