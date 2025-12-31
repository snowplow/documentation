---
title: "Learn how to set up the Unified Digital dbt package"
sidebar_label: "Introduction"
position: 1
description: "Learn how to set up the Snowplow Unified Digital dbt package for web and mobile analytics. Covers prerequisites for implementing unified cross-platform tracking with DBT transformations."
keywords: ["unified digital dbt package", "cross-platform web mobile analytics"]
---

This tutorial walks you through the process of setting up our Unified Digital dbt package.

## Prerequisites

- [DBT](https://github.com/dbt-labs/dbt) installed
- Connection to a warehouse
- For web:
  - web events dataset being available in your database
  - [Snowplow Javascript tracker](/docs/sources/web-trackers/) version 2 or later implemented.
  - Web Page context [enabled](/docs/sources/web-trackers/tracker-setup/initialization-options/) (enabled by default in version 3+).
  - [Page view events](/docs/sources/web-trackers/tracking-events/#page-views) implemented.
- For mobile:
  - Mobile events dataset being available in your database
  - Snowplow Android, iOS [mobile tracker](/docs/sources/mobile-trackers/) version 1.1.0 (or later) or [React Native tracker](/docs/sources/react-native-tracker/) implemented
  - Mobile session context enabled
  - Screen view events enabled and tracked
