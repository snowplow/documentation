---
title: "Snowplow events"
description: ""
date: "2020-02-26"
sidebar_label: "Events"
sidebar_position: 3.5
---

At its heart, Snowplow is a platform for granular tracking of events.
Snowplow trackers fire _events_, which are either HTTP GET or POST requests to a Snowplow collector. By adding parameters to these requests, trackers can pass data into the collector for processing by Snowplow.

This section aims to give an overview of Snowplow events.
It lists the available data types and links to the tracking and modeling documentation for them.
If you are interested in an overview of the properties in the atomic events table, [please refer to this page](/docs/fundamentals/canonical-event/index.md).

## Custom events and context entities

Snowplow data is designed to be able to tailor to your business needs using custom events and context entities.

| Category                                                                                    | Description                                                                                                   |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [Context entities](/docs/events/custom-events/index.md#custom-context-entities)             | Add information to events using reusable entities.                                                            |
| [Self-describing events](/docs/events/custom-events/index.md#custom-self-describing-events) | Track custom events with schemas.                                                                             |
| [Structured events](/docs/events/custom-events/index.md#structured-events)                  | Track custom events without schemas (not recommended – we recommend tracking self-describing events instead). |

## Out-of-the-box data

Snowplow also provides out-of-the-box events, context entities and atomic event properties for common Web and mobile use cases.

| Category                                                                                                         | Description                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Page and screen view events](/docs/events/ootb-data/page-and-screen-view-events/index.md)                       | Basic building block for tracking views of Web pages or mobile screens.                       |
| [Page activity events](/docs/events/ootb-data/page-activity-tracking/index.md)                                   | Tracking user engagement on the Web page using page pings.                                    |
| [Mobile app lifecycle events](/docs/events/ootb-data/mobile-lifecycle-events/index.md)                           | Events to track mobile app lifecycle (install, going to foreground, background).              |
| [Referrers, deep links and cross-navigation events](/docs/events/ootb-data/links-and-referrers/index.md)         | Events and properties to track referrer information and linking between apps and websites.    |
| [App error events](/docs/events/ootb-data/app-error-events/index.md)                                             | Tracking errors and exceptions from apps.                                                     |
| [Consent events](/docs/events/ootb-data/consent-events/index.md)                                                 | Events for tracking user consent.                                                             |
| [E-commerce events](/docs/events/ootb-data/ecommerce-events/index.md)                                            | Events for tracking e-commerce transactions and more.                                         |
| [Media events](/docs/events/ootb-data/media-events/index.md)                                                     | Tracking media playback in Web or mobile apps.                                                |
| [Performance metrics](/docs/events/ootb-data/app-performance/index.md)                                           | Events to track performance metrics from websites and apps.                                   |
| [App information](/docs/events/ootb-data/app-information/index.md)                                               | Information about the app that the events originate from.                                     |
| [Device and browser information](/docs/events/ootb-data/device-and-browser/index.md)                             | Information about the device or browser of the user.                                          |
| [User and session identification and stitching](/docs/events/ootb-data/user-and-session-identification/index.md) | Overview of the user and session identifiers provided by the trackers and how to stitch them. |
| [Geolocation information](/docs/events/ootb-data/geolocation/index.md)                                           | Geolocation information attached to events.                                                   |

<details>
  <summary>Going deeper into the event properties</summary>
  <div>

These pages are for you if you want to understand the tracker payload in more detail, and especially if you are building your own tracker. In the latter case, utilizing the parameters documented here will ensure that your tracker works with the rest of the Snowplow stack.

| Category                                                                | Description                                          |
| ----------------------------------------------------------------------- | ---------------------------------------------------- |
| [Event parameters](/docs/events/going-deeper/event-parameters/index.md) | Protocol of all the parameters in the event payload. |
| [HTTP headers](/docs/events/going-deeper/http-headers/index.md)         | Collecting HTTP request headers and cookies.         |
| [Example requests](/docs/events/going-deeper/example-requests/index.md) | Example tracker requests with sample payload.        |

  </div>
</details>
