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

Screen view tracking is the recommended way to track users opening a screen in mobile apps.
They are the default option for tracking views in our mobile trackers (iOS, Android, React Native, Flutter).
On Web, [we recommend using page views](/docs/sources/web-trackers/tracking-events/page-views/index.md) to track users visiting a page.
However, using the screen view tracking plugin is also an option on Web if you prefer this data model.

:::note
The plugin is available from Version 4.2 of the tracker.
:::

## Install plugin

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
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

To track a screen view event, use the `trackScreenView` function.
This will track a self-describing event with [the schema described here](/docs/events/ootb-data/page-and-screen-view-events/index.md#screen-view-events).

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
  'trackScreenView',
  {
    name: 'my-screen-name',
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e', // generated automatically if not provided
    type: 'carousel', // optional
    transitionType: 'basic', // optional
  }
);
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { trackScreenView } from '@snowplow/browser-plugin-screen-tracking';

trackScreenView({
  name: 'my-screen-name',
  id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e', // generated automatically if not provided
  type: 'carousel', // optional
  transitionType: 'basic', // optional
});
```

</TabItem>
</Tabs>

## Screen context entity

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

If the `screenContext` property is enabled, the tracker attaches a [`Screen` entity](https://iglucentral.com/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

The `Screen` entity is based off the internal state of the tracker only. To make an example, if the developer manually tracks a `ScreenView` event, all the following events will have a `Screen` entity attached reporting the same information as the last tracked ScreenView event.

## Screen engagement tracking

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


Screen engagement tracking is a feature that enables tracking the user activity on the screen.
This consists of the time spent and the amount of content viewed on the screen.

Concretely, it consists of the following metrics:

1. Time spent on screen while the app was in foreground (tracked automatically).
2. Time spent on screen while the app was in background (tracked automatically).
3. Number of list items scrolled out of all list items (requires some manual tracking).
4. Scroll depth in pixels (requires some manual tracking).

This information is attached using a [`screen_summary` context entity](/docs/events/ootb-data/page-activity-tracking/index.md#screen-summary-entity) to the following events:

1. [`screen_end` event](/docs/events/ootb-data/page-activity-tracking/index.md#screen-end-event) that is automatically tracked before a new screen view event.
2. [`application_background` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#background-event).
3. [`application_foreground` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#foreground-event).

Screen engagement tracking is enabled by default, but can be configured using the `screenEngagementAutotracking` option when initializing the plugin.

For a demo of how mobile screen engagement tracking works in action, **[please visit this demo](https://snowplow-incubator.github.io/mobile-screen-engagement-demo/)**.

### Updating list item view and scroll depth information

To update the list item viewed and scroll depth information tracked in the screen summary entity, you can track the `ListItemView` and `ScrollChanged` events with this information.
When tracked, the tracker won't send these events individually to the collector, but will process the information into the next `screen_summary` entity and discard the events.
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
