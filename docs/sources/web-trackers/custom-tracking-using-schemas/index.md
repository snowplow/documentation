---
title: "Track custom events on web"
sidebar_label: "Custom event tracking"
description: "Track self-describing events and attach custom entities using JSON schemas for flexible data capture."
keywords: ["self-describing events", "custom entities", "json schemas", "custom tracking"]
date: "2022-08-30"
sidebar_position: 2600
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The specific data you need might not be covered by the JavaScript tracker's built-in event types and entities. In this case, you can use Snowplow’s [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) and custom [entities](/docs/fundamentals/entities/index.md) to track [customised data](docs/events/custom-events/index.md).

## Track a custom event (self-describing)

To track a custom self-describing event, use the `trackSelfDescribingEvent` method. For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

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

Like all `trackX` methods, `trackSelfDescribingEvent` can also be passed an array of custom entities as an additional parameter.

## Track a custom entity

```mdx-code-block
import DefineCustomEntity from "@site/docs/reusable/define-custom-entity/_index.md"

<DefineCustomEntity/>
```
:::tip
Custom entities can be added as an extra argument to most Snowplow's `trackX()` methods, e.g. `trackPageView` or `trackLinkClick`.

Not all plugins support adding custom entities; please refer to the corresponding plugin documentation for details.
:::

Here are two examples of schema for custom entities.
One describes a screen:

```json
{
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
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
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
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

**Important:** Even if only one custom entity is being attached to an event, it still needs to be wrapped in an array.

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

Tracking a **self describing event** with both of these entities attached:

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

## Track a structured event

We recommend using custom self-describing events instead of structured events, as the provide more better data governance and easier modeling.

There are five parameters that can be associated with each structured event. Only the first two are required:

| Name       | Required? | Description                                                                                                                                                      | Type    |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `Category` | Yes       | The name you supply for the group of objects you want to track e.g. 'media', 'ecomm'.                                                                            | String  |
| `Action`   | Yes       | Defines the type of user interaction for the web object e.g. 'play-video', add-to-basket'.                                                                       | String  |
| `Label`    | No        | Identifies the specific object being actioned e.g. ID of the video being played, or the SKU or the product added to basket.                                      | String? |
| `Property` | No        | Describing the object or the action performed on it. This might be the quantity of an item added to basket.                                                      | String? |
| `Value`    | No        | Quantify or further describe the user action. This might be the price of an item added to basket, or the starting time of the video where play was just pressed. | Float?  |

An example of tracking a user listening to a music mix:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackStructEvent', {
  category: 'Mixes',
  action: 'Play',
  label: 'MrC/fabric-0503-mix',
  property: '',
  value: 0.0
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackStructEvent } from '@snowplow/browser-tracker';

trackStructEvent({
  category: 'Mixes',
  action: 'Play',
  label: 'MrC/fabric-0503-mix',
  value: 0.0
});
```

  </TabItem>
</Tabs>
