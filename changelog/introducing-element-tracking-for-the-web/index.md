---
title: "Introducing element tracking for the web"
description: "We’re excited to announce the release of Snowplow's Element Tracking plugin for the JavaScript and Browser web trackers, which enables simple tracking of the presence and visibility of web page components."
date: "2025-05-01"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
We’re excited to announce the release of Snowplow's Element Tracking plugin for the JavaScript and Browser web trackers, which enables simple tracking of the presence and visibility of web page components. This plugin builds on our suite of plugins that enable generic event tracking, including the [Link](/docs/sources/web-trackers/tracking-events/link-click/), [Button](/docs/sources/web-trackers/tracking-events/button-click/), and [Form](/docs/sources/web-trackers/tracking-events/form-tracking/) tracking plugins.

## What’s New

The plugin works by watching page contents for changes that match rules you specify, and then automatically fires events when matching elements appear on the page, are scrolled into/out of view, or removed from the page again.

These features let you track specific page components or elements on a page in a generic way, enabling easy implementation for use cases such as:

* Impression tracking
* Recommendation & Personalization tracking
* Per-element scroll depth tracking
* Content based heat-mapping
* Component-centric funnels
* Modal/Over-the-Page tracking
* Scroll tracking

## Key Benefits

With this plugin, you can now easily get more accurate baseline metrics for specific features of your site to measure their performance. This is increasingly important as these events are used as signals to train machine learning models for providing accurate recommendations and personalization functions. These can also help align measurements with industry standards for viewability.

Like the other generic tracking plugins, you can enable tracking in one place with a central configuration across many different pages or sites, and get a consistent tracking experience without having to manually add site-specific event handlers. We’ve taken care to ensure full functionality is available in constrained environments like tag management systems so you can get the most out of a single shared configuration for easier deployment. Features like “per pageview” frequency allow clean integrations with Single Page Applications, and modern standards like [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) are catered for with shadow DOM support.

Our documentation has [examples](/docs/sources/web-trackers/tracking-events/element-tracking/#further-examples) built from the [Snowplow website](https://snowplow.io/) to give you some ideas on how to get started.

## Key Features

* Specify elements of interest with rules using [CSS Selectors](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors)

* Automatically track events when matching elements:

  * Exist on page load
  * Are added dynamically to the page
  * Get scrolled into view
  * Get scrolled out of view
  * Are removed from the page or no longer match

* Configure how often events should fire: always, per element, per pageview

* Viewability constraints: define minimum sizes and times elements should be on-screen before firing visibility events

* Define custom data to extract from the elements and their content

* Track statistics like size and time on screen for specific elements

* Define a hierarchy of components or features to aggregate events by

* Include element status as entities on other events for behavior over time

## Get Started Today

The plugin is available now and compatible with Browser and JavaScript trackers version 3 and 4. To get started, simply [install the plugin](/docs/sources/web-trackers/tracking-events/element-tracking/#install-plugin) and start [configuring the elements](/docs/sources/web-trackers/tracking-events/element-tracking/#start-element-tracking) to track!

## More Resources

* [Element Tracking documentation](/docs/sources/web-trackers/tracking-events/element-tracking/)
* [Element Tracking plugin at GitHub](https://github.com/snowplow/snowplow-javascript-tracker/tree/release/4.6.0/plugins/browser-plugin-element-tracking)
