---
title: "Detect bots on the web"
sidebar_label: "Bot detection"
sidebar_position: 55
description: "Detect automated browsers client-side using FingerprintJS BotD and attach a bot detection entity to every event."
keywords: ["bot detection", "botd", "fingerprint", "automated browsers", "bot filtering"]
date: "2026-03-24"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The bot detection plugin uses [FingerprintJS BotD](https://github.com/nicedoc/fingerprintjs-botd) to detect automated browsers — such as Selenium, PhantomJS, and headless Chrome — directly in the browser. Once detection completes, it attaches a `client_side_bot_detection` [entity](/docs/fundamentals/entities/index.md) to every event.

This is useful when you want to identify bot traffic as early as possible, before events reach your pipeline. For a broader approach that also incorporates server-side signals, see the [bot detection enrichment](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md).

## Install the plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-bot-detection@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-bot-detection@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

:::note

The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

:::

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-bot-detection@latest/dist/index.umd.min.js",
  ["snowplowBotDetection", "BotDetectionPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-bot-detection`
- `yarn add @snowplow/browser-plugin-bot-detection`
- `pnpm add @snowplow/browser-plugin-bot-detection`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { BotDetectionPlugin } from '@snowplow/browser-plugin-bot-detection';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ BotDetectionPlugin() ],
});
```

  </TabItem>
</Tabs>

## Output

The plugin attaches a `client_side_bot_detection` entity (`iglu:com.snowplowanalytics.snowplow/client_side_bot_detection/jsonschema/1-0-0`) to every event.

| Field | Type | Description |
| --- | --- | --- |
| `bot` | boolean | `true` if an automated browser was detected, `false` otherwise. |
| `kind` | string or null | The type of bot detected (e.g. `"selenium"`, `"headless_chrome"`, `"phantomjs"`), or `null` if no bot was detected. |

:::note Asynchronous detection

Bot detection runs asynchronously. Events tracked before detection completes will not have this entity attached. In most cases, detection finishes within milliseconds, but if you need the entity on the very first event, consider deferring your initial tracking calls until the tracker is fully initialized.

:::

The [bot detection enrichment](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md) can consolidate this client-side signal with server-side indicators from YAUAA, IAB, and ASN lookups into a single `bot_detection` entity.
