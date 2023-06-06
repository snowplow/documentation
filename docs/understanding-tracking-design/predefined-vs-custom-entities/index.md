---
title: "Predefined vs custom entities"
date: "2020-02-27"
sidebar_position: 40
---

## Predefined contexts

Predefined contexts are Snowplow authored web contexts and are available with the JavaScript tracker. They are enabled at the tracker initialization step and thus the associated data will be added automatically to any Snowplow event fired on the page.

```javascript
window.snowplow("newTracker", "sp", "{{COLLECTOR_URL}}", {
    appId: "cfe23a"
  },
  contexts: {
    webPage: true,
    performanceTiming: true,
    gaCookies: true,
    geolocation: false
  }
});
```

## Custom contexts

:::info
If you are using BDP Cloud, you can create custom schemas using the [Data Structures Builder](/docs/understanding-tracking-design/managing-your-data-structures/builder/index.md) without worrying about how it works under the hood.
:::

Custom contexts let you add additional information about the circumstances surrounding an event by attaching context through entities represented with a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

The `contexts` argument to any method is always _optional_. If set, it must be a self-describing JSON including at least one `name: property` pair in JSON provided as a value to `data` property of the self-describing JSON, where `data` is the name for an individual context entry.

It generally looks like the one below:

```json
{
    "schema": "iglu:com.snowplowanalytics/ad_click/jsonschema/1-0-0",
    "data": {
        "bannerId": "4732ce23d345"
    }
}
```

A few dos and don'ts for _context names_:

- Do name each context entry however you like
- Do use a context name to identify a set of associated data points which make sense to your business
- Do use the same contexts across multiple different events and event types
- Don't use multiple different context names to refer to the same set of data points

A few dos and don'ts for the _JSON_s inside each context entry JSONs:

- Do use any of the data types supported by custom unstructured events
- Do use Snowplow datatype suffixes if the data type would otherwise be unclear
- Don't nest properties as with custom unstructured events, the structure must be flat

If you want to create your own custom context, you must create a [data structure for it](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md). Since more than one can be attached to an event, the `context` argument (if it is provided at all) should be a _non-empty array of self-describing JSONs_.

**Important:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array.

Here are two examples of custom context JSONs. One describes a page:

```javascript
{
    schema: "iglu:com.example_company/page/jsonschema/1-2-1",
    data: {
        pageType: 'test',
        lastUpdated: new Date(2016,3,10)
    }
}
```

and the other describes a user on that page:

```javascript
{
    schema: "iglu:com.example_company/user/jsonschema/2-0-0",
    data: {
      userType: 'tester',
    }
}
```

Below is a JavaScript tracker example how the above custom contexts could be attached to a page view event:

##### Snowplow JavaScript Tracker v3

```javascript
// Snowplow JavaScript Tracker v3 API
window.snowplow(
    'trackPageView',
    {
      context: [{ // array of custom contexts
        schema: "iglu:com.example_company/page/jsonschema/1-2-1",
        data: {
            pageType: 'test',
            lastUpdated: new Date(2016,3,10)
        }
      },
      {
        schema: "iglu:com.example_company/user/jsonschema/2-0-0",
        data: {
          userType: 'tester',
        }
      }]
    });
```

##### Snowplow JavaScript Tracker v2

```javascript
// Snowplow JavaScript Tracker v2 API
window.snowplow(
    'trackPageView',
    null,
    [{ // array of custom contexts
      schema: "iglu:com.example_company/page/jsonschema/1-2-1",
      data: {
        pageType: 'test',
        lastUpdated: new Date(2016,3,10)
      }
    },
    {
      schema: "iglu:com.example_company/user/jsonschema/2-0-0",
      data: {
        userType: 'tester',
      }
    }]
);
```
