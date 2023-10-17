---
title: "Plugins"
date: "2021-03-28"
sidebar_position: 4000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The JavaScript Tracker is based around a plugin architecture which allows new functionality to be added to the tracker. These plugins may already be bundled with the tracker, loaded from external locations at runtime or included in your codebase and passed into the tracker.

There are a number of Snowplow maintained plugins, however you are also free to build your own or leverage community plugins too. This section details the Snowplow maintained plugins, whether they are bundled into any versions of the tracker, and also describes how you can build your own plugin.

The UMD files (which work in the browser) can be downloaded from [GitHub releases](https://github.com/snowplow/snowplow-javascript-tracker/releases) or they are available via [third party CDNs](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/hosting-the-javascript-tracker/third-party-cdn-hosting/index.md).

For other combinations of plugins not covered by `sp.js` or `sp.lite.js`, try [bundling a custom selection](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/plugins/bundling-a-custom-plugin-selection/index.md) and self hosting the tracker.

| Plugin | `sp.js` | `sp.lite.js` |
| --- | --- | --- |
| Ad Tracking | ✅ | ❌ |
| Browser Features | ❌ | ❌ |
| Client Hints | ✅ | ❌ |
| Consent | ✅ | ❌ |
| Debugger | ❌ | ❌ |
| Ecommerce | ✅ | ❌ |
| Enhanced Consent | ❌ | ❌ |
| Enhanced Ecommerce | ✅ | ❌ |
| Error Tracking | ✅ | ❌ |
| Form Tracking | ✅ | ❌ |
| GA Cookies | ✅ | ❌ |
| Geolocation | ✅ | ❌ |
| Link Click Tracking | ✅ | ❌ |
| Media Tracking | ❌ | ❌ |
| Optimizely | ❌ | ❌ |
| Optimizely X | ✅ | ❌ |
| Performance Timing | ✅ | ❌ |
| Site Tracking | ✅ | ❌ |
| Snowplow Ecommerce | ❌ | ❌ |
| Timezone | ✅ | ❌ |
| YouTube Tracking | ❌ | ❌ |
