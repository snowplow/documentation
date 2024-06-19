---
title: "Data product templates"
date: "2024-06-17"
sidebar_label: "Using data product templates"
sidebar_position: 2
sidebar_custom_props:
  offerings:
    - bdp
---

## Creating a Data Product based on Templates using Console

To create a new data product based on a pre-defined template, navigate to the "Data products" section from the navigation bar and click the "Create data product" or "Templates" buttons.

Below is a list of the current templates:

### Base Web Data Product

This Data Product template contains all the tracking of Standard Events. It is recommended to be used in conjunction with JavaScript Trackers (Web and Node.js).

Note: The event volume counts are calculated differently for this Data Product. They are counts of any page_ping/page_view events sent for the app ID's of this data product.

Included event specifications:

* [Page Ping](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/activity-page-pings/)
* [Page View](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/page-views/)


## E-commerce Web

This Data Product template contains all the basic e-commerce interactions that help you analyze customer behavior, identify potential growth opportunities and improve your sales performance.

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

This Data Product template contains a full set of media tracking interactions to measure video or audio data using the Snowplow Media plugin.

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

