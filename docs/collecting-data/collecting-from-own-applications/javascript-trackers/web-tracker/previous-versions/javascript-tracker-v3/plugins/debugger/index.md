---
title: "Debugger"
date: "2021-03-28"
sidebar_position: 5000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ❌ |
| `sp.lite.js` | ❌ |

## Download

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

## Initialization

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js",
  ["snowplowDebugger", "DebuggerPlugin"]
);
```

### Changing Log Level

There are various log levels which can be used when initializing the plugin:

```javascript
none = 0,
error = 1,
warn = 2,
debug = 3,
info = 4
```

Then you can pass your chosen log level when adding the plugin:

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-debugger@latest/dist/index.umd.min.js",
  ["snowplowDebugger", "DebuggerPlugin"],
  [ 4 ]
);
```

### Debugging

Adding this plugin will automatically start printing out `debug` logs to your Developer Tools console. This will help you debug what events are being tracked and what properties are included in each event that is being tracked and to what tracker instance.

**Note:** You may need to enable `Verbose` logs in your Developer Tools, as this plugin uses `console.debug` to output results.

![](images/Screenshot-2021-03-28-at-20.08.35.png)

An example of the output from this plugin
