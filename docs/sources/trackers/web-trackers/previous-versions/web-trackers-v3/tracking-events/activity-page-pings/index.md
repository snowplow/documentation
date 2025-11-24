---
title: "Activity (page pings)"
sidebar_position: 30
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

As well as tracking page views, we can monitor whether users continue to engage with pages over time, and record how they digest content on each page over time.

That is accomplished using 'page ping' events. If activity tracking is enabled, the web page is monitored to see if a user is engaging with it e.g. is the tab in focus, does the mouse move over the page, does the user scroll, is `updatePageActivity` called, etc. If any of these things occur in a set period of time, a page ping event fires, and records the maximum scroll left / right and up / down in the last ping period. If there is no activity in the page, e.g. because the user is on a different browser tab, no page ping fires.

Page ping events are **automatically tracked** once configured.

## Tracking page pings

### Enable activity tracking

Page pings are enabled by:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableActivityTracking', {
  minimumVisitLength: number,
  heartbeatDelay: number
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import {
  enableActivityTracking
} from '@snowplow/browser-tracker';

enableActivityTracking({
  minimumVisitLength: number,
  heartbeatDelay: number
});
```
  </TabItem>
</Tabs>

where `minimumVisitLength` is the time period from page load before the first page ping occurs, in seconds. `heartbeat` is the number of seconds between each page ping, once they have started.

Activity tracking will be disabled if either `minimumVisitLength` or `heartbeatDelay` is not integer. This is to prevent relentless callbacks.

You can elect to enable activity tracking on specific pages. It is executed as part of the main Snowplow tracking tag.

The following example would generate the first ping event after 30 seconds, and subsequent pings every 10 seconds as long as the user continued to browse the page actively.

:::warning
The `enableActivityTracking` method **must** be called _before_ the `trackPageView` method.
:::

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableActivityTracking', {
  minimumVisitLength: 30,
  heartbeatDelay: 10
});

snowplow('trackPageView');
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import {
  enableActivityTracking,
  trackPageView
} from '@snowplow/browser-tracker';

enableActivityTracking({
  minimumVisitLength: 30,
  heartbeatDelay: 10
});

trackPageView();
```
  </TabItem>
</Tabs>

### Disable activity tracking

:::note

Available since version 3.14 of the tracker.
:::

