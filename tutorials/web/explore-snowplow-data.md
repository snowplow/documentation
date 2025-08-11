---
title: Explore Snowplow data
position: 5
---

Data should now be loaded into your warehouse. In this section we will take a closer look at the output to mitigate data issues and get familiar with the derived tables.

## Check the output schemas

Head to the SQL editor of your choice (e.g., Snowflake Web UI) to check the model's output. You should be able to see three new schemas created:

1. `[your_custom_schema]_scratch`: drop and recompute models that aid the incremental run
2. `[your_custom_schema]_derived`: main output models you can use in your downstream models and reporting
3. `[your_custom_schema]_snowplow_manifest`: tables that help the integrity and core incremental logic of the model

## Explore your data

Take some time to familiarize yourself with the derived tables. You could run a few simple queries such as the ones listed below. Make sure to modify the schema to be aligned with your custom dbt schema.

### Find out the number of page reads using `derived.snowplow_unified_views`

```sql
WITH READS AS (
  SELECT
    PAGE_TITLE,
    COUNT(*)
  FROM
    YOUR_CUSTOM_SCHEMA_DERIVED.SNOWPLOW_UNIFIED_VIEWS
  WHERE
    ENGAGED_TIME_IN_S > 60
    AND VERTICAL_PIXELS_SCROLLED > 5000
  GROUP BY 1
  ORDER BY 2 DESC
)

SELECT * FROM READS
```

### Calculate the bounce rate using `derived.snowplow_unified_sessions`

```sql
WITH BOUNCE_RATE AS (
  SELECT
    FIRST_PAGE_URLPATH,
    COUNT(DISTINCT SESSION_ID) AS SESSIONS,
    COUNT(DISTINCT CASE WHEN PAGE_VIEWS = 1 THEN SESSION_ID END) / COUNT(DISTINCT SESSION_ID) AS BOUNCE_RATE
  FROM YOUR_CUSTOM_SCHEMA_DERIVED.SNOWPLOW_UNIFIED_SESSIONS
  GROUP BY 1
  ORDER BY SESSIONS DESC
)

SELECT * FROM BOUNCE_RATE
```

### Find out details about the highest engaged user using `derived.snowplow_unified_users`

```sql
WITH ENGAGEMENT AS (
  SELECT *
  FROM YOUR_CUSTOM_SCHEMA_DERIVED.SNOWPLOW_UNIFIED_USERS
  ORDER BY ENGAGED_TIME_IN_S DESC
  LIMIT 1
)

SELECT * FROM ENGAGEMENT
```

Check out the **database** section of the [documentation site](https://snowplow.github.io/dbt-snowplow-unified/#!/overview/snowplow_unified) for a full breakdown of what the output should look like.
