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

If you would like to follow along, create a data structure with the following JSON schema:

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

With our event data structure created and our site successfully firing Snowplow events, we can move on to creating Snowplow Signals Attributes.