---
title: "Plugins"
date: "2021-03-28"
sidebar_position: 4000
---

The JavaScript Tracker is based around a plugin architecture which allows new functionality to be added to the tracker. These plugins may already be bundled with the tracker, loaded from external locations at runtime or included in your codebase and passed into the tracker.

There are a number of Snowplow maintained plugins, however you are also free to build your own or leverage community plugins too. This section details the Snowplow maintained plugins, whether they are bundled into any versions of the tracker, and also describes how you can build your own plugin.

The UMD files (which work in the browser) can be downloaded from [GitHub releases](https://github.com/snowplow/snowplow-javascript-tracker/releases) or they are available via [third party CDNs](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/third-party-cdn-hosting/).

| Plugin | `sp.js` | `sp.lite.js` |
| --- | --- | --- |
| Ad Tracking | ✅ | ❌ |
| Browser Features | ❌ | ❌ |
| Client Hints | ✅ | ❌ |
| Consent | ✅ | ❌ |
| Debugger | ❌ | ❌ |
| Ecommerce | ✅ | ❌ |
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
| Timezone | ✅ | ❌ |
| YouTube Tracking | ❌ | ❌ |
