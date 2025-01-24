---
position: 3
title: Data modeling
---
## Sending Events and Verifying Data

After implementing the tracking setup, send some events and test that they are arriving in your data warehouse. If you don't have a data warehouse, you can sign up for a free trial of Snowflake.

Once you have sent data to Snowflake, you can run the following query to verify the events are coming through:

```sql
SELECT 
    domain_userid, 
    page_urlpath AS product_id, 
    event_name,
    page_title,
    contexts_com_snplow_sales_gcp_demo_ecommerce_entity_user_1,
    contexts_com_snowplowanalytics_snowplow_ecommerce_product_1,
    contexts_com_snowplowanalytics_snowplow_web_page_1
FROM SNOWPLOW_SALES_AWS_PROD1_DB.ATOMIC.EVENTS
WHERE 
    DATE(load_tstamp) = CURRENT_DATE()
    and app_id = 'ShopifyDemo'
ORDER BY load_tstamp DESC;
```

### Identifying Most Viewed but Not Added-to-Cart Products

Once events are confirmed, use the following query to determine the product that was viewed the most but not added to the cart:

```sql
WITH productsViewedToday AS (
SELECT 
    domain_userid, 
    page_urlpath AS product_id, 
    MAX(user.value:firstName::STRING) AS first_name, 
    MAX(user.value:email::STRING) AS email,
    MAX(product.value:name::STRING) AS product,
    5 * SUM(CASE WHEN event_name = 'page_ping' THEN 1 ELSE 0 END) AS time_engaged_in_s,
    MAX(CASE WHEN unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type::STRING = 'add_to_cart' THEN TRUE ELSE FALSE END) AS add_to_cart,
    MAX(CASE WHEN page_urlquery = 'abandonedEmail=true' THEN TRUE ELSE FALSE END) AS winback_successful,
    FALSE AS purchased,
    'Facebook' AS channel,
    'NewSnowboardsCampaign' AS campaign,
    MAX(page_url) AS product_url
FROM SNOWPLOW_SALES_AWS_PROD1_DB.ATOMIC.EVENTS,
    LATERAL FLATTEN(input => contexts_com_snplow_sales_gcp_demo_ecommerce_entity_user_1) user,
    LATERAL FLATTEN(input => contexts_com_snowplowanalytics_snowplow_ecommerce_product_1) product,
    LATERAL FLATTEN(input => contexts_com_snowplowanalytics_snowplow_web_page_1) page
WHERE 
    DATE(collector_tstamp) = CURRENT_DATE()
    AND app_id = 'ShopifyDemo'
    AND page_urlpath LIKE '/product%'
GROUP BY 1, 2
ORDER BY time_engaged_in_s DESC
)

SELECT a.* 
FROM productsViewedToday a
LEFT JOIN productsViewedToday b
  ON a.email = b.email AND a.time_engaged_in_s < b.time_engaged_in_s
WHERE b.time_engaged_in_s IS NULL 
  AND a.email IS NOT NULL;
```