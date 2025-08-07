---
title: "Run models"
position: 4
---

Now you'll run the snowplow-mobile dbt package to transform your raw event data into modeled tables. This process creates derived tables that aggregate and enrich the mobile data, making it much easier to analyze user behavior.

The modeling process will create tables for screen views, sessions, users, and user mappings. These tables contain calculated metrics like session duration, screen engagement time, and user-level aggregations.

## Step 1: Run the models

Execute the modeling process using the selector you copied in the previous step:

```bash
dbt run --selector snowplow_mobile
```

This command runs all the models in the snowplow-mobile package. The process should take a couple of minutes to complete. You'll see output showing each model being built:

```
Running with dbt=1.0.0
Found X models, Y tests, Z snapshots, ...

Completed successfully
```

## Step 2: Check the output schemas

The package creates three new schemas in your warehouse:

1. **[your_custom_schema]_scratch**: Contains temporary models that aid the incremental processing. These tables are dropped and recreated on each run.

2. **[your_custom_schema]_derived**: Contains the main output tables you'll use for analysis and reporting:
   - `snowplow_mobile_screen_views`: Individual screen view events with calculated metrics
   - `snowplow_mobile_sessions`: Session-level aggregations and metrics 
   - `snowplow_mobile_users`: User-level aggregations across all their sessions
   - `snowplow_mobile_user_mapping`: Maps different user identifiers together

3. **[your_custom_schema]_snowplow_manifest**: Contains tables that manage the incremental processing logic and data integrity checks.

## Step 3: Explore the modeled data

Take some time to explore the derived tables and understand what insights they contain. Here are some example queries to get you started:

### Screen view analysis

Find the most popular screens in your app:

```sql
SELECT
    screen_view_name,
    COUNT(*) as screen_views
FROM your_custom_schema_derived.snowplow_mobile_screen_views
GROUP BY 1 
ORDER BY 2 DESC
LIMIT 10
```

### Session bounce rate

Calculate the bounce rate (single screen view sessions) by app:

```sql
SELECT
    app_id,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(DISTINCT CASE WHEN screen_views = 1 THEN session_id END) as bounce_sessions,
    (bounce_sessions / total_sessions) * 100 as bounce_rate_percent
FROM your_custom_schema_derived.snowplow_mobile_sessions
GROUP BY 1
ORDER BY total_sessions DESC
```

### User engagement

Find your most engaged users:

```sql
SELECT
    device_user_id,
    screen_views,
    sessions,
    screen_views_per_session,
    total_engaged_time_in_s / 60 as total_engaged_minutes
FROM your_custom_schema_derived.snowplow_mobile_users
ORDER BY screen_views DESC
LIMIT 10
```

### Screen engagement metrics

Analyze which screens keep users engaged the longest:

```sql
SELECT
    screen_view_name,
    COUNT(*) as views,
    AVG(engaged_time_in_s) as avg_engaged_time_seconds,
    AVG(horizontal_pixels_scrolled + vertical_pixels_scrolled) as avg_pixels_scrolled
FROM your_custom_schema_derived.snowplow_mobile_screen_views
WHERE engaged_time_in_s > 0
GROUP BY 1
HAVING views > 10
ORDER BY avg_engaged_time_seconds DESC
```

Remember to replace `your_custom_schema` with your actual schema name in all queries.

## Understanding the data model

The snowplow-mobile package implements a specific approach to mobile analytics:

- **Screen views** are the fundamental unit of analysis, representing each time a user views a screen
- **Sessions** group screen views from the same user within a time window
- **Users** aggregate behavior across all sessions and time periods
- **Contexts** provide additional metadata like device info, geolocation, and app details

The models calculate metrics like engagement time, scroll depth, and session patterns automatically. This gives you a foundation for building dashboards and conducting analysis without having to implement these calculations yourself.

For complete details about the data model and all available columns, check the [snowplow-mobile package documentation](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-mobile-data-model/).

With your data modeled, you're ready to create visualizations to explore the insights.
