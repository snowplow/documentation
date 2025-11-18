---
title: "Platform & Application Context Tracking for React Native Tracker"
sidebar_position: 10
---

# Platform and application data tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Platform and application data tracking features capture information about the device and the app.

They can be configured through `TrackerConfiguration` like in the example below:

```typescript
const tracker = await newTracker({
  namespace: 'appTracker',
  endpoint: COLLECTOR_URL,

  // application information
  appId: 'my-app-id',
  appVersion: '1.0.0',
  appBuild: '1',

  platformContext: true, // enabled by default
});
```

## Application information

### App ID

Set the application ID using the `appId` field of the tracker configuration object.
This will be attached to every event the tracker fires.
The information will be available in the `app_id` column of the events table.

### App version and build number

To track the application version, you can pass it using the `appVersion` configuration option.
The version of can be a semver-like structure (e.g 1.1.0) or a Git commit SHA hash.

Additionally, you can track the build name of the application (e.g., `s9f2k2d` or `1.1.0 beta`) using the `build` option.

Depending on whether `build` property is configured, the information will be tracked in a context entity using either of these schemas:

1. If only `appVersion` is configured, [the Web `application` entity is used](/docs/events/ootb-data/app-information/index.md#application-context-entity-on-web-apps).
2. If both `appVersion` and `build` are configured, [the mobile `application` entity is used](/docs/events/ootb-data/app-information/index.md#application-context-entity-on-mobile-apps).

## Platform context

The [platform context entity](/docs/events/ootb-data/device-and-browser/index.md#mobile-context) contains information about the user's device.

By default only the following properties are tracked automatically:

| Property | Type | Description | Required in schema |
| --- | --- | --- | --- |
| `osType` | String | Type of the operating system (e.g., "ios", "tvos", "watchos", "osx", "android") | Yes |
| `osVersion` | String | Version of the mobile operating system. | Yes |
| `deviceManufacturer` | String | Device vendor. | Yes |
| `deviceModel` | String | Model of the device. | Yes |
| `language` | String | System language currently used on the device (ISO 639) | No |
| `resolution` | String | Screen resolution in pixels. Arrives in the form of WIDTHxHEIGHT (e.g., 1200x900). Doesn't change when device orientation changes | No |
| `scale` | Number | Scale factor used to convert logical coordinates to device coordinates of the screen (uses UIScreen.scale on iOS and DisplayMetrics.density on Android) | No |

The platform context entity can be used to track more information.
However, you will need to pass it manually using callback functions.

```ts
const tracker = await newTracker({
  namespace: "sp1",
  endpoint: "http://example.com",
  // provide custom getters for the platform context properties
  platformContextRetriever: {
    getAppleIdfv: async () => "apple-idfv",
    getAppSetId: async () => "app-set-id",
    getAvailableStorage: async () => 1000,
  }
});
```

The following table lists all the extra properties that can be set:

| Property | Type | Description | Required in schema |
| --- | --- | --- | --- |
| `carrier` | String | Carrier of the SIM inserted in the device. | No |
| `networkType` | String | One of: "mobile", "wifi", "offline" | No |
| `networkTechnology` | String | Radio access technology that the device is using. | No |
| `openIdfa` | String | Deprecated property. | No |
| `appleIdfa` | String | Advertising identifier on iOS. | No |
| `appleIdfv` | String | UUID [identifier for vendors](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor) on iOS. | No |
| `androidIdfa` | String | Advertising identifier on Android. | No |
| `physicalMemory` | Integer | Total physical system memory in bytes | No |
| `systemAvailableMemory` | Integer | Available memory on the system in bytes (Android only) | No |
| `appAvailableMemory` | Integer | Amount of memory in bytes available to the current app (iOS only) | No |
| `batteryLevel` | Integer | Remaining battery level as an integer percentage of total battery capacity | No |
| `batteryState` | String | Battery state for the device. One of: "unplugged", "charging", "full". | No |
| `lowPowerMode` | Boolean | A Boolean indicating whether Low Power Mode is enabled (iOS only) | No |
| `availableStorage` | Integer | Bytes of storage remaining | No |
| `totalStorage` | Integer | Total size of storage in bytes | No |
| `isPortrait` | Boolean | A Boolean indicating whether the device orientation is portrait (either upright or upside down) | No |
| `appSetId` | String | Android vendor ID scoped to the set of apps published under the same Google Play developer account (see https://developer.android.com/training/articles/app-set-id) | No |
| `appSetIdScope` | String (either "app" or "developer") | Scope of the `appSetId`. Can be scoped to the app or to a developer account on an app store (all apps from the same developer on the same device will have the same ID) | No |
