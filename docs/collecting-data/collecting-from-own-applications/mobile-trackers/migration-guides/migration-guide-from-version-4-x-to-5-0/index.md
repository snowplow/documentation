---
title: "From version 4.x to 5.0"
date: "2022-08-30"
sidebar_position: -4
---

# Migration guide from version 4.x to 5.0

Although the trackers underwent a huge internal rewrite (from Objective-C to Swift and from Java to Kotlin), the API was kept without breaking changes.

The supported platforms have changed:

* Minimum SDK version on the Android tracker changed from version 21 to version 24.
* On the iOS tracker:
  * Minimum iOS deployment target changed from 9.0 to 11.0.
  * On macOS, from 10.10 to 10.13.
  * On tvOS, from 9.0 to 12.0.
  * On watchOS, from 2.0 to 6.0.

The `contexts` property in events used to assign custom context entities to events has been renamed to `entities`. The previous naming is still available but it is deprecated.
