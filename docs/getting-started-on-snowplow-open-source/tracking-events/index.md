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

Learn more [why schemas are a powerful feature of Snowplow](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md), and about [the anatomy of a schema](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md#the-anatomy-of-a-schema).

:::

- First create the schema for the event
    - The below is an example - you can create your own schema or edit this schema to better suit your needs

```json
{
     "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
     "description": "Schema for a button click event",
     "self": {
         "vendor": "com.snowplowanalytics",
         "name": "button_click",
         "format": "jsonschema",
         "version": "1-0-0"
     },
     "type": "object",
     "properties": {
         "id": {
             "type": "string"
             "minLength": 1
         },
         "target": {
             "type": "string"
         },
         "content": {
             "type": "string"
         }
     },
     "required": ["id"],
     "additionalProperties": false
 }
```

- You should then save this schema in the following folder structure, with a filename of `1-0-0`:
    - /`schemas/com.snowplowanalytics/button_click/jsonschema/1-0-0`
    - Note: If you update the `vendor` string in the example, you should update the above path too.
- Upload your schema to your Iglu registry that you created when setting up your pipeline
    - Download [the latest igluctl](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md) if you haven't already
    - To upload your schemas on localhost to the Iglu Server, use the following command:
        - `igluctl static push --public <local path to schemas/> <Iglu server endpoint> <iglu_super_api_key>`
        - You can find more information on the [Igluctl docs page](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md#static-push)
- To send an event using this schema you'll want to track a Self Describing Event. Here is an example of how to do so with the JavaScript Tracker:

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

Next, learn how to further [enrich your data](/docs/enriching-your-data/index.md) and [configure extra enrichments](/docs/enriching-your-data/configuring-enrichments-open-source/index.md) if necessary.

Once you are all set, check out our [recipes](/docs/recipes/index.md) to get tackling real-world use cases!
