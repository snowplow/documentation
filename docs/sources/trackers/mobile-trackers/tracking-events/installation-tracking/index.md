---
title: "Tracking application installs with the native mobile trackers"
sidebar_label: "Installs"
sidebar_position: 60
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Installation tracking tracks an install event which occurs the first time an application is opened. The tracker will record when it's first been installed, so deleting and reinstalling an app will trigger another install event.

If installation autotracking is not enabled, the tracker will still keep track of when the app was first installed, so that when enabled, the tracker will send the recorded install event with a timestamp reflecting when it was first installed.

The installation autotracking is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .installAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .installAutotracking(true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .installAutotracking(true);
```

  </TabItem>
</Tabs>

## Android-only: Tracking referrer information from the Google Play Referrer library

The Google Play Referrer library is a tool provided by Google for Android developers to track and capture referral information when a user installs or updates an app from the Google Play Store.
It allows developers to gather valuable insights about the sources that drive app installations, such as ad campaigns, referral links, or marketing efforts.

When an app is installed or updated, the Google Play Referrer library retrieves the referral information from the Google Play Store and provides it to the app.
This information includes the referrer URL, which can contain parameters or tracking codes that identify the specific referral source.

The Android tracker can make use of the library to retrieve the referral information.
It attaches the information in an entity attached to the install event.
The entity uses the `iglu:com.android.installreferrer.api/referrer_details/jsonschema/1-0-0` schema with the following properties:

| Property                 | Type     | Description                                                                                        |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------- |
| `installReferrer`        | String   | The referrer URL of the installed package                                                          |
| `referrerClickTimestamp` | Datetime | The timestamp when referrer click happens                                                          |
| `installBeginTimestamp`  | Datetime | The timestamp when installation begins                                                             |
| `googlePlayInstantParam` | Boolean  | Boolean indicating if the user has interacted with the app's instant experience in the past 7 days |

To enable tracking the entity, you will need to have `installAutotracking` enabled (it's on by default) and add the following line to the dependencies section of the `build.gradle` file in your app:

```gradle
dependencies {
    ...
    implementation "com.android.installreferrer:installreferrer:2.2"
}
```
