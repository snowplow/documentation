---
title: "Marketing attribution"
description: "Get started with attribution modeling using Snowplow"
date: "2020-10-12"
sidebar_position: 10
---

```mdx-code-block
import { Accelerator } from "@site/src/components/AcceleratorAdmonitions";

<Accelerator href="https://docs.snowplow.io/accelerators/snowplow_fractribution/" name="Fractional Attribution Modeling"/>
```

## Introduction

Attribution modeling is the process of assigning credit for conversions to marketing touch points. The key to attribution modeling is capturing all marketing touchpoints and all conversions, and being able to assign them to a specific user. This allows you to look at the effectiveness of your marketing spend across platforms and channels, over time.

This recipe allows you to explore how you can get started with taking control of your attribution modeling with Snowplow. Owning your attribution modeling forces you make assumptions explicitly and deliberately, a crucial step in understanding its limitations and using its outputs appropriately. Furthermore, being able to run multiple attribution models in parallel allows you to see the impact different modeling logic have on the outputs of the model.

## What you'll be doing

You have already set up Snowplow’s out of the box web tracking by instrumenting the JavaScript Tracker in your application. This includes tracking `page_view` and `page_ping` events.

With each page view, Snowplow automatically captures the marketing parameters and referrer information as well as a session identifier. This means you have already started capturing marketing touches.

To attribute conversions, you’ll also need to track conversion events. You'll then be able to run simple query that attributes the conversions to the marketing channels based on three popular marketing attribution models:

- First touch: this model gives all credit to the user's first touch preceding a conversion
- Last touch: this model gives all credit to the user’s last touch preceding a conversion
- Linear: this model gives equal credit to all of the user touches preceding a conversion

## Design and implement the `conversion` event

#### Designing the `conversion` event

