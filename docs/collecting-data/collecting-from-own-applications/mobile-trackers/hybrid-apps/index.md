---
title: "Hybrid Apps"
date: "2022-08-30"
sidebar_position: 70
---

# Hybrid Apps

:::info

This feature is available since v4.

:::

Hybrid apps are mobile apps that in addition to a native interface, provide part of the UI through an embedded Web view. Snowplow events are tracked from both the native code (e.g., written in Swift or Kotlin) as well as the Web view (in JavaScript). Our goal is to have both events tracked from the native code as well as the Web view share the same session and appear as tracked with the same tracker.

This use case is supported by implementing the [Snowplow WebView tracker](../../webview-tracker/index.md) in the Web view in your app. The WebView tracker is able to pass events to the iOS/Android tracker which sends them to the collector.

Please refer to the [Snowplow Hybrid Apps Tracking tutorial](https://docs.snowplow.io/accelerators/hybrid) for a step-by-step guide how to set up tracking in hybrid apps.
