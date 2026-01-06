---
title: "Google Analytics to Snowplow"
date: "2025-01-20"
sidebar_position: 10
description: "Migrate from Google Analytics to Snowplow, including data layer implementations with Google Tag Manager."
keywords: ["google analytics", "ga4", "migration", "data layer", "gtm", "google tag manager"]
---

This guide is to help technical implementers migrate from Google Analytics to Snowplow.

## Platform differences

There are [significant differences](https://snowplow.io/comparisons/snowplow-vs-google-analytics) between Google Analytics and Snowplow as data platforms. For migration, it's important to understand how Snowplow structures events differently from GA4. This affects both your data layer implementation and how you'll model the warehouse data.

This table shows some key differences:

| Feature                 | Google Analytics 4                                                                                | Snowplow                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capturing user behavior | Uses `gtag('event', ...)` with event names, or `dataLayer.push()` with GTM triggers and variables | Direct tracker SDK calls for built-in or custom [event](/docs/fundamentals/events/index.md) types                                                                          |
| Contextual event data   | Included in the event `parameters` object                                                         | Included in the event as reusable [entities](/docs/fundamentals/entities/index.md)                                                                                         |
| Warehouse tables        | BigQuery only; daily partitioned `events_YYYYMMDD` table with nested fields                       | In [most warehouses](/docs/destinations/warehouses-lakes/index.md) one big table with columns for every event or entity; in Redshift, one table per custom event or entity |
| Data validation         | None                                                                                              | All events and entities defined by JSON schemas                                                                                                                            |

### Event structure

The main GA4 tracking method is `gtag('event', ...)` with event names and parameter objects. The event name describes the action taken, and the parameters provide contextual information about that action.

You might have implemented these calls directly in your codebase. More likely, you're using Google Tag Manager (GTM) and tracking behavior via the data layer. When using GTM, your application pushes structured data to the `dataLayer` array. GTM then processes this data using triggers and variables to fire the appropriate `gtag()` calls.

Here's an example GA4 web ecommerce event using the data layer. The application pushes a `purchase` event with an `ecommerce` object containing transaction details:

```javascript
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: '12345',
    value: 25.42,
    currency: 'USD',
    items: [{
      item_id: 'SKU_123',
      item_name: 'Product Name',
      price: 25.42,
      quantity: 1
    }]
  }
});
```

GTM processes this data layer push and fires the corresponding GA4 event. Alternatively, you might have implemented the event directly using `gtag()` calls, like this:

```javascript
gtag('event', 'purchase', {
  transaction_id: '12345',
  value: 25.42,
  currency: 'USD',
  items: [{
    item_id: 'SKU_123',
    item_name: 'Product Name',
    price: 25.42,
    quantity: 1
  }]
});
```

To directly track the same behavior with Snowplow, you could use the [web ecommerce](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) `trackTransaction` event. The tracking code looks similar:

```javascript
snowplow('trackTransaction', {
  transaction_id: 'T_12345',
  revenue: 25.42,
  currency: 'USD',
  products: [{
    id: 'SKU_123',
    name: 'Product Name',
    price: 25.42,
    quantity: 1
  }]
});
```

### Tracking comparison

This table shows how some data layer GA4 tracking maps to Snowplow web tracking:

| GA4 Event     | GA4 Data Layer Example                                                                                                      | Snowplow Implementation                                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page_view`   | Sent by default by GTM, or `dataLayer.push({event: 'page_view'})`.                                                          | Use `trackPageView`                                                                                                                                            |
| `purchase`    | `dataLayer.push({event: 'purchase', ecommerce: {transaction_id: '123', value: 99.99}})`                                     | Use built-in ecommerce tracking, or define a custom `purchase` schema containing `transaction_id` and `value` properties, and track `trackSelfDescribingEvent` |
| Custom events | Define custom GTM configuration then call e.g. `dataLayer.push({event: 'read_article', article_title: 'Interesting text'})` | Define a custom `read_article` schema containing `article_title` property and track with `trackSelfDescribingEvent`                                            |
| Send user IDs | `dataLayer.push({user_id: 'USER_123'})`, configured as user property in GTM                                                 | Use `setUserId('USER_123')` to set the user ID                                                                                                                 |
| Page metadata | `dataLayer.push({page_type: 'product', category: 'electronics'})`, configured as custom dimensions in GTM                   | Define custom entities for page context and attach to relevant events                                                                                          |

### Warehouse loading and data modeling

The key differences between GA4 and Snowplow events are in the warehouse loading and data modeling.

With GA, the example `purchase` event would be loaded into an `events_YYYYMMDD` table in BigQuery, with nested RECORD fields for parameters and user properties. Each parameter exists as key-value pairs with separate columns for different data types: `string_value`, `int_value`, `float_value`, or `double_value`. Analysts must use complex `UNNEST` operations to extract parameters and join data.

With Snowplow, the example event would be processed as a `transaction` [event](/docs/fundamentals/events/index.md) with one `product` [entity](/docs/fundamentals/entities/index.md). The Snowplow [tracker SDKs](/docs/sources/index.md) and pipeline add additional contextual entities to each event, for example information about the specific page or screen view, the user's session, or the browser.

In BigQuery, Databricks, or Snowflake, the event will be loaded into the single `atomic.events` table, with a column for the `transaction` event and a column for each entity. In Redshift, each event and entity is loaded into its own table.

You can add the same `product` entity to any other relevant event, such as `add_to_cart` or `view_item`. This simplifies analysis of product lifecycles, from initial product view to purchase.

Snowplow tracker SDKs provide built-in methods for tracking page views, along with many other kinds of events. The additional entities added depend on which Snowplow SDK you're using, and which [enrichments](/docs/pipeline/enrichments/index.md) you've configured.

Snowplow provides out-of-the-box [dbt data models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/index.md) for initial modeling and common analytics use cases.

### Data validation

GA4 is loosely typed and doesn't validate incoming events. You can define expected properties and custom configuration, but events that don't match their specification are still processed. The defined configurations are mainly used for reporting in the GA4 interface.

The lack of validation leads to fragmented and low quality data. For example, the `price` for a purchase event might be accidentally tracked in different places as `25.42`, `"25.42"`, or even `2542`. In the warehouse, this parameter's values will be split over `float_value`, `string_value`, and `int_value` columns, making querying more complex.

Event specification and validation isn't optional for Snowplow. Every event and entity is defined by a [JSON schema](/docs/fundamentals/schemas/index.md), called a data structure. The data payload itself contains a reference to the specific data structure and version that defines it. The events are always validated as they're processed through the Snowplow pipeline, and events that fail validation are filtered out.

Snowplow provides [monitoring](/docs/monitoring/index.md) and alerting for failed events. You can choose to load failed events into a separate table in your warehouse, or to analyze them in temporary buckets. This strict approach ensures high data quality.

#### Tracking plans

You've probably defined which GA4 events and parameters to track in a tracking plan spreadsheet or similar document. Snowplow provides event data management tools for defining and managing tracking plans. Tracking plans are called [data products](/docs/fundamentals/tracking-plans/index.md) in Snowplow. Each data product contains a set of related event specifications. Each event specification has one event data structure, and any number of entity data structures.

You can use the Snowplow Console, API, or CLI to [define your tracking data structures](/docs/event-studio/tracking-plans/index.md). For each event you can specify when it should be tracked, and which entities should be added. Once you've defined your event specifications, you may be able to use [Snowtype](/docs/event-studio/snowtype/index.md) to automatically generate the tracking code snippets.


## Migration approaches

In general, we recommend a parallel-run migration approach. This involves running both GA4 and Snowplow tracking simultaneously, allowing you to validate your Snowplow data in your warehouse before switching over completely.

If you're using GA4 with direct `gtag()` calls, you can replace these with Snowplow tracker SDK calls in your application code.

However, Snowplow also provides templates and tags for GTM and GTM Server-side. You could choose to migrate your data layer tracking and your modeling implementations in separate stages. This table summarizes the three possible approaches to reach a parallel-run dual tracking implementation:

| Approach                                                                                                | Phase 1                                                                     | Phase 2                                                                                         | Phase 3                           | Best for                                                                              |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| Direct [tracker SDK](/docs/sources/index.md) calls                                                      | Define Snowplow [data products](/docs/fundamentals/tracking-plans/index.md) | Add Snowplow tracking calls; implement Snowplow data models                                     |                                   | Teams with tracking implementation engineer resources; greenfield validation projects |
| [Snowplow GTM templates](/docs/sources/google-tag-manager/index.md)                                     | Define Snowplow [data products](/docs/fundamentals/tracking-plans/index.md) | Configure Snowplow tags to receive data layer events; implement Snowplow data models            | Implement Snowplow tracking calls | Validation of Snowplow data quality for analytics or marketing teams                  |
| [GTM Server-side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md) tagging | Define Snowplow [data products](/docs/fundamentals/tracking-plans/index.md) | Use GTM Server-side to forward your existing events to Snowplow; implement Snowplow data models | Implement Snowplow tracking calls | Validation of Snowplow data quality for teams already using GTM Server-side           |

Using Snowplow's GTM templates or tags is a temporary solution to help you migrate.

## Migration phases

We recommend using a parallel-run migration approach. This process can be divided into four phases:
1. Assess and plan
2. Validate data
3. Finish implementation
4. Cutover and finalize

### 1. Assess and plan

Your existing GA4 event configuration will serve as the foundation for your new Snowplow implementation. Before migration, we advise auditing your tracking calls and event configuration. Are all the events and parameters still relevant? Does your configuration match your tracking plan?

Start documenting all downstream data consumers, such as BI dashboards, dbt models, ML pipelines, or marketing automation workflows, that may need updating after migration.

Review your existing GA4 implementation using one or more of these methods:
* Tag manager inspection: if using GTM, export your container configuration to identify all GA4 tags, their triggers, and variable mappings
* Programmatic API export: use the [Google Analytics Admin API](https://developers.google.com/analytics/devguides/config/admin/v1) to retrieve the full JSON definition of all custom event configurations
* Code audit: review all `dataLayer.push()` or `gtag('event', ...)` calls in your codebase
* Warehouse inference: analyze your BigQuery `events_YYYYMMDD` tables to identify all event names and parameters in use

For data layer implementations, pay special attention to:
* The structure of your data layer objects and how properties are nested
* Which GTM variables extract and transform data layer properties
* How GTM triggers determine when events are sent
* Any custom JavaScript variables that process data layer data

You'll need to translate your GA4 event configuration into Snowplow [data products](/docs/fundamentals/tracking-plans/index.md). Some things to consider:
* Which platforms will you be tracking on? Different Snowplow tracker SDKs include different built-in event types. The [web](/docs/sources/web-trackers/index.md) and [native mobile](/docs/sources/mobile-trackers/index.md) trackers are the most fully featured.
* Which GA4 events can be migrated to built-in Snowplow events, and which should be custom [self-describing events](/docs/fundamentals/events/index.md#self-describing-events)?
* Are there sets of event parameters used in multiple places that could be defined as [entities](/docs/fundamentals/entities/index.md) instead?
* What's the best combination of event properties and entities to capture the same data as GA4?
* If you're using GTM, will you go straight to implementing direct tracker SDK calls, or use Snowplow's GTM templates or GTM Server-side tagging to maintain the data layer pattern initially?

The goal is to create a set of JSON data structures for all your events and entities, organized into data products and [event specifications](/docs/event-studio/event-specifications/index.md). The best way to import your new data product tracking plans into Snowplow is to use the [Snowplow CLI](/docs/event-studio/snowplow-cli/index.md).

:::info Snowplow CLI MCP server
The Snowplow CLI includes an [MCP server](/docs/event-studio/snowplow-cli/index.md#mcp-server) to help you translate your GA4 event configuration into Snowplow data products.
:::

In this phase, you'll also need to decide what to do with historical data. There are two main choices:
* Coexistence: leave historical GA4 data in BigQuery. Write queries that combine data from both systems, using a transformation layer (for example, in dbt) to create compatible structures.
* Unification: transform and backfill historical GA4 data into the Snowplow format. This requires a custom engineering project to export GA4 data, reshape it into the Snowplow enriched event format, and load it into the warehouse. The result is a unified historical dataset.

### 2. Validate data

This phase involves three main tasks:
* Set up your Snowplow infrastructure
* Start sending events to Snowplow and test your new tracking plan
* Set up data models

Follow the [Snowplow CDI getting started instructions](/docs/get-started/private-managed-cloud/index.md) to set up your Snowplow infrastructure.

If you haven't done this yet, use the [Snowplow CLI](/docs/event-studio/snowplow-cli/index.md) to import your new data products plan into Snowplow. You can also inspect and edit data products using the Snowplow Console. They'll be available to the Snowplow pipeline for data validation on publishing.
Use the Snowplow CLI or Console to publish.

:::info Snowplow Micro
Use [Snowplow Micro](/docs/testing/snowplow-micro/index.md) to test and validate your Snowplow events locally, before sending them to your warehouse.

Snowplow Micro is a Dockerized local pipeline. It uses the same schema registry for event validation as your production pipeline.
:::

Use the Snowplow data quality [monitoring tools](/docs/monitoring/index.md) for confidence in your tracking implementation.

Set up your analytics:
* Configure the Snowplow [dbt models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for initial modeling
* Update your existing data models to handle the new data structures
* Create queries to reconcile your old and new data
* Compare high-level metrics between systems e.g. daily event counts, or unique users

Your GA4 implementation will stay live until the final migration phase. By the end of this phase, you'll have a validated Snowplow implementation that captures or recreates your GA4 tracking, and recreates your modeling. The goal is to be confident that the new Snowplow pipeline is capturing critical business logic correctly.

#### Direct tracker SDK calls

For the most straightforward migration, add Snowplow tracking in parallel with your existing GA4 tracking:
* Implement a tracker SDK, and track a small number of built-in events, such as [page views](/docs/sources/web-trackers/quick-start-guide/index.md)
* Use the [Snowplow Inspector browser extension](/docs/testing/snowplow-inspector/index.md) to confirm that the tracker is generating the expected events
* Use [Snowtype](/docs/event-studio/snowtype/index.md) to generate custom tracking code for your data products

#### Snowplow GTM templates

If you're using GTM and don't have the resources to implement Snowplow tracking yet, you can use [Snowplow's GTM tag templates](/docs/sources/google-tag-manager/index.md) to generate Snowplow events without changing your application code:
* Keep your existing `dataLayer.push()` calls in your application code
* Install the [Snowplow GTM tag template](/docs/sources/google-tag-manager/index.md) in your GTM web container
* Configure GTM triggers to fire Snowplow tags based on your data layer events
* Use GTM variables to map data layer properties to Snowplow event and entity fields

For example, the existing data layer push stays the same:

```javascript
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: '12345',
    value: 25.42,
    currency: 'USD'
  }
});
```

In GTM, you would configure a Snowplow tag that fires when `event` equals `purchase`, mapping the ecommerce properties to a custom Snowplow self-describing event or using the built-in ecommerce tracking.

#### GTM server-side tagging

If you're already using GTM Server-side to forward events, you could configure Snowplow as a destination using the [Snowplow GTM Server-side tag](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md):
1. Keep your existing `dataLayer.push()` calls in your application code
2. Configure GTM web container to forward events to GTM server-side
3. Set up Snowplow tracking in the GTM server-side container
4. Use GTM server-side variables and transformations to map data layer data to Snowplow events

### 3. Finish implementation

If you used Snowplow GTM templates or GTM server-side tagging in the previous phase, it's time to implement direct Snowplow tracker SDK calls in your application code.

The benefits of a full Snowplow implementation include:
* Enables a complete migration away from GA4
* Allows you to take advantage of all Snowplow features, including out-of-the-box tracking definitions and event data management tools
* Increased page performance
* Improved debugging and maintenance

### 4. Cutover and finalize

In the final phase, you'll update downstream data consumers, and decommission GA4.

Use Snowplow [event forwarding](/docs/destinations/forwarding-events/index.md) to integrate with third-party destinations. Update all your data consumers to query the new Snowplow data tables.

Remove the GA4 tracking from your codebases. Finally, archive your GA4 configuration and data exports.
