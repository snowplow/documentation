---
title: Explore user features
position: 2
---

Primary features returned from the Snowplow dbt web model can be grouped into categories based on their origin:

- **Temporal** – created from first event timestamp: an hour of the day, day of the week
- **Landing Page** – page title of the first URL, comes out of the box
- **Device** – User Agent enrichment
- **Referral** – Referral enrichment
- **Marketing** – Marketing campaign enrichment
- **Geographic** – IP lookup enrichment
- **Engagement** – Accumulated page ping events by dbt page view model

## Collect user features from Snowplow derived tables

First you need to create a view or table of users features based on their first website visit. If you are using your own conversion flag ensure you include this so you are ready to train and test your models. Conversion can be derived from a Snowplow tracked event or using other sources like Salesforce data.

:::note
If you are using the sample datasets, use the `converted_users` CTE shown in the example below. Otherwise replace or remove this with your own conversion events or tables.
:::

```sql
create or replace view first_touch_user_features as (
    with first_page_view as (
        select
            user_id,
            absolute_time_in_s,
            vertical_percentage_scrolled,
            geo_country,
            geo_region,
            br_lang,
            device_family,
            os_family
        from snowplow_web_page_views
        where page_view_in_session_index = 1
        qualify
          row_number() over (partition by user_id order by start_tstamp) = 1
    ),

    converted_users as (
    -- Replace or remove this with your own website conversion logic
        select distinct
            user_id,
            True as converted
        from snowplow_web_page_views
        where (page_urlpath like '/get-started/%'
            or page_urlpath = '/contact-us/')
            and engaged_time_in_s >= 30
    )

    select
        u.user_id,
        u.first_page_title,
        u.refr_urlhost,
        u.refr_medium,
        u.mkt_medium,
        u.mkt_source,
        u.mkt_term,
        u.mkt_campaign,
        u.engaged_time_in_s,
        pv.absolute_time_in_s,
        pv.vertical_percentage_scrolled,
        pv.geo_country,
        pv.geo_region,
        pv.br_lang,
        pv.device_family,
        pv.os_family,
        coalesce(c.converted, false) as converted_user -- Your conversion flag here
    from snowplow_web_users u
    inner join
        first_page_view pv on
            u.user_id = pv.user_id
    left join
        converted_users c on
            u.user_id = c.user_id
    qualify
      row_number() over (partition by u.user_id order by u.start_tstamp) = 1
)
```

Here we have just selected a few of the features Snowplow behavioral data has to offer. You can include more columns before going through feature engineering as you start using ML to predict more and more types of user behavior, building out a richer view of each of your customers / users.

:::note
Consider adding this step as a custom model in dbt so the table is kept up to date when your ML model is in production. Read more about adding custom dbt models [here](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web).
:::
