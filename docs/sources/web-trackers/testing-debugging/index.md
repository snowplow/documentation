---
title: "Test, debug and troubleshoot the web trackers"
sidebar_label: "Testing, debugging and troubleshooting"
description: "Test and debug your web tracker implementation using Snowplow Inspector, Snowplow Micro, and the debugger plugin."
keywords: ["testing", "debugging", "snowplow inspector", "snowplow micro", "troubleshooting"]
date: "2021-04-07"
sidebar_position: 2950
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

To prevent data loss and bad events, it's important to test and validate your tracking implementation. Snowplow provides two main tools for this, which work well together.

## Snowplow Inspector for browsers

Use our [browser extension](/docs/testing/snowplow-inspector/index.md) to inspect event requests in the browser Developer Tools window.

## Snowplow Micro

A [lightweight, local Snowplow pipeline](/docs/testing/snowplow-micro/index.md) ideal for sending test events into. It's used as a Docker container.


## Debugger plugin

The debugger plugin logs detailed information about tracked events to your browser's Developer Tools console. For each event, it displays:
- Event type
- Schema information for self-describing events and entities
- All entities attached to the event
- The complete event payload sent to the Collector

The plugin uses color-coded output to distinguish between different types of information, making it easier to scan through logged events.

:::note
You may need to enable **Verbose** logs in your Developer Tools console, as this plugin uses `console.debug` to output results.
:::

![Example console output from the debugger plugin](images/Screenshot-2021-03-28-at-20.08.35.png)

### Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js",
  ["snowplowDebugger", "DebuggerPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-debugger`
- `yarn add @snowplow/browser-plugin-debugger`
- `pnpm add @snowplow/browser-plugin-debugger`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { DebuggerPlugin } from '@snowplow/browser-plugin-debugger';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ DebuggerPlugin() ],
});
```

  </TabItem>
</Tabs>

### Configuration

The `DebuggerPlugin` function accepts an optional `logLevel` parameter that controls the verbosity of console output.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js",
  ["snowplowDebugger", "DebuggerPlugin"],
  [3] // Log level: 3 = debug (default)
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { DebuggerPlugin } from '@snowplow/browser-plugin-debugger';
import { LOG_LEVEL } from '@snowplow/tracker-core';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ DebuggerPlugin(LOG_LEVEL.debug) ],
});
```

  </TabItem>
</Tabs>

The available log levels are:

| Level   | Value | Description                                         |
| ------- | ----- | --------------------------------------------------- |
| `none`  | 0     | Disables all logging                                |
| `error` | 1     | Logs errors only                                    |
| `warn`  | 2     | Logs errors and warnings                            |
| `debug` | 3     | Logs errors, warnings, and debug messages (default) |
| `info`  | 4     | Logs all messages                                   |
