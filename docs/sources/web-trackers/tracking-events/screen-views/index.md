---
title: "Track screen views on web"
sidebar_label: "Screen views"
sidebar_position: 60
description: "Track screen views with mobile-style tracking on web including screen engagement metrics for time spent and scroll depth analysis."
keywords: ["screen views", "mobile tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Screen view tracking is the recommended way to track users opening a screen in mobile apps. They are the default option for tracking views in our mobile trackers. Check out the [screen tracking overview page](/docs/events/ootb-data/page-and-screen-view-events/index.md) for more details and schemas.

On web, [we recommend using page views](/docs/sources/web-trackers/tracking-events/page-views/index.md) to track users visiting a page. However, using the screen view tracking plugin is also an option on web.

:::note Availability
The plugin is available from Version 4.2 of the tracker.
:::

Screen tracking events must be **manually tracked**. The plugin will add the relevant entities automatically.

## Install plugin

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table>
  <tbody>
    <tr>
      <td>Download from GitHub Releases (Recommended)</td>
      <td>
        <a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a>
      </td>
    </tr>
    <tr>
      <td>Available on jsDelivr</td>
      <td>
        <a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-screen-tracking@latest/dist/index.umd.min.js">jsDelivr</a> (latest)
      </td>
    </tr>
    <tr>
      <td>Available on unpkg</td>
      <td>
        <a href="https://unpkg.com/@snowplow/browser-plugin-screen-tracking@latest/dist/index.umd.min.js">unpkg</a> (latest)
      </td>
    </tr>
  </tbody>
</table>

</TabItem>
<TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-screen-tracking`
- `yarn add @snowplow/browser-plugin-screen-tracking`
- `pnpm add @snowplow/browser-plugin-screen-tracking`

</TabItem>
</Tabs>

In order to make use of the plugin, you will need to register it with the tracker:

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-screen-tracking@latest/dist/index.umd.min.js',
    ['snowplowScreenTracking', 'ScreenTrackingPlugin']
);
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { ScreenTrackingPlugin } from '@snowplow/browser-plugin-screen-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [
    ScreenTrackingPlugin()
   ],
});
```

</TabItem>
</Tabs>


## Track a screen view event

To track a [screen view event](/docs/events/ootb-data/page-and-screen-view-events/index.md#screen-views), use the `trackScreenView` function.

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

This example shows the required properties only.

```javascript
window.snowplow(
  'trackScreenView',
  {
    name: 'my-screen-name',
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e', // generated automatically if not provided
  }
);
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

This example shows the required properties only.

```javascript
import { trackScreenView } from '@snowplow/browser-plugin-screen-tracking';

trackScreenView({
  name: 'my-screen-name',
  id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e', // generated automatically if not provided
});
```

</TabItem>
</Tabs>

## Screen entity

By default, the tracker will automatically attach [a `screen` entity](/docs/events/ootb-data/page-and-screen-view-events/index.md#screen-entity) to **all** events tracked.

However, if you haven't tracked any screen views, no `screen` entity will be attached. The `screen` entity contains information about the last screen viewed by the user, based on the last `trackScreenView` call.

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-screen-tracking@latest/dist/index.umd.min.js',
    ['snowplowScreenTracking', 'ScreenTrackingPlugin'],
    [
      {
        screenContext: true, // enabled by default
      }
    ]
);
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { ScreenTrackingPlugin } from '@snowplow/browser-plugin-screen-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [
    ScreenTrackingPlugin({
      screenContext: true, // enabled by default
    })
   ],
});
```

</TabItem>
</Tabs>

## Screen engagement tracking

By default, the screen tracking plugin enables [screen engagement tracking](/docs/events/ootb-data/page-activity-tracking/index.md#screen-engagement).

The tracker will automatically track a screen end event, with `screen_summary` entity, just before tracking a new screen view event.

Because this feature was designed for mobile platforms, not all the functionality is applicable to web. The page doesn't distinguish between foreground and background, so the `foreground_sec` time in the `screen_summary` entity will track the total time spent on the screen. The `background_sec` field will always be `null`.

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-screen-tracking@latest/dist/index.umd.min.js',
    ['snowplowScreenTracking', 'ScreenTrackingPlugin'],
    [
      {
        screenEngagementAutotracking: true, // enabled by default
      }
    ]
);
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { ScreenTrackingPlugin } from '@snowplow/browser-plugin-screen-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [
    ScreenTrackingPlugin({
      screenEngagementAutotracking: true, // enabled by default
    })
   ],
});
```

</TabItem>
</Tabs>


### Updating list item view and scroll depth information

To update the [list item viewed and scroll depth information](/docs/events/ootb-data/page-activity-tracking/index.md#screen-engagement) tracked in the `screen_summary` entity, track the `ListItemView` and `ScrollChanged` events with this information.

:::note Page pings and element visibility

We designed the screen summary entity to work with mobile platforms. On web, you can track scroll offsets automatically using [page pings](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md).

For fine-grained tracking of page element visibility, consider using the [element visibility tracking plugin](/docs/sources/web-trackers/tracking-events/element-tracking/index.md) instead.

:::

When tracked and `screenEngagementAutotracking` is enabled, the tracker won't send these events to the Collector, but will process the information into the next screen summary entity. This means that tracking these events by themselves has no effect if you don't also track screen views.

If you've set `screenEngagementAutotracking: false`, the list item view and scroll depth events are treated as regular events and sent to the Collector.

You may want to track the events every time a new list item is viewed on the screen, or whenever the scroll position changes.

To update the list items viewed information:

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
  'trackListItemView',
  {
    index: 1,
    itemsCount: 10,
  }
);
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { trackListItemView } from '@snowplow/browser-plugin-screen-tracking';

trackListItemView({
  index: 1,
  itemsCount: 10,
});
```

</TabItem>
</Tabs>

To update the scroll depth information:

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
  'trackScrollChanged',
  {
    yOffset: 10,
    xOffset: 20,
    viewHeight: 100,
    viewWidth: 200,
    contentHeight: 300,
    contentWidth: 400,
  }
);
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { trackScrollChanged } from '@snowplow/browser-plugin-screen-tracking';

trackScrollChanged({
  yOffset: 10,
  xOffset: 20,
  viewHeight: 100,
  viewWidth: 200,
  contentHeight: 300,
  contentWidth: 400,
});
```

</TabItem>
</Tabs>
