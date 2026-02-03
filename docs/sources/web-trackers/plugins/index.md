---
title: "Web tracker plugins"
sidebar_label: "Plugins"
description: "Extend the web tracker with plugins for tracking ads, ecommerce, media, forms, and more."
keywords: ["plugins", "tracker extensions", "ecommerce tracking", "form tracking", "media tracking"]
date: "2021-04-07"
sidebar_position: 2800
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The JavaScript Tracker is based around a plugin architecture which allows new functionality to be added to the tracker. There are a number of Snowplow maintained plugins, however you are also free to [build your own](/docs/sources/web-trackers/plugins/creating-your-own-plugins/index.md) or leverage community plugins too.

## All plugins

The following table lists the Snowplow plugins in alphabetical order. It shows what kinds of data are created using them, and their [distribution](/docs/sources/web-trackers/tracker-setup/index.md) for the JavaScript tracker. Read more about configuring plugins [here](/docs/sources/web-trackers/plugins/configuring-tracker-plugins/index.md) or on the individual pages.

If you're using the JavaScript tracker with the full `sp.js` distribution and your plugin is included, no further installation or initialization is required. You can use it straight away.

| Plugin                                                                                                                            | Since version  | Creates             | Tracked              | `sp.js` | `sp.lite.js` | Package name                                   |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------- | -------------------- | ------- | ------------ | ---------------------------------------------- |
| [Ads](/docs/sources/web-trackers/tracking-events/ads/index.md)                                                                    | 3.0.0          | Events              | Manual               | ✅       | ❌            | `browser-plugin-ad-tracking`                   |
| [Button click](/docs/sources/web-trackers/tracking-events/button-click/index.md)                                                  | 3.18.0         | Events              | Automatic            | ✅       | ❌            | `browser-plugin-button-click-tracking`         |
| [Client Hints](/docs/sources/web-trackers/tracking-events/client-hints/index.md)                                                  | 3.0.0          | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-client-hints`                  |
| [Consent (Enhanced)](/docs/sources/web-trackers/tracking-events/consent-gdpr/index.md)                                            | 3.8.0          | Events and entities | Manual               | ✅       | ❌            | `browser-plugin-enhanced-consent`              |
| [Debugger](/docs/sources/web-trackers/testing-debugging/index.md)                                                                 | 3.0.0          | Other               | n/a                  | ❌       | ❌            | `browser-plugin-debugger`                      |
| [Ecommerce (Snowplow)](/docs/sources/web-trackers/tracking-events/ecommerce/index.md)                                             | 3.8.0          | Events and entities | Manual               | ✅       | ❌            | `browser-plugin-snowplow-ecommerce`            |
| [Ecommerce (Enhanced)](/docs/sources/web-trackers/tracking-events/ecommerce/enhanced/index.md) - Deprecated                       | 3.0.0 - 3.24.6 | Events              | Manual               | ❌       | ❌            | `browser-plugin-enhanced-ecommerce`            |
| [Errors](/docs/sources/web-trackers/tracking-events/errors/index.md)                                                              | 3.0.0          | Events              | Manual and automatic | ✅       | ❌            | `browser-plugin-error-tracking`                |
| [Element visibility](/docs/sources/web-trackers/tracking-events/element-tracking/index.md)                                        | 4.6.0          | Events              | Automatic            | ❌       | ❌            | `browser-plugin-element-tracking`              |
| [Event specifications](/docs/sources/web-trackers/tracking-events/event-specifications/index.md)                                  | 3.23.0         | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-event-specifications`          |
| [Forms](/docs/sources/web-trackers/tracking-events/form-tracking/index.md)                                                        | 3.0.0          | Events              | Automatic            | ✅       | ❌            | `browser-plugin-form-tracking`                 |
| [GA cookies](/docs/sources/web-trackers/tracking-events/ga-cookies/index.md)                                                      | 3.0.0          | Entities            | Automatic            | ✅       | ❌            | `browser-plugin-ga-cookies`                    |
| [Geolocation](/docs/sources/web-trackers/tracking-events/timezone-geolocation/index.md)                                           | 3.0.0          | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-geolocation`                   |
| [Kantar Focal Meter](/docs/sources/web-trackers/tracking-events/focalmeter/index.md)                                              | 3.16.0         | Other               | n/a                  | ❌       | ❌            | `browser-plugin-focalmeter@focalmeter_plugin`  |
| [Link click](/docs/sources/web-trackers/tracking-events/link-click/index.md)                                                      | 3.0.0          | Events              | Automatic            | ✅       | ❌            | `browser-plugin-link-click-tracking`           |
| [Media (Snowplow)](/docs/sources/web-trackers/tracking-events/media/index.md)                                                     | 3.12.0         | Events and entities | Manual               | ❌       | ❌            | `browser-plugin-media`                         |
| [Media (HTML)](/docs/sources/web-trackers/tracking-events/media/html5/index.md)                                                   | 3.2.0          | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-media-tracking`                |
| [Media (Vimeo)](/docs/sources/web-trackers/tracking-events/media/vimeo/index.md)                                                  | 3.14.0         | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-vimeo-tracking`                |
| [Media (Youtube)](/docs/sources/web-trackers/tracking-events/media/youtube/index.md)                                              | 3.2.0          | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-youtube-tracking`              |
| [Optimizely X](/docs/sources/web-trackers/tracking-events/optimizely/index.md)                                                    | 3.0.0          | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-optimizely-x`                  |
| [Performance navigation timing](/docs/sources/web-trackers/tracking-events/timings/index.md)                                      | 3.10.0         | Entities            | Automatic            | ✅       | ❌            | `browser-plugin-performance-navigation-timing` |
| [Performance timing](/docs/sources/web-trackers/tracking-events/timings/index.md#performance-timing-plugin-original) - Deprecated | 3.0.0 - 3.24.6 | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-performance-timing`            |
| [Privacy Sandbox](/docs/sources/web-trackers/tracking-events/privacy-sandbox/index.md)                                            | 3.14.0         | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-privacy-sandbox`               |
| [Screen views](/docs/sources/web-trackers/tracking-events/screen-views/index.md)                                                  | 4.2.0          | Events              | Combination          | ❌       | ❌            | `browser-plugin-screen-tracking`               |
| [Site search](/docs/sources/web-trackers/tracking-events/site-search/index.md) in Site plugin                                     | 3.0.0          | Events              | Manual               | ✅       | ❌            | `browser-plugin-site-tracking`                 |
| [Social media interactions](/docs/sources/web-trackers/tracking-events/social-media/index.md) in Site plugin                      | 3.0.0          | Events              | Manual               | ✅       | ❌            | `browser-plugin-site-tracking`                 |
| [Timing](/docs/sources/web-trackers/tracking-events/timings/generic/index.md) in Site plugin                                      | 3.0.0          | Events              | Manual               | ✅       | ❌            | `browser-plugin-site-tracking`                 |
| [Timezone](/docs/sources/web-trackers/tracking-events/timezone-geolocation/index.md) - Legacy                                     | 3.0.0          | Other               | Automatic            | ❌       | ❌            | `browser-plugin-timezone`                      |
| [WebView](/docs/sources/web-trackers/tracking-events/webview/index.md)                                                            | 4.3.0          | Other               | Automatic            | ❌       | ❌            | `browser-plugin-webview`                       |
| [Web vitals](/docs/sources/web-trackers/tracking-events/web-vitals/index.md)                                                      | 3.13.0         | Events              | Automatic            | ✅       | ❌            | `browser-plugin-web-vitals`                    |

You can find the plugins code [here](https://github.com/snowplow/snowplow-javascript-tracker/tree/master/plugins) and also search for them on [npmjs.com](https://www.npmjs.com/).
