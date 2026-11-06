---
title: "Create your first custom events"
sidebar_position: 8
sidebar_label: "Define custom events"
description: "Create a custom event and an entity in Console, deploy them to your development environment, track them with the web tracker, and check them in Snowplow Inspector."
keywords: ["custom events", "self-describing events", "custom entities", "event schemas"]
content_type: tutorial
pagination_next: null
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow provides many [events](/docs/fundamentals/events/index.md) and [entities](/docs/fundamentals/entities/index.md) out of the box. To match your business more closely, define your own: a [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) for something the user does, and an entity for the context it happens in. Each has a [schema](/docs/fundamentals/schemas/index.md) that the pipeline validates the data against.

This page follows on from [Track your first events](/docs/get-started/tracking/index.md), and uses the web tracker.

## Create the data structures in Console

In Console, go to **Data collection** > **Data structures** and click **Create data structure**. Create two data structures with the builder:

1. An event, for example `product_viewed`, with the properties `productId` (string) and `price` (decimal)
2. An entity, for example `user`, with the property `userType` (string)

For each one, fill in the name, description, and vendor, then add the properties. Note the tracking URL that Console generates, such as `iglu:com.example_company/product_viewed/jsonschema/1-0-0`. See [managing data structures](/docs/event-studio/data-structures/index.md) for every option.

Clicking **Save** saves each data structure as a draft. Drafts can't be used for validation, so deploy both data structures to your development environment.

## Track the event

Call `trackSelfDescribingEvent` with the event's tracking URL and data. Attach the entity in the `context` array, which must be an array even if you only attach one entity.

<Tabs groupId="platform" queryString>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';

trackSelfDescribingEvent({
  event: {
    schema: 'iglu:com.example_company/product_viewed/jsonschema/1-0-0',
    data: {
      productId: '12345',
      price: 10.99
    }
  },
  context: [{
    schema: 'iglu:com.example_company/user/jsonschema/1-0-0',
    data: {
      userType: 'tester'
    }
  }]
});
```

  </TabItem>
  <TabItem value="js" label="JavaScript (tag)">

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.example_company/product_viewed/jsonschema/1-0-0',
    data: {
      productId: '12345',
      price: 10.99
    }
  },
  context: [{
    schema: 'iglu:com.example_company/user/jsonschema/1-0-0',
    data: {
      userType: 'tester'
    }
  }]
});
```

  </TabItem>
</Tabs>

Instead of writing these calls by hand, you can generate typed tracking code from your data structures with [Snowtype](/docs/event-studio/implement-tracking/index.md).

For more examples, including entities on page views, see [custom event tracking on web](/docs/sources/web-trackers/custom-tracking-using-schemas/index.md).

## Check the event

Open your site with [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) installed, and trigger the event. Inspector shows the event with its entity. To check the data against your schemas in Inspector, [add your schemas](/docs/testing/snowplow-inspector/adding-schemas/index.md).

To see what happens when data doesn't match a schema, send an event with a string in the `price` field, then [inspect your first failed events](/docs/get-started/failed-events/index.md).

## Next steps

* [Query your first events](/docs/destinations/warehouses-lakes/querying-data/index.md#connect-to-your-warehouse) in your warehouse
* [Run your first data model](/docs/get-started/modeling/index.md)
* [Inspect your first failed events](/docs/get-started/failed-events/index.md)
* Ready for production? [Choose a deployment](/docs/get-started/deployment-options/index.md)

To learn more, see the [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) documentation, or [this tutorial](/tutorials/data-products-base-tracking/start/). You can also ask an AI assistant connected to the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) to design your custom events and entities and create their schemas in your account. Run `npx plugins add snowplow/skills` to install the MCP server and the Snowplow [skills](/docs/ai/skills/index.mdx) in your coding agent.
