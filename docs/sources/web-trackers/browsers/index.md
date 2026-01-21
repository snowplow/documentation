---
title: "Track browser information with the web trackers"
sidebar_label: "Browser entity"
description: "Track browser information including viewport, device properties, and client hints with the browser entity."
keywords: ["browser entity", "client hints", "privacy sandbox"]
date: "2021-04-07"
sidebar_position: 2950
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The Snowplow web tracker supports tracking in all modern browsers, including new browser features such as [Privacy Sandbox](/docs/sources/web-trackers/tracking-events/privacy-sandbox/index.md) and [client hints](/docs/sources/web-trackers/tracking-events/client-hints/index.md).

## Browser entity

Add an entity to every tracked event that records information about the user's browser. Configure it using the `"contexts"` object within the [tracker configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

<details>
    <summary>Browser entity properties</summary>

The [browser](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema) context entity consists of the following properties:

| Attribute             | Description                                                                                                                                                                    | Required? |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `viewport`            | Viewport dimensions of the browser. Arrives in the form of WidthxHeight e.g. 1200x900.                                                                                         | Yes       |
| `documentSize`        | Document dimensions. Arrives in the form of WidthxHeight e.g. 1200x900.                                                                                                        | Yes       |
| `resolution`          | Device native resolution. Arrives in the form of WidthxHeight e.g. 1200x900.                                                                                                   | Yes       |
| `colorDepth`          | The number of bits allocated to colors for a pixel in the output device, excluding the alpha channel.                                                                          | Yes       |
| `devicePixelRatio`    | Ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.                                                                     | No        |
| `cookiesEnabled`      | Indicates whether cookies are enabled or not. More info and caveats at the official [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled). | Yes       |
| `online`              | Returns the online status of the browser. Important caveats are described in [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine).               | Yes       |
| `browserLanguage`     | The preferred language of the user, usually the language of the browser UI. Defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646).                              | No        |
| `documentLanguage`    | The language of the HTML document. Defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646).                                                                       | No        |
| `webdriver`           | Indicates whether the user agent is controlled by automation.                                                                                                                  | No        |
| `deviceMemory`        | Approximate amount of device memory in gigabytes.                                                                                                                              | No        |
| `hardwareConcurrency` | Number of logical processors available to run threads on the user's computer.                                                                                                  | No        |
| `tabId`               | A UUID identifier for the client browser tab the event is sent from.                                                                                                           | No        |

:::note
Please note that the browser entity is only available since version 3.9 of the tracker.
:::
</details>

## Automatic event properties

The web trackers automatically capture browser and page information and add it to every event. You don't need to configure or manually include these properties.

### Set once per tracker initialization

These values are captured when the tracker initializes and remain constant for the session:

| Property                                 | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| `br_cookies`                             | Whether cookies are enabled (`1` or `0`) |
| `doc_charset`                            | Document character set (e.g., `UTF-8`)   |
| `br_lang`                                | Browser language                         |
| `dvce_screenwidth` / `dvce_screenheight` | Screen resolution                        |
| `br_colordepth`                          | Color depth of the display               |
| `os_timezone`                            | User's timezone                          |

### Set on every event

These values are freshly captured for each event:

| Property                         | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| `br_viewwidth` / `br_viewheight` | Viewport dimensions at the time of the event   |
| `doc_width` / `doc_height`       | Document dimensions at the time of the event   |
| `page_url`                       | Current page URL                               |
| `page_referrer`                  | Referrer URL                                   |
| `domain_userid`                  | Domain user ID (first-party cookie identifier) |
| `domain_sessionidx`              | Session index (visit count)                    |
| `domain_sessionid`               | Session ID                                     |
| `user_id`                        | Business user ID, if set via `setUserId()`     |

:::note
Some properties may be omitted when [anonymous tracking](/docs/sources/web-trackers/anonymous-tracking/index.md) is enabled.
:::
