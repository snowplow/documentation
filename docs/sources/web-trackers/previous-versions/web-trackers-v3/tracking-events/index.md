---
title: "Tracking data out-of-the-box"
date: "2022-08-30"
sidebar_position: 2500
description: "Documentation for tracking Tracking data out-of-the-box with the web tracker."
keywords: ["tracking", "events"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

To track an event, the API is slightly different depending if you're using the JavaScript or Browser version of our web tracker.

For example, instrumenting a tracker and manually tracking a [page view](./page-views/index.md). Note that [activity tracking](./activity-page-pings/index.md) (page pings) is also configured here.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

  ```javascript
  <!-- Snowplow starts plowing -->
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
  <!-- Snowplow stops plowing -->
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

The tracker makes it easy to track different kinds of data. We provide three kinds of base events - PageViews, Structured, and fully custom (Self-Describing) - that can be manually tracked. On top of this, we also provide a range of [plugins](../plugins/index.md) for automatic and manual tracking of different events and entities.

Each event has an associated context, which is composed of entities. The tracker attaches entities to the events based on the tracker configuration and active plugins. You can also attach your own [custom entities](../custom-tracking-using-schemas/index.md) to all `trackX` method calls.

:::note

Tracker methods available through plugins do not necessarily support adding custom entities. For those please refer to the corresponding plugin documentation for details.

:::

For example, here is a page view with an additional custom context entity.

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

Every tracked event payload has a unique `event_id` UUID string set by the tracker, a set of timestamps, and other ubiquitous properties such as the `namespace`. You can find out more about how events and entities are structured [here](/docs/events/index.md).

## Auto-tracked entities

The tracker can be set up to automatically track certain events, or automatically add entities to every event sent. Most autotracking is specifically configured using plugins, which are imported, enabled, and configured individually.

However, the following autotracked context entities can be configured directly when instrumenting the tracker. To enable them, simply add their names and boolean to the `contexts` field of the [configuration object](../tracker-setup/initialization-options/index.md). They will be added to every event tracked.

| Entity                                                    | Usage                             | Enabled by default |
| --------------------------------------------------------- | --------------------------------- | ------------------ |
| [`webPage`](./page-views/index.md#webpage-page-view-id-context-entity) | A UUID for the page view.         | `true`             |
| [`session`](./session/index.md)                           | Data about the current session.   | `false`            |
| [`browser`](../browsers/index.md)                         | Properties of the user's browser. | `false`            |

The following context entities can be configured by plugin, or when setting up the **JavaScript tracker** configuration object only. To automatically track these context entities when using the Browser tracker, use the plugin versions.

| Entity                                           | Usage                          | Enabled by default |
| ------------------------------------------------ | ------------------------------ | ------------------ |
| [`performanceTiming`](./timings/index.md)        | Performance timing metrics.    | `true`             |
| [`gaCookies`](./ga-cookies/index.md)             | Extract GA cookie values.      | `true`             |
| [`geolocation`](./timezone-geolocation/index.md) | User's geolocation.            | `false`            |
| [`clientHints`](./client-hints/index.md)         | Chrome user-agent Client Hints | `true`             |

## Manually-tracked events

The tracker provides methods for tracking different types of events.
The events are divided into two groups: canonical events and self-describing events. Canonical event properties have their own column in the data warehouse, while self-describing custom events are based on JSON schema.

### Page view

Read about page view tracking [here](./page-views/index.md).

### Custom (self-describing)

Our philosophy in creating Snowplow is that users should capture important user interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](/docs/data-product-studio/index.md).

Read about how to track custom events [here](../custom-tracking-using-schemas/index.md).

### Structured

There may be user interactions where custom self-describing events are too complex or unwarranted. They are candidates to track using `trackStructEvent`.

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

## Tracking data that is not event-type specific

Some data, such as that relating to the user whose activity is being tracked, is relevant across all event types. The tracker provides two mechanisms for tracking this kind of data.

Certain properties, including `domain_userid` or `application_id`, can be set as "atomic" properties in the raw event. These properties have their own column in the data warehouse.

A more general and powerful method is to attach self-describing JSON "context entities" to your events - the same JSON schemas as used for self-describing events. This means that any data that can be described by a JSON schema can be added to any or all of your events. Read more [here](../custom-tracking-using-schemas/index.md).

All events also provide the option for setting a custom timestamp, called `trueTimestamp`. See below for details.

### Setting application ID

Set the application ID using the `appId` field of the [tracker configuration object](../tracker-setup/initialization-options/index.md). This will be attached to every event the tracker fires. You can set different application IDs on different parts of your site. You can then distinguish events that occur on different applications by grouping results based on `application_id`.

### Setting application platform

Set the application platform using the `platform` field of the [tracker configuration object](../tracker-setup/initialization-options/index.md). This will be attached to every event the tracker fires. Its default value is “web”. For a list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/fundamentals/canonical-event/index.md#application-fields).

### Setting the user ID

The JavaScript Tracker automatically sets a `domain_userid` based on a first party cookie. Read more about cookies [here](../cookies-and-local-storage/index.md).

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

### Getting user ID once set

It's possible to retrieve certain properties for use in your code, including the user ID, [page view ID](./page-views/index.md#get-page-view-id), and [cookie values](../cookies-and-local-storage/getting-cookie-values/index.md#retrieving-cookie-properties-from-the-tracker), using a tracker callback. This is an advanced usage of the tracker.

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

### Setting a custom page URL and referrer URL

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

### Adding custom timestamps to events

Snowplow events have several timestamps. The raw event payload always contains a `deviceCreatedTimestamp` (`dtm`) and a `deviceSentTimestamp` (`stm`). Other timestamps are added as the event moves through the pipeline.

Every `trackX...()` method in the tracker allows for a custom timestamp, called `trueTimestamp` to be set.

As standard, every event tracked by the Javascript tracker will be recorded with two timestamps:

1. A `device_created_tstamp` - set when the event occurred
2. A `device_sent_tstamp` - set when the event was sent by the tracker to the collector

These are combined downstream in the Snowplow pipeline (with the `collector_tstamp`) to calculate the `derived_tstamp`, which is our best estimate of when the event actually occurred.

In certain circumstances you might want to set the timestamp yourself e.g. if the JS tracker is being used to process historical event data, rather than tracking the events live. In this case you can set the `true_timestamp` for the event. When set, this will be used as the value in the `derived_tstamp` rather than a combination of the `device_created_tstamp`, `device_sent_tstamp` and `collector_tstamp`.

To set the true timestamp add an extra argument to your track method: `{type: 'ttm', value: unixTimestampInMs}`.

E.g. to set a true timestamp with a page view event:

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
