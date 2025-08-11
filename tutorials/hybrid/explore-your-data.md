---
title: Explore your data
position: 5
---

Data should now be loaded into your warehouse. In this section, we'll take a closer look at the output to mitigate data issues and get familiar with the derived tables.

## Check the output schemas

Head to the SQL editor of your choice (e.g.: Snowflake Web UI) to check the model's output. You should be able to see three new schemas created:

1. **[your_custom_schema]_scratch**: Drop and recompute models that aid the incremental run
2. **[your_custom_schema]_derived**: Main output models you can use in your downstream models and reporting
3. **[your_custom_schema]_snowplow_manifest**: Tables that help the integrity and core incremental logic of the model

## Explore your data

Take some time to familiarize yourself with the derived tables. You could run a few simple queries such as the ones listed below. Make sure to modify the schema to be aligned with your custom dbt schema.

### Find the number of screen views

```sql
WITH VIEWS AS (
  SELECT
    SCREEN_VIEW_NAME,
    COUNT(*)
  FROM YOUR_CUSTOM_SCHEMA_DERIVED.SNOWPLOW_MOBILE_SCREEN_VIEWS
  GROUP BY 1 ORDER BY 2 DESC
)

SELECT * FROM VIEWS
```

### Calculate the bounce rate

```sql
WITH BOUNCE_RATE AS (
  SELECT
    APP_ID,
    COUNT(DISTINCT SESSION_ID) AS SESSIONS,
    COUNT(DISTINCT CASE WHEN SCREEN_VIEWS = 1 THEN SESSION_ID END) / COUNT(DISTINCT SESSION_ID) AS BOUNCE_RATE
  FROM YOUR_CUSTOM_SCHEMA_DERIVED.SNOWPLOW_MOBILE_SESSIONS
  GROUP BY 1
  ORDER BY SESSIONS DESC
)

SELECT * FROM BOUNCE_RATE
```

### Find details about the highest engaged user

```sql
WITH ENGAGEMENT AS (
  SELECT *
  FROM YOUR_CUSTOM_SCHEMA_DERIVED.SNOWPLOW_MOBILE_USERS
  ORDER BY SCREEN_VIEWS DESC
  LIMIT 1
)

SELECT * FROM ENGAGEMENT
```

### Analyze hybrid app usage patterns

Since this is hybrid app data, you can also explore the relationship between native and web view interactions:

```sql
-- Compare native vs web view screen views
SELECT 
  CASE 
    WHEN SCREEN_VIEW_NAME LIKE '%web%' THEN 'Web View'
    ELSE 'Native'
  END AS VIEW_TYPE,
  COUNT(*) AS SCREEN_VIEWS,
  COUNT(DISTINCT SESSION_ID) AS SESSIONS
FROM YOUR_CUSTOM_SCHEMA_DERIVED.SNOWPLOW_MOBILE_SCREEN_VIEWS
GROUP BY 1
```

These queries demonstrate how the unified modeling treats both native screens and web view pages as screen views, providing a complete picture of user behavior across your hybrid app.

Check out the **database** section of the [documentation site](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile) for a full breakdown of what the output should look like.
