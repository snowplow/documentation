---
title: "Quick Start Guide"
description: "Quick start guide for mobile trackers version 2.x behavioral event collection implementation."
schema: "TechArticle"
keywords: ["Mobile V2.x Guide", "Legacy Guide", "Quick Start", "Previous Version", "Deprecated Guide", "Old Guide"]
date: "2021-04-12"
sidebar_position: 200
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS Tracker" default>

### Installation

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
   pod 'SnowplowTracker', '~> 2.0'
```

3. Run the command `pod install` to add the tracker to your app project.

**Carthage**

To install Snowplow Tracker with Carthage:

1. Make sure that Carthage is installed on your system and correctly configured for your app.
2. Add the iOS Tracker SDK among the dependencies of your `Cartfile`:

```ruby
   github "snowplow/snowplow-objc-tracker" ~> 2.0
```

3. Run the command `carthage update` and drag the appropriate frameworks from the `Carthage/build` folder to your app project.

**Supported System Version**

The iOS Tracker SDK supports **iOS 9.0+**, **macOS 10.9+**, **tvOS 9.0+** and **watchOS 2.0+**

### Instrumentation

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
let sessionConfig = SessionConfiguration(
    foregroundTimeout: Measurement(value: 30, unit: .minutes),
    backgroundTimeout: Measurement(value: 30, unit: .minutes)
)       
Snowplow.createTracker(
    namespace: "appTracker",
    network: networkConfig,
    configurations: [trackerConfig, sessionConfig]
);
```

  </TabItem>
  <TabItem value="android" label="Android Tracker">

### Installation

The Android Tracker SDK is available on [Maven Central](https://search.maven.org/artifact/com.snowplowanalytics/snowplow-android-tracker) and can be installed using Gradle.

**Gradle**

Add into your `build.gradle` file:

```gradle
dependencies {
  ...
  // Snowplow Android Tracker
  implementation 'com.snowplowanalytics:snowplow-android-tracker:2.+'
  // In case 'lifecycleAutotracking' is enabled
  implementation 'androidx.lifecycle-extensions:2.2.+'
  ...
}
```

**Supported System Version**

The Android Tracker SDK supports Android 5 (**API level 21+**)

### Instrumentation

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
    .installAutotracking(true);
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
