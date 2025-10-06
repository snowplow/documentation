---
title: "Data product templates"
date: "2024-06-17"
sidebar_label: "Using data product templates"
sidebar_position: 2
sidebar_custom_props:
  offerings:
    - cdi
---

## Creating a Data Product based on Templates using Console

To create a new data product based on a pre-defined template, navigate to the "Data products" section from the navigation bar and click the "Create data product" or "Templates" buttons.

:::note
_When creating a data product based on a template, the name must be unique to ensure proper identification and avoid conflicts._
:::

Below is a list of the current templates:

### Base Web

This Data Product template contains all the tracking of Standard Events related to web tracking. It is expected that these events would be implemented using our [Web trackers](/docs/sources/trackers/web-trackers/index.md) and the respective [button click](/docs/sources/trackers/web-trackers/tracking-events/button-click/index.md) and [link click](/docs/sources/trackers/web-trackers/tracking-events/link-click/index.md) plugins.

Note: The event volume counts are calculated differently for this Data Product. They are counts of any of the following events sent for the app ID's of this data product.

Included event specifications:

* [Page View](/docs/sources/trackers/web-trackers/tracking-events/page-views/index.md)
* [Page Ping](/docs/sources/trackers/web-trackers/tracking-events/activity-page-pings/index.md)
* [Button click](/docs/sources/trackers/web-trackers/tracking-events/button-click/index.md)
* [Link click](/docs/sources/trackers/web-trackers/tracking-events/link-click/index.md)

### Base Mobile

This Data Product template contains all the tracking of Standard Events related to mobile tracking. It is expected that these events would be implemented using our [mobile trackers](/docs/sources/trackers/mobile-trackers/index.md) with [installation](/docs/sources/trackers/mobile-trackers/tracking-events/installation-tracking/index.md), [screen view](/docs/sources/trackers/mobile-trackers/tracking-events/screen-tracking/index.md) and [app lifecycle](/docs/sources/trackers/mobile-trackers/tracking-events/lifecycle-tracking/index.md) tracking capabilities enabled.

Note: The event volume counts are calculated differently for this Data Product. They are counts of any of the following events sent for the app ID's of this data product.

Included event specifications:

* [Screen view](/docs/events/ootb-data/page-and-screen-view-events/index.md#screen-view-events)
* [Screen end](/docs/events/ootb-data/page-activity-tracking/index.md#screen-end-event)
* [Application install](/docs/events/ootb-data/mobile-lifecycle-events/index.md#install-event)
* [Application background](/docs/events/ootb-data/mobile-lifecycle-events/index.md#background-event)
* [Application foreground](/docs/events/ootb-data/mobile-lifecycle-events/index.md#foreground-event)

### E-commerce (Web and Mobile)

This Data Product template contains all the basic e-commerce interactions that help you analyze customer behavior, identify potential growth opportunities, and improve your sales performance.

Tracked using the [out-of-the-box e-commerce events](/docs/events/ootb-data/ecommerce-events/index.md) for web, Android, and iOS. On web, this requires the [Snowplow Ecommerce plugin](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/index.md).

Included event specifications:

* Add to cart
* Checkout step
* Internal promotion click
* Internal promotion view
* Product list click
* Product list view
* Refund
* Remove from cart
* Track product view
* Transaction
* Transaction Error

### Media Web

This Data Product template contains a full set of media tracking interactions to measure video or audio data.
Tracked using the [Snowplow Media plugin](https://docs.snowplow.io/docs/sources/trackers/web-trackers/tracking-events/media/snowplow/).

Included event specifications:

* Ad Break End Event
* Ad Break Start Event
* Ad Click Event
* Ad Complete Event
* Ad Pause Event
* Ad Quartile Event
* Ad Resume Event
* Ad Skip Event
* Ad Start Event
* Buffer End Event
* Buffer Start Event
* Error Event
* Fullscreen Change Event
* Media Ping Event
* Pause Event
* Percent Progress Event
* Picture-in-picture Change Event
* Playback End Event
* Play Event
* Quality Change Event
* Ready Event
* Seek End Event
* Seek Start Event
* Volume Change Event