We have already created a custom `conversion` event for you in [Iglu Central](http://iglucentral.com/).

Snowplow uses self-describing JSON schemas to structure events and entities so that they can be validated in the pipeline and loaded into tidy tables in the warehouse. You can learn more about these data structures [here](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md), and about why we take this approach [here](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/).

While Try Snowplow only ships with a pre-designed set of custom events and entities required for the recipes, Snowplow BDP lets you create an unlimited number of your own via the [Data Structures UI](/docs/understanding-tracking-design/managing-data-structures/index.md) (and API) for Enterprise and via [the Data Structures Builder](/docs/understanding-tracking-design/managing-data-structures-with-data-structures-builder/index.md) for Cloud. 

The custom `conversion` event used in this recipe is very flexible so that you can instrument it across as many or as few conversions as possible. Specifically, it has the following fields:

<table><tbody><tr><td><strong>Field</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td><td><strong>Validation</strong></td><td><strong>Required?</strong></td></tr><tr><td><code>name</code></td><td>The name of the conversion</td><td>string</td><td><code>maxLength: 255</code></td><td>❌</td></tr><tr><td><code>value</code></td><td>The value assigned to the conversion, such as the revenue associated with it</td><td>integer</td><td><code>minimum: 0</code>,<br/><code>maximum: 1000000</code><br/></td><td>❌</td></tr></tbody></table>

#### Implementing the event

Trigger the conversion events wherever you have conversions on your site. Some examples might be:

- Newsletter sign up
- Cart checkout
- Item download

#### In the JavaScript Tracker

```javascript
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:io.snowplow.foundation/conversion/jsonschema/1-0-0",
      "data": {
         "name": "email-signup",
         "value": 10
      }
   }
});
```

#### Via Google Tag Manager

If you are using Google Tag Manager, you can add the variables like so:

```javascript
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:io.snowplow.foundation/conversion/jsonschema/1-0-0",
      "data": {
         "name": "{{example_conversion_variable}}",
         "value": {{example_value_variable}}
      }
   }
});
```

## Modeling the data you've collected

#### What does the model do?

Now that you are capturing marketing touches and conversions, you can get started with attributing marketing touches to conversions over time. You can compare first click, last click and linear attribution using the simple SQL query below.

#### First generate the table:

```sql
CREATE TABLE derived.marketing_attribution AS(
    WITH session_aggregations AS (

        SELECT
            ev.domain_userid AS domain_userid,
            ev.domain_sessionid AS session_id, 
            MIN(ev.derived_tstamp) AS session_start, 
            SUM(CASE WHEN ev.event_name = 'page_view' THEN 1 ELSE 0 END) AS page_views,
            SUM(CASE WHEN ev.event_name = 'conversion' THEN 1 ELSE 0 END) AS conversions,
            SUM(c.value) AS conversions_value

        FROM atomic.events AS ev
        LEFT JOIN atomic.io_snowplow_foundation_conversion_1 AS c
            ON ev.event_id = c.root_id AND ev.collector_tstamp = c.root_tstamp

        WHERE ev.event_name IN ('page_view', 'conversion')
        GROUP BY 1,2

    ), session_count AS(

        SELECT 
            domain_userid, 
            COUNT(DISTINCT session_id) AS session_count

        FROM session_aggregations

        GROUP BY 1

    ), marketing_infos AS(

        SELECT
            -- session information
            s.domain_userid,
            s.session_id,
            s.session_start,
            s.page_views,

            -- marketing information 
            ev.mkt_medium, 
            ev.mkt_source,
            ev.mkt_term, 
            ev.mkt_content,
            ev.mkt_campaign, 
            ev.mkt_network, 
            ev.mkt_clickid,

            -- referer information
            ev.refr_medium, 
            ev.refr_source, 
            ev.refr_term,

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

            -- conversions
            s.conversions,
            s.conversions_value,

            -- position
            ROW_NUMBER() OVER(PARTITION BY s.domain_userid ORDER BY s.session_start) AS position,
            c.session_count

        FROM atomic.events AS ev
        INNER JOIN session_aggregations AS s
            ON ev.domain_sessionid = s.session_id AND ev.derived_tstamp = s.session_start
        INNER JOIN session_count AS c
            ON s.domain_userid = c.domain_userid

        GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19
    
    ) 

    SELECT
        -- session information
        domain_userid,
        session_id,
        session_start,
        page_views,

        -- marketing information 
        mkt_medium, 
        mkt_source,
        mkt_term, 
        mkt_content,
        mkt_campaign, 
        mkt_network, 
        mkt_clickid,

        -- referer information
        refr_medium, 
        refr_source, 
        refr_term,

        -- marketing channel
        marketing_channel,

        -- conversions
        conversions,
        conversions_value,

        -- attribution
        CASE WHEN position = 1 THEN 1 ELSE 0 END AS first_touch,
        CASE WHEN position = session_count THEN 1 ELSE 0 END AS last_touch,
        1/session_count AS linear
    
    FROM marketing_infos

    GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20

);
```

#### And then view it:

```sql
SELECT 
    marketing_channel, 
    SUM(conversions) AS conversions,
    SUM(conversions*first_touch) AS first_touch_attribution,
    SUM(conversions*last_touch) AS last_touch_attribution,
    SUM(conversions*linear) AS linear_attribution

FROM derived.marketing_attribution

GROUP BY 1;
```

## Let's break down what you've done

- With the out of the box tracking, you have automatically captured the marketing and referrer information for each page view and session.
- By instrumenting a custom conversion event, you are collecting all the data you need to get started with attribution.
- By running a simple query that attributes the conversions to the marketing channels based on three popular attribution models, you can explore how Snowplow enables you to take control of your marketing attribution.

## What you might want to do next

- Add additional marketing sources, such as ad impressions or emails
- Add acquisition costs, such as the average cpc for paid search based on the click and keyword performance reports from Google
- Add the revenue associated with conversions from your transactional database
- Explore different attribution models, such as bathtub or time decay
- Split out attribution by additional dimensions, such as device type or campaign information
- Consider different types of conversions, or model intent-to-convert

To learn more about marketing attribution with Snowplow, check out [our introductory post](https://snowplowanalytics.com/blog/2020/04/06/introduction-to-marketing-attribution-with-snowplow/) as well as [this full guide to advanced attribution](https://snowplowanalytics.com/blog/2020/10/26/how-to-do-marketing-attribution-with-snowplow/).

```mdx-code-block
import { AllAccelerators } from "@site/src/components/AcceleratorAdmonitions";

<AllAccelerators/>
```
