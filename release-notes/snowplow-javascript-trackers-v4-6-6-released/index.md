---
title: "Snowplow JavaScript trackers v4.6.6 released"
description: "We’re happy to announce a new release for the JavaScript, Browser, and React Native trackers."
date: "2025-08-26"
category:
  - "Release notes"
components:
  - "Trackers"
---
We’re happy to announce a [new release](https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/4.6.6) for the JavaScript, Browser, and React Native trackers.

This is a small patch release addressing reported cases of invalid events, data consistency, and an issue with using the [HTML5 Media Tracking plugin](/docs/sources/web-trackers/tracking-events/media/html5/) from our Google Tag Manager Tag Template.

**Bug fixes**

* **Browser/JavaScript trackers**

  * Round the `browser_context.hardwareConcurrency` property, so it is always an integer to match the schema and avoid some invalid events
  * Do not produce a value for dimensions (screen, viewport, document) when a value is non-numeric, which may cause invalid events

* **React Native tracker**
  * Make the values automatically collected in the `mobile_context` more consistent with the values in the v2 tracker

* **Plugins**

  * `browser-plugin-media-tracking`: Allow selecting media elements via CSS selectors rather than just IDs
  * `browser-plugin-media-tracking`: Prevent a case where the media entity may not populate `currentSrc` even when it has a `src`
  * `browser-plugin-media-tracking`: Update README to match current API

* **General**
  * Fix the [API reference documentation](https://snowplow.github.io/snowplow-javascript-tracker/) to correctly generate and update for all SDKs
