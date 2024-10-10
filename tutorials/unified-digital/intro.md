---
id: intro
title: Introduction
position: 1
---

This tutorial walks you through the process of setting up our Unified Digital DBT package.

### Prerequisites

- DBT installed
- Connection to a warehouse
- for web:
  - web events dataset being available in your database
  - [Snowplow Javascript tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/) version 2 or later implemented.
  - Web Page context [enabled](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/#webpage-context) (enabled by default in [v3+](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/#webpage-context)).
  - [Page view events](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#page-views) implemented.
- for mobile:
  - mobile events dataset being available in your database
  - Snowplow [Android](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/), [iOS](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/) mobile tracker version 1.1.0 (or later) or [React Native tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/react-native-tracker/) implemented
  - Mobile session context enabled ([ios](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/#session-context) or [android](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/#session-tracking)).
  - Screen view events enabled ([ios](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/#tracking-features) or [android](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/#tracking-features)).
