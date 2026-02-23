---
title: "Track browser information with the web trackers"
sidebar_label: "Browser information"
description: "Track browser information including viewport, device properties, and client hints with the browser entity."
keywords: ["browser entity", "client hints", "privacy sandbox"]
date: "2021-04-07"
sidebar_position: 59
---

The Snowplow web tracker supports tracking in all modern browsers, including newer browser features such as [client hints](/docs/sources/web-trackers/tracking-events/client-hints/index.md).

## Browser entity

Add an entity to every tracked event that records [information about the user's browser](/docs/events/ootb-data/device-and-browser/index.md#browser-entity). Configure it at [tracker initialization](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

The browser entity is **automatically tracked** once configured.

:::note Availability
The browser entity is available since version 3.9 of the tracker.
:::

## Atomic event properties

The web trackers automatically capture [browser and page information](/docs/events/ootb-data/device-and-browser/index.md) and add it to every event. You don't need to configure or manually include these properties.

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
