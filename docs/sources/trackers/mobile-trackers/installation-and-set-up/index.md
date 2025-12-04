---
title: "Installing and initializing the native mobile trackers"
sidebar_label: "Installation and initialization"
date: "2022-08-30"
sidebar_position: 0
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Badges badgeType="Actively Maintained"></Badges>
```

<Tabs groupId="platform" queryString>
<TabItem value="ios" label="iOS" default>


The Snowplow iOS Tracker SDK supports iOS 11.0+, macOS 10.13+, tvOS 12.0+, watchOS 6.0+, and visionOS 1.0+.
It can be used both in Swift as well as in Objective-C code.

## Installing

The iOS Tracker SDK can be installed using various dependency managers.

**Swift Package Manager** (Recommended)

To install Snowplow Tracker with SPM:

1. In Xcode, select File > Swift Packages > Add Package Dependency.
2. Add the url where to download the library: [https://github.com/snowplow/snowplow-ios-tracker](https://github.com/snowplow/snowplow-ios-tracker)

**Cocoapods**

To install Snowplow Tracker with Cocoapods:

1. Make sure that Cocoapods is installed on your system and correctly configured for your app.

2. Add the iOS Tracker SDK among the dependencies of your `Podfile`:

   ```ruby
   pod 'SnowplowTracker', '~> 6.0'
   ```

3. Run the command `pod install` to add the tracker to your app project.

:::note
Support for installing the tracker using Carthage was dropped in version 5 of the tracker.
:::

## Setting up

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker:

1. In your application delegate `AppDelegate.swift` add `import SnowplowTracker`.

2. In the `application(_:didFinishLaunchingWithOptions:)` method, set up the SDK as follows:

   ```swift
   let tracker = Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com")
   ```

   The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

3. It creates a tracker instance which can be used to track events like this:

   ```swift
   let event = ScreenView(name: "screen_name")
   tracker.track(event)
   ```

   If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker` :

   ```swift
   Snowplow.defaultTracker()?.track(event)
   ```

