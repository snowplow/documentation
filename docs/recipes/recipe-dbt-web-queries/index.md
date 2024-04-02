---
title: "Derived Web Analytics Queries"
sidebar_position: -10
description: A selection of useful SQL queries to run on the derived dbt unified package data
---


The [Snowplow Unified data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) enables analysts to more easily generate insights from their Snowplow data, without having to run potentially complicated, long-running and expensive queries over the raw event level data. This how-to guide is designed to give an inspiration of how the derived tables in the model (`views`, `sessions` and `users`) can be used to answer common web analytics questions. This guide is aimed at analysts using query tools (such as Redash, Metabase, Superset etc) to interrogate their Snowplow data, and to also highlight to other users how the Snowplow derived data can be used (potentially with SQL based BI tools such as Tableau, Looker, Power BI etc).

Most of these queries are relatively warehouse agnostic, however there may be small differences such the order of arguments in `date_trunc()` (which are reversed in BigQuery) or casting types you may need to edit. You will also need to substitute the relevant schema name into these queries.

In some cases, some of these queries can be merged to display multiple metrics or dimensions, making n-dimensional pivoting or slicing and dicing possible. 

## Page Views Table
### Top 10 Most Viewed Pages

```sql
SELECT
    page_urlpath,
    COUNT(DISTINCT view_id) AS page_views
FROM derived.views
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10
```

### Page Views by Device
```sql
SELECT
    device_category,
    COUNT(DISTINCT view_id) AS page_views
FROM derived.views
GROUP BY 1
ORDER BY 2 DESC
```

### Page Views Over Time
```sql
SELECT
    date_trunc('day', start_tstamp) as date, 
    COUNT(DISTINCT view_id) AS page_views
FROM derived.views
GROUP BY 1
```

### Top Exit Pages
```sql
SELECT
    page_urlpath,
    COUNT(DISTINCT CASE WHEN VIEW_IN_SESSION_INDEX = VIEWS_IN_SESSION THEN VIEW_ID END) AS exits,
    COUNT(DISTINCT CASE WHEN VIEW_IN_SESSION_INDEX = VIEWS_IN_SESSION THEN VIEW_ID END) / count(DISTINCT VIEW_ID) as exit_rate
FROM derived.views
GROUP BY 1
```

### Running Count of Page Views Over Time
```sql
WITH page_views_by_day AS
    (SELECT
        DATE_TRUNC('day', start_tstamp) AS date,
        COUNT(DISTINCT VIEW_ID) AS page_views
    FROM derived.views
    GROUP BY 1)

SELECT
    date,
    page_views,
    SUM(page_views) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_count
FROM page_views_by_day
```

### Average Scroll Depths of Top 10 Pages
```sql
SELECT
    page_title,
    COUNT(DISTINCT VIEW_ID) AS page_views,
    AVG(vertical_percentage_scrolled) AS avg_scroll_depth
FROM derived.views
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10
```

## Sessions Table
### Top 10 Landing Pages Over Time
```sql
WITH top_landing_pages AS
    (SELECT
        first_page_urlpath AS landing_page,
        COUNT(DISTINCT SESSION_IDENTIFIER) AS n
    FROM derived.sessions
    WHERE start_tstamp > CURRENT_DATE - 30
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 10)

SELECT
    DATE_TRUNC('day', start_tstamp) AS date,
    first_page_urlpath AS landing_page,
    COUNT(DISTINCT SESSION_IDENTIFIER) AS sessions
FROM derived.sessions a
WHERE 
    EXISTS (SELECT 1 from top_landing_pages b where a.first_page_urlpath = b.landing_page)
    AND start_tstamp > CURRENT_DATE - 30
GROUP BY 1, 2
```

### Unique Users Over Time
```sql
SELECT
    DATE_TRUNC('day', start_tstamp) AS date,
    COUNT(DISTINCT USER_IDENTIFIER)   AS unique_users
FROM derived.sessions
WHERE start_tstamp > current_date - 30
GROUP BY 1
```

### Pages Per Session
```sql
WITH sessions_with_pageviews AS
    (SELECT
        SESSION_IDENTIFIER,
        VIEWS AS page_visited
    FROM derived.sessions
    WHERE start_tstamp > current_date - 30)

SELECT
    page_visited,
    COUNT(*)
FROM sessions_with_pageviews
GROUP BY 1
ORDER BY 1
```

### Bounce Rate Over Time
```sql
SELECT
    DATE_TRUNC('day', start_tstamp) AS date,
    SUM(CASE WHEN VIEWS = 1 THEN 1 ELSE 0 END)::decimal / count(DISTINCT SESSION_IDENTIFIER)::decimal AS bounce_rate
FROM derived.sessions
WHERE start_tstamp > current_date - 30
GROUP BY 1
```

