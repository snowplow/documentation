---
title: "Web Vitals"
sidebar_position: 17000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The plugin adds the capability to track web performance metrics categorized as [Web Vitals](https://web.dev/vitals/). These metrics are tracked with an event based on the [web_vitals schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/web_vitals/jsonschema/). To make sure it collects the most complete values for the web vital metrics, the plugin uses a set of browser APIs to detect and send the event as the visitor is leaving the current page in the browser.

To collect the web vitals data, the plugin loads the [web-vitals](https://github.com/GoogleChrome/web-vitals) open source library dynamically on your page.

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ❌ |
| `sp.lite.js` | ❌ |

:::note
The plugin is available since version 3.13 of the tracker.
:::

## Download

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-web-vitals@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-web-vitals@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

## Initialization

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-web-vitals@latest/dist/index.umd.min.js',
    ['snowplowWebVitals', 'WebVitalsPlugin']
);
```

## Plugin options

The Web Vitals plugin can be initialized with a couple of options allowing for customizing its behaviour:

| Option | Type | Description | Default value |
| :--------------:| :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| loadWebVitalsScript | `boolean` | Should the plugin immediately load the Core Web Vitals measurement script from UNPKG CDN. | `true` |
| webVitalsSource | `string` | The URL endpoint the Web Vitals script should be loaded from. Defaults to the UNPKG CDN. | `https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js` |

### Using an already existing Web Vitals library source

There could be cases where your page or one of the loaded JavaScript bundles already include the [web-vitals](https://github.com/GoogleChrome/web-vitals) library. In those cases, there is no need to load it an additional time from the plugin. If this is the case, you have to make sure that the library APIs are exposed in the `window` object properly as well.

### Choosing a Web Vitals measurement source

The default Web Vitals measurement script is loaded from the [UNPKG](https://www.unpkg.com/) CDN. This choice is chosen as a default but you should consider your own setup when choosing the script source. Selecting a script source from a CDN which might already be used in your website might save you from yet another connection startup time (_Queueing_,_DNS lookup_,_TCP_, _SSL_).

Another reasonable choice could be [jsDelivr](https://cdn.jsdelivr.net/npm/web-vitals@3/dist/web-vitals.iife.js).
