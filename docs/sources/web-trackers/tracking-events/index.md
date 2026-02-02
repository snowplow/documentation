---
title: "Track data out-of-the-box with the web trackers"
sidebar_label: "Tracking data out-of-the-box"
date: "2022-08-30"
sidebar_position: 2500
description: "Track page views, structured events, and self-describing events with automatic context entities and custom timestamps using the web trackers."
keywords: ["tracking", "events"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

To track an event, the API is slightly different depending if you're using the JavaScript or Browser version of our web tracker.

The main built-in events are [page views](/docs/sources/web-trackers/tracking-events/page-views/index.md) and [page pings](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md). Here's how to track them:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

  ```javascript
  <script type="text/javascript">
  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
  p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
  };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
  n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));

  snowplow('newTracker', 'sp', '{{collector_url_here}}', {
      appId: 'my-app-id',
  });

  snowplow('enableActivityTracking', {
    minimumVisitLength: 30,
    heartbeatDelay: 10
  });

  snowplow('trackPageView');
  </script>
  ```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import {
  newTracker,
  trackPageView,
  enableActivityTracking
} from '@snowplow/browser-tracker';

newTracker('sp', '{{collector_url_here}}', {
    appId: 'my-app-id',
});

enableActivityTracking({
  minimumVisitLength: 30,
  heartbeatDelay: 10
});

trackPageView();
```
  </TabItem>

</Tabs>

As well as page views and activity tracking, you can track [custom events](/docs/sources/web-trackers/custom-tracking-using-schemas/index.md), or use [plugins](/docs/sources/web-trackers/plugins/index.md) to track a wide range of other events and entities.

## Add contextual data with entities

The tracker can be set up to automatically add [entities](/docs/fundamentals/entities/index.md) to every event sent.

Most entity autotracking is specifically configured using plugins, which are imported, enabled, and configured individually. However, you can configure some entities directly when instrumenting the tracker, using the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

| Entity                                                                                                          | Usage                            | Added by default | JavaScript (tag) tracker | Browser (npm) tracker |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------- | ------------------------ | --------------------- |
| [`webPage`](/docs/sources/web-trackers/tracking-events/page-views/index.md#webpage-page-view-id-context-entity) | UUID for the page view           | ✅                | `contexts` config        | `contexts` config     |
| [`session`](/docs/sources/web-trackers/tracking-events/session/index.md)                                        | Data about the current session   | ❌                | `contexts` config        | `contexts` config     |
| [`browser`](/docs/sources/web-trackers/browsers/index.md)                                                       | Properties of the user's browser | ❌                | `contexts` config        | `contexts` config     |
| [`performanceTiming`](/docs/sources/web-trackers/tracking-events/timings/index.md)                              | Performance timing metrics       | ❌                | `contexts` config        | Plugin                |
| [`gaCookies`](/docs/sources/web-trackers/tracking-events/ga-cookies/index.md)                                   | Extract GA cookie values         | ❌                | `contexts` config        | Plugin                |
| [`geolocation`](/docs/sources/web-trackers/tracking-events/timezone-geolocation/index.md)                       | User's geolocation               | ❌                | `contexts` config        | Plugin                |

If you're using the `sp.lite.js` JavaScript tracker distribution, only the `webPage`, `session`, and `browser` entities are available out of the box, as the others require plugins that aren't included in that distribution.

You can also attach your own [custom entities](/docs/sources/web-trackers/custom-tracking-using-schemas/index.md) to events.

For example, here is a page view with an additional custom entity:

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
  }]
});
```
  </TabItem>
</Tabs>

:::note

Tracker methods available through plugins do not necessarily support adding custom entities. For those please refer to the corresponding plugin documentation for details.

:::

## Set event properties

Certain event properties, including `domain_userid` or `application_id`, can be set as [atomic properties](/docs/fundamentals/canonical-event/index.md) in the raw event.

### Application ID

Set the application ID using the `appId` field of the [tracker configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md). This will be attached to every event the tracker fires. You can set different application IDs on different parts of your site. You can then distinguish events that occur on different applications by grouping results based on `application_id`.

### Application version

:::info
The option to track the application version was introduced in version 4.1 of the JavaScript tracker.
:::

Set the application ID using the `appVersion` field of the [tracker configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md). This will be attached to every event the tracker fires using the [application context entity](/docs/events/ootb-data/app-information/index.md#entity-definitions).

The version of can be a semver-like structure (e.g 1.1.0) or a Git commit SHA hash.

### Application platform

Set the application platform using the `platform` field of the [tracker configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md). This will be attached to every event the tracker fires. Its default value is “web”. For a list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/fundamentals/canonical-event/index.md#application-fields).

### Business user ID

The JavaScript Tracker automatically sets a `domain_userid` based on a first party cookie. Read more about cookies [here](/docs/sources/web-trackers/cookies-and-local-storage/index.md).

There are many situations, however, when you will want to identify a specific user using an ID generated by one of your business systems. To do this, you use one of the methods described in this section: `setUserId`, `setUserIdFromLocation`, `setUserIdFromReferrer`, and `setUserIdFromCookie`.

Typically, companies do this at points in the customer journey where users identify themselves e.g. if they log in.

:::note
This will only set the user ID on further events fired while the user is on this page; if you want events on another page to record this user ID too, you must call `setUserId` on the other page as well.
:::

#### `setUserId`

`setUserId` is the simplest of the four methods. It sets the business user ID to a string of your choice:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserId', 'joe.blogs@email.com');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserId('joe.blogs@email.com');
```

  </TabItem>
</Tabs>

:::note
`setUserId` can also be called using the alias `identifyUser`.
:::

#### `setUserIdFromLocation`

`setUserIdFromLocation` lets you set the user ID based on a querystring field of your choice. For example, if the URL is `http://www.mysite.com/home?id=user345`, then the following code would set the user ID to “user345”:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserIdFromLocation', 'id');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserIdFromLocation('id');
```

  </TabItem>
</Tabs>

#### `setUserIdFromReferrer`

`setUserIdFromReferrer` functions in the same way as `setUserIdFromLocation`, except that it uses the referrer querystring rather than the querystring of the current page.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserIdFromReferrer', 'id');
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserIdFromReferrer('id');
```

  </TabItem>
</Tabs>

#### `setUserIdFromCookie`

Use `setUserIdFromCookie` to set the value of a cookie as the user ID. For example, if you have a cookie called “cookieid” whose value is “user123”, the following code would set the user ID to “user123”:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setUserIdFromCookie', 'cookieid');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setUserIdFromCookie('cookieid');
```

  </TabItem>
</Tabs>

### Custom page URL and referrer URL

The Snowplow JavaScript Tracker automatically tracks the page URL and referrer URL on any event tracked. However, in certain situations, you may want to override the one or both of these URLs with a custom value. For example, this might be desirable if your CMS spits out particularly ugly URLs that are hard to unpick at analysis time.

To set a custom page URL, use the `setCustomUrl` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setCustomUrl', 'http://mysite.com/checkout-page');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setCustomUrl('http://mysite.com/checkout-page');
```

  </TabItem>
</Tabs>

To set a custom referrer, use the `setReferrerUrl` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setReferrerUrl', 'http://custom-referrer.com');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setReferrerUrl('http://custom-referrer.com');
```

  </TabItem>
</Tabs>

:::tip For Single Page Apps
On an SPA, the page URL might change without the page being reloaded. Whenever an event is fired, the Tracker checks whether the page URL has changed since the last event. If it has, the page URL is updated and the URL at the time of the last event is used as the referrer. If you use `setCustomUrl`, the page URL will no longer be updated in this way. Similarly if you use `setReferrerUrl`, the referrer URL will no longer be updated in this way.

To use `setCustomUrl` within an SPA, call it before all `trackPageView` calls.

If you want to ensure that the original referrer is preserved even though your page URL can change without the page being reloaded, use `setReferrerUrl` like this before sending any events:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('setReferrerUrl', document.referrer);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
setReferrerUrl(document.referrer);
```
  </TabItem>
</Tabs>
:::

### Custom timestamp

Snowplow events have several [timestamps](/docs/events/timestamps/index.md).

Every `trackX...()` method in the tracker allows for a custom timestamp, called `trueTimestamp` to be set.

In certain circumstances you might want to set the timestamp yourself e.g. if the JS tracker is being used to process historical event data, rather than tracking the events live. In this case you can set the `true_timestamp` for the event.

To set the true timestamp add an extra argument to your track method: `{type: 'ttm', value: unixTimestampInMs}`.

This example shows how to set a true timestamp for a page view event:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackPageView', {
  timestamp: { type: 'ttm', value: 1361553733371 }
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackPageView({
  timestamp: { type: 'ttm', value: 1361553733371 }
});
```
  </TabItem>
</Tabs>


E.g. to set a true timestamp for a self-describing event:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/2-0-0',
    data: {
        productId: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        availableSince: new Date(2013,3,7)
    }
  },
  timestamp: { type: 'ttm', value: 1361553733371 }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackSelfDescribingEvent({
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/2-0-0',
    data: {
        productId: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        availableSince: new Date(2013,3,7)
    }
  },
  timestamp: { type: 'ttm', value: 1361553733371 }
});
```
  </TabItem>
</Tabs>


## Get event properties

It's possible to retrieve certain identifiers and properties for use in your code. You'll need to use a callback for the JavaScript tracker.

```mdx-code-block
import RetrieveValuesJs from "@site/docs/reusable/javascript-tracker-retrieve-values/_javascript.md"
import RetrieveValuesBrowser from "@site/docs/reusable/javascript-tracker-retrieve-values/_browser.md"
```

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

<RetrieveValuesJs />

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

<RetrieveValuesBrowser />

  </TabItem>
</Tabs>

### Cookie values

You can [retrieve cookie values](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md) using the `getDomainUserInfo` and other getters, or from the cookies directly.

### Page view ID

When the JavaScript Tracker loads on a page, it generates a new [page view UUID](docs/sources/web-trackers/tracking-events/page-views/index.md). To get this page view ID, use the `getPageViewId` method:

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

### Business user ID

The `getUserId` method returns the user ID which you configured using `setUserId()`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var userId = sp.getUserId();
 console.log(userId);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const userId = sp.getUserId();
console.log(userId);
```

  </TabItem>
</Tabs>

### Tab ID

If you've enabled the [`browser` entity](/docs/sources/web-trackers/browsers/index.md), you can get the tab ID using the `getTabId` method. It's a UUID identifier for the specific browser tab the event is sent from.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Access the tracker instance inside a callback
snowplow(function () {
 var sp = this.sp;
 var tabId = sp.getTabId();
 console.log(tabId);
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const tabId = sp.getTabId();
console.log(tabId);
```

  </TabItem>
</Tabs>
