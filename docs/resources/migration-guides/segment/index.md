---
title: "Segment to Snowplow"
date: "2025-08-04"
sidebar_position: 0
---

This guide helps technical implementers migrate from Segment to Snowplow.

## Platform differences

There are a number of differences between Segment and Snowplow as a data platform. For migration, it's important to be aware of how Snowplow structures events differently from Segment. This affects how you'll implement tracking and how you'll model the warehouse data.

### Segment event structure

Segment's core method for tracking user behavior is `track`. A `track` call contains a name that describes the action taken, and a `properties` object that contains contextual information about the action.

The other Segment tracking methods are:
* `page` and `screen` record page views and screen views
* `identify` describes the user, and associates a `userId` with user `traits`
* `group` associates the user with a group
* `alias` merges user identities, for identity resolution across applications

With Segment, you track data about the user's action separately from data about the user. These are stitched together during data modeling in the warehouse.

Here's an example showing how you can track an ecommerce transaction event on web using Segment:

```javascript
analytics.track('Transaction Completed', {
  order_id: 'T_12345',
  revenue: 99.99,
  currency: 'USD',
  products: [{
    product_id: 'ABC123',
    name: 'Widget',
    price: 99.99,
    quantity: 1
  }]
})
```

The tracked events can be optionally validated against Protocols, defined as part of a tracking plan. They'll detect violations against your tracking plan, and you can choose to filter out events that don't pass validation.

### Snowplow event structure

Snowplow separates the action that occurred (the [event](/docs/fundamentals/events/index.md)) from the contextual objects involved in the action (the [entities](/docs/fundamentals/entities/index.md)), such as the user, the device, etc.

Snowplow SDKs also provide methods for tracking page views and screen views, along with many other kinds of events, such as button clicks, form submissions, page pings (activity), media interactions, and so on.

The equivalent to Segment's custom `track` method is `trackSelfDescribingEvent`.

All Snowplow events, whether designed by you or built-in, are defined by [JSON schemas](/docs/fundamentals/schemas/index.md). The events are always validated as they're processed through the Snowplow pipeline, and events that fail validation are separated out for assessment.


Here's an example showing how you could track a Snowplow ecommerce transaction event on web:

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

Superficially, it looks similar to Segment's `track` call. The first key difference is that the products property here contains a reusable `product` entity. You'd add this entity to any other relevant event, such as `add_to_cart` or `view_product`.

Secondly, the Snowplow tracking SDKs add multiple entities to all tracked events by default, including information about the specific page or screen view, the user's session, and the device or browser. Many other built-in entities can be configured, and you can define your own custom entities to add to any or all Snowplow events.

### Tracking comparison

This table gives examples of how the different Segment tracking methods map to Snowplow tracking.

| Segment API Call | Segment Example                                                 | Snowplow Implementation                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `track()`        | `track('Order Completed', {revenue: 99.99, currency: 'USD'})`   | Use one of the built-in event types, or define a custom `order_completed` schema containing `revenue` and `currency` properties, and track  `trackSelfDescribingEvent`.      |
| `page()`         | `page('Pricing')`                                               | Use `trackPageView`. The tracker SDK will capture details such as `title` and `url`.                                                                                         |
| `screen()`       | `screen('Home Screen')`                                         | Use `trackScreenView`.                                                                                                                                                       |
| `identify()`     | `identify('user123', {plan: 'pro', created_at: '2024-01-15'})`  | Call `setUserId('user123')` to track the ID in all events. Attach a custom `user` entity with schema containing `plan` and `created_at` properties.                          |
| `group()`        | `group('company-123', {name: 'Acme Corp', plan: 'Enterprise'})` | No direct equivalent. Attach a custom `group` entity to your events, or track group membership changes as custom events with `group_joined` or `group_updated` schemas.      |
| `alias()`        | `alias('new-user-id', 'anonymous-id')`                          | No direct equivalent. Track identity changes as custom events with `user_alias_created` schema. Use `setUserId` to update the current user identifier for subsequent events. |

### Warehouse data structure

Segment loads each custom event type into separate tables, for example, `order_completed`, or `product_viewed` tables. Analysts must `UNION` tables together to reconstruct user journeys.

Snowplow uses a single [`atomic.events`](/docs/fundamentals/canonical-event/index.md) table in warehouses like Snowflake and BigQuery. Events and entities are stored as structured columns within that table, simplifying analysis.

## Migration phases

We recommend using a parallel-run migration approach. This process can be divided into three phases:
1. Assess and plan
2. Implement and validate
3. Cutover and finalize

### Assess and plan

#### Audit existing implementation
- Audit the Segment tracking calls in your application code
- Document all downstream data consumers, such as BI dashboards, dbt models, or ML pipelines
- Export your complete Segment tracking plan, using one of these methods:
  - Ideally, use the Segment Public API to obtain the full JSON structure for each event
  - Manually download CSVs from the Segment UI
  - Infer it from warehouse data

#### Design Snowplow tracking plan
- Translate Segment events into Snowplow self-describing events
  - The [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) MCP server can help with this
- Identify reusable entities that can replace repeated properties
- Create JSON schemas for all events and entities

#### Deploy infrastructure
- Confirm that your Snowplow infrastructure is up and running
- Publish your schemas so they're available to your pipeline
  - Use Snowplow BDP Console or the Snowplow CLI

### Implement and validate

#### Set up dual tracking
- Add [Snowplow tracking](/docs/sources/index.md) to run in parallel with existing Segment tracking
  - Use [Snowtype](/docs/data-product-studio/snowtype/index.md) to generate type-safe tracking code
- Use [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md) for local testing and validation

#### Data validation
- Compare high-level metrics between systems e.g. daily event counts, or unique users
- Validate critical business logic and property values
- Perform end-to-end data reconciliation in your warehouse
- Decide what to do about historical data

For historical data, you have a choice of approaches:
- Coexistence: leave historical Segment data in existing tables. Write queries that `UNION` data from both systems, using a transformation layer (for example, in dbt) to create compatible structures.
- Unification: transform and backfill historical Segment data into Snowplow format. This requires a custom engineering project to export Segment data, reshape it into the Snowplow enriched event format, and load it into the warehouse. The result is a unified historical dataset.

#### Gradual rollout
- Start with non-critical pages or features
- Gradually expand to cover all tracking points
- Monitor data quality and pipeline health
- Update [dbt models](https://docs.snowplow.io/docs/modeling-data/modeling-your-data/dbt/) to use the new data structure

### Cutover and finalize

#### Update downstream consumers
- Migrate BI dashboards to query Snowplow tables
- Test all data-dependent workflows

#### Configure integrations
- Set up [event forwarding](https://docs.snowplow.io/docs/destinations/forwarding-events/) for real-time destinations
- Configure reverse ETL workflows to use your new modeled data

#### Complete transition
- Remove Segment tracking from codebases
- Decommission Segment sources
- Cancel Segment subscription once validation period is complete
