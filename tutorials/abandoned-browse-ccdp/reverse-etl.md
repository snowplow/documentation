---
position: 4
title: Reverse ETL Integration
---

Next we will set up a Census sync to build an audience using our query from Snowflake, filter the audience to focus on users who have shown interest in products but haven't purchased, and sync the data to Braze.

## Connect Census to Snowflake

1. Log into your Census account ([sign up if needed](https://www.getcensus.com/))
2. Go to **Sources**
3. Click "New Source" 
4. Select Snowflake
5. Enter your Snowflake connection details
6. Test the connection and save

## Create Your Abandoned Browse Audience

Use the query from the [Data Modeling](./data-modeling.md#identifying-most-viewed-but-not-added-to-cart-products) step to identify users who have shown interest in products but haven't purchased. Here it is again:

```sql
WITH productsViewedToday AS (
    SELECT 
        domain_userid, 
        page_urlpath AS product_id, 
        MAX(user_id) AS email,
        MAX(product.value:name::STRING) AS product,
        5 * SUM(CASE WHEN event_name = 'page_ping' THEN 1 ELSE 0 END) AS time_engaged_in_s,
        MAX(
            CASE 
                WHEN ecom_action.value:type = 'add_to_cart' 
                THEN TRUE 
                ELSE FALSE 
            END
        ) AS add_to_cart,
        MAX(
            CASE 
                WHEN page_urlquery = 'abandonedEmail=true' 
                THEN TRUE 
                ELSE FALSE 
            END
        ) AS winback_successful,
        MAX(page_url) AS product_url
    FROM 
        SNOWPLOW_SALES_AWS_PROD1_DB.ATOMIC.EVENTS,
        LATERAL FLATTEN(input => contexts_com_snowplowanalytics_snowplow_ecommerce_product_1) product,
        LATERAL FLATTEN(input => contexts_com_snowplowanalytics_snowplow_web_page_1) page,
        LATERAL FLATTEN(input => unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1) ecom_action
    WHERE 
        DATE(load_tstamp) = CURRENT_DATE()
        AND page_urlpath LIKE '/product%'
    GROUP BY 
        1, 2
    ORDER BY 
        time_engaged_in_s DESC
)

SELECT 
    a.* 
FROM 
    productsViewedToday a
LEFT JOIN 
    productsViewedToday b
    ON a.email = b.email 
    AND a.time_engaged_in_s < b.time_engaged_in_s
WHERE 
    b.time_engaged_in_s IS NULL 
    AND a.email IS NOT NULL;
```

## Set Up the Census Sync

1. In Census, go to **Syncs** and click "Create New Sync"
2. For the Source:
   - Select your Snowflake connection
   - Paste in your abandoned browse query
   - Test the query to ensure it returns data

3. For the Destination:
   - Select your marketing platform (e.g., Braze)
   - Choose the appropriate object type (e.g., Users or Events)

4. Map the fields:
   - User ID → External User ID
   - Product ID → Custom Attribute
   - Total View Time → Custom Attribute
   - Last View Time → Custom Attribute

5. Configure sync settings:
   - Set sync frequency (e.g., every 1 hour)
   - Choose sync behavior (e.g., update or mirror)
   - Enable "Full Sync" for the first run

6. Save and start the sync

Once your Census sync is configured and running, proceed to the [Creating Campaigns in Braze](./braze-campaign.md) guide to set up your marketing automation campaign.

## Monitoring and Optimization

- Monitor sync status in Census dashboard
- Track campaign performance metrics
- A/B test different message content and timing
- Adjust view time thresholds based on results

## Best Practices

- Review view time thresholds (10+ seconds) to ensure genuine interest
- Include product images and details in your messages
- Add urgency elements (e.g., limited time offers)
- Test different message sequences and timings
- Monitor unsubscribe rates to avoid message fatigue

By following these steps, you'll have an automated system that identifies users showing genuine interest in products and triggers relevant abandoned browse campaigns to encourage purchases.

## Next Step

Proceed to the [Creating Campaigns in Braze](./braze-campaign.md) step to set up your marketing automation campaign.