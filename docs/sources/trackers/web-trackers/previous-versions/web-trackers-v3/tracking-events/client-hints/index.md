---
title: "Client Hints"
sidebar_position: 150
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

User-agent [Client Hints](https://www.chromium.org/updates/ua-ch) are being rolled out across a number of browsers and are an alternative to the tracking the user-agent, which is particularly useful in those browsers which are freezing the user-agent string. See [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH#Browser_compatibility) for browser support.

This is useful data to capture as browsers are moving away from high entropy user-agent strings. Client Hints offer useful information to understand browser usage without the potential to infringe on a users privacy as is often the case with the user-agent string.

This context be enabled in two ways:

1. `clientHints: true`
    - This will capture the "basic" client hints
2. `clientHints: { includeHighEntropy: true }`
    - This will capture the "basic" client hints as well as hints that are deemed "High Entropy" and could be used to fingerprint users. Browsers may choose to prompt the user before making this data available.

To see what will be captured please see the JsonSchema file [org.ietf/http_client_hints/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/org.ietf/http_client_hints/jsonschema/1-0-0).

The Client Hints context entity is **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-client-hints@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-client-hints@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-client-hints@3/dist/index.umd.min.js",
  ["snowplowClientHints", "ClientHintsPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-client-hints@3`
- `yarn add @snowplow/browser-plugin-client-hints@3`
- `pnpm add @snowplow/browser-plugin-client-hints@3`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ ClientHintsPlugin() ],
            // Use ClientHintsPlugin(true) to capture high entropy values
});
```

  </TabItem>
</Tabs>

## Context entity

Adding this plugin will automatically capture [this](https://github.com/snowplow/iglu-central/blob/master/schemas/org.ietf/http_client_hints/jsonschema/1-0-0) context entity.

**Example information**:

```json
{
  "isMobile": false,
  "brands": [
    {
      "brand": "Google Chrome",
      "version": "89"
    },
    {
      "brand": "Chromium",
      "version": "89"
    }
  ]
}
```
