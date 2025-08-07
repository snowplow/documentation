---
title: Install the trackers
position: 7
---

To instrument tracking, you will need to install tracker libraries both in the web view as well as the native mobile app.

## Snowplow WebView tracker installation

To install the [WebView tracker](https://github.com/snowplow-incubator/snowplow-webview-tracker) in your JavaScript or TypeScript app, add the npm package:

```bash
npm install --save @snowplow/webview-tracker
```

You will then be able to use the functions provided by the WebView tracker as follows:

```typescript
import { trackSelfDescribingEvent } from '@snowplow/webview-tracker';
```

There is no need to configure the WebView tracker. All configuration is done in the native layer as explained next.

## Snowplow iOS, Android and React Native tracker installation

First, you will need to install the Snowplow tracker package in your app. Below, we show how to do so using the Swift Package Manager (SPM) on iOS and Gradle on Android. To learn about other options for installing the trackers (e.g. using CocoaPods or Carthage on iOS), [see the mobile tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/mobile-trackers/mobile-trackers-v3-0/quick-start-guide/).

### iOS

You can install the tracker using SPM as follows:  
1. In Xcode, select File > Swift Packages > Add Package Dependency.
2. Add the url where to download the library: https://github.com/snowplow/snowplow-objc-tracker

### Android

The tracker can be installed using Gradle. Add the following to your `build.gradle` file:

```gradle
dependencies {
  ...
  // Snowplow Android Tracker
  implementation 'com.snowplowanalytics:snowplow-android-tracker:3.+'
  // In case 'lifecycleAutotracking' is enabled
  implementation 'androidx.lifecycle-extensions:2.2.+'
  ...
}
```

### React Native

To install the tracker, add it as a dependency to your React Native app:

```bash
npm install --save @snowplow/react-native-tracker
```

With both trackers installed, you can now configure them to work together seamlessly, ensuring that events from both native code and web views share the same session and user context.
