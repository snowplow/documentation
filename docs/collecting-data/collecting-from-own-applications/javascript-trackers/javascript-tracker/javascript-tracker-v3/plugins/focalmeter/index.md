---
title: "Kantar FocalMeter"
sidebar_position: 12000
---

```mdx-code-block
import Block5966 from "@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md"

<Block5966/>
```

This plugin will add integration with the [Kantar FocalMeter](https://www.virtualmeter.co.uk/focalmeter) to your Snowplow tracking.
The plugin sends requests with the domain user ID to a Kantar endpoint used with the FocalMeter system.
A request is made when the first event with a new user ID is tracked.

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ❌ |
| `sp.lite.js` | ❌ |

:::note
The plugin is available since version 3.9 of the tracker.
:::

## Download

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-focalmeter@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-focalmeter@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

## Quick Start

To integrate with the Kantar FocalMeter, use the snippet below after [setting up your tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/web-quick-start-guide/index.md):

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

## The enableFocalMeterIntegration function

The `enableFocalMeterIntegration` function takes the form:

```javascript
window.snowplow('enableFocalMeterIntegration', { kantarEndpoint, useLocalStorage? });
```

| Parameter         | Type       | Default             | Description                                                                                                                                                 | Required |
|-------------------|------------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `kantarEndpoint`  | `string`   | \-                  | URL of the Kantar endpoint to send the requests to (including protocol)                                                                                     | Yes      |
| `useLocalStorage` | `boolean`  | `false`             | Whether to store information about the last submitted user ID in local storage to prevent sending it again on next load (defaults not to use local storage) | No       |

## How does it work?

The plugin inspects the domain user ID property in tracked events.
Whenever it changes from the previously recorded value, it makes an HTTP GET requested to the `kantarEndpoint` URL with the ID as a query parameter.

Optionally, the tracker may store the last published domain user ID value in local storage in order to prevent it from making the same request on the next page load.
If local storage is not used, the request is made on each page load.
