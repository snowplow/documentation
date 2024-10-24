---
title: "Managing multiple trackers"
date: "2021-03-31"
sidebar_position: 4000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

You can have more than one tracker instance running on the same page at once. This may be useful if you want to log events to different collectors. By default, any Snowplow method you call will be executed by every tracker you have created so far. 

You can override this behavior and specify which trackers will execute a Snowplow method. 

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>
To do this, change the method name by adding a colon followed by a list of tracker names separated by semicolons as such:

```javascript
/* Sending a pageview on a single tracker */
snowplow('trackPageView:{{TRACKER_NAME}}');
/* Sending a pageview on multiple trackers */
snowplow('trackPageView:{{TRACKER_NAME}};{{ANOTHER_TRACKER_NAME}}');

/**
 * Where {{TRACKER_NAME}} and {{ANOTHER_TRACKER_NAME}} are names of 
 * trackers initialized on the page using the `newTracker` API.
*/
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">
To do this, there is a final parameter on each function call that accepts an array containing the tracker identifiers you wish this function to be executed against as such:

```javascript
/* Sending a pageview on a single tracker */
trackPageView({}, [ '{{TRACKER_NAME}}' ]);
/* Sending a pageview on multiple trackers */
trackPageView({}, [ '{{TRACKER_NAME}}', '{{ANOTHER_TRACKER_NAME}}' ]);

/**
 * Where {{TRACKER_NAME}} and {{ANOTHER_TRACKER_NAME}} are names of 
 * trackers initialized on the page using the `newTracker` API.
*/
```

  </TabItem>
</Tabs>

Example usage:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow("newTracker", "sp1", "{{FIRST_COLLECTOR_URL}}", {
  appId: "my-app",
  platform: "mob"
});

snowplow("newTracker", "sp2", "{{SECOND_COLLECTOR_URL}}", {
  appId: "my-app",
  platform: "mob"
});

/* Both trackers will use this custom title */
snowplow('setCustomUrl', 'http://mysite.com/checkout-page');

/* Both trackers will fire a structured event */
snowplow('trackStructEvent', {
  category: 'Mixes',
  action: 'Play',
  label: 'MRC/fabric-0503-mix',
  property: '',
  value: 0.0,
});

/* Only the first tracker will be affected by the plugin addition */
snowplow(
  "addPlugin:sp1",
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-web-vitals@3/dist/index.umd.min.js",
  ["snowplowWebVitals", "WebVitalsPlugin"]
);

/* Only the first tracker will fire this structured event */
snowplow('trackStructEvent:sp1', {
  category: 'Mixes',
  action: 'Play',
  label: 'MRC/fabric-0503-mix',
  property: '',
  value: 0.0,
});

/* Only the second tracker will fire this self-describing event */
snowplow('trackSelfDescribingEvent:sp2', { 
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/1-0-0',
    data: {
        product_id: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        available_since$dt: new Date(2013,3,7)
    }
  }
});

/* Both trackers will fire a page view event */
snowplow('trackPageView:sp1;sp2');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { 
  newTracker, 
  setCustomUrl, 
  trackStructEvent, 
  trackSelfDescribingEvent, 
  trackPageView
} from '@snowplow/browser-tracker';
import { WebVitalsPlugin } from "@snowplow/browser-plugin-web-vitals";

newTracker('sp1', '{{FIRST_COLLECTOR_URL}}', {
  appId: 'my-app',
  platform: 'mob'
});

newTracker('sp2', '{{SECOND_COLLECTOR_URL}}', {
  appId: 'my-app',
  platform: 'web'
});

/* Both trackers will use this custom title */
setCustomUrl('http://mysite.com/checkout-page');

/* Both trackers will fire a structured event */
trackStructEvent({
  category: 'Mixes',
  action: 'Play',
  label: 'MRC/fabric-0503-mix',
  property: '',
  value: 0.0,
});

/* Only the first tracker will be affected by the plugin addition */
addPlugin({ plugin: WebVitalsPlugin() }, ['sp1']);

/* Only the first tracker will fire this structured event */
trackStructEvent({
  category: 'Mixes',
  action: 'Play',
  label: 'MRC/fabric-0503-mix',
  property: '',
  value: 0.0,
},
[ 'sp1' ]);

/* Only the second tracker will fire this self-describing event */
trackSelfDescribingEvent({ 
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/1-0-0',
    data: {
        product_id: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        available_since$dt: new Date(2013,3,7)
    }
  }
},
[ 'sp2' ]);

/* Both trackers will fire a page view event */
trackPageView({}, [ 'sp1', 'sp2' ]);
```

  </TabItem>
</Tabs>
