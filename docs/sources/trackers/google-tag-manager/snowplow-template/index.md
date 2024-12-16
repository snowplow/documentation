---
title: Snowplow Template
sidebar_position: 400
---

This template implements the [Snowplow JavaScript tracker](/docs/sources/trackers/javascript-trackers/web-tracker) for Google Tag Manager.

## Adding Custom Context Entities

Attaching [custom context entities](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/index.md#custom-context) will attach additional data to every Snowplow event fired by the tag.

To add a custom context entity:

1. Create a variable that returns an array of custom contexts, for example to manually attach the web page context:

```js
function() {
    return [{
        schema: 'iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0',
        data: {
            id: '12345',
            title: 'Snowplow Analytics',
            url: 'https://snowplow.io'
        }
    }];
} 
```

2. Add the variable to the `Context Entities` table in the tag configuration and save.

