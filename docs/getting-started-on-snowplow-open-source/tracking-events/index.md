---
title: "Track events & entities"
date: "2021-10-06"
sidebar_position: 6
---

In this section, you will add tracking to your own application, as well as learn how to create schemas that describe your custom events & entities, and how to track these from your application/s.

**Step 1: Track out-of-the-box events from your own application**

**Web tracking**

- See our quick start guide for adding the [Javascript tracker to your application](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/web-quick-start-guide/index.md), and how to [self host it](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/self-hosting-the-javascript-tracker/index.md)
- Alternatively you can embed the [Browser tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/index.md) directly into your application

You will track a large number of standard web events out-of-the-box with Snowplow. Implementing the Javascript tracker, for example, will enable you to start tracking the following events:

- [Page views](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#page-views)
- [Page pings](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#activity-tracking-page-pings)
- [Link clicks](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#link-click-tracking)
- [Form interactions](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#form-tracking)
- [Transactions](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#ecommerce-tracking)
- [Search](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#tracksitesearch)

**Mobile tracking**

- Please see our quick start guide for the Snowplow [iOS and Android tracker](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up/index.md)

You can find our [full list of our SDKs here](/docs/collecting-data/collecting-from-own-applications/index.md) (including our server side trackers, and 3rd party webhooks).

:::note Snowplow Inspector

We recommend installing the [Snowplow Inspector](https://chrome.google.com/webstore/detail/snowplow-inspector/maplkdomeamdlngconidoefjpogkmljm?hl=en) chrome extension developed by our partner [Poplin Data](https://poplindata.com/) which allows you to view & validate events that are being tracked from a web page and can be used for QA purposes.

:::

**Step 2: Track custom events & entities**

Custom events & entities allow you to track & collect events that better reflect your business. In this step, you will define your custom event by creating a schema for it and uploading it to Iglu - your schema repository - and then start tracking it from your application. 

:::note Schemas

Learn more [why schemas are a powerful feature of Snowplow](/docs/understanding-your-pipeline/schemas/index.md), and about [the anatomy of a schema](/docs/understanding-your-pipeline/schemas/index.md#the-anatomy-of-a-schema).

:::

Follow the documentation for [creating and uploading a schema to Iglu Server](/docs/understanding-tracking-design/managing-your-data-structures/iglu/index.md).

To send an event using your schema you'll want to track a Self Describing Event. Here is an example of how to do so with the JavaScript Tracker:

```javascript
snowplow('trackSelfDescribingEvent', {
   event: {
     schema: 'iglu:com.snowplowanalytics/button_click/jsonschema/1-0-0',
     data: {
         id: 'purchase-button-1',
         target: '/checkout',
         content: 'Purchase Now'
     }
   }
 });
```

Once you've sent this event at least once, you can take a look at this event in Postgres. You'll find the core event properties in `atomic.events` and the event specific properties in `atomic.com_snowplowanalytics_button_click_1`.

You can join back to atomic.events using `root_id = event_id`.

Next, learn how to further [enrich your data](/docs/enriching-your-data/index.md) and [configure extra enrichments](/docs/enriching-your-data/managing-enrichments/terraform/index.md) if necessary.

Once you are all set, check out our [recipes](/docs/recipes/index.md) to get tackling real-world use cases!
