---
title: Snowplow Tracking
position: 2
---

## Snowplow Tracking

Our simplified website tracks only two Snowplow events - page_views and article_details, for the purposes of this tutorial we will only focus on article_details.

For our recommendation system, we are going to suggest articles to users based on their reading history. This involves:

* Identifying articles in similar categories that match their demonstrated interests.
* Surfacing similar articles to their last read article.

The article_details event is sent on every article page view event and contains two properties: category and name. We will utilise these properties in the next step within Signals.

---

### Creating the Article Details Data Structure

For this example, we will create an event data structure with the following JSON schema. 

You can create an event data structure with JSON by going to [here within the BDP Console](https://console.snowplowanalytics.com/data-structures/create/event).

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "type": "object",
  "self": {
    "vendor": "com.snplow.example",
    "name": "article_details",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "description": "Schema for the article details entity",
  "properties": {
    "category": {
      "type": "string",
      "maxLength": 255,
      "description": "Category of the article"
    },
    "name": {
      "type": "string",
      "maxLength": 255,
      "description": "Name of the article"
    }
  },
  "additionalProperties": false
}
```

With our event data structure created we can move on to implementing tracking on our website.

---

### Deploying Snowplow Tracking

To start sending our events to Snowplow, we need to do the following within on our website:

* Initialise the Snowplow Tracker
* Implement our Article Details custom event

For this example, we will demonstrate how the Snowplow tracking can be implemented using the JavaScript tracker.

We can initialise Snowplow Tracker using the following code, make sure to update it with your Snowplow pipeline collector URL:

```js
 ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@4.6.3/dist/sp.min.js","snowplow"));

window.snowplow('newTracker', 'sp1', 'INSERT_COLLECTOR_URL', {
    appId: 'website',
    platform: 'web'
});
```

Now the Snowplow tracker is ready for events. We can include the following code to send our article details custom event which will be triggered on any page that has `article` within the URL pathname:

```js
// Ensure this runs after the Snowplow Tracker is initialised and once per page/article view

// Check if URL contains article
if (window.location.pathname.includes('article')) {

  let article_category = 'business'; // For example purposes
  let article_name = 'modern-data-stack'; // For example purposes

  window.snowplow('trackSelfDescribingEvent', {
    event: {
      schema: 'iglu:com.snplow.example/article_details/jsonschema/1-0-0',
      data: {
       category: article_category,
       name: article_name
      }
    }
  });
}
```
