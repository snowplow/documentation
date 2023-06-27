---
title: "Content analytics"
description: "Get better insights into how your content is performing"
date: "2020-10-12"
sidebar_position: 30
---

## Introduction

If the primary function of your site is content consumption, whether it's reading news articles or watching videos, you'll want to understand how that content is performing. While traditional web analytics is focused on page views and sessions, you might be more interested in how long users are engaging with what content.

This recipe will give you an overview of how Snowplow empowers you to get better insights into how your content is performing.

## What you'll be doing

You have already set up Snowplow’s out of the box web tracking by instrumenting the Javascript Tracker in your application. This includes tracking `page_view` and `page_ping` events.

To understand how people are engaging with your content, you’ll want to be tie these events to specific pieces of content, not just pages.

For this purpose, you can add a content [entity](/docs/understanding-your-pipeline/entities/index.md) which will be sent every time these events are tracked. You can then aggregate all of your user behavioral data into one row per content piece to get a better view of how your content is performing.

## Design and implement the `content` entity

#### Designing the entity

We have already created a custom `content` entity for you in [Iglu Central](http://iglucentral.com/).

Snowplow uses self-describing JSON schemas to structure events and entities so that they can be validated in the pipeline and loaded into tidy tables in the warehouse. You can learn more about these data structures [here](/docs/understanding-your-pipeline/schemas/index.md), and about why we take this approach [here](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/).

While Try Snowplow only ships with a pre-designed set of custom events and entities required for the recipes, Snowplow BDP lets you create an unlimited number of your own via the [Data Structures UI](/docs/understanding-tracking-design/managing-your-data-structures/ui/index.md) (and API) for Enterprise and via [the Data Structures Builder](/docs/understanding-tracking-design/managing-your-data-structures/builder/index.md) for Cloud. 

The `content` entity has the following fields:

<table><tbody><tr><td><strong>Field</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td><td><strong>Validation</strong></td><td><strong>Required?</strong></td></tr><tr><td><code>name</code></td><td>The name of the piece of content</td><td>string</td><td><code>maxLength: 255</code></td><td>✅&nbsp;</td></tr><tr><td>id</td><td>The content identifier</td><td>string</td><td>maxLength: 255</td><td>❌</td></tr><tr><td><code>category</code></td><td>The category of the piece of content</td><td>string</td><td><code>maxLength: 255</code></td><td>❌</td></tr><tr><td><code>date_published</code></td><td>The date the piece of content was published</td><td>string</td><td><code>maxLength: 255</code></td><td>❌</td></tr><tr><td><code>author</code></td><td>The author of the piece of content</td><td>string</td><td><code>maxLength: 255</code></td><td>❌</td></tr></tbody></table>

#### Implementing the entity

#### In the Javascript Tracker

Add the content entity to your `page_view` and `page_ping` events by editing your `trackPageView` events to include the entity. Specifically, update

```javascript
window.snowplow('trackPageView');
```

to

```javascript
window.snowplow('trackPageView', {
   "context": [{
      "schema": "iglu:io.snowplow.foundation/content/jsonschema/1-0-0",
      "data": {
         "name": "example_name",
         "id": "example_id",
         "category": "example_category",  
         "date_published": "01-01-1970",
         "author": "example_author"
      }
   }]
});
```

#### Via Google Tag Manager

If you are using Google Tag Manager, you can add the variables like so:

```javascript
window.snowplow('trackPageView', {
   "context": [{
      "schema": "iglu:io.snowplow.foundation/content/jsonschema/1-0-0",
      "data": {
         "name": "{{example_name_variable}}",
         "id": "{{example_id_variable}}",
         "category": "{{example_category_variable}}",
         "date_published": "{{example_date_variable}}",
         "author": "{{example_author_variable}}"
      }
   }]
});
```

## Modeling the data you've collected

#### What does the model do?

The tracking above captures which content users are consuming and how they are engaging with it. This allows you to get a better understanding of how your content is performing.

For this recipe we'll create a simple table describing content engagement. Once you have collected some data with your new tracking you can run the following two queries in your tool of choice.

#### First generate the table:

```sql
CREATE TABLE derived.content AS(

    WITH content_page_views AS(

        SELECT
            wp.id AS page_view_id,
            c.category AS content_category, 
            c.name AS content_name, 
            c.date_published AS date_published,
            c.author AS author,
            10*SUM(CASE WHEN ev.event_name = 'page_ping' THEN 1 ELSE 0 END) AS time_engaged_in_s, 
            ROUND(100*(LEAST(LEAST(GREATEST(MAX(COALESCE(ev.pp_yoffset_max, 0)), 0), MAX(ev.doc_height)) + ev.br_viewheight, ev.doc_height)/ev.doc_height::FLOAT)) AS percentage_vertical_scroll_depth

        FROM atomic.events AS ev
        INNER JOIN atomic.com_snowplowanalytics_snowplow_web_page_1 AS wp
            ON ev.event_id = wp.root_id AND ev.collector_tstamp = wp.root_tstamp
        INNER JOIN atomic.io_snowplow_foundation_content_1 AS c
            ON ev.event_id = c.root_id AND ev.collector_tstamp = c.root_tstamp
        
        GROUP BY 1,2,3,4,5,ev.br_viewheight,ev.doc_height

    )

    SELECT
        content_category, 
        content_name, 
        date_published,
        author,
        COUNT(DISTINCT page_view_id) AS page_views,
        ROUND(SUM(time_engaged_in_s)/COUNT(DISTINCT page_view_id)) AS average_time_engaged_in_s, 
        ROUND(SUM(percentage_vertical_scroll_depth)/COUNT(DISTINCT page_view_id))AS average_percentage_vertical_scroll_depth

    FROM content_page_views

    GROUP BY 1,2,3,4

);
```

#### And then view it:

```sql
SELECT * FROM derived.content;
```

## Let's break down what you've done

- You have captured granular data around how your users are engaging with your content, including time engaged and scroll depth.
- You have modeled this data into a content engagement table that surfaces the user engagement per content piece. This gives you an overview of how your content is performing across your site.

## What you might want to do next

Understanding how your users are engaging with your content is just the first step. Next, you might want to

- Extend this table to include where the content is being promoted on your site to understand how placement affects performance.
- Start mapping the relationships between content pieces based on user behavior, working towards compelling content recommendations.
- Pivot this data to look at users instead: understand which marketing channels users come from, and how that affects their engagement with your content.
- Etc.

To learn more about Snowplow for media and entertainment, check out [our blog series on the topic](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-1/).

Ready to get started with content recommendations? Check out our [step-by-step guide](https://snowplowanalytics.com/blog/2020/10/26/how-to-build-a-content-recommendation-engine-with-snowplow/).

```mdx-code-block
import { AllAccelerators } from "@site/src/components/AcceleratorAdmonitions";

<AllAccelerators/>
```
