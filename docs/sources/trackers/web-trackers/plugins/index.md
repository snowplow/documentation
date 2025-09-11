---
title: "Plugins"
description: "Web tracker plugins for enhanced behavioral event collection including ecommerce, media, and form tracking."
schema: "TechArticle"
keywords: ["Web Plugins", "Tracker Plugins", "JavaScript Extensions", "Analytics Plugins", "Web Features", "Plugin System"]
date: "2021-04-07"
sidebar_position: 2800
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The Javascript Tracker is based around a plugin architecture which allows new functionality to be added to the tracker. There are a number of Snowplow maintained plugins, however you are also free to [build your own](/docs/sources/trackers/web-trackers/plugins/creating-your-own-plugins/index.md) or leverage community plugins too.

## All plugins

The following table lists the Snowplow plugins (alphabetical order), what kinds of data are created using them, and their distribution for the JavaScript (`sp.js` file or minimal version) and Browser (`npm` etc. package) trackers. Read more about configuring plugins [here](/docs/sources/trackers/web-trackers/plugins/configuring-tracker-plugins/index.md) or on the individual pages.

If you are using the JavaScript tracker with the full `sp.js` and your plugin is included, no further installation or initialization is required. You can use it straight away.

| Plugin                                                                                                                       | Creates             | Tracked              | `sp.js` | `sp.lite.js` | Package name                                   |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------- | ------- | ------------ | ---------------------------------------------- |
| [Ads](/docs/sources/trackers/web-trackers/tracking-events/ads/index.md)                                   | Events              | Manual               | ✅       | ❌            | `browser-plugin-ad-tracking`                   |
| [Button click](/docs/sources/trackers/web-trackers/tracking-events/button-click/index.md)                 | Events              | Automatic            | ✅       | ❌            | `browser-plugin-button-click-tracking`         |
| [Client Hints](/docs/sources/trackers/web-trackers/tracking-events/client-hints/index.md)                 | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-client-hints`                  |
| [Consent (Enhanced)](/docs/sources/trackers/web-trackers/tracking-events/consent-gdpr/index.md)           | Events and entities | Manual               | ✅       | ❌            | `browser-plugin-enhanced-consent`              |
| [Debugger](/docs/sources/trackers/web-trackers/testing-debugging/index.md)                                | Other               | n/a                  | ❌       | ❌            | `browser-plugin-debugger`                      |
| [Ecommerce (Snowplow)](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/index.md)            | Events and entities | Manual               | ✅       | ❌            | `browser-plugin-snowplow-ecommerce`            |
| [Ecommerce (Enhanced)](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/enhanced/index.md)   | Events              | Manual               | ❌       | ❌            | `browser-plugin-enhanced-ecommerce`            |
| [Errors](/docs/sources/trackers/web-trackers/tracking-events/errors/index.md)                             | Events              | Manual and automatic | ✅       | ❌            | `browser-plugin-error-tracking`                |
| [Element visibility](/docs/sources/trackers/web-trackers/tracking-events/element-tracking/index.md)       | Events              | Automatic            | ❌       | ❌            | `browser-plugin-element-tracking`          |
| [Event Specifications](/docs/sources/trackers/web-trackers/tracking-events/event-specifications/index.md) | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-event-specifications`          |
| [Forms](/docs/sources/trackers/web-trackers/tracking-events/form-tracking/index.md)                       | Events              | Automatic            | ✅       | ❌            | `browser-plugin-form-tracking`                 |
| [GA cookies](/docs/sources/trackers/web-trackers/tracking-events/ga-cookies/index.md)                     | Entities            | Automatic            | ✅       | ❌            | `browser-plugin-ga-cookies`                    |
| [Geolocation](/docs/sources/trackers/web-trackers/tracking-events/timezone-geolocation/index.md)          | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-geolocation`                   |
| [Kantar Focal Meter](/docs/sources/trackers/web-trackers/tracking-events/focalmeter/index.md)             | Other               | n/a                  | ❌       | ❌            | `browser-plugin-focalmeter@focalmeter_plugin`  |
| [Link click](/docs/sources/trackers/web-trackers/tracking-events/link-click/index.md)                     | Events              | Automatic            | ✅       | ❌            | `browser-plugin-link-click-tracking`           |
| [Media (Snowplow)](/docs/sources/trackers/web-trackers/tracking-events/media/index.md)                    | Events and entities | Manual               | ❌       | ❌            | `browser-plugin-media`                         |
| [Media (HTML)](/docs/sources/trackers/web-trackers/tracking-events/media/html5/index.md)                  | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-media-tracking`                |
| [Media (Vimeo)](/docs/sources/trackers/web-trackers/tracking-events/media/vimeo/index.md)                 | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-vimeo-tracking`                |
| [Media (Youtube)](/docs/sources/trackers/web-trackers/tracking-events/media/youtube/index.md)             | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-youtube-tracking`              |
| [Optimizely X](/docs/sources/trackers/web-trackers/tracking-events/optimizely/index.md)                   | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-optimizely-x`                  |
| [Performance navigation timing](/docs/sources/trackers/web-trackers/tracking-events/timings/index.md)     | Entities            | Automatic            | ✅       | ❌            | `browser-plugin-performance-navigation-timing` |
| [Performance timing (original)](/docs/sources/trackers/web-trackers/tracking-events/timings/index.md)     | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-performance-timing`            |
| [Privacy Sandbox](/docs/sources/trackers/web-trackers/tracking-events/privacy-sandbox/index.md)           | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-privacy-sandbox`               |
| [Screen views](/docs/sources/trackers/web-trackers/tracking-events/screen-views/index.md)                 | Events              | Combination          | ❌       | ❌            | `browser-plugin-screen-tracking`               |
| Site*                                                                                                                        | Events              | Manual               | ✅       | ❌            | `browser-plugin-site-tracking`                 |
| [Timezone](/docs/sources/trackers/web-trackers/tracking-events/timezone-geolocation/index.md)             | Other               | Automatic            | ❌       | ❌            | `browser-plugin-timezone`                      |
| [WebView](/docs/sources/trackers/web-trackers/tracking-events/webview/index.md)                           | Other               | Automatic            | ❌       | ❌            | `browser-plugin-webview`                       |
| [Web vitals](/docs/sources/trackers/web-trackers/tracking-events/web-vitals/index.md)                     | Events              | Automatic            | ✅       | ❌            | `browser-plugin-web-vitals`                    |

*The site tracking plugin provides events for [site search](/docs/sources/trackers/web-trackers/tracking-events/site-search/index.md), [social media interactions](/docs/sources/trackers/web-trackers/tracking-events/social-media/index.md), and [timing](/docs/sources/trackers/web-trackers/tracking-events/timings/generic/index.md).

You can find the plugins code [here](https://github.com/snowplow/snowplow-javascript-tracker/tree/master/plugins) and also search for them on [npmjs.com](https://www.npmjs.com/).
