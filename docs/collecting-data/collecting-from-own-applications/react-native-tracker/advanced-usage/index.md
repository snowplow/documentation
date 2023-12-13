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

Since the Snowplow React Native Tracker is a wrapper around the native trackers for iOS and Android, it is possible to access the underlying iOS and Android trackers in native iOS and Android code. This allows you to:

1. Instantiate a new tracker instance either in React Native or iOS/Android native code.
2. Track events using the same tracker instance from both React Native code as well as iOS/Android native code.

This is a better approach than creating a separate tracker instance for React Native and for native code because it enables all the events to share the same user and session identifiers.

As an example, we have implemented this setup in a simple demo app [available here](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid). The app does the following:

1. Adds a dependency for the React Native tracker [here](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/package.json#L3).
2. Creates a tracker instance in the React Native code [here](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/App.tsx#L5).
3. Tracks a screen view event in the React Native code [here](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/App.tsx#L9).
4. Adds the Android tracker as a dependency in the Android app [here](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/android/app/build.gradle#L182-L183).
5. Periodically tracks an event from the Android native code [here](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/android/app/src/main/java/com/snowplowanalytics/reactnativedemohybrid/MainActivity.java#L29-L37).
6. Periodically tracks an event from the iOS native code [here](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/ios/snowplowreactnativedemohybrid/main.m#L9-L15).

When accessing the native tracker APIs in Swift, Objective-C, Java, or Kotlin, refer to the documentation for the [mobile trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md).

:::note
Please note that in Android, you will need to add a dependency for the Android tracker to your `build.gradle` inside the Android codebase within your React Native app. Follow the instructions in the [mobile tracker documentation](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md). Make sure that you include the same version of the Android tracker as used by the React Native tracker.
:::

### Example usage in the demo app

To see this use case implemented in a simple app, take a look at the [demo app provided in the React Native tracker](https://github.com/snowplow/snowplow-react-native-tracker#launching-the-demoapp). In addition to instantiating a tracker and tracking events in React Native, the tracker adds tracking of key presses as structured events in native Android and iOS code.

It listens for key press events in the `MainActivity` class in Java and `ViewController` in Objective-C. It accesses the default tracker instance (instantiated in React Native) and tracks a simple structured event using the native tracker API.
