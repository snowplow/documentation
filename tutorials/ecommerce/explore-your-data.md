---
title: Explore your data
position: 12
---

Processed data should now be loaded into your warehouse. In this section we'll take a closer look at the output to get familiar with the derived tables.

## Check the output schemas

Head to the SQL editor of your choice to check the model's output. You should be able to see three new schemas created:

1. **[your_custom_schema]_scratch**: Drop and recompute models that aid the incremental run
2. **[your_custom_schema]_derived**: Main output models you can use in your downstream models and reporting
3. **[your_custom_schema]_snowplow_manifest**: Tables that help the integrity and core incremental logic of the model

## Explore your data

Take some time to familiarize yourself with the derived tables. Here are some example queries to get you started. Make sure to modify the schema to align with your custom dbt schema.

### Find sessions with abandoned carts

```sql
SELECT
    domain_sessionid,
    start_tstamp,
    end_tstamp,
    number_carts_created - (number_carts_emptied + number_carts_transacted) AS number_of_abandoned_cart
FROM
    YOUR_CUSTOM_SCHEMA.snowplow_ecommerce_sessions
WHERE
    DATE(start_tstamp) >= "2022-10-01"
    AND number_carts_created > (number_carts_emptied + number_carts_transacted)
ORDER BY
    end_tstamp DESC
LIMIT
    5;
```

### Calculate top product variants by transactions

```sql
-- Top variant in transactions per product
SELECT
    product_id,
    product_variant,
    COUNT(DISTINCT CASE WHEN is_product_transaction THEN event_id END) as number_purchased
FROM
    YOUR_CUSTOM_SCHEMA.snowplow_ecommerce_product_interactions
GROUP BY 1,2
ORDER BY 3 DESC;
```

### Analyze checkout funnel entrance points

```sql
-- Entrance per step in checkout process
SELECT
    checkout_step_number,
    COUNT(DISTINCT CASE WHEN session_entered_at_step THEN event_id END) as number_entrance_step,
    COUNT(DISTINCT event_id) as number_total_views
FROM
    YOUR_CUSTOM_SCHEMA.snowplow_ecommerce_checkout_interactions
GROUP BY 1
ORDER BY 1;
```

### Additional analysis opportunities

With the derived tables, you can now analyze:

- **Conversion funnels** - Track users from product view through purchase
- **Product performance** - Identify best and worst performing products
- **Cart abandonment rates** - Understand where users drop off in the purchase process
- **Checkout optimization** - Analyze which checkout steps cause friction
- **Revenue attribution** - Connect transactions back to marketing campaigns
- **User behavior patterns** - Segment users by purchasing behavior

## Understanding the data model

Check out the **database** section of the [documentation site](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/overview/snowplow_ecommerce) for a full breakdown of what the output should look like.

The main derived tables provide different perspectives on your ecommerce data:

- **snowplow_ecommerce_sessions** - Session-level aggregations and metrics
- **snowplow_ecommerce_product_interactions** - All product-related interactions
- **snowplow_ecommerce_cart_interactions** - Shopping cart behavior tracking
- **snowplow_ecommerce_checkout_interactions** - Checkout funnel analysis
- **snowplow_ecommerce_transactions** - Complete transaction records

These tables are designed to make common ecommerce analyses straightforward while providing the flexibility for custom analysis and reporting.
