---
title: "Platform and Application Context Tracking for Mobile Trackers"
sidebar_position: 10
---

# Platform and application data tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Platform and application data tracking features capture information about the device and the app.

They are enabled by default. But the setting can be changed through `TrackerConfiguration` like in the example below:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .platformContext(true)
    .applicationContext(true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .platformContext(true)
    .applicationContext(true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .platformContext(true)
    .applicationContext(true);
```

  </TabItem>
</Tabs>

## Application context

The [application context entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.mobile/application/jsonschema/1-0-0) contains two properties:

| Property | Type | Description | Required in schema |
| --- | --- | --- | --- |
| `version` | String | Version number of the application e.g 1.1.0 | Yes |
| `build` | String | Build name of the application e.g s9f2k2d or 1.1.0 beta | Yes |

## Platform (mobile) context

The [platform context entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-3) contains the following properties:

| Property | Type | Android | iOS | Description | Required in schema |
| --- | --- | --- | --- | --- | --- |
| `osType` | String | ✅ | ✅ | Type of the operating system (e.g., "ios", "tvos", "watchos", "osx", "android") | Yes |
| `osVersion` | String | ✅ | ✅ | Version of the mobile operating system | Yes |
| `deviceManufacturer` | String | ✅ | ✅ | Device vendor | Yes |
| `deviceModel` | String | ✅ | ✅ | Model of the device | Yes |
| `carrier` | String | ✅ | ✅ | Carrier of the SIM inserted in the device | No |
| `networkType` | String | ✅ | ✅ | One of: "mobile", "wifi", "offline" | No |
| `networkTechnology` | String | ✅ | ✅ | Radio access technology that the device is using | No |
| `openIdfa` | String | ❌ | ❌ | Deprecated property | No |
| `appleIdfa` | String | ❌ | ✅ | Advertising identifier on iOS | No |
| `appleIdfv` | String | ❌ | ✅ | UUID [identifier for vendors](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor) on iOS | No |
| `androidIdfa` | String | ✅ | ❌ | Advertising identifier on Android | No |
| `physicalMemory` | Integer | ✅ | ✅ | Total physical system memory in bytes | No |
| `systemAvailableMemory` | Integer | ✅ | ❌ | Available memory on the system in bytes | No |
| `appAvailableMemory` | Integer | ❌ | ❌ | Amount of memory in bytes available to the current app | No |
| `batteryLevel` | Integer | ✅ | ✅ | Remaining battery level as an integer percentage of total battery capacity | No |
| `batteryState` | String | ✅ | ✅ | Battery state for the device. One of: "unplugged", "charging", "full" | No |
| `lowPowerMode` | Boolean | ❌ | ✅ | A Boolean indicating whether Low Power Mode is enabled | No |
| `availableStorage` | Integer | ✅ | ❌ | Bytes of storage remaining | No |
| `totalStorage` | Integer | ✅ | ❌ | Total size of storage in bytes | No |
| `isPortrait` | Boolean | ✅ | ✅ | A Boolean indicating whether the device orientation is portrait (either upright or upside down) | No |
| `resolution` | String | ✅ | ✅ | Screen resolution in pixels. Arrives in the form of WIDTHxHEIGHT (e.g., 1200x900). Doesn't change when device orientation changes. See note below. | No |
| `scale` | Number | ✅ | ✅ | Scale factor used to convert logical coordinates to device coordinates of the screen (uses UIScreen.scale on iOS and DisplayMetrics.density on Android) | No |
| `language` | String | ✅ | ✅ | System language currently used on the device (ISO 639) | No |
| `appSetId` | String | ✅ | ❌ | Android vendor ID scoped to the set of apps published under the same Google Play developer account (see https://developer.android.com/training/articles/app-set-id) | No |
| `appSetIdScope` | String (either "app" or "developer") | ✅ | ❌ | Scope of the `appSetId`. Can be scoped to the app or to a developer account on an app store (all apps from the same developer on the same device will have the same ID) | No |

:::note Android screen resolution
The screen resolution for the platform entity is obtained from the Android context resources. The height value will likely be lower than that reported in the canonical `dvce_screenheight` [event property](/docs/events/going-deeper/event-parameters/index.md), which is fetched from `WindowManager`, an older API that still includes the menu bar.

To standardize the screen resolution between event and entity properties, provide a `SubjectConfiguration` with `useContextResourcesScreenResolution(true)` flag at tracker initialization. This flag is false by default, and available from Android tracker v6.0.3 onwards. Read about configuring `Subject` properties [here](/docs/sources/trackers/mobile-trackers/client-side-properties/index.md).
:::


### Choosing which properties to track

You can choose which properties should be added to the platform context entity.
By default, all available properties are tracked in the entity.
In case you don't want certain properties to be tracked, you can choose the ones to track using `TrackerConfiguration.platformContextEntities`:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .platformContextProperties([.batteryLevel, .isPortrait, .language])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
     .platformContextProperties(listOf(PlatformContextProperty.BATTERY_LEVEL, PlatformContextProperty.IS_PORTRAIT))
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .platformContextProperties(Collections.singletonList(PlatformContextProperty.BATTERY_LEVEL, PlatformContextProperty.IS_PORTRAIT));
```

  </TabItem>
</Tabs>

### Overriding platform context properties

In case you want to override the values for certain properties of the platform context (or provide ones that are not tracked by default, such as the `totalStorage` on iOS), you can set the `platformContextRetriever` in `TrackerConfiguration` to provide these values.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .platformContextRetriever(
        PlatformContextRetriever(deviceVendor: { "my-custom-vendor" })
    )
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfiguration = TrackerConfiguration("appId")
    .platformContextRetriever(
        PlatformContextRetriever(deviceVendor = { "my-custom-vendor" })
    )
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
PlatformContextRetriever platformContextRetriever = new PlatformContextRetriever();
platformContextRetriever.setDeviceVendor(() -> "my-custom-vendor");
TrackerConfiguration trackerConfiguration = new TrackerConfiguration("appId")
    .platformContextRetriever(platformContextRetriever);
```

  </TabItem>
</Tabs>

### Identifier for Advertisers (IDFA/AAID)

The IDFA advertising identifiers are only added to the platform context if you fulfill the following requirements.
Otherwise, their values will be NULL.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS">

The Apple advertising identifier is stored in the `appleIdfa` property.

Starting with iOS 14, one has to request user consent through the [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency) framework in order to access the advertising identifier.

1. Add and follow the guidelines of [App Tracking Transparency Framework](https://developer.apple.com/documentation/apptrackingtransparency) in your app.
2. Pass a callback to your `TrackerConfiguration` that retrieves the identifier:

```swift
import AdSupport

let tracker = Snowplow.createTracker(namespace: "ns", network: networkConfig) {
    TrackerConfiguration()
        .advertisingIdentifierRetriever {
            ASIdentifierManager.shared().advertisingIdentifier
        }
}
```

:::note

The simulators can’t generate a proper IDFA, instead they generate a sequence of zeros.
If you want to test IDFA with a real code, please use the physical device.

The user has the ability to limit ad-tracking from the device’s Settings.
If the user enable the limitations the tracker will not be able to track the IDFA.

:::

  </TabItem>
  <TabItem value="android" label="Android">

The AAID (Android Advertising ID) is a unique user-resettable identifier, which uniquely identifies a particular user for advertising use cases, such as ad personalization. The tracker allows retrieval of the AAID, sending it as property `androidIdfa`.

For privacy purposes the user can reset the identifier at any moment.
In that case the tracker will report a new AAID, despite the device and user being the same as before.
Also, the user can "Opt out of Ads Personalisation" from the Android settings menu.
In that case the tracker will report an empty string in place of the AAID.

If you want to track the AAID, you need to add the Google Mobile Ads library to your app.
If it isn’t included, the tracker will not send the AAID with the events.

The Google Mobile Ads can be imported in the `dependencies` section of the `build.gradle` adding:

```gradle
dependencies {
    ...
    implementation 'com.google.android.gms:play-services-ads:22.6.0'
    ...
}
```

The Google Mobile Ads SDK v.17.0.0 introduced some [changes](https://ads-developers.googleblog.com/2018/10/announcing-v1700-of-android-google.html) requiring a tag in the `androidManifest.xml` explained below.

#### Manifest tag for AdMob publishers

AdMob publishers have to add the AdMob app ID in the `AndroidManifest.xml` file:

```xml
<manifest>
    <application>
        <!-- TODO: Replace with your real AdMob app ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-################~##########"/>
    </application>
</manifest>
```

Failure to add this tag will result in the app crashing at app launch with a message starting with "The Google Mobile Ads SDK was initialized incorrectly".

#### Manifest tag for Google Ad Manager publishers

Publishers using Google Ad Manager have to declare the app an "Ad Manager app" in the `AndroidManifest.xml` file:

```xml
<manifest>
    <application>
        <meta-data
            android:name="com.google.android.gms.ads.AD_MANAGER_APP"
            android:value="true"/>
    </application>
</manifest>
```

Failure to add this tag will result in the app crashing at app launch with a message starting with "The Google Mobile Ads SDK was initialized incorrectly".

Read more about [Google Play Data safety here.](../../android-google-play-data-safety/index.md)

  </TabItem>
</Tabs>

### App set ID (Android only)

To identify a set of apps owned by an organization, Google provides the app set ID. Read more about it [here](https://developer.android.com/training/articles/app-set-id).

An extra dependency is required to populate the Android-specific properties `appSetId` and `appSetIdScope` within the platform context entity.

```gradle
dependencies {
    ...
    implementation 'com.google.android.gms:play-services-appset:16.0.2'
    ...
}
```
