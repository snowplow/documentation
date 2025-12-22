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

As an example, we have implemented this setup in [a simple demo app](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid). The app does the following:

1. [Adds a dependency](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/package.json#L3) for the React Native tracker.
2. [Creates a tracker instance](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/App.tsx#L5) in the React Native code.
3. [Tracks a screen view event](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/App.tsx#L9) in the React Native code.
4. [Adds the Android tracker as a dependency](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/android/app/build.gradle#L182-L183) in the Android app.
5. [Periodically tracks an event](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/android/app/src/main/java/com/snowplowanalytics/reactnativedemohybrid/MainActivity.java#L29-L37) from the Android native code.
6. [Periodically tracks an event](https://github.com/snowplow-incubator/snowplow-react-native-demo-hybrid/blob/main/ios/snowplowreactnativedemohybrid/main.m#L9-L15) from the iOS native code.

When accessing the native tracker APIs in Swift, Objective-C, Java, or Kotlin, refer to the documentation for the [mobile trackers](/docs/sources/mobile-trackers/index.md).

:::note
Please note that in Android, you will need to add a dependency for the Android tracker to your `build.gradle` inside the Android codebase within your React Native app. Follow the instructions in the [mobile tracker documentation](/docs/sources/mobile-trackers/index.md). Make sure that you include the same version of the Android tracker as used by the React Native tracker.
:::
