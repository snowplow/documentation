---
title: "Performance Navigation Timing"
date: "2023-05-10"
sidebar_position: 15500
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ❌ |
| `sp.lite.js` | ❌ |

Adds Performance Navigation Timing contexts to your Snowplow tracking. To learn more about the properties tracked, you can visit the [specification](https://www.w3.org/TR/navigation-timing-2/) or MDN [documentation site](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming).

The following diagram shows the ResourceTiming and PerformanceNavigationTiming properties and how they connect to the navigation of the page main document.

![performance navigation timeline](./images/performance_navigation_timeline.png)

_Performance navigation timeline from the [W3C specification](https://www.w3.org/TR/navigation-timing-2/)._

:::note
The plugin is available since version 3.10 of the tracker.
:::

## Download

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-performance-navigation-timing@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-performance-navigation-timing@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

## Initialization

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-performance-navigation-timing@latest/dist/index.umd.min.js",
  ["snowplowPerformanceNavigationTiming", "PerformanceNavigationTimingPlugin"]
);
```

### Context

Adding this plugin will automatically capture the following context:

| Context |
| --- |
| [iglu:org.w3/PerformanceNavigationTiming/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/org.w3/PerformanceNavigationTiming/jsonschema/1-0-0) |
