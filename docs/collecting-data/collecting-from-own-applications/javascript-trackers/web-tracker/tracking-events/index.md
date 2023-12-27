---
title: "Tracking data out-of-the-box"
date: "2022-08-30"
sidebar_position: 2500
---

# Tracking data out-of-the-box

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

To track an event, the API is slightly different depending if you're using the JavaScript or Browser version of our web tracker.

For example, instrumenting a tracker and manually tracking a PageView:

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

  snowplow('trackPageView');

  </script>
  <!-- Snowplow stops plowing -->
  ```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import {
  newTracker,
  trackPageView
} from '@snowplow/browser-tracker';

newTracker('sp', '{{collector_url_here}}', {
    appId: 'my-app-id',
});

trackPageView();
```
  </TabItem>

</Tabs>

The tracker makes it easy to track different kinds of data. We provide three kinds of base events - PageViews, Structured, and fully custom (Self-Describing) - that can be manually tracked. On top of this, we also provide a range of [plugins](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/index.md) for automatic and manual tracking of different events and entities.

Each event has an associated context, which is composed of entities. The tracker attaches entities to the events based on the configuration, but you can attach your own [custom entities](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/custom-tracking-using-schemas/index.md) as well.

Every tracked event payload has a unique `event_id` UUID string set by the tracker, a set of timestamps, and other ubiquitous properties such as the `namespace`. You can know more about how events and entities are structured [here](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md).

## Auto-tracked entities

The tracker can be set up to automatically track certain events, or automatically add entities to every event sent. Most autotracking is specifically configured using plugins, which are imported, enabled, and configured individually.

However, the following autotracked context entities can be configured directly when instrumenting the tracker. To enable them, simply add their names to the `contexts` field of the configuration object.

TODO add link to config here

| Entity    | Usage                             | Enabled by default |
|-----------|-----------------------------------|--------------------|
| `webPage` | A UUID for the page view.         | `true`             |
| `session` | Data about the current session.   | `false`            |
| `browser` | Properties of the user's browser. | `false`            |

The following context entities can be configured by plugin, or when setting up the JavaScript tracker only. To automatically track these context entities when using the Browser tracker, use the plugin versions.

| Entity              | Usage                          | Enabled by default |
|---------------------|--------------------------------|--------------------|
| `performanceTiming` | Performance timing metrics.    | `true`             |
| `gaCookies`         | Extract GA cookie values.      | `true`             |
| `geolocation`       | User's geolocation.            | `false`            |
| `clientHints`       | Chrome user-agent Client Hints | `true`             |

The JavaScript Tracker comes with many predefined context entities which you can automatically add to every event you send. To enable them, simply add them to the `contexts` field of the configuration object as above.

### WebPage

When the JavaScript Tracker loads on a page, it generates a new page view UUID. If the webPage context is enabled, then a context containing this UUID is attached to every page view.

From v3 of the web tracker, the webPage entity is enabled by default. You can disable it if you don't require it but we advise you leave this enabled so you can use the [Snowplow Web Data Model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md).

<details>
    <summary>Web page entity properties</summary>

The [web_page](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0) context entity consists of the following property:

| Attribute | Description                             | Required? |
|-----------|-----------------------------------------|-----------|
| `id`      | An identifier (UUID) for the page view. | Yes       |

</details>

### Session

If this context is enabled, the JavaScript tracker will add a context entity to events with information about the current session. The context entity repeats some of the session information stored in canonical event properties (e.g. `domain_userid`, `domain_sessionid`), but also adds new information. It adds a reference to the previous session (`previousSessionId`) and first event in the current session (`firstEventId`, `firstEventTimestamp`). It also adds an index of the event in the session useful for ordering events as they were tracked (`eventIndex`).

:::note
No session context entities will be added to events if anonymous tracking is enabled.
:::

<details>
    <summary>Client session entity properties</summary>

The [client_session](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2/) context entity consists of the following properties:

| Attribute             | Description                                                                                                   | Required? |
|-----------------------|---------------------------------------------------------------------------------------------------------------|-----------|
| `userId`              | An identifier for the user of the session (same as `domain_userid`).                                          | Yes       |
| `sessionId`           | An identifier (UUID) for the session (same as `domain_sessionid`).                                            | Yes       |
| `sessionIndex`        | The index of the current session for this user (same as `domain_sessionidx`).                                 | Yes       |
| `eventIndex`          | Optional index of the current event in the session. Signifies the order of events in which they were tracked. | No        |
| `previousSessionId`   | The previous session identifier (UUID) for this user.                                                         | No        |
| `storageMechanism`    | The mechanism that the session information has been stored on the device.                                     | Yes       |
| `firstEventId`        | The optional identifier (UUID) of the first event id for this session.                                        | No        |
| `firstEventTimestamp` | Optional date-time timestamp of when the first event in the session was tracked.                              | No        |

:::note
Please note that the session context entity is only available since version 3.5 of the tracker.
:::
</details>

### Browser

This entity records information about the user's browser.

