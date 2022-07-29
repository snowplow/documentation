---
title: "Tutorial: User engagement"
date: "2020-10-12"
sidebar_position: 70
---

## Introduction

Deep insights into how your customers interact with you across platforms over time enable you to deliver excellent customer experiences. While sessions are a great place to start understanding how your site is performing, only by looking at the entire customer journey you get a true understanding of who your users are, how they engage with you and how you can improve their experience.

There are two key steps in understanding user engagement:

- Capture their behaviour in granular detail, and aggregate that behaviour into an easily consumable format.
- Consistently identify users across platforms to ensure you are seeing the full picture.

This recipe will focus on capturing and aggregating user behaviour. You might also want to take a look at [our single customer view recipe](/docs/migrated/try-snowplow/recipes/recipe-single-customer-view/) that tackles user stitching more specifically.

## What you'll be doing

You have already set up Snowplow’s out of the box web tracking by instrumenting the Javascript Tracker in your application. This includes tracking `page_view` and `page_ping` events.

With all web events the Snowplow JavaScript tracker captures the following user identifiers automatically:

<table><tbody><tr><td><code>domain_userid</code></td><td>client side cookie ID set against the domain the tracking is on</td></tr><tr><td><code>network_userid</code></td><td>server side cookie ID set against the collector domain</td></tr><tr><td><code>user_ipaddress</code></td><td>the user’s IP address</td></tr></tbody></table>

Please note that in Try Snowplow, these fields (as well as the `domain_sessionid`) are being hashed with Snowplow's [PII enrichment](/docs/migrated/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/) to protect user privacy. With Snowplow BDP, you are able to configure this enrichment to hash (or not hash) any number of out of the box or custom fields.

Additionally, Snowplow allows you to specify a custom user ID, which we'll be adding in this recipe. We'll then build a user engagement table to explore how you can develop a better understanding of how your users engage with you over time.

## Implement a custom user ID (optional)

Adding a custom user ID with the Snowplow Javascript Tracker is easy. You'll simply add this line to your out of the box tracking:

```
window.snowplow('setUserId', "example_user_id");
```

If you are using Google Tag Manager, you can add the variable like so:

```
window.snowplow('setUserId', "{{example_user_id_variable}}");
```

Make sure you add this method before you start tracking events, i.e.

```
window.snowplow('setUserId', "example_user_id");
window.snowplow('enableActivityTracking', { minimumVisitLength: 10, heartbeatDelay: 10 });
window.snowplow('enableLinkClickTracking');
window.snowplow('trackPageView');
window.snowplow('enableFormTracking');
```

## Modeling the data you've collected

#### What does the model do?

Aggregating the user behaviour data you have collected into a table with one row per user makes it much easier to understand how your customers are engaging with your website.

The following SQL creates a table of one row per user (as identified by one of the Snowplow cookie IDs), with additional user information as well as engagement measures including number of page views and sessions, total time engaged, etc.

Once you have collected some data with your new tracking you can run the following two queries in your tool of choice.

#### First generate the table:

```
CREATE TABLE derived.user_engagement AS(

    SELECT
        -- user information
        ev.domain_userid,
        LAST_VALUE(ev.network_userid) OVER (PARTITION BY ev.domain_userid ORDER BY ev.derived_tstamp) AS network_userid,
        LAST_VALUE(ev.user_id) OVER (PARTITION BY ev.domain_userid ORDER BY ev.derived_tstamp) AS user_id,
        ev.user_ipaddress AS ip_address, 
        ev.geo_country AS country, -- this field will be null as we cannot enable MaxMind geo data in the Try Snowplow experience due to CCPA regulation
        ev.geo_city AS city, -- this field will be null as we cannot enable MaxMind geo data in the Try Snowplow experience due to CCPA regulation
        ua.useragent_family AS browser,
        ua.os_family AS operating_system,

        -- user engagement
        MIN(derived_tstamp) AS first_interaction,
        MAX(derived_tstamp) AS last_interaction,
        10*SUM(CASE WHEN ev.event_name = 'page_ping' THEN 1 ELSE 0 END) AS total_time_engaged_in_s,
        COUNT(DISTINCT ev.domain_sessionid) AS sessions,
        (10*SUM(CASE WHEN ev.event_name = 'page_ping' THEN 1 ELSE 0 END))/(COUNT(DISTINCT ev.domain_sessionid)) AS avg_time_engaged_in_s_per_session,
        SUM(CASE WHEN ev.event_name = 'page_view' THEN 1 ELSE 0 END) AS page_views,
        SUM(CASE WHEN ev.event_name = 'link_click' THEN 1 ELSE 0 END) AS link_clicks

    FROM atomic.events AS ev
    INNER JOIN atomic.com_snowplowanalytics_snowplow_ua_parser_context_1 AS ua
        ON ev.event_id = ua.root_id AND ev.collector_tstamp = ua.root_tstamp

    WHERE ev.domain_userid IS NOT NULL
    GROUP BY 1,4,5,6,7,8, ev.network_userid, ev.user_id, ev.derived_tstamp

);
```

#### And then view it:

```
SELECT * FROM derived.user_engagement;
```

## Let's break down what we've done

- You have learnt what user identifiers Snowplow tracks out of the box, and how you can add a custom user ID to Snowplow web events.
- You have created a simple user engagement table that aggregates user activity into an easily queryable format. This allows you to better understand how your users are interacting with your site.

## What you might want to do next

This recipe covers a really simple example of aggregating user engagement based on Snowplow's out of the box events and the custom user ID only. Next, you might want to

- Build a user stitching table to make sure you are including all user activity correctly based on the different identifiers you observe across platforms. You can explore Snowplow's approach to user stitching in [our single customer view recipe](/docs/migrated/try-snowplow/recipes/recipe-single-customer-view/).
- Instrument additional events to better understand how your users are engaging with you.
- Start to think about how you might use user attributes and user behaviour to segment your user base. Segmentation is the first step towards personalizing user experience.
