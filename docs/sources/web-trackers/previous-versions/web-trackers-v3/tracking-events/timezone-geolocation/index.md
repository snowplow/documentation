---
title: "Timezone and geolocation"
sidebar_position: 100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Track users' timezone and geolocation with these configuration options.

## Timezone

The timezone plugin allows the tracker to populate the `os_timezone` field within the [canonical event model](/docs/fundamentals/canonical-event/index.md). This field has its own column in the data warehouse.

The timezone property is **automatically tracked** once configured.

### Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-timezone@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-timezone@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-timezone@3/dist/index.umd.min.js",
  ["snowplowTimezone", "TimezonePlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-timezone@3`
- `yarn add @snowplow/browser-plugin-timezone@3`
- `pnpm add @snowplow/browser-plugin-timezone@3`

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ TimezonePlugin() ],
});
```
  </TabItem>
</Tabs>

Once configured, all subsequent events will contain this property.

## Geolocation

If this plugin is enabled, the tracker will attempt to create a context from the visitor’s geolocation information. If the visitor has not already given or denied the website permission to use their geolocation information, a prompt will appear. If they give permission, then all events from that moment on will include their geolocation information, as a context entity.

If the geolocation context isn't enabled at tracker initialization, then it can be enabled at a later time by calling `enableGeolocationContext`. This is useful if you have other areas of your site where you require requesting geolocation access, as you can defer enabling this on your Snowplow events until you have permission to read the users geolocation for your other use case.

For more information on the geolocation API, see [the specification](http://dev.w3.org/geo/api/spec-source.html).

Geolocation context entities are **automatically tracked** once configured.

### Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-geolocation@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDeliv</a><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-consent@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">r</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-geolocation@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-geolocation@3/dist/index.umd.min.js",
  ["snowplowGeolocation", "GeolocationtPlugin"],
  [false] // Enable at load
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-geolocation@3`
- `yarn add @snowplow/browser-plugin-geolocation@3`
- `pnpm add @snowplow/browser-plugin-geolocation@3`

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { GeolocationPlugin, enableGeolocationContext } from '@snowplow/browser-plugin-geolocation';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ GeolocationPlugin() ],
});

enableGeolocationContext();
```

  </TabItem>
</Tabs>

### Context entity

Adding this plugin will automatically capture [this](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0) context entity.

**Example geolocation data**

```json
{
  "latitude": 51.507351,
  "longitude": -0.127758,
  "latitudeLongitudeAccuracy": 150,
  "altitude": 93.03439331054688,
  "altitudeAccuracy": 10,
  "bearing": null,
  "speed": null,
  "timestamp": 1617139404224
}
```
