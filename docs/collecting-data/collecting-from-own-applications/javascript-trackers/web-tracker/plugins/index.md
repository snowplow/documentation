---
title: "Plugins"
date: "2021-04-07"
sidebar_position: 2800
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The Javascript Tracker is based around a plugin architecture which allows new functionality to be added to the tracker. There are a number of Snowplow maintained plugins, however you are also free to [build your own](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/creating-your-own-plugins/index.md) or leverage community plugins too.

The following table lists the Snowplow plugins, what kinds of data are created using them, and their distribution for the JavaScript (`sp.js` file or minimal version) and Browser (npm etc package) trackers. Read more about configuring plugins [here](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/configuring-tracker-plugins/index.md) or on the individual pages.

| Plugin | Creates | `sp.js` | `sp.lite.js` | Package name |
|---|---|---|---|---|
| Ads | Events | ✅ | ❌ | `browser-plugin-ad-tracking` |
| Button click | Events | ❌ | ❌ | `browser-plugin-button-click-tracking` |
| Client hints | Entities | ✅ | ❌ | `browser-plugin-client-hints` |
| Consent (Enhanced) | Events and entities | ❌ | ❌ | `browser-plugin-enhanced-consent` |
| Consent (original) | Events and entities | ✅ | ❌ | `browser-plugin-consent` |
| Debugger | Other | ❌ | ❌ | `browser-plugin-debugger` |
| Ecommerce (Snowplow) | Events and entities | ❌ | ❌ | `browser-plugin-snowplow-ecommerce` |
| Ecommerce (Enhanced) | Events | ✅ | ❌ | `browser-plugin-enhanced-ecommerce` |
| Ecommerce (original) | Events | ✅ | ❌ | `browser-plugin-ecommerce` |
| Error | Events | ✅ | ❌ | `browser-plugin-error-tracking` |
| Forms | Events | ✅ | ❌ | `browser-plugin-form-tracking` |
| GA cookies | Entities | ✅ | ❌ | `browser-plugin-ga-cookies` |
| Geolocation | Entities | ✅ | ❌ | `browser-plugin-geolocation` |
| Kantar FocalMeter | Other | ❌ | ❌ | `browser-plugin-focalmeter@focalmeter_plugin` |
| Link click | Events | ✅ | ❌ | `browser-plugin-link-click-tracking` |
| Media (Snowplow) | Events and entities | ❌ | ❌ | `browser-plugin-media` |
| Media (HTML) | Events and entities | ❌ | ❌ | `browser-plugin-media-tracking` |
| Media (Vimeo) | Events and entities | ❌ | ❌ | `browser-plugin-vimeo-tracking` |
| Media (Youtube) | Events and entities | ❌ | ❌ | `browser-plugin-youtube-tracking` |
| Optimizely Classic | Entities | ✅ | ❌ | `browser-plugin-optimizely` |
| Optimizely X | Entities | ✅ | ❌ | `browser-plugin-optimizely-x` |
| Performance navigation timing | Entities | ❌ | ❌ | `browser-plugin-performance-navigation-timing` |
| Performance timing (original) | Entities | ✅ | ❌ | `browser-plugin-performance-timing` |
| Privacy Sandbox | Entities |  ❌ | ❌ | `browser-plugin-privacy-sandbox` |
| Site | Events | ✅ | ❌ | `browser-plugin-site-tracking` |
| Timezone | Other | ❌ | ❌ | `browser-plugin-timezone` |
| Web vitals | Events | ❌ | ❌ | `browser-plugin-web-vitals` |
| ~~Browser features~~ deprecated | Events | ❌ | ❌ | `browser-plugin-browser-features` |

## Browser features

:::caution
**Deprecated**: This plugin is deprecated. The `navigator.mimeTypes` API which this tracker uses is now deprecated and modern browsers may no longer populate these values.
:::

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-browser-features@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-browser-features@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

   * `npm install @snowplow/browser-plugin-browser-features`
   * `yarn add @snowplow/browser-plugin-browser-features`
   * `pnpm add @snowplow/browser-plugin-browser-features`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-browser-features@latest/dist/index.umd.min.js",
  ["snowplowBrowserFeatures", "BrowserFeaturesPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ BrowserFeaturesPlugin() ],
});

trackPageView();
```

  </TabItem>
</Tabs>

### Properties

This plugin will add [MIME Type](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins/mimeTypes) tracking. This allows the tracker to populate the `f_*` fields within the [canonical event model](/docs/understanding-your-pipeline/canonical-event/index.md).
