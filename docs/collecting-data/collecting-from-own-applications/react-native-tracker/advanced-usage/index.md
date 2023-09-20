---
title: "Advanced usage"
date: "2021-08-09"
sidebar_position: 40
---

## Removing a tracker at runtime

As also mentioned in Introduction, besides the `createTracker` function, the React Native Tracker also provides two functions that allow you to remove a tracker (or all of them) at runtime.

### removeTracker

As each tracker is identified by its namespace, in order to remove a tracker at runtime, you need to pass its namespace to the `removeTracker` function.

For example, assuming an existing tracker with namespace `sp1` :

```javascript
import { createTracker, removeTracker } from '@snowplow/react-native-tracker';

// ...

removeTracker('sp1');
```

### removeAllTrackers

The function removeAllTrackers, which accepts no arguments, will remove all trackers created in your app.

```javascript
import { removeAllTrackers } from '@snowplow/react-native-tracker';

removeAllTrackers();
```

## Accessing the tracker from native code

Since the Snowplow React Native Tracker is a wrapper around the native trackers for iOS and Android, it is possible to access the underlying iOS and Android trackers in native iOS and Android code. For instance, you can instantiate a new tracker in React Native and track a new event in your Swift code within the same app.

When accessing the native tracker APIs in Swift, Objective-C, Java, or Kotlin, refer to the documentation for the [mobile trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md).

Please note that in Android, you will need to add a dependency for the Android tracker to your `build.gradle` inside the Android codebase within your React Native app. Follow the instructions in the [mobile tracker documentation](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md). Make sure that you include the same version of the Android tracker as used by the React Native tracker.

### Example usage in the demo app

To see this use case implemented in a simple app, take a look at the [demo app provided in the React Native tracker](https://github.com/snowplow/snowplow-react-native-tracker#launching-the-demoapp). In addition to instantiating a tracker and tracking events in React Native, the tracker adds tracking of key presses as structured events in native Android and iOS code.

It listens for key press events in the `MainActivity` class in Java and `ViewController` in Objective-C. It accesses the default tracker instance (instantiated in React Native) and tracks a simple structured event using the native tracker API.
