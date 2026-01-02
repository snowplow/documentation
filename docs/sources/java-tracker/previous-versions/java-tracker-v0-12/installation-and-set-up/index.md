---
title: "Installation and set-up"
sidebar_label: "Installation and set-up"
date: "2022-03-24"
sidebar_position: 10
description: "Install and configure Java tracker version 0.12 using Maven, Gradle, or direct download."
keywords: ["java tracker v0.12 installation", "maven setup", "gradle configuration"]
---


The Snowplow Java tracker ([GitHub](https://github.com/snowplow/snowplow-java-tracker)) has been built and tested using Java versions 8, 11 and 17, so should work within any Java application built using JDK8 upwards. The Java tracker is also usable from Scala.

:::info These pages are for version 0.12
See [here](/docs/sources/java-tracker/installation-and-set-up/index.md) for the documentation for the latest version.
:::

## Installing

### Install using Maven

Add into your project’s `pom.xml`:

```xml
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-java-tracker</artifactId>
    <version>0.12.0</version>
</dependency>
```

### Install using Gradle

From version 0.10.1 onwards, we have provided out-of-the-box support for sending events via OkHttp or Apache HTTP. The appropriate dependencies must be specified. The default tracker configuration uses OkHttp.

Add this into your project’s `build.gradle` for the default installation with OkHttp support:

```gradle
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.12.0'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.12.0') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-okhttp-support'
        }
    }
}
```

Adding Apache HTTP support instead:

```gradle
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.12.0'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.12.0') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-apachehttp-support'
        }
    }
}
```

If you are using your own `HttpClientAdapter` class:

```gradle
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.12.0'
}
```

### Install by direct download

You can also manually insert the tracker by downloading the jar directly from [Maven Central](https://search.maven.org/search?q=a:snowplow-java-tracker).

### Install in Scala project (SBT)

The Snowplow Java tracker is also usable from Scala. Add this to your SBT config:

```scala
// Dependency
val snowplowTracker = "com.snowplowanalytics"  % "snowplow-java-tracker"  % "0.12.0"
```

## Setting up

The simplest initialization looks like this:

```java
import com.snowplowanalytics.snowplow.tracker.*;
import com.snowplowanalytics.snowplow.tracker.emitter.*;

BatchEmitter emitter = BatchEmitter.builder()
        .url("http://collectorEndpoint")
        .build();
Tracker tracker = new Tracker
        .TrackerBuilder(emitter, "trackerNamespace", "appId")
        .build();
```

The [Java tracker Github repository](https://github.com/snowplow/snowplow-java-tracker) includes a mini demo, "simple-console". Follow the instructions in the README to send one event of each type to your event collector. Simple-console is provided as a simple reference app to help you set up the tracker.

These are the required objects for tracking using the Java tracker:

| Class                      | Function               |
| -------------------------- | ---------------------- |
| `Tracker`                  | Tracks events          |
| `Emitter` (`BatchEmitter`) | Sends event payloads   |
| subclasses of `Event`      | What you want to track |

### Configuring the `Tracker`

The `Tracker` class has the responsibility for tracking [events](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md). Certain properties can also be set when creating a `Tracker` that will be attached to all events. These are `trackerNamespace`, `appId`, and `platform`.

Both `trackerNamespace` and `appId` are required arguments for `TrackerBuilder`. Snowplow events are designed to be stored in a single data warehouse/lake, regardless of their source, to make data modeling easier and provide a single valuable source of truth for your business. The tracker namespace allows you to distinguish events sent by this specific `Tracker`, if you are using multiple `Tracker` objects within your app. The `appId` allows you to identify events from this specific application, if you are tracking from multiple places.

The other Tracker property that will be added to all tracked events is `platform`. This is set by default to `srv` - "server-side app". To set another valid platform type, use the optional `TrackerBuilder` method `platform()`.

The final two `TrackerBuilder` methods are `base64()` and `subject()`. By default, JSONs within the event are sent base-64 encoded. This can be set to `false` here at `Tracker` initialization. The `subject()` method is for adding a `Subject` object to the `Tracker`, explained [here](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-specific-client-side-properties/index.md).

To initialize a `Tracker` with all the options:

```java
Tracker tracker = new Tracker.TrackerBuilder(emitter, namespace, appId)
            .base64(false)
            .platform(DevicePlatform.Desktop)
            .subject(Subject)
            .build();
```

This `Tracker` will produce events with the `platform` value `pc`.

See the API docs for the full [TrackerBuilder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/Tracker.TrackerBuilder.html) details.

### Configuring the `Emitter`

The `Emitter` class manages the buffering and sending of tracked events. Event sending configuration is described fully [on this page](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/configuring-how-events-are-sent/index.md).

See the API docs for the full [BatchEmitter.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/emitter/BatchEmitter.Builder.html) and [AbstractEmitter.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/emitter/AbstractEmitter.Builder.html) options.

### Logging

Logging in the Tracker is done using SLF4J. The majority of the logging set as `DEBUG` so it will not overly populate your own logging.

Since Java tracker v0.11, user-supplied values are only logged at `DEBUG` level.
