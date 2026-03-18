---
title: "Out-of-the-box data types"
sidebar_label: "Out-of-the-box data"
sidebar_position: 2
description: "Overview of Snowplow's built-in event types and entities for web and mobile tracking including ecommerce, media, and performance data."
keywords: ["out-of-the-box data", "built-in events", "pre-built entities", "automatic tracking"]
---

Snowplow has provided these out-of-the-box [event](/docs/fundamentals/events/index.md) and [entity](/docs/fundamentals/entities/index.md) types so you can get started quickly with tracking user data.

This table shows the available out-of-the-box data grouped by category.

| Category                                                                                           | Description                                                                         | Events | Entities | [Atomic fields](/docs/fundamentals/canonical-event/index.md) |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------ | -------- | ------------------------------------------------------------ |
| [Application errors](/docs/events/ootb-data/app-error-events/index.md)                             | Exception messages, stack traces, and error classification                          | ✅      |          |                                                              |
| [Application and tracker information](/docs/events/ootb-data/app-information/index.md)             | App version, build number, platform, and tracker namespace                          |        | ✅        | ✅                                                            |
| [Application performance](/docs/events/ootb-data/app-performance/index.md)                         | Web vitals, navigation timing, and performance metrics                              | ✅      | ✅        |                                                              |
| [Buttons](/docs/events/ootb-data/page-elements/index.md)                                           | Button click events with label, ID, and element classes                             | ✅      |          |                                                              |
| [Campaigns and ads](/docs/events/ootb-data/campaigns-and-ads/index.md)                             | UTM parameters, ad impressions, clicks, and conversions                             | ✅      |          | ✅                                                            |
| [Consent](/docs/events/ootb-data/consent-events/index.md)                                          | GDPR consent and CMP visibility tracking                                            | ✅      | ✅        |                                                              |
| [Device and browser information](/docs/events/ootb-data/device-and-browser/index.md)               | Track data such as language, viewport size, screen resolution, or client hints      |        | ✅        | ✅                                                            |
| [Ecommerce](/docs/events/ootb-data/ecommerce-events/index.md)                                      | Complete ecommerce tracking including product views, cart actions, and transactions | ✅      | ✅        | ✅                                                            |
| [Forms](/docs/events/ootb-data/page-elements/index.md)                                             | Form focus, field changes, and submission with field values                         | ✅      |          |                                                              |
| [Geolocation](/docs/events/ootb-data/geolocation/index.md)                                         | IP-based location (city, region, country) and GPS coordinates                       |        | ✅        | ✅                                                            |
| [Referrers, links, and cross-navigation](/docs/events/ootb-data/links-and-referrers/index.md)      | Page referrer URLs, link clicks, and mobile deep links                              | ✅      | ✅        | ✅                                                            |
| [Media](/docs/events/ootb-data/media-events/index.md)                                              | Complete video or audio tracking, including play, pause, and ad breaks              | ✅      | ✅        |                                                              |
| [Mobile application lifecycle](/docs/events/ootb-data/mobile-lifecycle-events/index.md)            | App install, foreground and background                                              | ✅      | ✅        |                                                              |
| [Page and screen engagement](/docs/events/ootb-data/page-activity-tracking/index.md)               | Page pings, scroll depth, and time engaged on page or screen                        | ✅      | ✅        | ✅                                                            |
| [Page and screen views](/docs/events/ootb-data/page-and-screen-view-events/index.md)               | Track page and screen views                                                         | ✅      | ✅        | ✅                                                            |
| [Page elements](/docs/events/ootb-data/page-elements/index.md)                                     | Element visibility, scroll depth into elements, and lifecycle                       | ✅      | ✅        |                                                              |
| [Site search](/docs/events/ootb-data/site-search/index.md)                                         | Search terms, filters applied, and result counts                                    | ✅      |          |                                                              |
| [Social media interactions](/docs/events/ootb-data/social-media/index.md)                          | Likes, shares, and social widget interactions by network                            | ✅      |          |                                                              |
| [Third-party sources](/docs/events/ootb-data/third-party-sources/index.md)                         | Optimizely experiments, GA cookies, Kantar Focal Meter, and Privacy Sandbox topics  |        | ✅        |                                                              |
| [Timezone](/docs/events/ootb-data/geolocation/index.md)                                            | Track device timezone                                                               |        |          | ✅                                                            |
| [User and session identification](/docs/events/ootb-data/user-and-session-identification/index.md) | Track identifiers such as user ID, domain user ID, session ID, and session index    |        | ✅        | ✅                                                            |
| [VisionOS and SwiftUI](/docs/events/ootb-data/visionos-swiftui/index.md)                           | Window group and immersive space tracking for Apple                                 | ✅      | ✅        |                                                              |