To disable activity tracking, you can use the `disableActivityTracking` method.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('disableActivityTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { disableActivityTracking } from '@snowplow/browser-tracker';

disableActivityTracking();
```
  </TabItem>
</Tabs>

Disabling activity tracking will stop page activity intervals and will not send additional activity tracking events.

### Page activity

You can also mark the user as active with:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('updatePageActivity');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { updatePageActivity } from '@snowplow/browser-tracker';

updatePageActivity();
```

  </TabItem>
</Tabs>

On the next interval after this call, a ping will be generated even if the user had no other activity.

This is particularly useful when a user is passively engaging with your content, e.g. watching a video.

## Activity tracking callback

You can now perform edge analytics in the browser to reduce the number of events sent to you collector whilst still tracking user activity. The Snowplow JavaScript Tracker enables this by allowing a callback to be specified in place of a page ping being sent. This is enabled by:

### Enable callback

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableActivityTrackingCallback', {
  minimumVisitLength: number,
  heartbeatDelay: number,
  callback: (data: ActivityCallbackData) => void
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import {
  enableActivityTrackingCallback
} from '@snowplow/browser-tracker';

enableActivityTrackingCallback({
  minimumVisitLength: number,
  heartbeatDelay: number,
  callback: (data: ActivityCallbackData) => void
});
```

  </TabItem>
</Tabs>

where `minimumVisitLength` is the time period from page load before the first page ping occurs, in seconds. `heartbeat` is the number of seconds between each page ping, once they have started. The `callback` should be a function which will receive an event object containing the page ping activity information, including pageivew_id, and any Page View contexts.

```javascript
type ActivityCallbackData = {
    /**
     * All context for the activity tracking
     * Often generated by the page view events context callback
     */
    context: Array<SelfDescribingJson>;
    /** The current page view id */
    pageViewId: string;
    /** The minimum X scroll position for the current page view */
    minXOffset: number;
    /** The maximum X scroll position for the current page view */
    minYOffset: number;
    /** The minimum Y scroll position for the current page view */
    maxXOffset: number;
    /** The maximum Y scroll position for the current page view */
    maxYOffset: number;
};
```

A full example of how this might be used to aggregate page ping information and then send an event on page unload is below:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
    appId: 'my-app-id',
    eventMethod: 'beacon'
});
var aggregatedEvent = {
    pageViewId: null,
    minXOffset: 0,
    maxXOffset: 0,
    minYOffset: 0,
    maxYOffset: 0,
    numEvents: 0
};
snowplow('enableActivityTrackingCallback', {
  minimumVisitLength: 10,
  heartbeatDelay: 10,
  callback: function (event) {
    aggregatedEvent = {
        pageViewId: event.pageViewId,
        minXOffset: aggregatedEvent.minXOffset < event.minXOffset ? aggregatedEvent.minXOffset : event.minXOffset,
        maxXOffset: aggregatedEvent.maxXOffset > event.maxXOffset ? aggregatedEvent.maxXOffset : event.maxXOffset,
        minYOffset: aggregatedEvent.minYOffset < event.minYOffset ? aggregatedEvent.minYOffset : event.minYOffset,
        maxYOffset: aggregatedEvent.maxYOffset > event.maxYOffset ? aggregatedEvent.maxYOffset : event.maxYOffset,
        numEvents: aggregatedEvent.numEvents + 1
    };
});
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState == 'hidden') {
    window.snowplow('trackSelfDescribingEvent', {
      event: {
        schema: 'iglu:com.acme_company/page_unload/jsonschema/1-0-0',
        data: {
            minXOffset: Math.max(0, Math.round(aggregatedEvent.minXOffset)),
            maxXOffset: Math.max(0, Math.round(aggregatedEvent.maxXOffset)),
            minYOffset: Math.max(0, Math.round(aggregatedEvent.minYOffset)),
            maxYOffset: Math.max(0, Math.round(aggregatedEvent.maxYOffset)),
            activeSeconds: aggregatedEvent.numEvents * 10
        }
      }
    });
  }
});
window.snowplow('trackPageView');
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import {
  newTracker,
  enableActivityTrackingCallback,
  trackPageView,
  trackSelfDescribingEvent
} from '@snowplow/browser-tracker';

newTracker('sp', '{{collector_url_here}}', {
    appId: 'my-app-id',
    eventMethod: 'beacon'
});
var aggregatedEvent = {
    pageViewId: null,
    minXOffset: 0,
    maxXOffset: 0,
    minYOffset: 0,
    maxYOffset: 0,
    numEvents: 0
};
enableActivityTrackingCallback({
  minimumVisitLength: 10,
  heartbeatDelay: 10,
  callback: function (event) {
    aggregatedEvent = {
        pageViewId: event.pageViewId,
        minXOffset: aggregatedEvent.minXOffset < event.minXOffset ? aggregatedEvent.minXOffset : event.minXOffset,
        maxXOffset: aggregatedEvent.maxXOffset > event.maxXOffset ? aggregatedEvent.maxXOffset : event.maxXOffset,
        minYOffset: aggregatedEvent.minYOffset < event.minYOffset ? aggregatedEvent.minYOffset : event.minYOffset,
        maxYOffset: aggregatedEvent.maxYOffset > event.maxYOffset ? aggregatedEvent.maxYOffset : event.maxYOffset,
        numEvents: aggregatedEvent.numEvents + 1
    };
});
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState == 'hidden') {
    trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.acme_company/page_unload/jsonschema/1-0-0',
        data: {
            minXOffset: Math.max(0, Math.round(aggregatedEvent.minXOffset)),
            maxXOffset: Math.max(0, Math.round(aggregatedEvent.maxXOffset)),
            minYOffset: Math.max(0, Math.round(aggregatedEvent.minYOffset)),
            maxYOffset: Math.max(0, Math.round(aggregatedEvent.maxYOffset)),
            activeSeconds: aggregatedEvent.numEvents * 10
        }
      }
    });
  }
});
trackPageView();
```

  </TabItem>
</Tabs>

:::note
For this technique of sending on visibility change to work reliably, we recommend initialising the Snowplow tracker with `eventMethod: 'beacon'` and/or `stateStorageStrategy: 'cookieAndLocalStorage'` (if navigating to a page that also contains the JS Tracker). Using the visibility change technique may not work as expected for Single Page Applications (SPA), you would need to send the aggregated event to the Snowplow collector on navigation within your application.
:::

:::warning
The `iglu:com.acme_company/page_unload/jsonschema/1-0-0` schema used in the example is not a valid schema. Please define your own schema for these events. Otherwise, they will fail validation and go to the bad event queue.
:::

We are using `visibilitychange` events as `beforeunload` isn't a reliable option for mobile devices when using `beacon`. You can read more about this on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#description). An idea on the different levels of compatibility of the different Page Visiblity API across browsers and mobile can here found [here](https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/).

### Disable callback

:::note
Available since version 3.14 of the tracker.
:::

To disable the activity tracking callback, you can use the `disableActivityTrackingCallback` method.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('disableActivityTrackingCallback');
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { disableActivityTrackingCallback } from '@snowplow/browser-tracker';

disableActivityTrackingCallback();
```
  </TabItem>
</Tabs>

This will stop any further activity tracking callback from being executed.

## Reset page ping on page view

By default the tracker will reset the Page Ping timers, which were configured when `enableActivityTracking` is called, as well as reset the attached webPage context entities on all future Page Pings when a new [`trackPageView`](../page-views/index.md) event occurs. This is enabled by default as of 2.13.0 and is particularly useful for Single Page Applications (SPA). If you previously relied on this behavior, you can disable this functionality by specifying `resetActivityTrackingOnPageView: false` in the configuration object on tracker initialisation.