You can override the default configuration with a fine grained configuration when you create the tracker. See the [API docs](https://snowplow.github.io/snowplow-ios-tracker/documentation/snowplowtracker/trackerconfiguration/) for the `Configuration` classes to see all the options and defaults.

```swift
Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com") {
  TrackerConfiguration()
      .base64Encoding(false)
      .sessionContext(true)
      .platformContext(true)
      .lifecycleAutotracking(true)
      .screenViewAutotracking(true)
      .screenContext(true)
      .applicationContext(true)
      .exceptionAutotracking(true)
      .installAutotracking(true)
      .userAnonymisation(false)
      .immersiveSpaceContext(true)
      .logLevel(.off)
  SessionConfiguration(
      foregroundTimeout: Measurement(value: 30, unit: .minutes),
      backgroundTimeout: Measurement(value: 30, unit: .minutes)
  )
      .continueSessionOnRestart(false)
}
```

The `createTracker` method allows the creation of multiple trackers in the same app. The `namespace` field lets you distinguish events sent by a specific tracker instance. It is mandatory even when the app uses just a single tracker instance like in the example above.

:::note
The trackers created with the above method are configured "locally" only. To create a tracker where the configuration can be updated through downloaded files, read [this page](/docs/sources/trackers/mobile-trackers/remote-configuration/index.md) about remote configuration.
:::

The [Examples Github repository](https://github.com/snowplow-industry-solutions/snowplow-ios-tracker-examples) includes demo apps for Swift and Objective-C covering the most popular dependencies managers. They are provided as simple reference apps to help you set up the tracker.


</TabItem>
<TabItem value="android" label="Android (Kotlin)">


The Android Tracker SDK supports Android 5 (**API level 21+**).

## Installing

The Android Tracker SDK can be installed using Gradle.

**Gradle**

Add into your `build.gradle` file:

```gradle
dependencies {
  ...
  implementation 'com.snowplowanalytics:snowplow-android-tracker:6.+'
  ...
}
```
No other dependencies are required to track events. However, some **optional** dependencies can be added:
- `InstallReferrer` to enable the referrer context entity of the [`ApplicationInstall` event](/docs/sources/trackers/mobile-trackers/tracking-events/installation-tracking/index.md).
-  `Play Services` dependencies for [tracking the app set ID and AAID](/docs/sources/trackers/mobile-trackers/tracking-events/platform-and-application-context/index.md).

## Setting up

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker:

1. In your `Application` subclass, set up the SDK as follows:

    ```kotlin
    val tracker = Snowplow.createTracker(
        applicationContext, // Android context (LocalContext.current in Compose apps)
        "appTracker", // namespace
        "https://snowplow-collector-url.com" // Event collector URL
    )
    ```
    The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

2. It creates a tracker instance which can be used to track events like this:

   ```kotlin
   val event = ScreenView("screen_name")
   tracker.track(event)
   ```

If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker` :

```kotlin
Snowplow.defaultTracker?.track(event)
```

You can override the default configuration with a fine grained configuration when you create the tracker. See the [Android API docs](https://snowplow.github.io/snowplow-android-tracker/snowplow-android-tracker/com.snowplowanalytics.snowplow.configuration/index.html) for the `Configuration` classes to see all the options and defaults.

```kotlin
val networkConfig = NetworkConfiguration(
    "https://snowplow-collector-url.com",
    HttpMethod.POST
)
val trackerConfig = TrackerConfiguration("appId")
    .base64encoding(false)
    .sessionContext(true)
    .platformContext(true)
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true)
    .screenContext(true)
    .applicationContext(true)
    .exceptionAutotracking(true)
    .installAutotracking(true)
    .userAnonymisation(false)
    .logLevel(LogLevel.OFF)
val sessionConfig = SessionConfiguration(
    TimeMeasure(30, TimeUnit.SECONDS),
    TimeMeasure(30, TimeUnit.SECONDS)
)
    .continueSessionOnRestart(false)
createTracker(
    applicationContext,
    "appTracker",
    networkConfig,
    trackerConfig,
    sessionConfig
)
```

:::note
The trackers created with the above method are configured "locally" only. To create a tracker where the configuration can be updated through downloaded files, read [this page](/docs/sources/trackers/mobile-trackers/remote-configuration/index.md) about remote configuration.
:::

The [Android tracker Github repository](https://github.com/snowplow/snowplow-android-tracker) includes demo apps in Java, Kotlin, and Kotlin with Jetpack Compose. They are provided as simple reference apps to help you set up the tracker.

## Using the tracker with R8 optimization

Depending on your app configuration, you may need to add ProGuard rules to prevent the R8 compiler removing code needed for tracker function. Fetching certain [platform context](/docs/sources/trackers/mobile-trackers/tracking-events/platform-and-application-context/index.md) properties - AAID and app set ID - uses reflection. To include the necessary classes, add the following rules to the app's `proguard-rules.pro` file.

```
# Reflection for the appSetId
-keep class com.google.android.gms.appset.AppSet { *; }
-keep class com.google.android.gms.appset.AppSetIdInfo { *; }
-keep class com.google.android.gms.internal.appset.zzr { *; }
-keep class com.google.android.gms.tasks.Tasks { *; }

# Reflection for the AAID (AndroidIdfa)
-keep class com.google.android.gms.ads.identifier.** { *; }
```


</TabItem>
<TabItem value="android-java" label="Android (Java)">


The Android Tracker SDK supports Android 5 (**API level 21+**).

## Installing

The Android Tracker SDK can be installed using Gradle.

**Gradle**

Add into your `build.gradle` file:

```gradle
dependencies {
  ...
  implementation 'com.snowplowanalytics:snowplow-android-tracker:6.+'
  ...
}
```
No other dependencies are required to track events. However, some **optional** dependencies can be added:
- `InstallReferrer` to enable the referrer context entity of the [`ApplicationInstall` event](/docs/sources/trackers/mobile-trackers/tracking-events/installation-tracking/index.md).
-  `Play Services` dependencies for [tracking the app set ID and AAID](/docs/sources/trackers/mobile-trackers/tracking-events/platform-and-application-context/index.md).

## Setting up

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker:

1. In your `Application` subclass, set up the SDK as follows:

    ```java
    TrackerController tracker = Snowplow.createTracker(
          getApplicationContext(), // Android context
          "appTracker", // namespace
          "https://snowplow-collector-url.com" // Event collector URL
    );
    ```
    The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

2. It creates a tracker instance which can be used to track events like this:

   ```java
   Event event = new ScreenView("screen_name");
   tracker.track(event);
   ```

If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker` :

```java
Snowplow.getDefaultTracker().track(event);
```

You can override the default configuration with a fine grained configuration when you create the tracker. See the [Android API docs](https://snowplow.github.io/snowplow-android-tracker/snowplow-android-tracker/com.snowplowanalytics.snowplow.configuration/index.html) for the `Configuration` classes to see all the options and defaults.

```java
NetworkConfiguration networkConfig = new NetworkConfiguration(
    "https://snowplow-collector-url.com",
    HttpMethod.POST
);
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .base64encoding(false)
    .sessionContext(true)
    .platformContext(true)
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true)
    .screenContext(true)
    .applicationContext(true)
    .exceptionAutotracking(true)
    .installAutotracking(true)
    .userAnonymisation(false)
    .logLevel(LogLevel.OFF);
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(30, TimeUnit.SECONDS),
    new TimeMeasure(30, TimeUnit.SECONDS)
)
    .continueSessionOnRestart(false);
Snowplow.createTracker(
    getApplicationContext(),
    "appTracker",
    networkConfig,
    trackerConfig,
    sessionConfig
);
```

:::note
The trackers created with the above method are configured "locally" only. To create a tracker where the configuration can be updated through downloaded files, read [this page](/docs/sources/trackers/mobile-trackers/remote-configuration/index.md) about remote configuration.
:::

The [Android tracker Github repository](https://github.com/snowplow/snowplow-android-tracker) includes demo apps in Java, Kotlin, and Kotlin with Jetpack Compose. They are provided as simple reference apps to help you set up the tracker.

## Using the tracker with R8 optimization

Depending on your app configuration, you may need to add ProGuard rules to prevent the R8 compiler removing code needed for tracker function. Fetching certain [platform context](/docs/sources/trackers/mobile-trackers/tracking-events/platform-and-application-context/index.md) properties - AAID and app set ID - uses reflection. To include the necessary classes, add the following rules to the app's `proguard-rules.pro` file.

```
# Reflection for the appSetId
-keep class com.google.android.gms.appset.AppSet { *; }
-keep class com.google.android.gms.appset.AppSetIdInfo { *; }
-keep class com.google.android.gms.internal.appset.zzr { *; }
-keep class com.google.android.gms.tasks.Tasks { *; }

# Reflection for the AAID (AndroidIdfa)
-keep class com.google.android.gms.ads.identifier.** { *; }
```

</TabItem>
</Tabs>
