---
title: "Google Analytics to Snowplow"
date: "2025-01-20"
sidebar_position: 10
---

This guide helps technical implementers migrate from Google Analytics to Snowplow.

## Platform differences

There are significant differences between Google Analytics and Snowplow as data platforms. For migration, it's important to understand how Snowplow structures events differently from GA4. This affects how you'll implement tracking and how you'll model the warehouse data.

### Google Analytics event structure

GA4 uses an event-based model where all user interactions are tracked as events with parameters. The main tracking method is `gtag('event', ...)` with event names and parameter objects.

GA4 events include:
* Built-in events like `page_view`, `session_start`, and `first_visit`
* Enhanced measurement events like `scroll`, `click`, and `file_download`
* Custom events that you define for specific business actions
* Ecommerce events like `purchase`, `add_to_cart`, and `view_item`

GA4 stores all data in a single `events_YYYYMMDD` table in BigQuery with nested RECORD fields for parameters and user properties. Each parameter exists as key-value pairs with separate columns for different data types (`string_value`, `int_value`, `float_value`).

Here's an example of GA4 ecommerce tracking:

```javascript
// GA4 tracking
gtag('event', 'purchase', {
  transaction_id: '12345',
  value: 25.42,
  currency: 'USD',
  items: [{
    item_id: 'SKU_123',
    item_name: 'Product Name',
    category: 'Category',
    quantity: 1,
    price: 25.42
  }]
});
```

### Snowplow event structure

Snowplow separates the action that occurred (the [event](/docs/fundamentals/events/index.md)) from the contextual objects involved in the action (the [entities](/docs/fundamentals/entities/index.md)), such as the user, the device, products, etc.

Snowplow SDKs provide methods for tracking page views, self-describing events, and many other kinds of events. All Snowplow events are defined by [JSON schemas](/docs/fundamentals/schemas/index.md) and are validated as they're processed through the pipeline.

Here's the equivalent ecommerce tracking with Snowplow:

```javascript
// Snowplow tracking
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0',
    data: {
      transaction_id: '12345',
      revenue: 25.42,
      currency: 'USD'
    }
  },
  context: [{
    schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0',
    data: {
      id: 'SKU_123',
      name: 'Product Name',
      category: 'Category',
      price: 25.42,
      quantity: 1
    }
  }]
});
```

The key difference is that Snowplow separates the transaction event from the product entity, creating reusable data structures that can attach to multiple event types.

### Tracking comparison

This table shows how common GA4 events map to Snowplow tracking:

| GA4 Event | GA4 Example | Snowplow Implementation |
|-----------|-------------|-------------------------|
| `page_view` | `gtag('event', 'page_view', {page_title: 'Home'})` | Use `trackPageView()`. The tracker captures details like `title` and `url` automatically. |
| `purchase` | `gtag('event', 'purchase', {transaction_id: '123', value: 99.99})` | Use built-in ecommerce tracking or define a custom `purchase` schema with `trackSelfDescribingEvent`. |
| `add_to_cart` | `gtag('event', 'add_to_cart', {currency: 'USD', value: 15.25})` | Use ecommerce tracking with `product` entity attached to `add_to_cart` event. |
| Custom events | `gtag('event', 'video_play', {video_title: 'Demo'})` | Define a custom `video_play` schema containing `video_title` property and track with `trackSelfDescribingEvent`. |

### Warehouse data structure

GA4 exports all data to a single `events_YYYYMMDD` table in BigQuery with nested structures. This requires complex UNNEST operations to extract parameters and makes joining data difficult.

Snowplow uses a single [`atomic.events`](/docs/fundamentals/canonical-event/index.md) table where events and entities appear as structured columns. This eliminates the need for complex unnesting and simplifies analysis.

### Key architectural differences

| Feature | Google Analytics 4 | Snowplow |
|---------|-------------------|----------|
| **Deployment** | SaaS-only; data processed on Google servers | Private cloud; runs in your AWS/GCP/Azure account |
| **Data ownership** | Data exported to BigQuery; vendor controls processing | Complete data ownership and pipeline control |
| **Data validation** | Optional validation through limited schema enforcement | Mandatory schema validation for all events |
| **Real-time processing** | 1-4 hour batch processing | 2-5 second event processing |
| **Customization** | Limited to predefined parameters and events | Unlimited custom events and entities |
| **Cost model** | Based on BigQuery usage and data export limits | Based on event volume and infrastructure usage |

## Migration phases

We recommend using a parallel-run migration approach. This process can be divided into three phases:
1. Assess and plan
2. Implement and validate
3. Cutover and finalize

### Assess and plan

#### Audit existing implementation
- Audit all GA4 tracking in your application code (gtag, Google Tag Manager)
- Document all custom events, parameters, and conversion definitions
- Export GA4 configuration and identify enhanced ecommerce tracking patterns
- Map existing audiences and segments
- Document downstream data consumers (BI dashboards, reports, ML models)

#### Design Snowplow tracking plan
- Translate GA4 events into Snowplow self-describing events
  - The [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) MCP server can help with this
- Identify reusable entities that can replace repeated parameters
- Create JSON schemas for all events and entities
- Design enhanced data capture beyond GA4's limitations

#### Deploy infrastructure
- Set up Snowplow pipeline components in your cloud environment
- Configure data warehouse destinations
- Publish schemas to your schema registry
  - Use Snowplow BDP Console or the Snowplow CLI

### Implement and validate

#### Set up dual tracking
- Add [Snowplow tracking](/docs/sources/index.md) to run parallel with existing GA4 tracking
  - Use [Snowtype](/docs/data-product-studio/snowtype/index.md) to generate type-safe tracking code
- Configure Google Tag Manager Server-side if needed to avoid client-side changes
- Use [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md) for local testing

#### Data validation
- Compare high-level metrics between systems (daily events, unique users, sessions)
- Validate critical business events and parameter values
- Perform end-to-end data reconciliation in your warehouse
- Monitor data quality and pipeline health

#### Historical data strategy

For historical data, you have two approaches:
- **Coexistence**: leave historical GA4 data in BigQuery. Write queries that combine data from both systems using transformation layers in dbt.
- **Unification**: export GA4 data from BigQuery and transform it into Snowplow format. This requires custom engineering work but provides a unified historical dataset.

#### Gradual rollout
- Start with non-critical pages or events
- Gradually expand tracking coverage
- Update [dbt models](https://docs.snowplow.io/docs/modeling-data/modeling-your-data/dbt/) to use Snowplow data structure
- Test downstream integrations

### Cutover and finalize

#### Update downstream consumers
- Migrate BI dashboards and reports to query Snowplow tables
- Update data pipelines and ML models
- Test all data-dependent workflows

#### Configure integrations
- Set up [event forwarding](https://docs.snowplow.io/docs/destinations/forwarding-events/) for real-time destinations
- Configure reverse ETL workflows if needed
- Integrate with existing marketing and analytics tools

#### Complete transition
- Remove GA4 tracking code from applications
- Archive GA4 configuration and data exports
- Update documentation and team processes
- Monitor system performance and data quality post-migration
