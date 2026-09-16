---
title: "Snowplow Flutter tracker 0.11.0"
description: "The Flutter tracker now supports tracking deep links and push notifications, so apps can attribute sessions to the campaigns and messages that opened them."
date: "2026-07-24"
category:
  - "Release notes"
components:
  - "Trackers"
---
The Flutter tracker now supports tracking deep links and push notifications, so apps can attribute sessions to the campaigns and messages that opened them. This release also brings a substantial build modernisation on both platforms: the Android plugin moves to the Kotlin Gradle DSL with an up-to-date toolchain, and the iOS plugin gains Swift Package Manager support alongside CocoaPods. Both underlying native trackers have been updated to their latest versions.

**Note:** this release raises the minimum iOS deployment target to 13.0.

**New features**

* Deep link and push notification event tracking

* Swift Package Manager support for the iOS plugin (CocoaPods still supported)

**Improvements**

* Android plugin and example app migrated to the Kotlin Gradle DSL, with the toolchain aligned to the native tracker (Android Gradle Plugin 8.13, Kotlin 2.2, Gradle 8.13, `compileSdk` 35, Java/Kotlin JVM target 17)

* iOS example app switched from CocoaPods to Swift Package Manager

* Native trackers updated to Android tracker 6.4 and iOS tracker 6.2.5

**Breaking changes**

* Minimum iOS deployment target raised to 13.0 (was 11.0)
