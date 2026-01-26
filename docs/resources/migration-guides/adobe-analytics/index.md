---
title: "Migrate from Adobe Analytics to Snowplow"
sidebar_label: "Adobe Analytics to Snowplow"
date: "2025-01-19"
sidebar_position: 1
description: "Migrate from Adobe Analytics to Snowplow with guidance on event tracking, eVars, props, and warehouse modeling."
keywords: ["adobe analytics", "migration", "tracking plan", "data products", "evars", "props", "event tracking", "adobe experience platform"]
---

This guide is to help technical implementers migrate from Adobe Analytics to Snowplow. For more advice on tracking plans, check out our [best practices guide](/docs/fundamentals/tracking-design-best-practice/index.md).

## Platform differences

There are significant differences between Adobe Analytics and Snowplow as data platforms. For migration, it's important to understand how Snowplow structures events differently from Adobe Analytics. This affects how you'll implement tracking and how you'll model the warehouse data.

This table shows some key differences:

| Feature                 | Adobe Analytics                                                                                       | Snowplow                                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capturing user behavior | Uses numbered variables                                                                               | Direct tracker calls for built-in or custom [event](/docs/fundamentals/events/index.md) types, including contextual data as reusable [entities](/docs/fundamentals/entities/index.md) |
| Warehouse tables        | Data Feeds export to flat files with numbered columns (prop1-prop75, eVar1-eVar250, event1-event1000) | In [most warehouses](/docs/destinations/warehouses-lakes/index.md), one big table with columns for every event or entity; in Redshift, one table per custom event or entity           |
| Data validation         | Processing rules and VISTA rules for transformation; no schema validation                             | All events and entities defined by JSON schemas                                                                                                                                       |

### Event structure

