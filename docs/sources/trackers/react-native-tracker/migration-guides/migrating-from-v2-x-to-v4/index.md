---
title: "Migrating from v2 to v4"
description: "Migration guide for upgrading React Native tracker from version 2.x to 4 with enhanced features."
schema: "TechArticle"
keywords: ["React Native Migration", "V2 to V4", "Version Migration", "Upgrade Guide", "Migration Guide", "Breaking Changes"]
sidebar_position: 90
---

Version 4 of the React Native tracker brings a significant rearchitecture of the tracker, which is now JavaScript-only instead of building on top of the iOS and Android native trackers.
This brings support for new platforms (Web, Expo Go) and new features (JS tracker plugins, improved global context), but also brings some limitations.

### Initialize tracker instance using `newTracker` instead of `createTracker`

The method for creating a new tracker instance has been changed to `newTracker`.
This is not just a rename, but a change in the structure of its parameters, which are now more in line with the rest of our JavaScript trackers.

You can review the [documentation page](/docs/sources/trackers/react-native-tracker/index.md) for the current set of configuration options.

The parameters are now provided in a flattened object instead of separated under categories.
Some have also been renamed:

- `method` to `eventMethod`
- `requestHeaders` to `customHeaders`
- `base64Encoding` to `encodeBase64`
- `serverAnonymisation` to `serverAnonymization`
- `customPostPath` to `postPath`

The `logLevel` parameter has been removed. Also global context configuration has been moved outside of the configuration, see [the global context docs page](/docs/sources/trackers/react-native-tracker/custom-tracking-using-schemas/global-context/index.md).

### User anonymization not available yet

The `userAnonymisation` configuration option has been removed. We will reintroduce it in the upcoming versions of the React Native tracker.

The session context entity can still be removed using the `sessionContext` option and one can disable the user identifiers in the platform context and subject properties individually. Read more about the options [in the documentation here](/docs/sources/trackers/react-native-tracker/anonymous-tracking/index.md).

### GDPR configuration not available

We have deprecated and removed the GPDR configuration. As a more up-to-date replacement, one can make use of the [consent plugins available for the JavaScript tracker](/docs/sources/trackers/web-trackers/tracking-events/consent-gdpr/index.md).

### Application context is not tracked automatically

The application context entity with the current app version and build number is not tracked automatically anymore, but the version information can be provided in the `newTracker` call in which case the tracker will track this entity with events.
Read more [in the documentation here](/docs/sources/trackers/react-native-tracker/tracking-events/platform-and-application-context/index.md).

### Removed geolocation context entity

The geolocation context entity is no longer available to be tracked by the tracker.
You may track it manually using global context and [the geolocation schema](/docs/events/ootb-data/geolocation/index.md#geolocation-context-entity-tracked-in-apps).

### Removed exception and diagnostic autotracking

The exception and diagnostic autotracking features have been deprecated and removed.

### Removed screen view autotracking for UIKit and Android Activities

Screen view autotracking for iOS UIKit and Android Activity views has been deprecated and removed as it is not relevant in most React Native apps.
See the [documentation for screen view tracking options](/docs/sources/trackers/react-native-tracker/tracking-events/screen-tracking/index.md).

### Less autotracked information in the platform context entity

There are fewer automatically tracked properties in the platform context entity, but it's possible to provide values for them manually.
Refer to [the documentation to learn more](/docs/sources/trackers/react-native-tracker/tracking-events/platform-and-application-context/index.md).

### Not possible to access from native code

Since the tracker is now purely implemented in JavaScript, it is no longer possible to access it from mobile native iOS or Android code.

### Base64 encoding disabled by default

In v2, the tracker defaulted to base64-encoding payloads for Self-Describing events and Entities.
In v4, the default is now to not do this.
In most cases, this behavior is better for performance and has no other impacts.

In some pipeline architectures, the Collector is protected by a Web Application Firewall; if your custom data contains content that appears risky to the WAF (e.g. HTML content) the removal of base64 encoding may mean those events now get blocked by the firewall.

You can return to the old behavior by specifying `encodeBase64: true` when calling `newTracker` as described above.
