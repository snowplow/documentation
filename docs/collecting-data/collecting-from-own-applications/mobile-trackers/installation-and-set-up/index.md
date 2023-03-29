---
title: "Installation and set-up"
date: "2022-08-30"
sidebar_position: 0
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

The Snowplow iOS Tracker SDK supports iOS 9.0+, macOS 10.9+, tvOS 9.0+ and watchOS 2.0+

## Installing

The iOS Tracker SDK can be installed using various dependency managers.

**Swift Package Manager** (Recommended)

To install Snowplow Tracker with SPM:

1. In Xcode, select File > Swift Packages > Add Package Dependency.
2. Add the url where to download the library: [https://github.com/snowplow/snowplow-objc-tracker](https://github.com/snowplow/snowplow-objc-tracker)

**Cocoapods**

To install Snowplow Tracker with Cocoapods:

1. Make sure that Cocoapods is installed on your system and correctly configured for your app.

2. Add the iOS Tracker SDK among the dependencies of your `Podfile`:
   
   ```ruby
   pod 'SnowplowTracker', '~> 4.0'
   ```

3. Run the command `pod install` to add the tracker to your app project.

**Carthage**

To install Snowplow Tracker with Carthage:

1. Make sure that Carthage is installed on your system and correctly configured for your app.

2. Add the iOS Tracker SDK among the dependencies of your `Cartfile`:
   
   ```ruby
   github "snowplow/snowplow-objc-tracker" ~> 4.0
   ```

3. Run the command `carthage update` and drag the appropriate frameworks from the `Carthage/build` folder to your app project.


## Setting up

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker:

1. In your application delegate `AppDelegate.swift` add `import SnowplowTracker`.

2. In the `application(_:didFinishLaunchingWithOptions:)` method, set up the SDK as follows:
   
   ```swift
   let tracker = Snowplow.createTracker(namespace: "appTracker", endpoint: COLLECTOR_URL, method: .post)
   ```

3. It creates a tracker instance which can be used to track events like this:
   
   ```swift
   let event = Structured(category: "Category_example", action: "Action_example")
   tracker.track(event)
   ```
   
   If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker` :
   
   ```swift
   Snowplow.defaultTracker().track(event)
   ```

The tracker has a default configuration where some settings are enabled by default:

- session tracking
- screen tracking
- platform contexts (mobile specific context fields)

You can override the default configuration with a fine grained configuration when you create the tracker:

```swift
let networkConfig = NetworkConfiguration(endpoint: COLLECTOR_URL, method: .post)
let trackerConfig = TrackerConfiguration()
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
let sessionConfig = SessionConfiguration(
    foregroundTimeout: Measurement(value: 30, unit: .minutes),
    backgroundTimeout: Measurement(value: 30, unit: .minutes)
)       
Snowplow.createTracker(
    namespace: "appTracker",
    network: networkConfig,
    configurations: [trackerConfig, sessionConfig]
)
```

The `createTracker` method allows the creation of multiple trackers in the same app. The `namespace` field lets you distinguish events sent by a specific tracker instance. It is mandatory even in case the app uses just a single tracker instance like in the example above.

The [Examples Github repository](https://github.com/snowplow-incubator/snowplow-objc-tracker-examples) includes demo apps for Swift and Objective-C covering the most popular dependencies managers. They are provided as simple reference apps to help you set up the tracker.

  </TabItem>
  <TabItem value="android" label="Android">

The Android Tracker SDK supports Android 5 (**API level 21+**)

## Installing

The Android Tracker SDK can be installed using Gradle.

**Gradle**

Add into your `build.gradle` file:

```ruby
dependencies {
  ...
  // Snowplow Android Tracker
  implementation 'com.snowplowanalytics:snowplow-android-tracker:4.+'
  // In case 'lifecycleAutotracking' is enabled
  implementation 'androidx.lifecycle-extensions:2.2.+'
  ...
}
```

## Setting up

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker:

1. In your `Application` subclass, set up the SDK as follows:
   
   ```java
   TrackerController tracker = Snowplow.createTracker(context, "appTracker", COLLECTOR_URL, HttpMethod.POST);
   ```

2. It creates a tracker instance which can be used to track events like this:
   
   ```java
   Event event = new Structured("Category_example", "Action_example");
   tracker.track(event);
   ```
   
   If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker` :
   
   ```java
   Snowplow.getDefaultTracker().track(event);
   ```

The tracker has a default configuration where some settings are enabled by default:

- session tracking
- screen tracking
- platform contexts (mobile specific context fields)

You can override the default configuration with a fine grained configuration when you create the tracker:

```java
NetworkConfiguration networkConfig = new NetworkConfiguration(COLLECTOR_URL, HttpMethod.POST);
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .base64Encoding(false)
    .sessionContext(true)
    .platformContext(true)
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true)
    .screenContext(true)
    .applicationContext(true)
    .exceptionAutotracking(true)
    .installAutotracking(true)
    .userAnonymisation(false);
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(30, TimeUnit.SECONDS),
    new TimeMeasure(30, TimeUnit.SECONDS)
);
Snowplow.createTracker(context,
    "appTracker",
    networkConfig,
    trackerConfig,
    sessionConfig
);
```

  </TabItem>
</Tabs>
