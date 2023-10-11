---
title: "Web analytics"
description: "Learn how to aggregated user data into sessions"
date: "2020-10-12"
sidebar_position: 0
---

```mdx-code-block
import { Accelerator } from "@site/src/components/AcceleratorAdmonitions";

<Accelerator href="https://docs.snowplow.io/accelerators/web/" name="Advanced Analytics for Web"/>
```

## Introduction

:::caution

While this recipe is still relevant if you want to process the raw data yourself, we recommend you use our [snowplow-web dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md) instead now to do all this for you!

:::

Snowplow empowers you to collect granular data from your website(s). To gain a better understanding of how users are engaging, let's start off by aggregating this data into sessions. While sessions don't tell you everything, and don't necessarily reflect the entire customer journey, they are great for some initial exploratory analysis such as:

- How many sessions does each of your marketing channels generate?
- What is the average time users spend engaging with your site in a given session? How does that compare to the average session length?
- How many pages do users look at in a given session?
- Etc.

## What you'll be doing

You have already set up Snowplow’s out of the box web tracking by instrumenting the Javascript Tracker in your application. This includes tracking `page_view` and `page_ping` events.

The next step is to aggregate these events into sessions. For that purpose, you'll be reviewing the default Snowplow session logic, and then running a simple SQL query to model the data.

## Updating the sessionization logic (optional)

The Snowplow JavaScript tracker automatically tracks a session identifier and a session index with all web events. Sessions are reset after 30 minutes of inactivity by default, but this can be changed this in the tracker initialization by adding the `sessionCookieTimeout` (in seconds):

```javascript
window.snowplow("newTracker", "sp", ..., {
    appId: "hosted-snowplow",
    platform: "web",
    sessionCookieTimeout: 3600,
    contexts: {
        webPage: true,
        performanceTiming: true
    }
});
```

Furthermore, you can manually reset a session, for example after a conversion, like so:

```javascript
window.snowplow("newSession");
```

Go ahead and update the sessionization logic in your tracker implementation if you would like to. More information on the Snowplow session cookie can be found [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/how-the-tracker-stores-state/index.md#the-session-cookie).

## Modeling sessions

#### What does the model do?

For this recipe you'll create a simple session table describing web engagement by running the following query in your query tool of choice. This is a very simplified version of the sessions table produced by our standard web data model. For each session, it will capture the session ID, session start and end times, marketing channel as well as engagement information: page views, link clicks and time engaged (in seconds).

#### First generate the table:

```sql
CREATE TABLE derived.sessions AS(
    WITH sessions AS (
        SELECT
            ev.domain_sessionid AS session_id, 
            MIN(ev.derived_tstamp) AS session_start, 
            MAX(ev.derived_tstamp) AS session_end,
            SUM(CASE WHEN ev.event_name = 'page_view' THEN 1 ELSE 0 END) AS page_views,
            SUM(CASE WHEN ev.event_name = 'link_click' THEN 1 ELSE 0 END) AS link_clicks,
            10*SUM(CASE WHEN ev.event_name = 'page_ping' THEN 1 ELSE 0 END) AS time_engaged_in_s
        
        FROM atomic.events AS ev
        GROUP BY 1
    )

    SELECT
        -- session information
        s.session_id,
        s.session_start,
        s.session_end,

        -- marketing channel
        CASE
            WHEN ev.refr_medium IS NULL AND ev.page_url NOT ILIKE '%utm_%' THEN 'Direct'
            WHEN (ev.refr_medium = 'search' AND ev.mkt_medium IS NULL) OR (ev.refr_medium = 'search' AND ev.mkt_medium = 'organic') THEN 'Organic Search'
            WHEN ev.refr_medium = 'search' AND ev.mkt_medium ILIKE '%(cpc|ppc|paidsearch)%' THEN 'Paid Search'
            WHEN ev.refr_medium = 'social' OR ev.mkt_medium ILIKE '%(social|social-network|social-media|sm|social network|social media)%' THEN 'Social'
            WHEN ev.refr_medium = 'email' OR ev.mkt_medium ILIKE 'email' THEN 'Email'
            WHEN ev.mkt_medium ILIKE '%(display|cpm|banner)%' THEN 'Display'
            ELSE 'Other'
        END AS marketing_channel,

        -- activity
        s.page_views,
        s.link_clicks,
        s.time_engaged_in_s

    FROM atomic.events AS ev
    INNER JOIN sessions AS s
        ON ev.domain_sessionid = s.session_id AND ev.derived_tstamp = s.session_start

    GROUP BY 1,2,3,4,5,6,7
);
```

#### And then view it:

```sql
SELECT * FROM derived.sessions;
```

#### Other queries you might want to run:

Sessions by marketing channel:

```sql
SELECT
    marketing_channel,
    COUNT(DISTINCT session_id) AS sessions 
FROM derived.sessions
GROUP BY 1 ORDER BY 2 DESC;
```

Average number of page views and time engaged in seconds per session:

```sql
SELECT
    AVG(page_views) AS avg_page_views,
    AVG(time_engaged_in_s) AS avg_time_engaged_in_s 
FROM derived.sessions;
```

## Let's break down what you've done

- You have captured a session identifier with all web events, and customized the sessionization logic to match your requirements.
- You have run a simple SQL query to model the Snowplow data collected from your website into sessions. Based on the sessions table, you can easily see how users are engaging with your site.

## Further reading

For more information on how Snowplow models web data, take a look at [our dbt web data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md).

A general view of Snowplow for web can also be found on [our website](https://snowplowanalytics.com/web/).

```mdx-code-block
import { AllAccelerators } from "@site/src/components/AcceleratorAdmonitions";

<AllAccelerators/>
```
