---
title: "Single customer view"
description: "Explore user stitching based on Snowplow's various web user identifiers"
date: "2020-10-12"
sidebar_position: 60
---

## Introduction

Developing a single customer view and effectively identifying users is an important part of delivering excellent user experience on digital platforms. The key steps in developing a single customer view are:

- Capturing first-party user identifiers across all your platforms and products.
- Developing an understanding of the relationships between those user identifiers (this generally means developing a hierarchy of identifiers and a mapping table).
- Using these relationships to link together all events from a single user.

This process is often referred to as user stitching. For example, user stitching can involve connecting events from users before and after they log in (or identify in some other way), or mapping together the same user across different devices.

This recipe will focus on exploring an example user stitching table based on Snowplow's various web user identifiers.

## What you'll be doing

You have already set up Snowplow’s out of the box web tracking by instrumenting the JavaScript Tracker in your application. This includes tracking `page_view` and `page_ping` events.

With all web events the Snowplow JavaScript tracker captures the following user identifiers automatically:

<table><tbody><tr><td><code>domain_userid</code></td><td>client side cookie ID set against the domain the tracking is on</td></tr><tr><td><code>network_userid</code></td><td>server side cookie ID set against the collector domain</td></tr><tr><td><code>user_ipaddress</code></td><td>the user’s IP address</td></tr></tbody></table>

Please note that in Try Snowplow and BDP Cloud, these fields (as well as the `domain_sessionid`) are being hashed with Snowplow's [PII enrichment](/docs/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/index.md) to protect user privacy. With Snowplow BDP, you are able to configure this enrichment to hash (or not hash) any number of out of the box or custom fields.

Additionally, Snowplow allows you to specify a custom user ID, which you'll be adding in this recipe. You'll then build a user stitching table to explore how you can reliably identify users over time.

## Implement a custom user ID

Adding a custom user ID with the Snowplow JavaScript Tracker is easy. You'll simply add this line to your out of the box tracking:

```javascript
window.snowplow('setUserId', "example_user_id");
```

If you are using Google Tag Manager, you can add the variable like so:

```javascript
window.snowplow('setUserId', "{{example_user_id_variable}}");
```

Make sure you add this method before you start tracking events, i.e.

```javascript
window.snowplow('setUserId', "example_user_id");
window.snowplow('enableActivityTracking', { minimumVisitLength: 10, heartbeatDelay: 10 });
window.snowplow('enableLinkClickTracking');
window.snowplow('trackPageView');
window.snowplow('enableFormTracking');
```

## Modeling the data you've collected

#### What does the model do?

Capturing as many user identifiers as possible is only the first step towards having a single customer view over time. You’ll also need to stitch those identifiers together across events. The following SQL query creates a user stitching table.

#### First generate the table:

```sql
CREATE TABLE derived.user_stitching AS(

    SELECT

        -- custom user ID
        LAST_VALUE(ev.user_id) OVER(PARTITION BY ev.domain_userid ORDER BY ev.derived_tstamp) as user_id,

        -- Snowplow cookie IDs
        ev.domain_userid,
        LAST_VALUE(ev.network_userid) OVER(PARTITION BY ev.domain_userid ORDER BY ev.derived_tstamp) AS network_userid,

        -- time the user was last active
        MIN(ev.derived_tstamp) AS first_active,
        MAX(ev.derived_tstamp) AS last_active

    FROM atomic.events AS ev
    
    GROUP BY 2, ev.user_id, ev.network_userid, ev.derived_tstamp

);
```

#### And then view it:

```sql
SELECT * FROM derived.user_stitching;
```

## Let's break down what you've done

- You have learnt what user identifiers Snowplow tracks out of the box, and how you can add a custom user ID to Snowplow web events.
- You have created a simple user stitching table that links all the identifiers available for a given user over time.

## What you might want to do next

This recipe covers a really simple example of user stitching based on Snowplow's out of the box identifiers and the custom user ID only. Next, you might want to

- Create a custom `user` entity to be sent with all events, that captures additional user information such as email address. (Currently, not possible with Try Snowplow or BDP Cloud.) You can learn more about Snowplow's events and entities [here](/docs/understanding-tracking-design/understanding-events-entities/index.md).
- Implement tracking on [other platforms](/docs/collecting-data/collecting-from-own-applications/index.md), such as mobile apps and servers, or ingest third party data via [webhooks](/docs/collecting-data/collecting-data-from-third-parties/index.md) (for example from you email service provider). You can then include the identifiers from these sources in your user stitching table to get a 360 view of your customers across platforms.
- Use the user stitching table alongside other data models, such as the simple user engagement table in the [user engagement recipe](/docs/recipes/recipe-user-engagement/index.md). Specifically, you could update the SQL in that recipe to aggregate user engagement based on the stitched user identifiers, rather than simply the `domain_userid`.
- Address your obligations as a data controller by learning more about [Snowplow's approach to user privacy](https://snowplow.io/blog/user-identification-and-privacy/).

For more information about how to build a single customer view with Snowplow, check out [our blog post on the topic](https://snowplowanalytics.com/blog/2020/06/11/single-customer-view/).

```mdx-code-block
import { AllAccelerators } from "@site/src/components/AcceleratorAdmonitions";

<AllAccelerators/>
```
