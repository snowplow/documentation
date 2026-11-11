---
title: "Tracking plan templates"
sidebar_label: "Start from a template"
date: "2024-06-17"
sidebar_position: 2
description: "Pre-defined tracking plan templates for Base Web, Base Mobile, Ecommerce, and Media tracking with included event specifications and implementation guidance."
keywords: ["tracking plan templates", "Base Web template", "Base Mobile template", "ecommerce template", "media tracking template"]
content_type: reference
---

Console provides templates for Base Web, Base Mobile, Ecommerce (Web and Mobile), and Media Web tracking plans. To create a tracking plan from one of them, see [create a tracking plan from a template](/docs/event-studio/tracking-plans/create-and-manage/index.md#create-a-tracking-plan-from-a-template).

:::note[Snowtype]
[Snowtype](/docs/event-studio/implement-tracking/index.md) **does not support** tracking plan templates.
:::

## Base Web

This tracking plan template contains the standard events for web tracking. You implement these events with the [web trackers](/docs/sources/web-trackers/index.md) and the respective [button click](/docs/sources/web-trackers/tracking-events/button-click/index.md) and [link click](/docs/sources/web-trackers/tracking-events/link-click/index.md) plugins.

Event volume counts are calculated differently for this tracking plan. See [volume metrics for Base templates](#volume-metrics-for-base-templates).

Included event specifications:

* [Page View](/docs/sources/web-trackers/tracking-events/page-views/index.md)
* [Page Ping](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md)
* [Button click](/docs/sources/web-trackers/tracking-events/button-click/index.md)
* [Link click](/docs/sources/web-trackers/tracking-events/link-click/index.md)

## Base Mobile

This tracking plan template contains the standard events for mobile tracking. You implement these events with the [mobile trackers](/docs/sources/mobile-trackers/index.md), with [installation](/docs/sources/mobile-trackers/tracking-events/installation-tracking/index.md), [screen view](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md) and [app lifecycle](/docs/sources/mobile-trackers/tracking-events/lifecycle-tracking/index.md) tracking capabilities enabled.

Event volume counts are calculated differently for this tracking plan. See [volume metrics for Base templates](#volume-metrics-for-base-templates).

Included event specifications:

* [Screen view](/docs/events/ootb-data/page-and-screen-view-events/index.md#screen-views)
* [Screen end](/docs/events/ootb-data/page-activity-tracking/index.md#screen-end-event)
* [Application install](/docs/events/ootb-data/mobile-lifecycle-events/index.md#install-events)
* [Application background](/docs/events/ootb-data/mobile-lifecycle-events/index.md#background-event)
* [Application foreground](/docs/events/ootb-data/mobile-lifecycle-events/index.md#foreground-event)

## Ecommerce (Web and Mobile)

This tracking plan template contains the basic ecommerce interactions, to help you analyze customer behavior.

Tracked using the [out-of-the-box ecommerce events](/docs/events/ootb-data/ecommerce-events/index.md) for web, Android, and iOS. On web, this requires the [Snowplow Ecommerce plugin](/docs/sources/web-trackers/tracking-events/ecommerce/index.md).

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

## Media Web

This tracking plan template contains a full set of media tracking interactions to measure video or audio data.
Tracked using the [Snowplow Media plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md).

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

## Volume metrics for Base templates

The Base Web and Base Mobile templates contain standard events, such as page pings, link clicks, screen views, and application installs. For tracking plans created from these templates, the event volume counts are counts of any of the included events sent for the app IDs of the tracking plan.

By default, a tracking plan created from a Base template isn't connected to a source application, and shows all the base event app IDs. To count only your application's events, edit the tracking plan and set its source application.

The volume metrics depend on the app IDs that the standard events are tracked with:

* If no standard events are being tracked with an app ID different from those inherited from the source applications set up in the tracking plan, the volume metrics behave the same as for any other tracking plan.
* If standard events are being tracked with app IDs different from those inherited from the source applications set up in the tracking plan, a **Show all tracked App IDs** toggle appears above the event specification list.

The toggle is disabled by default, so the metrics displayed relate only to the app IDs inherited from the source applications set up in the tracking plan.

![Event specifications list with the "Show all tracked App IDs" toggle disabled. Five event specifications are shown (Button click, Custom event, Link click, Page ping, Page view) with their data structures, the console-qa application ID badge, last seen dates, and volume counts. Page view shows 64.00k events.](images/tracking_plan_metrics_default.png)

If you enable the toggle, the list shows the metrics for all the app IDs found for the standard events, not only the ones inherited from the tracking plan.

![Event specifications list with the "Show all tracked App IDs" toggle enabled. The Page view event now shows three application ID badges — console-qa (green indicator), react-app (yellow indicator), and duncan_app (yellow indicator) — revealing events tracked from application IDs not configured in the tracking plan's source applications.](images/tracking_plan_metrics_toggled.png)

For what the app ID status colors mean, see [track specification versions and application IDs](/docs/event-studio/tracking-plans/data-quality/index.md#track-specification-versions-and-application-ids).
