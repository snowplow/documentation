---
title: "Advanced usage"
date: "2021-08-09"
sidebar_position: 40
---

[![Tracker Maintenance Classification](https://img.shields.io/static/v1?style=flat&label=Snowplow&message=Actively%20Maintained&color=6638b8&labelColor=9ba0aa&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC)](/docs/collecting-data/collecting-from-own-applications/tracker-maintenance-classification/index.md)

[![Latest tracker version](https://img.shields.io/npm/v/@snowplow/react-native-tracker)](https://www.npmjs.com/package/@snowplow/react-native-tracker)

[![Supported React Native versions](https://img.shields.io/npm/dependency-version/@snowplow/react-native-tracker/peer/react-native)](https://www.npmjs.com/package/@snowplow/react-native-tracker)

  
  
  
  
  
  

## Getting session data from the tracker

The React Native tracker has implemented callbacks that enable you to get session data back from the tracker at runtime. The way to do so is by using a tracker's `get..` methods. As with all tracker methods, these callbacks are also asynchronous, and they return a Promise that resolves to the respective value (or `undefined`) when fulfilled.

The available methods, are:

### getSessionUserId

This method returns a promise that resolves to the identifier (string UUIDv4) for the user of the session.

```
const sessionUserId = await tracker.getSessionUserId();
```

### getSessionId

This method returns a promise that resolves to the identifier (string UUIDv4) for the session.

```
const sessionId = await tracker.getSessionId();
```

### getSessionIndex

This method returns a promise to resolve to the index (number) of the current session for this user.

```
const sessionIdx = await tracker.getSessionIndex();
```

### getIsInBackground

This method returns a promise to resolve to whether (boolean) the app is currently in background.

```
const isInBackground = await tracker.getIsInBackground();
```

### getBackgroundIndex

This method returns a promise to resolve to the number of background transitions in the current session.

```
const bgIndex = await tracker.getBackgroundIndex();
```

### getForegroundIndex

This method returns a promise to resolve to the number of foreground transitions in the current session.

```
const fgIndex = await tracker.getForegroundIndex();
```

## Removing a tracker at runtime

As also mentioned in Introduction, besides the `createTracker` function, the React Native Tracker also provides two functions that allow you to remove a tracker (or all of them) at runtime.

### removeTracker

As each tracker is identified by its namespace, in order to remove a tracker at runtime, you need to pass its namespace to the `removeTracker` function.

For example, assuming an existing tracker with namespace `sp1` :

```
import { createTracker, removeTracker } from '@snowplow/react-native-tracker';

// ...

removeTracker('sp1');
```

### removeAllTrackers

The function removeAllTrackers, which accepts no arguments, will remove all trackers created in your app.

```
import { removeAllTrackers } from '@snowplow/react-native-tracker';

removeAllTrackers();
```

## Tracking user identifiers

The React Native Tracker inherits from the Mobile Native Trackers the policy for tracking user identifiers. Generally the user identifiers, when tracked, are being sent as part of the `mobile_context`.

This section describes the default behavior of the native trackers concerning tracking of user identifiers (namely: AAID for Android, and IDFA, IDFV for iOS) and the ways to change it.

### iOS

Concerning the IDFA and IDFV user identifiers, the default behavior of the Snowplow iOS Tracker, and thus, the default behavior of the React Native Tracker is:

- The IDFA is not being tracked
- The IDFV is being tracked

One of the things to do in order for this behavior to change, is to pass Preprocessor flags to the underlying Snowplow iOS Tracker, especially since Apple requires the relevant code to be removed. The way to do so from the React Native side is therefore through `post_install` script in the app's `Podfile`, that will take care of passing the corresponding Preprocessor definitions to the build settings of the Snowplow iOS Tracker.

#### IDFV tracking

Returns the generated identifier for vendors. More info can be found in UIDevice's identifierForVendor documentation.

As mentioned above, by default, the IDFV is being tracked.

If you do **not** want to track the IDFV, you'll need to pass the `SNOWPLOW_NO_IDFV` preprocessor definition to the iOS Tracker build settings:

```
# ios/Podfile
# ...
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      if target.name == 'SnowplowTracker'
        target.build_configurations.each do |config|
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'SNOWPLOW_NO_IDFV=1'
        end
      end
    end
  end
```

#### IDFA tracking

IDFA allows advertisers to track a user’s device among reinstalls and apps. Obviously Apple has introduced way to limit the trackability in order to keep high level of privacy for the user. Your app's users can choose to limit ad-tracking by preventing the IDFA being passed to advertisers.

If you want to track the IDFA you need to follow the guidelines of [AppTrackingTransparency](https://developer.apple.com/documentation/apptrackingtransparency?language=objc) and enable IDFA tracking on Snowplow iOS tracker:

- Add and follow the guidelines of [AppTrackingTransparency](https://developer.apple.com/documentation/apptrackingtransparency?language=objc) framework in your app.
- Add `AdSupport` framework to your app. If it’s not added the tracker will not send the IDFA with the events.
- Again, use a post\_install script in your app's Podfile to pass the `SNOWPLOW_IDFA_ENABLED=1` preprocessor definition to the underlying iOS Tracker

```
# ios/Podfile
# ...
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      if target.name == 'SnowplowTracker'
        target.build_configurations.each do |config|
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'SNOWPLOW_IDFA_ENABLED=1'
        end
      end
    end
  end
```

**Note**: The simulators can’t generate a proper IDFA, instead they generate a sequence of zeros. If you want to test IDFA with a real code, please, use the physical device.

**Note**: The user has the ability to limit ad-tracking from the device’s Settings. If the user enable the limitations the tracker will not be able to track the IDFA.

### Android

Similarly, the React Native Tracker, inherits the AAID-tracking behavior from the Snowplow Android Tracker. This section below, from the Android Tracker documentation, applies equally to the React Native Tracker, where you will need to make the respective changes to the `android` part of your React Native app.

#### AAID tracking

The AAID (Android Advertising ID) is a unique user-resettable identifier, which uniquely identifies a particular user for advertising use cases, such as ad personalization. The tracker allows retrieval of the AAID, sending it as property `androidIdfa` as part of the `mobile_context` JSON which is attached to each mobile event.

For privacy purposes the user can reset the identifier at any moment. In that case the tracker will report a new AAID, despite the device and user being the same as before. Also, the user can “Opt out of Ads Personalisation” from the Android settings menu. In that case the tracker will report an empty string in place of the AAID.

If you want to track the AAID, you need to add the Google Mobile Ads library to your app. If it isn’t included, the tracker will not send the AAID with the events.

The Google Mobile Ads can be imported in the `dependencies` section of the `build.gradle` adding:

```
dependencies {
    ...
    implementation 'com.google.android.gms:play-services-ads:19.0.0'
    ...
}
```

The Google Mobile Ads SDK v.17.0.0 introduced some [changes](https://ads-developers.googleblog.com/2018/10/announcing-v1700-of-android-google.html) requiring a tag in the `androidManifest.xml` explained below.

#### Manifest tag for AdMob publishers

AdMob publishers have to add the AdMob app ID in the `AndroidManifest.xml` file:

```
<manifest>
    <application>
        <!-- TODO: Replace with your real AdMob app ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-################~##########"/>
    </application>
</manifest>
```

Failure to add this tag will result in the app crashing at app launch with a message starting with “The Google Mobile Ads SDK was initialized incorrectly”.

#### Manifest tag for Google Ad Manager publishers

Publishers using Google Ad Manager have to declare the app an “Ad Manager app” in the `AndroidManifest.xml` file:

```
<manifest>
    <application>
        <meta-data
            android:name="com.google.android.gms.ads.AD_MANAGER_APP"
            android:value="true"/>
    </application>
</manifest>
```

Failure to add this tag will result in the app crashing at app launch with a message starting with “The Google Mobile Ads SDK was initialized incorrectly”.

## Accessing the tracker from native code

Since the Snowplow React Native Tracker is a wrapper around the native trackers for iOS and Android, it is possible to access the underlying iOS and Android trackers in native iOS and Android code. For instance, you can instantiate a new tracker in React Native and track a new event in your Swift code within the same app.

When accessing the native tracker APIs in Swift, Objective-C, Java, or Kotlin, refer to the documentation for the [mobile trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md).

Please note that in Android, you will need to add a dependency for the Android tracker to your `build.gradle` inside the Android codebase within your React Native app. Follow the instructions in the [mobile tracker documentation](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md). Make sure that you include the same version of the Android tracker as used by the React Native tracker.

### Example usage in the demo app

To see this use case implemented in a simple app, take a look at the [demo app provided in the React Native tracker](https://github.com/snowplow/snowplow-react-native-tracker#launching-the-demoapp). In addition to instantiating a tracker and tracking events in React Native, the tracker adds tracking of key presses as structured events in native Android and iOS code.

It listens for key press events in the `MainActivity` class in Java and `ViewController` in Objective-C. It accesses the default tracker instance (instantiated in React Native) and tracks a simple structured event using the native tracker API.
