---
title: "Page views"
sidebar_position: 20
---

# Page view tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Page view events are tracked using the `trackPageView` method. This is generally part of the first Snowplow tag to fire, or first method to be called, on a particular web page. As a result, the `trackPageView` method is usually deployed straight after the tag that also invokes the Snowplow JavaScript (sp.js).

## Tracking a page view

Page view events must be **manually tracked**.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

```javascript runnable
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

This method automatically captures the URL, referrer URL and page title (inferred from the `<title>` tag). The first page view tracked uses `document.referrer` for the referrer URL, while for subsequent page views it is the previous page URL.

It's possible to [override the URL and referrer URL](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#setting-a-custom-page-url-and-referrer-url).

If you wish, you can also override the title with a custom value:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

```javascript runnable
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

## Context callback

As with all `trackX` methods, `trackPageView` can be passed an array of [custom context entities](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/custom-tracking-using-schemas/index.md) as an additional parameter.

Additionally, you can pass a function which returns an array of zero or more context entities to `trackPageView`. For the page view and for all subsequent [page pings](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/activity-page-pings/index.md), the function will be called and the context entities it returns will be added to the event.

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
  // The usual array of static context entities
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom context entities
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
  // The usual array of static context entities
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom context entities
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

In this example, the tracked page view and every subsequent page ping will have both a static_context and a dynamic_context attached. The static_contexts will all have the same staticValue, but the dynamic_contexts will have different dynamicValues since a new context is created for every event.

## WebPage (page view ID) context entity

When the JavaScript Tracker loads on a page, it generates a new page view UUID. If the webPage context entity is enabled, then an entity containing this UUID is attached to **all events**.

From v3 of the web tracker, the webPage entity is enabled by default. We advise you leave this enabled so you can use the [Snowplow Web Data Model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md).

To disable this entity, set `"webPage": false` in the `"contexts"` object within the [tracker configuration object](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/index.md).

<details>
    <summary>Web page entity properties</summary>

The [web_page](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0) context entity consists of the following property:

| Attribute | Description                             | Required? |
|-----------|-----------------------------------------|-----------|
| `id`      | An identifier (UUID) for the page view. | Yes       |

</details>

## Reset page ping on page view

By default the tracker will reset the Page Ping timers, which were configured when [`enableActivityTracking`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/activity-page-pings/index.md) is called, as well as reset the attached webPage context entities on all future Page Pings when a new `trackPageView` event occurs. This is enabled by default as of 2.13.0 and is particularly useful for Single Page Applications (SPA). If you previously relied on this behavior, you can disable this functionality by specifying `resetActivityTrackingOnPageView: false` in the configuration object on tracker initialisation.

## Get page view ID

When the JavaScript Tracker loads on a page, it generates a new page view UUID as mentioned above.

It's possible to retrieve certain properties for use in your code, including the page view UUID, [user ID](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#getting-user-id-once-set), and [cookie values](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/getting-cookie-values/#retrieving-cookie-properties-from-the-tracker), using a tracker callback. This is an advanced usage of the tracker.

```mdx-code-block
import RetrieveValues from "@site/docs/reusable/javascript-tracker-retrieve-values/_index.md"
```

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

<RetrieveValues lang="javascript" />

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

<RetrieveValues lang="browser" />

  </TabItem>
</Tabs>

To get the page view ID, use the `getPageViewId` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var pageViewId = sp.getPageViewId();
 console.log(pageViewId);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const pageViewId = sp.getPageViewId();
console.log(pageViewId);
```

  </TabItem>
</Tabs>
