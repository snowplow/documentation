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

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

The bot detection plugin uses [FingerprintJS BotD](https://github.com/fingerprintjs/Botd) to detect automated browsers such as Selenium, PhantomJS, or headless Chrome. It attaches a `client_side_bot_detection` [entity](/docs/fundamentals/entities/index.md) to every event.

This is useful when you want to identify bot traffic as early as possible, before events reach your pipeline. For a broader approach that also incorporates server-side indicators, see the [bot detection enrichment](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md).

:::note
The plugin is available since version 4.7 of the tracker.
:::

The bot detection entity is **automatically tracked** once configured.

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

The plugin attaches a `client_side_bot_detection` entity to every event.

<SchemaProperties
  example={{
    bot: true,
    kind: "headless_chrome"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for bot detection entity, powered by the BotD library (https://github.com/fingerprintjs/BotD)", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "client_side_bot_detection", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "bot": { "description": "Whether the current browser is identified as a bot", "type": "boolean" }, "kind": { "description": "The type of bot detected. Populated when bot is true, null or omitted otherwise. See https://github.com/fingerprintjs/BotD/blob/main/src/types.ts", "type": ["string", "null"], "enum": ["awesomium", "cef", "cefsharp", "coachjs", "electron", "fminer", "geb", "nightmarejs", "phantomas", "phantomjs", "rhino", "selenium", "sequentum", "slimerjs", "webdriverio", "webdriver", "headless_chrome", "unknown", null] } }, "required": ["bot"], "additionalProperties": false }} />

:::note[Asynchronous detection]

Bot detection runs asynchronously. Events tracked before detection completes won't have this entity attached. In most cases, detection finishes within milliseconds, but if you need the entity on the very first event, consider deferring your initial tracking calls until the tracker is fully initialized.

:::

The [bot detection enrichment](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md) can consolidate this client-side indicator with server-side indicators from YAUAA, IAB, and ASN lookups into a single `bot_detection` entity.
