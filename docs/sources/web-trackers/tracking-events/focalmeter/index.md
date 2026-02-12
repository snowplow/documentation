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
```

This plugin provides integration with [Focal Meter by Kantar](https://www.virtualmeter.co.uk/focalmeter). Focal Meter is a box that connects directly to the broadband router and collects viewing information for the devices on your network.

This integration enables measuring the audience of content through the Focal Meter router meter.
The plugin has the ability to send the [domain user ID](/docs/fundamentals/canonical-event/index.md#user-fields) to a [Kantar Focal Meter](https://www.virtualmeter.co.uk/focalmeter) endpoint.
A request is made when the first event with a new user ID is tracked.

The plugin inspects the domain user ID property in tracked events.
Whenever it changes from the previously recorded value, it makes an HTTP GET request to the `kantarEndpoint` URL with the ID as a query parameter.

Optionally, the tracker may store the last published domain user ID value in local storage in order to prevent it from making the same request on the next page load.
If local storage is not used, the request is made on each page load.

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

- `npm install @snowplow/browser-plugin-focalmeter`
- `yarn add @snowplow/browser-plugin-focalmeter`
- `pnpm add @snowplow/browser-plugin-focalmeter`

</TabItem>
</Tabs>

## Enable integration

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

The `enableFocalMeterIntegration` function has the following arguments:

| Parameter         | Type                         | Default | Description                                                                                                                                                 | Required |
| ----------------- | ---------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `kantarEndpoint`  | `string`                     | -       | URL of the Kantar endpoint to send the requests to (including protocol)                                                                                     | Yes      |
| `processUserId`   | `(userId: string) => string` | -       | Callback to process user ID before sending it in a request. This may be used to apply hashing to the value.                                                 | No       |
| `useLocalStorage` | `boolean`                    | `false` | Whether to store information about the last submitted user ID in local storage to prevent sending it again on next load (defaults not to use local storage) | No       |

If you choose to storage the last submitted user ID in local storage, the plugin will use the key `sp-fclmtr-{trackerId}`. The `trackerId` is your tracker namespace.

### Processing the user ID

By default, the plugin sends the domain user ID as a GET parameter in requests to Kantar without modifying it.
In case you want to apply some transformation on the value, such as hashing, you can provide the `processUserId` callback in the `enableFocalMeterIntegration` call:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('enableFocalMeterIntegration', {
    kantarEndpoint: "https://kantar.example.com",
    processUserId: (userId) => md5(userId).toString(), // apply the custom hashing here
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import md5 from 'crypto-js/md5';
enableFocalMeterIntegration({
    kantarEndpoint: "https://kantar.example.com",
    processUserId: (userId) => md5(userId).toString(), // apply the custom hashing here
});
```

  </TabItem>
</Tabs>

### Configure multiple trackers

If you have multiple trackers loaded on the same page, you can enable the Focal Meter integration for each of them by specifying the tracker namespace as the third parameter to the `enableFocalMeterIntegration` function:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
    'enableFocalMeterIntegration',
    { kantarEndpoint: 'https://kantar.example.com' },
    ['sp1', 'sp2']  // Only these tracker namespaces will send to Kantar
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableFocalMeterIntegration(
    { kantarEndpoint: 'https://kantar.example.com' },
    ['sp1', 'sp2']  // Only these tracker namespaces will send to Kantar
);
```

  </TabItem>
</Tabs>

## Request format

The tracker will send requests with this format:

```text
GET https://your-kantar-endpoint.com?vendor=snowplow&cs_fpid=d5c4f9a2-3b7e-4d1f-8c6a-9e2b5f0a3c8d&c12=not_set
```

Where:
* `vendor` is always `snowplow`
* `cs_fpid` is the domain user ID, or the processed version if a `processUserId` callback is provided
* `c12` is always `not_set`
