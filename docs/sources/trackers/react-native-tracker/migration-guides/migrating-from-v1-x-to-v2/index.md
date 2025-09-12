---
title: "Migrating from v1 to v2"
description: "Migration guide for upgrading React Native tracker from version 1.x to 2 with behavioral tracking improvements."
schema: "TechArticle"
keywords: ["React Native Migration", "V1 to V2", "Version Migration", "Upgrade Guide", "Migration Guide", "Breaking Changes"]
date: "2021-08-09"
sidebar_position: 100
---

Version 2 of the React Native tracker underwent a large rewrite of the internal code, both on the side of the React Native project as well as in the underlying iOS and Android trackers (which have been upgraded to version 5). However, the public APIs and tracker behavior have remained largely unchanged except for a few things discussed on this page.

## Installation on iOS

In addition to adding the tracker as a dependency in your `package.json`, you will also need to add the FMDB dependency to you `ios/Podfile` (unless using Expo Go) with `modular_headers` enabled. Add this line to the end of the file:

```rb
pod 'FMDB', :modular_headers => true
```

## Supported iOS platforms

The supported platforms have changed on iOS:

* Minimum iOS deployment target changed from 9.0 to 11.0.
* On macOS, from 10.10 to 10.13.
* On tvOS, from 9.0 to 12.0.
* On watchOS, from 2.0 to 6.0.

## IDFA tracking on iOS

The approach to track the IDFA identifier has changed in the underlying iOS tracker version 5. This means that you will need to take a different approach to set it up. The new approach [is described in the documentation here](/docs/sources/trackers/react-native-tracker/tracking-events/platform-and-application-context/index.md).

## Automatic screen view tracking default

The automatic screen view tracking configuration (set by `TrackerConfiguration.screenViewAutotracking`) has been changed to disabled by default. In case you rely on the default value and want to keep using the feature, please set it manually when creating a new tracker.

The feature was disabled because it does not track screen views for React Native screens but for UIKit and Android Activity screens which is not what users expected in most cases.
