---
title: "iOS tracker"
sidebar_position: 0
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

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

You can override the default configuration with a fine grained configuration when you create the tracker. See the API docs for the `Configuration` classes to see all the options and defaults.

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

The [Examples Github repository](https://github.com/snowplow-incubator/snowplow-ios-tracker-examples) includes demo apps for Swift and Objective-C covering the most popular dependencies managers. They are provided as simple reference apps to help you set up the tracker.
