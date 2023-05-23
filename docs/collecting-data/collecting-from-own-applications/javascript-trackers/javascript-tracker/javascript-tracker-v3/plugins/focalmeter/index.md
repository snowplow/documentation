---
title: "Kantar FocalMeter"
sidebar_position: 12000
---

```mdx-code-block
import Block5966 from "@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md"
import FocalMeter from "@site/docs/reusable/focalmeter-js-tracker/_index.md"

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

```mdx-code-block
<FocalMeter tracker="js-tag"/>
```
