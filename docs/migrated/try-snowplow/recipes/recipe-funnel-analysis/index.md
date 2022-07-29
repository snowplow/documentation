---
title: "Tutorial: Funnel analysis"
date: "2021-01-05"
sidebar_position: 20
---

## Introduction

Funnel analysis is a great way to get started with understanding how your users are using your digital products. Specifically, it allows you to identify where users might be struggling or dropping off, and therefore optimize your users' journeys and conversions.

## What you'll be doing

You have already set up Snowplow’s out of the box web tracking by instrumenting the Javascript Tracker in your application. This includes tracking `page_view` events. In the modeling section of this recipe, you will be able to classify any page view as a funnel step. However, you might also want to track additional actions as part of your funnel analysis. For this purpose, you will implement a custom `funnel_interaction` event (optional).

You will then collect all funnel step interactions (whether they are page views or specific interactions) into a single table to easily visualise and analyse how your users are moving through your funnels, and where they are getting stuck or dropping off.

## Design and implement the `funnel_interaction` event (optional)

#### Designing the event

We have already created the custom `funnel_interaction` event for you, and uploaded its data structure to [your Iglu server](/docs/migrated/pipeline-components-and-applications/iglu/iglu-resolver/).

Snowplow uses self-describing JSON schemas to structure events and entities so that they can be validated in the pipeline and loaded into tidy tables in the warehouse. You can learn more about these data structures [here](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/), and about why we take this approach [here](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/).

While Try Snowplow only ships with a pre-designed set of custom events and entities required for the recipes, Snowplow BDP lets you create an unlimited number of your own via the [Data Structures UI](/docs/migrated/understanding-tracking-design/managing-data-structures/) (and API).

The `funnel_interaction` event has the following fields:

<table><tbody><tr><td><strong>Field</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td><td><strong>Validation</strong></td><td><strong>Required?</strong></td></tr><tr><td><code>funnel_name</code></td><td>The name of the funnel</td><td>string</td><td><code>maxLength: 255</code></td><td>✅</td></tr><tr><td><code>step_name</code></td><td>The funnel step</td><td>string</td><td>maxLength: 255</td><td>✅&nbsp;</td></tr><tr><td><code>step_position</code></td><td>The position of this step in the funnel</td><td>integer</td><td>minimum: 1, maximum: 100</td><td>❌&nbsp;</td></tr></tbody></table>

#### Implementing the event

#### In the Javascript Tracker

Track the `funnel_interaction` event whenever a user completes a given funnel step:

```
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:com.trysnowplow/funnel_interaction/jsonschema/1-0-0",
      "data": {
         "funnel_name": "example_funnel_name",
         "step_name": "example_step_name",
         "step_position": 1
      }
   }
});
```

For example, on the [snowplowanalytics.com website](https://snowplowanalytics.com/), we might consider a home page view as step 1 , a `/get-started/` page view as step 2 and then the submission of the form as step 3. All three steps can be tracked has `funnel _interaction` events. However, the first two funnel steps are already tracked as page views, so we could also just track the form submission as a `funnel_interaction` event and then classify the other two steps in the modeling step below.

#### Via Google Tag Manager

If you are using Google Tag Manager, you can add the variables like so:

```
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:com.trysnowplow/funnel_interaction/jsonschema/1-0-0",
      "data": {
         "funnel_name": "{{example_funnel_name_variable}}",
         "step_name": "{{example_step_name_variable}}",
         "step_position": {{example_position_variable}}
      }
   }
});
```

## Modeling funnels

#### First, classify the funnel steps:

```
-- select all explicitly defined funnel steps (optional)
CREATE TABLE derived.funnel_step_definitions AS(

    SELECT 
        funnel_name,
        step_name,
        step_position,
        NULL AS page_urlpath
    FROM atomic.com_trysnowplow_funnel_interaction_1
    GROUP BY 1,2,3,4

);

-- classify relevant page views as funnel steps
INSERT INTO derived.funnel_step_definitions
    ('example_funnel_name', 'example_step_name', 1, '/example_page_url_path/'),
    ('example_funnel_name_2', 'example_step_name_2', 2, '/example_page_url_path_2/'),
    ...,
    ('example_funnel_name_n', 'example_step_name_n', n, '/example_page_url_path_n/')
;

-- verify funnel definitions
SELECT * FROM derived.funnel_step_definitions GROUP BY 1 ORDER BY 3 ASC;
```

#### Second, build the funnel:

```
CREATE TABLE derived.funnel_interactions AS(

    SELECT
        ev.domain_userid,
        ev.domain_sessionid AS session_id,
        ev.derived_tstamp as "timestamp",
        fi.funnel_name,
        fi.step_name,
        fi.step_position

    FROM atomic.events AS ev
    INNER JOIN atomic.com_trysnowplow_funnel_interaction_1 AS fi
        ON ev.event_id = fi.root_id AND ev.collector_tstamp = fi.root_tstamp
    
    GROUP BY 1,2,3,4,5,6

    UNION

    SELECT
        ev.domain_userid,
        ev.domain_sessionid AS session_id,
        ev.derived_tstamp as "timestamp",
        fd.funnel_name,
        fd.step_name,
        fd.step_position

    FROM atomic.events AS ev
    INNER JOIN derived.funnel_step_definitions AS fd USING(page_urlpath)

    WHERE ev.event_name = 'page_view' AND
        fd.page_urlpath IS NOT NULL

    GROUP BY 1,2,3,4,5,6

);
```

#### Then, view it:

```
SELECT
    funnel_name,
    step_name,
    step_position,
    COUNT(DISTINCT domain_userid) AS users

FROM derived.funnel_interactions

GROUP BY 1,2,3
ORDER BY 1,3 ASC;
```

## Let's break down what you've done

- You have captured all funnel steps, whether they are page views or specific interactions.
- You have modeled this data into a single table to easily visualise and analyse how your users are moving through your funnels.
- This gives you initial insights into where users are getting stuck or dropping off, and how you might improve their journeys.

## Further reading

Funnels can be difficult to construct and visualise in relational databases using common BI tools. Hence a multitude of different dedicated Product Analytics tools (such as Amplitude or Heap) have emerged. However, being able to include different types of data in your funnels can be key if you have more complex user journeys.

For example, if your users can also interact with you via email or a ticketing system such as ZenDesk, you might want to include those interactions too. Building out funnel analytics yourself in the data warehouse gives you that flexibility. You might want to try this out by joining the data collected through Try Snowplow with our customer data you have.

To learn more about Snowplow's approach to Product Analytics, check out [the relevant page in our use case library](https://snowplowanalytics.com/use-cases/product-analytics/) or download our [e-book](https://snowplowanalytics.com/resources/product-analytics-ebook/).
