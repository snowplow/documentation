---
title: "Snowplow WebView plugin released, plus Android and iOS v6.1"
description: "We’ve released a set of updates to improve the hybrid app tracking experience."
date: "2025-01-21"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
We’ve released a set of updates to improve the hybrid app tracking experience. Hybrid apps are mobile apps that in addition to a native interface, provide part of the UI through an embedded webview.

The new WebView plugin for the JavaScript tracker (v4.3.1) automatically forwards all events to a Snowplow Android (v6.1+), iOS (v6.1+), or React Native (v4.2+) tracker.

Read more about how the plugin works in the [documentation](/docs/sources/web-trackers/tracking-events/webview/).

**JavaScript tracker v4.3.1**
**Enhancements**

* Add WebView plugin (#1402)

---

**Android tracker v6.1.0**
**Enhancements**

* Add new WebView interface (#700)

---

**iOS tracker v6.1.0**
**Enhancements**

* Add new WebView interface (#913)

**Under the hood**

* Fix typos in internal Structured event constants (#911)

---

**WebView tracker v0.3.1**
**Enhancements**

* Integrate with new mobile interfaces (#19)

---

Snowplow **JavaScript tracker** version `4.3.1` is available as [@snowplow/browser-tracker on npm](https://www.npmjs.com/package/@snowplow/browser-tracker), or as the tag based javascript tracker - available on [GitHub Releases](https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/4.3.1), [jsDelivr](https://www.jsdelivr.com/package/npm/@snowplow/javascript-tracker) or [unpkg](https://unpkg.com/browse/@snowplow/javascript-tracker@4.3.1/dist/).
The project’s source code can be found [here](https://github.com/snowplow/snowplow-javascript-tracker).

Snowplow **Android Tracker** version `6.1.0` is available on [Maven Central](https://search.maven.org/artifact/com.snowplowanalytics/snowplow-android-tracker/6.1.0/aar).
The project’s source code can be found [here](https://github.com/snowplow/snowplow-android-tracker).

Snowplow **iOS Tracker** version `6.1.0` is available on [Cocoapods](https://cocoapods.org/pods/SnowplowTracker).
The project’s source code can be found [here](https://github.com/snowplow/snowplow-ios-tracker).

Snowplow **WebView tracker**’s source code can be found [here](https://github.com/snowplow-incubator/snowplow-webview-tracker).
