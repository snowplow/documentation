---
title: "Event specifications"
sidebar_position: 115
---

# Event Specifications integration

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The plugin allows you to integrate with Event Specifications for a selected set of plugins. The configuration for the plugin should be retrieved directly from your [Data Product](https://docs.snowplow.io/docs/fundamentals/data-products/) in [Snowplow Console](https://console.snowplowanalytics.com).

The plugin will automatically add an Event Specification context to the events matching the configuration added.

:::note
The plugin is available since version 3.23 of the tracker and is currently only available for Data Products created using the [Media Web template](/docs/data-product-studio/data-products/data-product-templates/#media-web).
:::

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-event-specifications@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-event-specifications@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-event-specifications@latest/dist/index.umd.min.js',
    ['eventSpecifications', 'EventSpecificationsPlugin']
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

- `npm install @snowplow/browser-plugin-event-specifications`
- `yarn add @snowplow/browser-plugin-event-specifications`
- `pnpm add @snowplow/browser-plugin-event-specifications`


```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { WebVitalsPlugin } from '@snowplow/browser-plugin-event-specifications';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ EventSpecificationsPlugin(/* plugin configuration */) ],
});
```

  </TabItem>
</Tabs>

## Configuration

The configuration of the plugin would be in the form of:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-event-specifications@latest/dist/index.umd.min.js',
    ['eventSpecifications', 'EventSpecificationsPlugin'],
    [
        {
            [Plugin integration name]: {
                /* Key value pairs of event names and event specification ids */
            },
            /* More integrations */
        }
    ]
);
```

 </TabItem>
 <TabItem value="browser" label="Browser (npm)" default>

```javascript
EventSpecificationsPlugin({
    [Plugin integration name]: {
        /* Key value pairs of event names and event specification ids */
    },
    /* More integrations */
});
```

 </TabItem>
</Tabs>

You can retrieve the configuration for your Event Specifications directly from your Data Product after clicking on the `Implement tracking` button.

![implement tracking button](./images/implement_tracking.png)
