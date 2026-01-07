---
title: "Custom event tracking"
date: "2022-08-30"
sidebar_position: 2600
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Self-describing (self-referential) JSON schemas are at the core of Snowplow tracking. Read more about them [here](/docs/fundamentals/schemas/index.md). They allow you to track completely customised data, and are also used internally throughout Snowplow pipelines.

In all our trackers, self-describing JSON are used in two places. One is in the `SelfDescribing` event type that wraps custom self-describing JSONs for sending. The second use is to attach entities to any tracked event.
The entities can describe the context in which the event happen or provide extra information to better describe the event.


## Tracking a custom event (self-describing)

You may wish to track events in your app which are not directly supported by Snowplow and which structured event tracking does not adequately capture. Your event may have more than the five fields offered by Structured events, or its fields may not fit into the category-action-label-property-value model. The solution is Snowplow’s self-describing events. Self-describing events are a [data structure based on JSON Schemas](/docs/fundamentals/schemas/index.md) and can have arbitrarily many fields.

To track a self-describing event, you make use of the `trackSelfDescribingEvent` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackSelfDescribingEvent', {{SELF-DESCRIBING EVENT JSON}});
```

For example:

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/1-0-0',
    data: {
        productId: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        availableSince: new Date(2013,3,7)
    }
  }
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';

trackSelfDescribingEvent({
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/1-0-0',
    data: {
        productId: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        availableSince: new Date(2013,3,7)
    }
  }
});
```
  </TabItem>
</Tabs>


The second argument or event property, depending on tracker, is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/). It has two fields:

- A `data` field, containing the properties of the event
- A `schema` field, containing the location of the [JSON schema](http://json-schema.org/) against which the `data` field should be validated.

Like all `trackX` methods, `trackSelfDescribingEvent` can also be passed an array of custom context entities as an additional parameter. See the next section for more information.

## Tracking a custom entity

```mdx-code-block
import DefineCustomEntity from "@site/docs/reusable/define-custom-entity/_index.md"

<DefineCustomEntity/>
```
:::tip
Custom context entities can be added as an extra argument to any of Snowplow's `trackX()` methods, e.g. `trackPageView` or `trackLinkClick`.
:::

:::note

Tracker methods available through plugins do not necessarily support adding custom entities. For those please refer to the corresponding plugin documentation for details.

:::

Here are two examples of schema for custom entities.
One describes a screen:

```json
{
    "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
        "vendor": "com.example",
        "name": "screen",
        "format": "jsonschema",
        "version": "1-0-1"
    },
    "type": "object",
    "properties": {
        "screenType": {
            "type": "string"
        },
        "lastUpdated": {
            "type": "string"
        }
    }
    "required": ["screenType", "lastUpdated"],
    "additionalProperties": false
}
```

and the other describes a user on that screen:

```json
{
    "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
        "vendor": "com.example",
        "name": "user",
        "format": "jsonschema",
        "version": "2-0-0"
    },
    "type": "object",
    "properties": {
        "user": {
            "type": "string"
        }
    }
    "required": ["user"],
    "additionalProperties": false
}
```

**Important:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array.

Tracking a **page view** with both of these example entities attached:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackPageView', {
  context: [{
    schema: "iglu:com.example_company/page/jsonschema/1-2-1",
    data: {
      pageType: 'test',
      lastUpdated: new Date(2021,04,01)
    }
  },
  {
    schema: "iglu:com.example_company/user/jsonschema/2-0-0",
    data: {
      userType: 'tester'
    }
  }]
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackPageView({
  context: [{
    schema: 'iglu:com.example_company/page/jsonschema/1-2-1',
    data: {
      pageType: 'test',
      lastUpdated: new Date(2021,04,01)
    }
  },
  {
    schema: 'iglu:com.example_company/user/jsonschema/2-0-0',
    data: {
      userType: 'tester'
    }
  }]
});
```

  </TabItem>
</Tabs>

Tracking a **self describing event** with both of these context entities attached:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.example_company/product_viewed/jsonschema/1-0-1',
    data: {
      productId: '12345',
      price: 10.99
    }
  },
  context: [{
    schema: 'iglu:com.example_company/page/jsonschema/1-2-1',
    data: {
      pageType: 'test',
      lastUpdated: new Date(2021,04,01)
    }
  },
  {
    schema: "iglu:com.example_company/user/jsonschema/2-0-0",
    data: {
      userType: 'tester'
    }
  }]
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackSelfDescribingEvent({
  event: {
    schema: 'iglu:com.example_company/product_viewed/jsonschema/1-0-1',
    data: {
      productId: '12345',
      price: 10.99
    }
  },
  context: [{
    schema: 'iglu:com.example_company/page/jsonschema/1-2-1',
    data: {
      pageType: 'test',
      lastUpdated: new Date(2021,04,01)
    }
  },
  {
    schema: "iglu:com.example_company/user/jsonschema/2-0-0",
    data: {
      userType: 'tester'
    }
  }]
});
```
  </TabItem>
</Tabs>

For more information on custom contexts, see [here](/docs/fundamentals/entities/index.md#custom-entities).
