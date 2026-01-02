---
title: "Track Kantar Focal Meter events on web"
sidebar_label: "Kantar Focal Meter"
sidebar_position: 180
description: "Integrate with Kantar Focal Meter router meters to measure content audience by sending domain user IDs to Focal Meter endpoints."
keywords: ["focal meter", "kantar"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import FocalMeter from "@site/docs/reusable/focalmeter-js-tracker/_index.md"
```

This plugin provides integration with [Focal Meter by Kantar](https://www.virtualmeter.co.uk/focalmeter). Focal Meter is a box that connects directly to the broadband router and collects viewing information for the devices on your network.

This integration enables measuring the audience of content through the Focal Meter router meter.
The plugin has the ability to send the domain user ID to a [Kantar Focal Meter](https://www.virtualmeter.co.uk/focalmeter) endpoint.
A request is made when the first event with a new user ID is tracked.

:::note
The plugin is available since version 3.16 of the tracker.
:::

The Focal Meter integration is **automatic** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-focalmeter@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-focalmeter@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-focalmeter@focalmeter_plugin`
- `yarn add @snowplow/browser-plugin-focalmeter@focalmeter_plugin`
- `pnpm add @snowplow/browser-plugin-focalmeter@focalmeter_plugin`

</TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

To integrate with the Kantar FocalMeter, use the snippet below after [setting up your tracker](/docs/sources/web-trackers/quick-start-guide/index.md):

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-focalmeter@latest/dist/index.umd.min.js',
    ['snowplowFocalMeter', 'FocalMeterPlugin']
);

window.snowplow('enableFocalMeterIntegration', {
    kantarEndpoint: '{{kantar_url}}',
    useLocalStorage: false // optional, defaults to false
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { FocalMeterPlugin, enableFocalMeterIntegration } from '@snowplow/browser-plugin-focalmeter';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ FocalMeterPlugin() ],
});

enableFocalMeterIntegration({
  kantarEndpoint: '{{kantar_url}}',
  useLocalStorage: false // optional, defaults to false
});
```
  </TabItem>
</Tabs>

## Enable integration

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```mdx-code-block
<FocalMeter tracker="js-tag"/>
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```mdx-code-block
<FocalMeter tracker="js-browser"/>
```

  </TabItem>
</Tabs>