Adobe Analytics uses two primary [tracking methods](https://experienceleague.adobe.com/en/docs/analytics/implementation/vars/functions/overview#): `s.t()` for page views and `s.tl()` for custom link tracking. Data is captured through props, eVars, and events.

Each of these types uses numbered variables with different persistence scopes:
* Props (`s.prop1-75`): hit-scoped traffic variables that expire after the hit
* eVars (`s.eVar1-250`): conversion variables with configurable expiration (hit, visit, visitor, or specific events)
* Events (`event1-1000`): counters and currency values for success metrics

This numbered variable system requires external documentation to map variable numbers to business meanings. For example, `eVar5` might represent "campaign code" in one implementation and "product category" in another.

Here's an example Adobe Analytics web ecommerce implementation. The code sets various variables before calling the tracking method:

```javascript
// Adobe Analytics purchase tracking
s.pageName = 'Order Confirmation';
s.events = 'purchase,event1';
s.products = ';SKU_123;1;25.42';
s.eVar1 = '12345';           // transaction_id
s.eVar2 = 'USD';             // currency
s.prop1 = 'Electronics';     // category
s.purchaseID = '12345';
s.t();
```

The `s.products` variable uses a specific syntax with semicolon delimiters: `category;product;quantity;price`. Success events like `purchase` are tracked in `s.events`. Context is spread across numbered props and eVars, requiring documentation to understand what each variable represents.

To track the same behavior with Snowplow, you could use the [web ecommerce](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) `trackTransaction` event:

```javascript
snowplow('trackTransaction', {
  transaction_id: 'T_12345',
  revenue: 25.42,
  currency: 'USD',
  products: [{
    id: 'SKU_123',
    name: 'Product Name',
    category: 'Electronics',
    price: 25.42,
    quantity: 1
  }]
});
```

As well as the tracking code looking different, there are key differences in the warehouse loading and data modeling:
* Snowplow processes this as a `transaction` [event](/docs/fundamentals/events/index.md) with one `product` [entity](/docs/fundamentals/entities/index.md)
* The Snowplow [tracker SDKs](/docs/sources/index.md) and pipeline add additional contextual entities to each event, for example information about the specific page or screen view, the user's session, or the browser
* In BigQuery, Databricks, or Snowflake, the event will be loaded into the single `atomic.events` table, with a column for the `transaction` event and a column for each entity
  * Columns have type `OBJECT` in Snowflake, and `REPEATED RECORD` in BigQuery
  * In Redshift, each event and entity is loaded into its own table

Snowplow tracker SDKs provide built-in methods for tracking page views and screen views, along with many other kinds of events. The additional entities added depend on which Snowplow SDK you're using, and which [enrichments](/docs/pipeline/enrichments/index.md) you've configured.

Snowplow provides out-of-the-box [dbt data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for initial modeling and common analytics use cases.

### Tracking comparison

This table shows how Adobe Analytics tracking maps to Snowplow tracking:

| Adobe Analytics Method | Adobe Example                                                    | Snowplow Implementation                                                                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `s.t()` (page view)    | `s.pageName='Home'; s.t();`                                      | Use `trackPageView`. The tracker automatically captures page title, URL, and referrer.                                                                                                          |
| `s.tl()` (link click)  | `s.tl(this,'o','Button Click');`                                 | Use `trackLinkClick` for links, or define a custom schema and track with `trackSelfDescribingEvent`.                                                                                            |
| `s.tl()` (custom)      | `s.linkTrackVars='eVar1'; s.eVar1='value'; s.tl(this,'o','CTA')` | Define a custom schema containing the relevant properties and track with `trackSelfDescribingEvent`.                                                                                            |
| Props (hit-scoped)     | `s.prop1 = 'value';`                                             | Attach as entities to the specific event.                                                                                                                                                       |
| eVars (visit-scoped)   | `s.eVar1 = 'value';`                                             | Attach as entities. For visit-scoped persistence, use [global context](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md) or model persistence in the warehouse. |
| Success events         | `s.events = 'event1,purchase';`                                  | Track as specific event types or custom self-describing events. Use entities for associated values.                                                                                             |
| Products string        | `s.products = ';SKU;1;99.99';`                                   | Use built-in ecommerce tracking, or define a `product` entity schema with explicit properties.                                                                                                  |
| `s.visitorID`          | `s.visitorID = 'user123';`                                       | Use `setUserId('user123')` to set user ID for all subsequent events.                                                                                                                            |

### Persistence and scope

Adobe Analytics eVars have [configurable persistence](https://experienceleague.adobe.com/en/docs/analytics/components/dimensions/evar#): they can expire after a hit, visit, or specific time period, or persist until a conversion event. This persistence is handled server-side by Adobe.

Snowplow takes an event-centric approach where each event is self-contained. There's no built-in persistence mechanism. Instead, you have two options:

1. **Global context**: attach entities to all events during a session using the tracker's [global context](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md) feature
2. **Warehouse modeling**: reconstruct persistence logic in your data models using SQL window functions

For most use cases, warehouse modeling provides more flexibility. You can define custom attribution windows, change persistence logic without re-instrumenting, and apply different persistence rules to historical data.

### Data validation

Adobe Analytics provides Processing Rules and VISTA rules for data transformation, but doesn't validate incoming data against schemas. Invalid or unexpected values are accepted and processed. Classification rules can categorize values post-collection, but there's no prevention of malformed data.

Snowplow requires schematic specification for all data. Every event and entity is defined by a [JSON schema](/docs/fundamentals/schemas/index.md), called a data structure. The data payload itself contains a reference to the specific data structure and version that defines it. The events are always validated as they're processed through the Snowplow pipeline, and events that fail validation are filtered out.

Snowplow provides [monitoring](/docs/monitoring/index.md) and alerting for failed events. You can choose to load failed events into a separate table in your warehouse, or to analyze them in temporary buckets. This strict approach ensures high data quality.

You've likely documented your Adobe Analytics implementation in a Solution Design Reference spreadsheet that maps business requirements to props, eVars, and events. Snowplow provides event data management tools for defining and managing tracking plans. Tracking plans are called [data products](/docs/fundamentals/data-products/index.md) in Snowplow. Each data product contains a set of related event specifications. Each event specification has one event data structure, and any number of entity data structures.

You can use the Snowplow Console, API, or CLI to [define your tracking data structures](/docs/data-product-studio/data-products/index.md). For each event you can specify when it should be tracked, and which entities should be added. Once you've defined your event specifications, use [Snowtype](/docs/data-product-studio/snowtype/index.md) to automatically generate the tracking code snippets.

## Tag management

If you're using Adobe Launch (Adobe Experience Platform Tags) to deploy Adobe Analytics, you'll need to decide how to deploy Snowplow tracking.

There are three main options:

| Approach                                                                                        | Description                                            | Best for                                                                                 |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Direct [tracker SDK](/docs/sources/index.md) implementation                                     | Add Snowplow tracker code directly to your application | Teams with engineering resources; cleanest long-term solution                            |
| [Google Tag Manager](/docs/sources/google-tag-manager/index.md)                                 | Use Snowplow's GTM tag templates to deploy tracking    | Teams already using GTM for other tools, or wanting to move away from Adobe Launch       |
| [GTM Server-side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md) | Forward events through a server-side container         | Teams already using GTM Server-side, or with strict client-side performance requirements |

Direct SDK implementation is recommended for most migrations. It provides the cleanest separation from your previous Adobe implementation and full access to Snowplow features.

If you choose GTM, you can use Snowplow's tag templates to fire Snowplow events based on data layer pushes, similar to how Adobe Launch rules fire based on data elements.

## Migration phases

We recommend using a parallel-run migration approach. This process can be divided into three phases:
1. Assess and plan
2. Implement and validate
3. Cutover and finalize

### 1. Assess and plan

Your existing Adobe Analytics Solution Design Reference will serve as the foundation for your new Snowplow implementation. Before migration, audit your tracking implementation and Solution Design Reference. Are all the props, eVars, and events still relevant?

Start documenting all downstream data consumers, such as BI dashboards, dbt models, ML pipelines, or marketing automation workflows, that may need updating after migration.

Review your existing Adobe Analytics implementation using one or more of these methods:
* Solution Design Reference review: examine your tracking plan spreadsheet for the complete mapping of business requirements to variables
* Code audit: review all `s.t()` and `s.tl()` calls in your codebase, along with variable assignments
* Data Feeds analysis: analyze your Data Feeds exports to identify which props, eVars, and events contain data
* Report suite inspection: use the Adobe Analytics Admin Console to review variable configurations and processing rules

Pay special attention to:
* Variable persistence settings for eVars
* Processing rules that transform incoming data
* VISTA rules for server-side data manipulation
* Classification rules that categorize values
* Calculated metrics that combine multiple variables

You'll need to translate your Adobe Analytics configuration into Snowplow [data products](/docs/fundamentals/data-products/index.md). Some things to consider:
* Which platforms will you be tracking on? Different Snowplow tracker SDKs include different built-in event types. The [web](/docs/sources/web-trackers/index.md) and [native mobile](/docs/sources/mobile-trackers/index.md) trackers are the most fully featured.
* Which Adobe events can be migrated to built-in Snowplow events, and which should be custom [self-describing events](/docs/fundamentals/events/index.md#self-describing-events)?
* How should you group props and eVars into logical [entities](/docs/fundamentals/entities/index.md)?
* Which eVar persistence behaviors need to be replicated in warehouse modeling?
* How will you handle the `s.products` string? Snowplow's ecommerce tracking or custom product entities are more flexible alternatives.

The goal is to create a set of JSON data structures for all your events and entities, organized into data products and [event specifications](/docs/data-product-studio/event-specifications/index.md). The best way to import your new data product tracking plans into Snowplow is to use the [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md).

:::info Snowplow CLI MCP server
The Snowplow CLI includes an [MCP server](/docs/data-product-studio/mcp-server/index.md) to help you translate your Adobe Analytics event configuration into Snowplow data products.
:::

In this phase, you'll also need to decide what to do with historical data. There are two main choices:
* Coexistence: leave historical Adobe Analytics Data Feeds in existing tables. Write queries that combine data from both systems, using a transformation layer (for example, in dbt) to create compatible structures.
* Unification: transform and backfill historical Adobe data into the Snowplow format. This requires a custom engineering project to export Data Feeds, reshape the numbered columns into the Snowplow enriched event format, and load it into the warehouse. The result is a unified historical dataset.

### 2. Implement and validate

This phase involves three main tasks:
* Set up your Snowplow infrastructure
* Implement and test your new tracking plan
* Set up data models

Follow the [Snowplow CDI getting started instructions](/docs/get-started/private-managed-cloud/index.md) to set up your Snowplow infrastructure.

If you haven't done this yet, use the [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) to import your new data products plan into Snowplow. You can also inspect and edit data products using the Snowplow Console. They'll be available to the Snowplow pipeline for data validation on publishing.
Use the Snowplow CLI or Console to publish.

Add Snowplow tracking in parallel with your existing Adobe Analytics tracking:
* If you have a web platform, we recommend starting here
  * The [Snowplow Inspector browser extension](/docs/testing/snowplow-inspector/index.md) is a useful manual testing tool
  * Start with non-critical pages or features
* Implement a tracker SDK, and track a small number of built-in events, such as [page views](/docs/sources/web-trackers/quick-start-guide/index.md)
  * Use the Snowplow Inspector to confirm that the tracker is generating the expected events
  * Use [Snowplow Micro](/docs/testing/snowplow-micro/index.md) to test and validate locally
  * Finally, confirm that the tracker can also send events to your warehouse
* Use [Snowtype](/docs/data-product-studio/snowtype/index.md) to generate custom tracking code for your data products
* Test and validate your custom tracking using Micro as before
* Gradually continue this process until you have a complete Adobe Analytics and Snowplow dual tracking implementation
* Gradually roll out tracking to production

:::info Snowplow Micro
[Snowplow Micro](/docs/testing/snowplow-micro/index.md) is a Dockerized local pipeline. It uses the same schema registry as your production pipeline, allowing developers to quickly confirm that the tracked events are valid.
:::

Use the Snowplow data quality [monitoring tools](/docs/monitoring/index.md) for confidence in your tracking implementation.

Set up your analytics:
* Configure the Snowplow [dbt models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for initial modeling
* Update your existing data models to handle the new data structures
* Replicate any eVar persistence logic in your warehouse models
* Create queries to reconcile your old and new data
* Compare high-level metrics between systems e.g. daily page views, or unique visitors

By the end of this phase, you'll have a validated Snowplow implementation that recreates your Adobe Analytics tracking and modeling. The goal is to be confident that the new Snowplow pipeline is capturing all critical business logic correctly.

### 3. Cutover and finalize

In the final phase, you'll update downstream data consumers, and decommission Adobe Analytics.

Use Snowplow [event forwarding](/docs/destinations/forwarding-events/index.md) to integrate with third-party destinations. Update all your data consumers to query the new Snowplow data tables.

Remove the Adobe Analytics tracking from your codebases. Finally, archive your Adobe Analytics configuration and Data Feeds exports.
