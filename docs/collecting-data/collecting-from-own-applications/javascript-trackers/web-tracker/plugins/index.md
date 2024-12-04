---
title: "Plugins"
date: "2021-04-07"
sidebar_position: 2800
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The Javascript Tracker is based around a plugin architecture which allows new functionality to be added to the tracker. There are a number of Snowplow maintained plugins, however you are also free to [build your own](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/creating-your-own-plugins/index.md) or leverage community plugins too.

## All plugins

The following table lists the Snowplow plugins (alphabetical order), what kinds of data are created using them, and their distribution for the JavaScript (`sp.js` file or minimal version) and Browser (`npm` etc. package) trackers. Read more about configuring plugins [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/configuring-tracker-plugins/index.md) or on the individual pages.

If you are using the JavaScript tracker with the full `sp.js` and your plugin is included, no further installation or initialization is required. You can use it straight away.

| Plugin                                                                                                                                                      | Creates             | Tracked              | `sp.js` | `sp.lite.js` | Package name                                   |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|----------------------|---------|--------------|------------------------------------------------|
| [Ads](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/ads/index.md)                                  | Events              | Manual               | ✅       | ❌            | `browser-plugin-ad-tracking`                   |
| [Button click](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/button-click/index.md)                | Events              | Automatic            | ✅       | ❌            | `browser-plugin-button-click-tracking`         |
| [Client Hints](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/client-hints/index.md)                | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-client-hints`                  |
| [Consent (Enhanced)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/consent-gdpr/index.md)          | Events and entities | Manual               | ✅       | ❌            | `browser-plugin-enhanced-consent`              |
| [Debugger](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/testing-debugging/index.md)                               | Other               | n/a                  | ❌       | ❌            | `browser-plugin-debugger`                      |
| [Ecommerce (Snowplow)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/ecommerce/index.md)           | Events and entities | Manual               | ✅       | ❌            | `browser-plugin-snowplow-ecommerce`            |
| [Ecommerce (Enhanced)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/ecommerce/enhanced/index.md)  | Events              | Manual               | ❌       | ❌            | `browser-plugin-enhanced-ecommerce`            |
| [Errors](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/errors/index.md)                            | Events              | Manual and automatic | ✅       | ❌            | `browser-plugin-error-tracking`                |
| [Event Specifications](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/event-specifications/index.md)                            | Entities              | Automatic | ❌       | ❌            | `browser-plugin-event-specifications`                |
| [Forms](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/form-tracking/index.md)                      | Events              | Automatic            | ✅       | ❌            | `browser-plugin-form-tracking`                 |
| [GA cookies](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/ga-cookies/index.md)                    | Entities            | Automatic            | ✅       | ❌            | `browser-plugin-ga-cookies`                    |
| [Geolocation](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/timezone-geolocation/index.md)         | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-geolocation`                   |
| [Kantar Focal Meter](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/focalmeter/index.md)            | Other               | n/a                  | ❌       | ❌            | `browser-plugin-focalmeter@focalmeter_plugin`  |
| [Link click](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/link-click/index.md)                    | Events              | Automatic            | ✅       | ❌            | `browser-plugin-link-click-tracking`           |
| [Media (Snowplow)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/index.md)                   | Events and entities | Manual               | ❌       | ❌            | `browser-plugin-media`                         |
| [Media (HTML)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/html5/index.md)                 | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-media-tracking`                |
| [Media (Vimeo)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/vimeo/index.md)                | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-vimeo-tracking`                |
| [Media (Youtube)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/youtube/index.md)            | Events and entities | Automatic            | ❌       | ❌            | `browser-plugin-youtube-tracking`              |
| [Optimizely X](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/optimizely/index.md)                  | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-optimizely-x`                  |
| [Performance navigation timing](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/timings/index.md)    | Entities            | Automatic            | ✅       | ❌            | `browser-plugin-performance-navigation-timing` |
| [Performance timing (original)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/timings/index.md)    | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-performance-timing`            |
| [Privacy Sandbox](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/privacy-sandbox/index.md)          | Entities            | Automatic            | ❌       | ❌            | `browser-plugin-privacy-sandbox`               |
| Site*                                                                                                                                                       | Events              | Manual               | ✅       | ❌            | `browser-plugin-site-tracking`                 |
| [Timezone](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/timezone-geolocation/index.md)            | Other               | Automatic            | ❌       | ❌            | `browser-plugin-timezone`                      |
| [Web vitals](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/web-vitals/index.md)                    | Events              | Automatic            | ✅       | ❌            | `browser-plugin-web-vitals`                    |

*The site tracking plugin provides events for [site search](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/site-search/index.md), [social media interactions](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/social-media/index.md), and [timing](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/timings/generic/index.md).

You can find the plugins code [here](https://github.com/snowplow/snowplow-javascript-tracker/tree/master/plugins) and also search for them on [npmjs.com](https://www.npmjs.com/).