### New vs Returning Users
```sql
SELECT
    DATE_TRUNC('day', start_tstamp)                                 AS date,
    CASE WHEN device_session_index = 1 THEN 'New' ELSE 'Returning' END AS new_returning,
    COUNT(DISTINCT SESSION_IDENTIFIER)                                AS sessions
FROM derived.sessions
WHERE start_tstamp > current_date - 30
GROUP BY 1, 2
```

### Proportion New User Sessions
```sql
SELECT
    DATE_TRUNC('day', start_tstamp) AS date,
    count(DISTINCT CASE WHEN device_session_index = 1 THEN SESSION_IDENTIFIER ELSE null END)::decimal / count(DISTINCT SESSION_IDENTIFIER)::decimal AS pc_new_users
FROM derived.sessions
WHERE start_tstamp > current_date - 30
GROUP BY 1
```

### Average Session Duration (Absolute vs Engaged Time)
```sql
WITH absolute AS
    (SELECT
        DATE_TRUNC('day', start_tstamp) AS date,
        SESSION_IDENTIFIER,
        absolute_time_in_s              AS time,
        'Absolute Time in Seconds'      AS measure_name
    FROM derived.sessions
    WHERE start_tstamp > current_date - 30),

engaged AS
    (SELECT
        DATE_TRUNC('day', start_tstamp) AS date,
        SESSION_IDENTIFIER,
        engaged_time_in_s               AS time,
        'Engaged Time in Seconds'       AS measure_name
    FROM derived.sessions
    WHERE start_tstamp > current_date - 30
    ),

combine AS
    (SELECT *
    FROM absolute
    UNION ALL
    SELECT *
    FROM engaged)

SELECT
    date,
    measure_name,
    AVG(time) AS time_on_site
FROM combine
GROUP BY 1, 2
```

### Traffic by Channel (source/medium)
```sql
SELECT
    DATE_TRUNC('day', start_tstamp)   AS date,
    mkt_source || ' / ' || mkt_medium AS source_medium,
    COUNT(DISTINCT SESSION_IDENTIFIER)  AS sessions
FROM derived.sessions
WHERE 
    start_tstamp > current_date - 30
    AND mkt_source IS NOT NULL
    AND mkt_medium IS NOT NULL
GROUP BY 1, 2
```

### Paid Search vs Organic Search
```sql
SELECT
    DATE_TRUNC('day', start_tstamp)                AS date,
    CASE
        WHEN mkt_clickid IS NOT NULL THEN 'PPC'
        WHEN refr_medium = 'search' THEN 'Organic'
    END                                            AS ppc_org,
    COUNT(DISTINCT SESSION_IDENTIFIER)               AS sessions
FROM derived.sessions
WHERE 
    start_tstamp > current_date - 30
    AND (mkt_clickid IS NOT NULL OR refr_medium = 'search')
GROUP BY 1, 2
```

## Users Table
### Recency
```sql
WITH most_recent_dates AS
    (SELECT
        DATE_TRUNC('day', end_tstamp) AS most_recently_seen,
        COUNT(DISTINCT USER_IDENTIFIER) AS users
    FROM derived.users
    WHERE DATE_TRUNC('day', end_tstamp) > CURRENT_DATE - 30
    GROUP BY 1),

daily_counts AS
    (SELECT
        -DATEDIFF('day', CURRENT_DATE, most_recently_seen) AS days_since_last_visit,
        SUM(users) AS users
    FROM most_recent_dates
    GROUP BY 1)

SELECT
   CASE
      WHEN days_since_last_visit = 0 THEN '0'
      WHEN days_since_last_visit = 1 THEN '1'
      WHEN days_since_last_visit = 2 THEN '2'
      WHEN days_since_last_visit = 3 THEN '3'
      WHEN days_since_last_visit = 4 THEN '4'
      WHEN days_since_last_visit = 5 THEN '5'
      WHEN days_since_last_visit <= 10 THEN '6-10'
      WHEN days_since_last_visit <= 25 THEN '11-25'
      ELSE '25+' END AS days_between_visits,
   SUM(users) AS users
FROM daily_counts
GROUP BY 1
ORDER BY 1
```

### User Acquisition Dates
```sql
SELECT
    DATE_TRUNC('day', start_tstamp) AS first_seen,
    COUNT(DISTINCT USER_IDENTIFIER)   AS users
FROM derived.users
WHERE end_tstamp > current_date - 30
GROUP BY 1
```

### Original Acquisition Channels
```sql
SELECT
    mkt_source,
    mkt_medium,
    mkt_campaign,
    refr_source,
    COUNT(DISTINCT USER_IDENTIFIER) AS users
FROM derived.users
WHERE end_tstamp > current_date - 300
GROUP BY 1, 2, 3, 4
```
