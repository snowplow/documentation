---
title: "Android tracker"
sidebar_position: 0
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Android Tracker SDK supports Android 5 (**API level 21+**).

## Installing

The Android Tracker SDK can be installed using Gradle.

**Gradle**

Add into your `build.gradle` file:

```gradle
dependencies {
  ...
  // Snowplow Android Tracker
  implementation 'com.snowplowanalytics:snowplow-android-tracker:6.+'
  // In case 'lifecycleAutotracking' is enabled
  implementation 'androidx.lifecycle-extensions:2.2.+'
  ...
}
```

## Setting up

Once the tracker SDK is correctly set as a dependency in your app project you have to instrument the tracker:

1. In your `Application` subclass, set up the SDK as follows:

    <Tabs groupId="platform" queryString>
      <TabItem value="android" label="Android (Kotlin)">

    ```kotlin
    val tracker = Snowplow.createTracker(
        applicationContext, // Android context (LocalContext.current in Compose apps)
        "appTracker", // namespace
        "https://snowplow-collector-url.com" // Event collector URL
    )
    ```
    The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

      </TabItem>
      <TabItem value="android-java" label="Android (Java)">

    ```java
    TrackerController tracker = Snowplow.createTracker(
          getApplicationContext(), // Android context
          "appTracker", // namespace
          "https://snowplow-collector-url.com" // Event collector URL
    );
    ```
    The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

      </TabItem>
    </Tabs>


2. It creates a tracker instance which can be used to track events like this:
  
    <Tabs groupId="platform" queryString>
      <TabItem value="android" label="Android (Kotlin)">
 
   ```kotlin
   val event = Structured("Category_example", "Action_example")
   tracker.track(event)
   ```
  
      </TabItem>
      <TabItem value="android-java" label="Android (Java)"> 

   ```java
   Event event = new Structured("Category_example", "Action_example");
   tracker.track(event);
   ```

      </TabItem>
    </Tabs>


If you prefer to access the tracker when the reference is not directly accessible, you can use the `defaultTracker` :

<Tabs groupId="platform" queryString>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
Snowplow.defaultTracker?.track(event)
```
  
</TabItem>
<TabItem value="android-java" label="Android (Java)">

```java
Snowplow.getDefaultTracker().track(event);
```

  </TabItem>
</Tabs>

You can override the default configuration with a fine grained configuration when you create the tracker. See the [Android API docs](https://snowplow.github.io/snowplow-android-tracker/snowplow-android-tracker/com.snowplowanalytics.snowplow.configuration/index.html) and [iOS API docs](https://snowplow.github.io/snowplow-ios-tracker/documentation/snowplowtracker/configurationprotocol) for the `Configuration` classes to see all the options and defaults.

<Tabs groupId="platform" queryString>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val networkConfig = NetworkConfiguration(
    "https://snowplow-collector-url.com",
    HttpMethod.POST
)
val trackerConfig = TrackerConfiguration("appId")
    .base64encoding(false)
    .sessionContext(true)
    .platformContext(true)
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true)
    .screenContext(true)
    .applicationContext(true)
    .exceptionAutotracking(true)
    .installAutotracking(true)
    .userAnonymisation(false)
val sessionConfig = SessionConfiguration(
    TimeMeasure(30, TimeUnit.SECONDS),
    TimeMeasure(30, TimeUnit.SECONDS)
)
createTracker(
    applicationContext,
    "appTracker",
    networkConfig,
    trackerConfig,
    sessionConfig
)
```

</TabItem>
<TabItem value="android-java" label="Android (Java)">

```java
NetworkConfiguration networkConfig = new NetworkConfiguration(
    "https://snowplow-collector-url.com",
    HttpMethod.POST
);
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .base64encoding(false)
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
Snowplow.createTracker(getApplicationContext(),
    "appTracker",
    networkConfig,
    trackerConfig,
    sessionConfig
);
```

  </TabItem>
</Tabs>

:::note
The trackers created with the above method are configured "locally" only. To create a tracker where the configuration can be updated through downloaded files, read [this page](docs/collecting-data/collecting-from-own-applications/mobile-trackers/remote-configuration/index.md) about remote configuration.
:::

The [Android tracker Github repository](https://github.com/snowplow/snowplow-android-tracker) includes demo apps in Java, Kotlin, and Kotlin with Jetpack Compose. They are provided as simple reference apps to help you set up the tracker.
