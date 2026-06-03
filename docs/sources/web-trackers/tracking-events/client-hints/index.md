---
title: "Track user agent client hints on web"
sidebar_label: "Client hints"
sidebar_position: 150
description: "Capture browser information through client hints as an alternative to user agent strings with basic and high-entropy options."
keywords: ["client hints", "user-agent"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Client hints include information about the user, network, or device. They're an alternative or supplement to tracking the user agent. They're available in most [Chromium-based browsers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-CH#browser_compatibility).

This is useful data to capture as browsers are moving away from high entropy user agent strings. Client hints offer useful information to understand browser usage, without the potential to infringe on a user's privacy as can be the case with the user agent string.

Use the client hints plugin to capture hints information from `navigator.userAgentData` in an entity.

This entity can be configured in two ways:

1. `clientHints: true`: captures the "low entropy" client hints `isMobile` and `brands`
2. `clientHints: { includeHighEntropy: true }`: captures the "low entropy" hints as well as the "high entropy" hints `architecture`, `model`, `platform`, `platformVersion`, and `uaFullVersion`

High entropy hints can potentially be used to fingerprint users, and so might not be suitable depending on your consent strategy. No additional configuration is needed to capture the high entropy hints here.

For the full schema details see the [device and browser tracking](/docs/events/ootb-data/device-and-browser/index.md#client-hints-entity) overview page.

The Client Hints entity is **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-client-hints@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-client-hints@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
// Basic
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-client-hints@latest/dist/index.umd.min.js",
  ["snowplowClientHints", "ClientHintsPlugin"]
);

// High Entropy
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-client-hints@latest/dist/index.umd.min.js",
  ["snowplowClientHints", "ClientHintsPlugin"],
  { includeHighEntropy: true }
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-client-hints`
- `yarn add @snowplow/browser-plugin-client-hints`
- `pnpm add @snowplow/browser-plugin-client-hints`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';

// Basic
newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ ClientHintsPlugin() ],
});

// High Entropy
newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ ClientHintsPlugin(true) ],
});
```

  </TabItem>
</Tabs>
