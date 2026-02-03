---
title: "Track timezone and geolocation on web"
sidebar_label: "Timezone and geolocation"
sidebar_position: 100
description: "Capture user timezone information and geolocation coordinates with accuracy data through browser APIs for location-based analysis."
keywords: ["timezone", "geolocation"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Track users' timezone and geolocation with these configuration options.

## Timezone

Since version 4 of the JavaScript tracker, the tracker automatically captures the user's timezone. It populates the `os_timezone` [atomic field](/docs/fundamentals/canonical-event/index.md). This feature uses the `Intl.DateTimeFormat` function in modern browsers.

If you're using an older version of the tracker, or your users use older browsers, use the timezone plugin to capture timezone information. It uses the `jstimezonedetect` library to determine the user's timezone and populate the `os_timezone` field.

The timezone property is **automatically tracked**.

### Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-timezone@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-timezone@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-timezone@latest/dist/index.umd.min.js",
  ["snowplowTimezone", "TimezonePlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-timezone`
- `yarn add @snowplow/browser-plugin-timezone`
- `pnpm add @snowplow/browser-plugin-timezone`

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

If this plugin is enabled, the tracker will attempt to create a entity from the visitor's geolocation information.

If the visitor hasn't already given or denied the website permission to use their geolocation information, a prompt will appear. If they give permission, then all events from that moment on will include their geolocation information, as a context entity.

If the geolocation entity isn't enabled at tracker initialization, you can enable it at a later time by calling `enableGeolocationContext`. This is useful if you have other areas of your site where you require requesting geolocation access, as you can defer enabling this on your Snowplow events until you have permission to read the users geolocation for your other use case.

For more information on the geolocation API, see [the specification](http://dev.w3.org/geo/api/spec-source.html).

Check out the [geolocation tracking overview](/docs/events/ootb-data/geolocation/index.md) for the entity schema.

The geolocation entity is **automatically tracked** once configured.

### Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

This plugin was included in `sp.js` in version 3, but removed from the default bundle in version 4.

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-geolocation@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDeliv</a><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-consent@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">r</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-geolocation@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

To enable after initialization:

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-geolocation@latest/dist/index.umd.min.js",
  ["snowplowGeolocation", "GeolocationPlugin"],
);

// Enable when appropriate e.g. after user consents
// This prompts the browser for location permission
window.snowplow('enableGeolocationContext');
```

To enable at initialization:

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-geolocation@latest/dist/index.umd.min.js",
  ["snowplowGeolocation", "GeolocationPlugin"],
  [true] // Prompts for permission immediately
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-geolocation`
- `yarn add @snowplow/browser-plugin-geolocation`
- `pnpm add @snowplow/browser-plugin-geolocation`

To enable after initialization:

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { GeolocationPlugin, enableGeolocationContext } from '@snowplow/browser-plugin-geolocation';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ GeolocationPlugin() ], // Inactive by default
});

// Enable when appropriate e.g. after user consents
// This prompts the browser for location permission
enableGeolocationContext();
```

To enable at initialization:

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { GeolocationPlugin } from '@snowplow/browser-plugin-geolocation';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ GeolocationPlugin(true) ], // Prompts for permission immediately
});
```

  </TabItem>
</Tabs>

:::note No consent revocation
There's no API to turn off geolocation tracking once enabled.
:::

If you have multiple tracker instances on your site, you can choose to enable geolocation tracking on a per-tracker basis. Provide a list of tracker namespaces to the `enableGeolocationContext` function.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('enableGeolocationContext', ['sp1']);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableGeolocationContext(['sp1']);
```

  </TabItem>
</Tabs>
