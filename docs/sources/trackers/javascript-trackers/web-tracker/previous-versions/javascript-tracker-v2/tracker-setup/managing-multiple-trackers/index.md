---
title: "Managing multiple trackers"
date: "2020-03-03"
sidebar_position: 40
---

```mdx-code-block
import DeprecatedV2 from "@site/docs/reusable/javascript-tracker-v2-deprecation/_index.md"
```

<DeprecatedV2/>

You have more than one tracker instance running on the same page at once. This may be useful if you want to log events to different collectors. By default, any Snowplow method you call will be executed by every tracker you have created so far. You can override this behavior and specify which trackers will execute a Snowplow method. To do this, change the method name by adding a colon followed by a list of tracker names separated by semicolons.

```javascript
snowplow("newTracker", "sp1", "{{FIRST_COLLECTOR_URL}}", {
  appId: "my-app",
  platform: "mob"
});

snowplow("newTracker", "sp2", "{{SECOND_COLLECTOR_URL}}", {
  appId: "my-app",
  platform: "mob"
});

// Both trackers will use this custom title
snowplow('setCustomUrl', 'http://mysite.com/checkout-page');

// Both trackers will fire a structured event
snowplow('trackStructEvent', 'Mixes', 'Play', 'MrC/fabric-0503-mix', '', '0.0');

// Only the first tracker will fire this structured event
snowplow('trackStructEvent:sp1', 'Mixes', 'Play', 'MrC/fabric-0503-mix', '', '0.0');

// Only the second tracker will fire this self-describing event
snowplow('trackSelfDescribingEvent:sp2', 
    'iglu:com.acme_company/viewed_product/jsonschema/1-0-0',
    {
        product_id: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        available_since$dt: new Date(2013,3,7)
    }
);

// Both trackers will fire a page view event
snowplow('trackPageView:sp1;sp2');
```
