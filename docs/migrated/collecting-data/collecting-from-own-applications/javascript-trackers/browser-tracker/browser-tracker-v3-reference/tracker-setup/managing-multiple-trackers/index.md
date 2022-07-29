---
title: "Managing multiple trackers"
date: "2021-03-31"
sidebar_position: 4000
---

You have more than one tracker instance running on the same page at once. This may be useful if you want to log events to different collectors. By default, any Snowplow method you call will be executed by every tracker you have created so far. You can override this behaviour and specify which trackers will execute a Snowplow method. To do this, there is a final parameter on each function call that accepts an array containing the tracker identifiers you wish this function to be excuted against.

```
import { 
  newTracker, 
  setCustomUrl, 
  trackStructEvent, 
  trackSelfDescribingEvent, 
  trackPageView
} from '@snowplow/browser-tracker';

newTracker('sp1', '{{FIRST_COLLECTOR_URL}}', {
  appId: 'my-app',
  platform: 'mob'
});

newTracker('sp2', '{{SECOND_COLLECTOR_URL}}', {
  appId: 'my-app',
  platform: 'web'
});

// Both trackers will use this custom title
setCustomUrl('http://mysite.com/checkout-page');

// Both trackers will fire a structured event
trackStructEvent({
  category: 'Mixes',
  action: 'Play',
  label: 'MRC/fabric-0503-mix',
  property: '',
  value: 0.0,
});

// Only the first tracker will fire this structured event
trackStructEvent({
  category: 'Mixes',
  action: 'Play',
  label: 'MRC/fabric-0503-mix',
  property: '',
  value: 0.0,
},
[ 'sp1' ]);

// Only the second tracker will fire this self-describing event
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

// Both trackers will fire a page view event
trackPageView({}, [ 'sp1', 'sp2' ]);
```
