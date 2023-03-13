---
title: "iOS Tracker"
date: "2022-08-30"
sidebar_position: 0
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Snowplow iOS Tracker SDK supports iOS 11.0+, macOS 10.13+, tvOS 12.0+ and watchOS 6.0+
It can be used both in Swift as well as in Objective-C code.

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
   pod 'SnowplowTracker', '~> 5.0'
   ```

3. Run the command `pod install` to add the tracker to your app project.

:::note
Support for installing the tracker using Carthage has been dropped in version 5 of the tracker.
:::

## Setting up

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker:

1. In your application delegate `AppDelegate.swift` add `import SnowplowTracker`.

2. In the `application(_:didFinishLaunchingWithOptions:)` method, set up the SDK as follows:
   
   ```swift
   let tracker = Snowplow.createTracker(namespace: "appTracker", endpoint: COLLECTOR_URL)
   ```

3. It creates a tracker instance which can be used to track events like this:
   
   ```swift
   let event = Structured(category: "Category_example", action: "Action_example")
   tracker?.track(event)
   ```
   
   If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker` :
   
   ```swift
   Snowplow.defaultTracker()?.track(event)
   ```

The tracker has a default configuration where some settings are enabled by default:

- session tracking
- screen tracking
- platform contexts (mobile specific context fields)

You can override the default configuration with a fine grained configuration when you create the tracker:

```swift
Snowplow.createTracker(namespace: "appTracker", endpoint: COLLECTOR_URL) {
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
  SessionConfiguration(
      foregroundTimeout: Measurement(value: 30, unit: .minutes),
      backgroundTimeout: Measurement(value: 30, unit: .minutes)
  )
}
```

The `createTracker` method allows the creation of multiple trackers in the same app. The `namespace` field lets you distinguish events sent by a specific tracker instance. It is mandatory even in case the app uses just a single tracker instance like in the example above.

The [Examples Github repository](https://github.com/snowplow-incubator/snowplow-objc-tracker-examples) includes demo apps for Swift and Objective-C covering the most popular dependencies managers. They are provided as simple reference apps to help you set up the tracker.
