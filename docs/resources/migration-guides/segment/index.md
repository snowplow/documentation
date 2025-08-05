---
title: "Segment to Snowplow"
date: "2025-08-04"
sidebar_position: 0
---

This guide covers migrating from Segment to Snowplow for technical implementers. The migration moves from a managed Customer Data Platform (CDP) to a composable behavioral data platform running in your cloud environment.

## High-level differences

There are a number of differences between Segment and Snowplow: as a data platform; in how they're priced; and in how the data is defined, conceptualized, and stored.

### Platform comparison

| Feature              | Segment                                              | Snowplow                                                               |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Deployment model     | SaaS-only: data is processed on Segment servers      | Private cloud (BDP Enterprise) and SaaS (BDP Cloud) are both available |
| Data ownership       | Data access in warehouse, vendor controls pipeline   | You own your data and control your pipeline infrastructure             |
| Governance model     | Reactive: post-hoc validation with Protocols         | Proactive: schema validation for every event                           |
| Data structure       | Flat events with properties, user traits and context | Events enriched by multiple, reusable entities                         |
| Pricing model        | Based on Monthly Tracked Users (MTUs) or API calls   | Based on event volume                                                  |
| Real-time capability | Limited low-latency support                          | Real-time streaming pipeline supports sub-second use cases             |

### Data warehouse structure

Segment loads each custom event type into separate tables, for example, `order_completed`, or `product_viewed` tables.

Snowplow uses a single [`atomic.events`](https://docs.snowplow.io/docs/fundamentals/canonical-event/) table in  warehouses like Snowflake and BigQuery. Events and entities are stored as structured columns within that table.

## What do events look like?

Segment uses flat JSON `properties` objects in `track` events. Snowplow uses a nested [event-entity model](/docs/fundamentals/events/index.md) where events can be enriched with multiple contextual entities.

### Segment

Segment's core method for tracking user behavior is `track`. A `track` call contains a name that describes the action taken, and a `properties` object that contains contextual information about the action.

The other Segment tracking methods are:
* `page` and `screen`: records page views and screen views
* `identify`: describes the user, and associates a `userId` with user `traits`
* `group`: associates the user with a group
* `alias`: merges user identities, for identity resolution across applications

Data about the user's action is tracked separately from data about the user. You'll stitch them together during data modeling in the warehouse.

Here's an example showing how you could track a user registration event in Segment:

```javascript
analytics.track("User Registered", {
  plan: "Pro Annual",
  accountType: "Facebook"
});
```

The tracked events can be optionally validated against Protocols. These are defined by you, and will detect violations against your tracking plan. You can choose to filter out events that don't pass validation.

### Snowplow

Snowplow events generally contain more data than Segment events. Each [event](/docs/fundamentals/events/index.md) contains data about the action, as well as about the user and any other relevant contextual information.

Snowplow SDKs also provide methods for tracking page views and screen views, along with many other kinds of events, such as button clicks, form submissions, page pings (activity), add to cart, and so on. The equivalent to Segment's `track` is tracking custom events with `track_self_describing_event`.

All Snowplow events, whether designed by you or built-in, are defined by [JSON schemas](/docs/fundamentals/schemas/index.md). The events are always validated as they're processed through the Snowplow pipeline, and events that fail validation are separated out for assessment.

To track a user registration event in Snowplow, you could define a custom event to track like this:

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme_company/user_registration/jsonschema/1-0-0',
    data: {
      plan: "Pro Annual",
      accountType: "Facebook",
    }
  }
});
```

This call doesn't appear to contain more information than the Segment `track` call, because only the event definition is shown. Here's the same example with additional data tracked about the user, as a `user` entity:

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme_company/user_registration/jsonschema/1-0-0',
    data: {
      plan: "Pro Annual",
      accountType: "Facebook",
    }
  },
  context: [{
    schema: "iglu:com.acme_company/user/jsonschema/1-0-0",
    data: {
      userId: "12345",
    }
  }]
});
```

Instead of tracking `identify` separately, this user entity can be reused and added to all Snowplow events where it could be useful, for example `log_out`, `change_profile_image`, `view_product`, etc.

The Snowplow tracking SDKs in fact add multiple entities to all tracked events by default, including information about the specific page or screen, the user's session, and the device or browser. Many other built-in entities can be configured. As shown here, you can define custom entities to add to any Snowplow event.

### Concepts comparison

This table compares some core Segment concepts with their Snowplow equivalents.

| Segment concept     | Segment example                                               | Snowplow equivalent                                        |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| Core action         | `track('Order Completed', {revenue: 99.99, currency: 'USD'})` | Self-describing event with custom `order_completed` schema |
| User identification | `identify('user123', {plan: 'pro', created_at: '...'})`       | User entity and `setUserId` call                           |
| Page context        | `page('Pricing', {category: 'Products'})`                     | `trackPageView` with `web_page` entity                     |
| Reusable properties | `properties.product_sku` in multiple `track` calls            | Dedicated `product` entity attached to relevant events     |

## Migration phases

We recommend using a parallel-run migration approach. This process can be divided into three phases:
1. Assess and plan
2. Implement and validate
3. Cutover and optimize

### Assess and plan

- Audit existing Segment tracking calls
- Export Segment tracking plan via API, or infer from warehouse data
- Translate the Segment tracking plan into a Snowplow tracking plan based on event schemas and entities
- Deploy Snowplow infrastructure

Export your Segment tracking plan using one of these methods:
* Programmatic API export (recommended) using Segment Public API for full JSON structure
* Manual CSV download from Segment UI

Use the [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) with its Model Context Protocol (MCP) server to translate your Segment plan. See the [Snowplow CLI MCP tutorial](https://docs.snowplow.io/tutorials/snowplow-cli-mcp/introduction/) for more information about using the Snowplow CLI with MCP server.

### Implement and validate

- Add [Snowplow tracking](/docs/sources/index.md) to run in parallel with Segment tracking
- Test with [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md) for local validation
- Compare between Segment and Snowplow data in your warehouse
- Decide what to do about historical data

Assuming you're tracking on web, the [Snowplow JavaScript tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/) uses object-based calls instead of ordered parameters:
- Segment: `analytics.track('Event', {prop: 'value'})`
- Snowplow: `snowplow('trackSelfDescribingEvent', {schema: 'iglu:com.acme/event/jsonschema/1-0-0', data: {prop: 'value'}})`

All Snowplow trackers follow the same pattern:

1. Initialize tracker with a Collector endpoint
3. Use `track` methods to send events

Use [Snowtype](/docs/data-product-studio/snowtype/index.md) to generate type-safe tracking code based on your tracking plan schemas.

Use [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md) to run a local Snowplow pipeline in Docker. Point your application to the local instance to validate events in real-time before deployment.

For historical data, you have a choice of approaches:
- Coexistence: leave historical Segment data in existing tables. Use transformation layer to `UNION` Segment and Snowplow data for longitudinal analysis.
- Unification: transform and backfill historical Segment data into Snowplow format. Requires custom engineering project but provides unified historical dataset.

During parallel tracking, compare data in your warehouse using SQL queries. Focus on:

- Daily event counts
- Unique user counts
- Critical property values

### Cutover and finalize

- Update downstream consumers (BI dashboards, [dbt models](https://docs.snowplow.io/docs/modeling-data/modeling-your-data/dbt/)) to use Snowplow data
- Remove Segment trackers from application code
- Decommission Segment sources
