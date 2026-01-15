---
title: "Out-of-the-box data types"
sidebar_label: "Out-of-the-box data"
sidebar_position: 2
description: "Overview of Snowplow's built-in event types and entities for web and mobile tracking including ecommerce, media, and performance data."
keywords: ["out-of-the-box data", "built-in events", "pre-built entities", "automatic tracking"]
---

Snowplow has provided these out-of-the-box [event](/docs/fundamentals/events/index.md) and [entity](/docs/fundamentals/entities/index.md) types so you can get started quickly with tracking user data.

This table shows the available events or out-of-the-box data grouped by category, along with the type of data you can generate on [web](/docs/sources/web-trackers/index.md) and [mobile](/docs/sources/mobile-trackers/index.md) platforms. Note that "events" refers to "self-describing events".

| Event category                                                                             | Description                                              | Web                   | Mobile                |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------- | --------------------- | --------------------- |
| [Application errors](/docs/events/ootb-data/app-error-events/index.md)                     | Track errors in your application                         | Events                | Events                |
| [Application and tracker information](/docs/events/ootb-data/app-information/index.md)     | Data about the application and tracker                   | Atomic fields, entity | Atomic fields, entity |
| [Application performance](/docs/events/ootb-data/app-performance/index.md)                 | Track application performance and timings                | Events, entity        | Events                |
| [Campaigns and ads](/docs/events/ootb-data/campaigns-and-ads/index.md)                     | Track marketing campaigns and ads on web                 | Atomic fields, events |                       |
| [Consent](/docs/events/ootb-data/consent-events/index.md)                                  | Track user marketing consent on web                      | Events                |                       |
| [Device and browser information](/docs/events/ootb-data/device-and-browser/index.md)       | Data about the user's device and browser                 | Atomic fields, entity | Atomic fields, entity |
| [Ecommerce](/docs/events/ootb-data/ecommerce-events/index.md)                              | Track ecommerce activity                                 | Events, entities      | Events, entities      |
| [Geolocation](/docs/events/ootb-data/geolocation/index.md)                                 | Data about the user's location                           | Entity                | Entity                |
| [Referrers, links, and cross-navigation](/docs/events/ootb-data/links-and-referrers/index.md) | How users arrive at or navigate through your application | Atomic fields, events | Events                |
| [Media](/docs/events/ootb-data/media-events/index.md)                                      | Track video or audio interactions                        | Events, entities      | Events, entities      |
| [Mobile application lifecycle](/docs/events/ootb-data/mobile-lifecycle-events/index.md)   | Track mobile application installs and lifecycle          |                       | Events, entity        |
| [Page and screen engagement](/docs/events/ootb-data/page-activity-tracking/index.md)       | Data about user engagement                               | Events                | Events, entity        |
| [Page and screen views](/docs/events/ootb-data/page-and-screen-view-events/index.md)       | Track page views on web and screen views on mobile       | Atomic fields, entity | Events, entity        |
| [Page elements](/docs/events/ootb-data/page-elements/index.md)                             | Track button clicks, forms, and element visibility       | Events, entity        |                       |
| [Site search](/docs/events/ootb-data/site-search/index.md)                                 | Track internal site search queries                       | Events                |                       |
| [Social media interactions](/docs/events/ootb-data/social-media/index.md)                  | Track likes, shares, and social widget interactions      | Events                |                       |
| [Third-party integrations](/docs/events/ootb-data/third-party-integrations/index.md)       | Capture data from Optimizely, GA cookies, and more       | Entity                |                       |
| [User and session identification](/docs/events/ootb-data/user-and-session-identification/index.md) | Identifiers for users and sessions                       | Atomic fields, entity | Atomic fields, entity |
| [VisionOS and SwiftUI](/docs/events/ootb-data/visionos-swiftui/index.md)                   | Track users behavior in SwiftUI and VisionOS             |                       | Events, entities      |
