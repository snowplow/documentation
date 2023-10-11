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

:::note
The plugin is available since version 3.13 of the tracker.
:::

## Installation

- `npm install @snowplow/browser-plugin-web-vitals`
- `yarn add @snowplow/browser-plugin-web-vitals`
- `pnpm add @snowplow/browser-plugin-web-vitals`


## Initialization

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { WebVitalsPlugin } from '@snowplow/browser-plugin-web-vitals';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ WebVitalsPlugin() ],
});
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
