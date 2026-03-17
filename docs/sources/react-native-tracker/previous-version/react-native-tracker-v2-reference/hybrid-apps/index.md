---
title: "Hybrid Apps"
sidebar_label: "Hybrid Apps"
date: "2022-08-30"
sidebar_position: 70
description: "Track events from WebViews in React Native tracker v2 hybrid apps using WebView tracker for event forwarding and shared sessions."
keywords: ["react native tracker v2 hybrid apps", "webview tracking", "event forwarding"]
---

:::info

This feature is available since v1.3.

:::

Hybrid apps are mobile apps that in addition to a React Native interface, provide part of the UI through an embedded Web view. Snowplow events are tracked from both the React Native code as well as the Web view. Our goal is to have both events tracked from both places to share the same session and appear as tracked with the same tracker.

## WebView Tracker

This use case is supported by implementing the [Snowplow WebView tracker](../../../../webview-tracker/index.md) in the Web view in your app. The WebView tracker is able to pass events to the React Native tracker which sends them to the collector.

## Mobile & Hybrid Accelerator

Please refer to the [Snowplow Hybrid Apps Tracking accelerator](https://docs.snowplow.io/accelerators/hybrid) for a step-by-step guide how to set up tracking in hybrid apps.
