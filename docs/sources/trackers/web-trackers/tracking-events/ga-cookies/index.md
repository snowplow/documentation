---
title: "Tracking Google Analytics cookies with the web trackers"
sidebar_label: "GA cookies"
sidebar_position: 130
---

# GA cookies tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

If this plugin is used, the tracker will look for Google Analytics cookies (GA4/Universal Analytics and "classic" GA; specifically the `_ga` cookie and older `__utma`, `__utmb`, `__utmc`, `__utmv`, `__utmz`) and combine their values into event context entities that get sent with every event.

GA cookies information is **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ga-cookies@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-ga-cookies@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-ga-cookies`
- `yarn add @snowplow/browser-plugin-ga-cookies`
- `pnpm add @snowplow/browser-plugin-ga-cookies`

</TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ga-cookies@latest/dist/index.umd.min.js",
  ["snowplowGaCookies", "GaCookiesPlugin"],
  [pluginOptions] // note: for sp.js, pluginOptions can also be specified when calling `newTracker`; e.g. `contexts: { gaCookies: { ua: true, ga4: false } }`
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { GaCookiesPlugin } from '@snowplow/browser-plugin-ga-cookies';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ GaCookiesPlugin(pluginOptions) ],
});
```

  </TabItem>
</Tabs>

The `pluginOptions` parameter allows to configure the plugin. Its type is:

```javascript
interface GACookiesPluginOptions {
  ua?: boolean;
  ga4?: boolean;
  ga4MeasurementId?: string | string[];
  cookiePrefix?: string | string[];
}
```

| Name             | Default | Description                                                                                                                                                                                                                                                                                                                                                     |
| ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ua               | `false` | Send Universal Analytics specific cookie values.                                                                                                                                                                                                                                                                                                                |
| ga4              | `true`  | Send Google Analytics 4 specific cookie values.                                                                                                                                                                                                                                                                                                                 |
| ga4MeasurementId | `""`    | Measurement id(s) to search the Google Analytics 4 session cookie. Can be a single measurement id as a string or an array of measurement id strings. The cookie has the form of `<cookie_prefix>_ga_<container-id>` where `<container-id>` is the data stream container id and `<cookie_prefix>` is the optional `cookie_prefix` option of the gtag.js tracker. |
| cookiePrefix     | `[]`    | Cookie prefix set on the Google Analytics 4 cookies using the `cookie_prefix` option of the gtag.js  tracker.                                                                                                                                                                                                                                                   |

## Context entities

Adding this plugin will automatically capture the following entities:

1. For GA4 cookies: `iglu:com.google.ga4/cookies/jsonschema/1-0-0` (default)

   ```json
   {
       "_ga": "G-1234",
       "cookie_prefix": "prefix",
       "session_cookies": [
           {
               "measurement_id": "G-1234",
               "session_cookie": "567"
           }
       ]
   }
   ```

2. For Universal Analytics cookies: `iglu:com.google.analytics/cookies/jsonschema/1-0-0` (if enabled)

   ```json
   {
       "_ga": "GA1.2.3.4"
   }
   ```