<details>
    <summary>Browser entity properties</summary>

The [browser](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema) context entity consists of the following properties:

| Attribute | Description | Required? |
| : ------: | :--------: | :-----: |
| `viewport` | Viewport dimensions of the browser. Arrives in the form of WidthxHeight e.g. 1200x900. | Yes  |
| `documentSize` | Document dimensions. Arrives in the form of WidthxHeight e.g. 1200x900. | Yes  |
| `resolution` | Device native resolution. Arrives in the form of WidthxHeight e.g. 1200x900. | Yes |
| `colorDepth` | The number of bits allocated to colors for a pixel in the output device, excluding the alpha channel. | Yes |
| `devicePixelRatio` | Ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device. | No  |
| `cookiesEnabled` | Indicates whether cookies are enabled or not. More info and caveats at the official [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled). | Yes |
| `online` | Returns the online status of the browser. Important caveats are described in [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine). | Yes |
| `browserLanguage` | The preferred language of the user, usually the language of the browser UI. Defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646). | No  |
| `documentLanguage` | The language of the HTML document. Defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646). | No  |
| `webdriver` | Indicates whether the user agent is controlled by automation. | No  |
| `deviceMemory` | Approximate amount of device memory in gigabytes. | No  |
| `hardwareConcurrency` | Number of logical processors available to run threads on the user's computer. | No  |
| `tabId` | A UUID identifier for the client browser tab the event is sent from. | No  |

:::note
Please note that the browser context entity is only available since version 3.9 of the tracker.
:::
</details>

## Manually-tracked events

The tracker provides methods for tracking different types of events.
The events are divided into two groups: canonical events and self-describing events.
<!-- You can read more about the difference between the two [here](TODO) -->

### PageView

Read about PageView tracking [here](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/page-views/index.md).

### Custom (Self-Describing)

Read about custom event tracking [here](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/custom-tracking-using-schemas/index.md).

### Structured

There are likely to be a large number of events that can occur on your site, for which a specific tracking method is part of Snowplow.

Our philosophy in creating Snowplow is that users should capture important consumer interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](/docs/understanding-tracking-design/index.md). Using `trackSelfDescribingEvent` captures these interactions with custom schemas, as described above.

However, as part of a Snowplow implementation there may be interactions where custom Self Describing events are perhaps too complex or unwarranted. They are then candidates to track using `trackStructEvent`, if none of the other event-specific methods outlined above are appropriate.

### `trackStructEvent`

There are five parameters can be associated with each structured event. Of them, only the first two are required:

| **Name**   | **Required?** | **Description**                                                                                                                                                                      |
|------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Category` | Yes           | The name you supply for the group of objects you want to track e.g. 'media', 'ecomm'                                                                                                 |
| `Action`   | Yes           | A string which defines the type of user interaction for the web object e.g. 'play-video', 'add-to-basket'                                                                            |
| `Label`    | No            | An optional string which identifies the specific object being actioned e.g. ID of the video being played, or the SKU or the product added-to-basket                                  |
| `Property` | No            | An optional string describing the object or the action performed on it. This might be the quantity of an item added to basket                                                        |
| `Value`    | No            | An optional float to quantify or further describe the user action. This might be the price of an item added-to-basket, or the starting time of the video where play was just pressed |

The async specification for the `trackStructEvent` method is:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript runnable
snowplow('trackStructEvent', {
  category: 'category',
  action: 'action',
  label: 'label',
  property: 'property',
  value: 0.0
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackStructEvent } from '@snowplow/browser-tracker';

trackStructEvent({
  category: 'category',
  action: 'action',
  label: 'label',
  property: 'property',
  value: 0.0
});
```

  </TabItem>
</Tabs>

An example of tracking a user listening to a music mix:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript runnable
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

Note that in the above example no value is set for the `event` property.

`trackStructEvent` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.


## Tracking data that is not event-type specific

Some data, such as that relating to the user whose activity is being tracked, is relevant across all event types. The tracker provides two mechanisms for tracking this kind of data.

Certain properties, including `userId` or `ipAddress`, can be set as "atomic" properties in the raw event, TODO

A more general and powerful method is to attach self-describing JSON "context entities" to your events - the same JSON schemas as used for self-describing events. This means that any data that can be described by a JSON schema can be added to any or all of your events. Read more on the [next page](../custom-tracking-using-schemas/index.md).

All events also provide the option for setting a custom timestamp, called `trueTimestamp`. See below for details.

### Setting the userID

### Setting a custom page URL and referrer URL

### Adding custom timestamps to events

Snowplow events have several timestamps. The raw event payload always contains a `deviceCreatedTimestamp` (`dtm`) and a `deviceSentTimestamp` (`stm`). Other timestamps are added as the event moves through the pipeline.

Every `Event` in the tracker allows for a custom timestamp, called `trueTimestamp` to be set. Read more about timestamps in [this still relevant forums post](https://discourse.snowplowanalytics.com/t/which-timestamp-is-the-best-to-see-when-an-event-occurred/538). 

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
