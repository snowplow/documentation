---
title: "Set up tracking"
position: 6
---

Now you'll implement Snowplow tracking in your mobile app. This section guides you through installing and configuring the appropriate Snowplow tracker for your platform.

The tracker captures user interactions and app events, sending them to your Snowplow pipeline. This includes automatic tracking of screen views, app lifecycle events, and session information, plus the ability to track custom events specific to your app.

## Step 1: Install the tracker package

Choose the installation method for your platform:

### iOS

You can install the tracker using Swift Package Manager:

1. In Xcode, select **File → Swift Packages → Add Package Dependency**
2. Add the URL: `https://github.com/snowplow/snowplow-objc-tracker`

Alternative installation methods are available using [CocoaPods or Carthage](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/installation-and-set-up/).

### Android

Add the tracker to your `build.gradle` file:

```gradle
dependencies {
    // Snowplow Android Tracker
    implementation 'com.snowplowanalytics:snowplow-android-tracker:3.+'
    // Required if lifecycleAutotracking is enabled
    implementation 'androidx.lifecycle:lifecycle-extensions:2.2.0'
}
```

### React Native

Install the tracker as a dependency:

```bash
npm install --save @snowplow/react-native-tracker
```

### Flutter

Add the tracker to your Flutter application:

```bash
flutter pub add snowplow_tracker
```

## Step 2: Import the tracker package

Create a dedicated file to manage your Snowplow tracking code (e.g., `Tracker.swift`, `Tracker.kt`, `tracker.js`, or `tracker.dart`).

Import the Snowplow tracker package in this file:

### iOS

```swift
import SnowplowTracker
```

### Android

```java
import com.snowplowanalytics.snowplow.Snowplow;
import com.snowplowanalytics.snowplow.configuration.NetworkConfiguration;
import com.snowplowanalytics.snowplow.configuration.TrackerConfiguration;
import com.snowplowanalytics.snowplow.controller.TrackerController;
```

### React Native

```typescript
import { createTracker } from '@snowplow/react-native-tracker';
```

### Flutter

```dart
import 'package:snowplow_tracker/snowplow_tracker.dart';
```

## Step 3: Configure the tracker

Initialize the tracker with basic configuration. You'll update the endpoint URL later when you set up testing.

The configuration requires:
- **Tracker namespace**: Uniquely identifies this tracker instance within your app
- **Network configuration**: Endpoint URL for your Snowplow collector
- **Tracker configuration**: App ID and other tracker settings

### iOS

```swift
let networkConfig = NetworkConfiguration(endpoint: "{{URL for Collector}}")
let trackerConfig = TrackerConfiguration()
    .appId("your-app-id")
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true)

let tracker = Snowplow.createTracker(
    namespace: "mobile-tracker",
    network: networkConfig,
    configurations: [trackerConfig]
)
```

### Android

```java
NetworkConfiguration networkConfig = new NetworkConfiguration("{{URL for Collector}}");
TrackerConfiguration trackerConfig = new TrackerConfiguration("your-app-id")
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true);

TrackerController tracker = Snowplow.createTracker(
    context,
    "mobile-tracker",
    networkConfig,
    trackerConfig
);
```

### React Native

```typescript
const tracker = createTracker(
    'mobile-tracker',
    {
        endpoint: '{{URL for Collector}}',
    },
    {
        trackerConfig: {
            appId: 'your-app-id',
            lifecycleAutotracking: true,
            screenViewAutotracking: true,
        },
    }
);
```

### Flutter

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
    namespace: 'mobile-tracker',
    endpoint: '{{URL for Collector}}',
    trackerConfig: const TrackerConfiguration(
        appId: 'your-app-id'
    )
);
```

## Important configuration options

The tracker configuration includes several important options:

- **appId**: Identifies your app across different platforms and versions
- **lifecycleAutotracking**: Automatically tracks when the app goes to background/foreground
- **screenViewAutotracking**: Automatically tracks when users view different screens
- **sessionContext**: Enables session tracking with timeout settings
- **platformContext**: Includes device and OS information with events

These auto-tracking features provide essential mobile analytics data without requiring additional code in your app.

## Next steps

With the tracker installed and configured, you're ready to add event tracking to your app. The next section covers the different types of events you can track and how to implement them.

For now, leave the endpoint URL as a placeholder - you'll configure it with a testing endpoint in the testing section to validate your implementation before connecting to a production Snowplow pipeline.
