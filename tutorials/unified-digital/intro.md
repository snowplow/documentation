---
title: "Learn how to set up the Unified Digital dbt package"
sidebar_label: "Introduction"
position: 1
---

This tutorial walks you through the process of setting up our Unified Digital dbt package.

## Prerequisites

- [DBT](https://github.com/dbt-labs/dbt) installed
- Connection to a warehouse
- for web:
  - web events dataset being available in your database
  - [Snowplow Javascript tracker](https://docs.snowplow.io/docs/sources/trackers/javascript-trackers/) version 2 or later implemented.
  - Web Page context [enabled](https://docs.snowplow.io/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/) (enabled by default in [v3+](https://docs.snowplow.io/docs/sources/trackers/web-trackers/tracker-setup/initialization-options/)).
  - [Page view events](https://docs.snowplow.io/docs/sources/trackers/web-trackers/tracking-events/#page-views) implemented.
- for mobile:
  - mobile events dataset being available in your database
  - Snowplow [Android](https://docs.snowplow.io/docs/sources/trackers/mobile-trackers/previous-versions/android-tracker/), [iOS](https://docs.snowplow.io/docs/sources/trackers/mobile-trackers/previous-versions/objective-c-tracker/) mobile tracker version 1.1.0 (or later) or [React Native tracker](https://docs.snowplow.io/docs/sources/trackers/react-native-tracker/) implemented
  - Mobile session context enabled ([ios](https://docs.snowplow.io/docs/sources/trackers/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/#session-context) or [android](https://docs.snowplow.io/docs/sources/trackers/mobile-trackers/previous-versions/android-tracker/android-1-7-0/#session-tracking)).
  - Screen view events enabled ([ios](https://docs.snowplow.io/docs/sources/trackers/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/#tracking-features) or [android](https://docs.snowplow.io/docs/sources/trackers/mobile-trackers/previous-versions/android-tracker/android-1-7-0/#tracking-features)).
