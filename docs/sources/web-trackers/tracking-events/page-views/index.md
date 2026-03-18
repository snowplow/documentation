---
title: "Track page views on web"
sidebar_label: "Page views"
sidebar_position: 20
description: "Track page views with automatically captured URL, referrer, and title along with page view UUID for session analysis and single page apps."
keywords: ["page views", "page tracking", "webpage entity", "page view ID"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Page view events are one of the most fundamental types of events to track on a website. They're tracked using `trackPageView()`.

Page view events must be **manually tracked**.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

```javascript
snowplow('trackPageView');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import { trackPageView } from '@snowplow/browser-tracker';

trackPageView();
```
  </TabItem>
</Tabs>

This method automatically captures the URL, referrer URL, and page title. The first page view tracked uses `document.referrer` for the referrer URL, while for subsequent page views the referrer is the previous page URL.

It's possible to [override the URL and referrer URL](/docs/sources/web-trackers/tracking-events/index.md#custom-page-url-and-referrer-url).

By default, the tracker infers the page title from the `<title>` tag. If you wish, you can also override the title with a custom value:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

```javascript
snowplow('trackPageView', { title: 'my custom page title' });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import { trackPageView } from '@snowplow/browser-tracker';

trackPageView({ title: 'my custom page title' });
```
  </TabItem>
</Tabs>

## Page view ID and `web_page` entity

When the tracker loads on a page, or when `trackPageView()` is called, it generates a new page view UUID. This page view ID is attached to **all events** tracked on that page, as a [`web_page` entity](/docs/events/ootb-data/page-and-screen-view-events/index.md#web-page-entity), until the next page view event is tracked. At that point, a new page view ID is generated and used for all subsequent events.

From version 3, the `web_page` entity is [enabled by default](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md). We advise you leave this enabled so you can use the [Snowplow Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) dbt package.

By default, the tracker lazily generates the page view ID when it's needed for the first time. For example:

1. The tracker is initialized when the page loads
2. `trackPageView()` is called for the first time
3. Tracker calls `getPageViewId()` to get the current page view ID
4. Since there is no page view ID yet, it generates a new one
5. The page view event is tracked with the generated page view ID
6. Subsequent events use the same page view ID

The next time `trackPageView()` is called, the tracker generates a new page view ID.

If you track an event before the first page view, the tracker will generate the page view ID at that point:

1. The tracker is initialized when the page loads
2. A custom event is tracked
3. Tracker calls `getPageViewId()` to get the current page view ID
4. Since there is no page view ID yet, it generates a new one
5. The custom event is tracked with the generated page view ID
6. Subsequent events, including the first page view, use the same page view ID

The second page view will generate a new page view ID as usual.

You can get the current page view ID using [the `getPageViewId` function](/docs/sources/web-trackers/tracking-events/index.md#page-view-id).

### Change ID behavior for SPAs

In a single-page app (SPA), the tracker stays in memory as the user navigates between URLs. If you track events after navigating to a new URL but before calling `trackPageView()`, those events will use the existing page view ID from the previous page. The ID only resets when `trackPageView()` is called.

Use the `preservePageViewIdForUrl` configuration option to bind the page view ID generation to URL changes instead of page view events. The options are:

* `false` (default): URL changes don't trigger a new ID when reading `getPageViewId()`. Only `trackPageView()` triggers a new ID (on second+ call).
* `true` or `'full'`: generate a new ID when reading `getPageViewId()` if the full URL changed. `trackPageView()` still generates a new ID on second+ call even for the same URL.
* `'pathname'`: generate a new ID when reading `getPageViewId()` if pathname changed. Search params or fragment changes don't trigger a new ID.
* `'pathnameAndSearch'`: generate a new ID when reading `getPageViewId()` if pathname or search params changed. Fragment changes don't trigger a new ID.
* `preservePageViewId`: never regenerate the ID at all. Ignores `preservePageViewIdForUrl`.

You can set these options at initialization or during runtime:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// At initialization
snowplow('newTracker', 'sp', 'collector.example.com', {
  appId: 'my-app',
  preservePageViewIdForUrl: 'pathname'
});

// At runtime
snowplow('preservePageViewIdForUrl', 'pathname');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
// At initialization
import { newTracker, preservePageViewIdForUrl } from '@snowplow/browser-tracker';

const tracker = newTracker('sp', 'collector.example.com', {
  appId: 'my-app',
  preservePageViewIdForUrl: 'pathname'
});

// At runtime
tracker.preservePageViewIdForUrl('pathname');
```

  </TabItem>
</Tabs>

## Reset page activity on page view

By default, tracking a page view using `trackPageView()`resets [activity tracking](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md).

Read more about this in the [activity tracking documentation](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md#reset-page-pings-on-page-view).

## Add entities dynamically

As with all `trackX` methods, `trackPageView` can be passed an array of [custom entities](/docs/sources/web-trackers/custom-tracking-using-schemas/index.md) as an additional parameter.

Additionally, you can add entities to page view and [page ping](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md) events dynamically using the `contextCallback` option.

Pass it a function that returns an array of zero or more entities. The function will fire for the page view and for all subsequent [page pings](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md) on the page. The returned entities will be added to the events.

For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Turn on page pings every 10 seconds
snowplow('enableActivityTracking', {
  minimumVisitLength: 10,
  heartbeatDelay: 10
});

snowplow('trackPageView', {
  // The usual array of static entities
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom entities
  // Gets called once per page view / page ping
  contextCallback: function() {
    return [{
      schema: 'iglu:com.acme/dynamic_context/jsonschema/1-0-0',
      data: {
        dynamicValue: new Date().toString()
      }
    }];
  }
});
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import {
  enableActivityTracking,
  trackPageView
} from '@snowplow/browser-tracker';

// Turn on page pings every 10 seconds
enableActivityTracking({
  minimumVisitLength: 10,
  heartbeatDelay: 10
});

trackPageView({
  // The usual array of static entities
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom entities
  // Gets called once per page view / page ping
  contextCallback: function() {
    return [{
      schema: 'iglu:com.acme/dynamic_context/jsonschema/1-0-0',
      data: {
        dynamicValue: new Date().toString()
      }
    }];
  }
});
```
  </TabItem>
</Tabs>

In this example, the tracked page view and every subsequent page ping will have both a `static_context` and a `dynamic_context` attached. The `static_context` will all have the same `staticValue`, but the `dynamic_context` will have different `dynamicValue` values.
