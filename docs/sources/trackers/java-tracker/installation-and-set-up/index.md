---
title: "Installing the Java tracker"
date: "2022-03-24"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Installing

The Snowplow Java tracker has been built and tested using Java versions 8, 11 and 17, so should work within any Java application built using JDK8 upwards. The Java tracker is also usable from Scala.

<p>The current tracker version is {versions.javaTracker}. New issues and pull requests are very welcome! Find the Github repository <a href="https://github.com/snowplow/snowplow-java-tracker">here.</a></p>

### Install using Maven
Add into your project’s `pom.xml`:
<CodeBlock language="xml">{
`<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-java-tracker</artifactId>
    <version>${versions.javaTracker}</version>
</dependency>
`}</CodeBlock>

### Install using Gradle
From version 0.10.1 onwards, we provide out-of-the-box support for sending events via OkHttp or Apache HTTP. The appropriate dependencies must be specified. The default tracker configuration uses OkHttp.

Add this into your project’s `build.gradle` for the default installation with OkHttp support:
<CodeBlock language="gradle">{
`dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:${versions.javaTracker}'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:${versions.javaTracker}') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-okhttp-support'
        }
    }
}`
}</CodeBlock>

Adding dependencies for Apache HTTP support instead (read [this page](/docs/sources/trackers/java-tracker/configuring-how-events-are-sent/index.md) for how to configure this):
<CodeBlock language="gradle">{
`dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:${versions.javaTracker}'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:${versions.javaTracker}') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-apachehttp-support'
        }
    }
}`
}</CodeBlock>

If you are using your own `HttpClientAdapter` implementation and/or will be installing dependencies separately:
<CodeBlock language="gradle">{
`dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:${versions.javaTracker}'
}`
}</CodeBlock>

### Install by direct download
You can also manually insert the tracker by downloading the jar directly from [Maven Central](https://search.maven.org/search?q=a:snowplow-java-tracker).

### Install in Scala project (SBT)
The Snowplow Java tracker is also usable from Scala. Add this to your SBT config:
<CodeBlock language="scala">{
`// Dependency
val snowplowTracker = "com.snowplowanalytics"  % "snowplow-java-tracker"  % "${versions.javaTracker}"`
}</CodeBlock>

## Setting up

The simplest initialization looks like this:
```java
import com.snowplowanalytics.snowplow.tracker.Snowplow;
import com.snowplowanalytics.snowplow.tracker.Tracker;

Tracker tracker = Snowplow.createTracker("trackerNamespace", "appId", "http://collectorEndpoint");
```
The URL path for your collector endpoint should include the protocol, "http" or "https". The Java tracker is able to send events to either.

The `Snowplow` interface, added in v1, contains static methods to help initialise and manage `Tracker` objects. This is especially useful when multiple trackers are needed (see [here](/docs/sources/trackers/java-tracker/using-multiple-trackers/index.md)). See the API docs for the full [Snowplow](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/Snowplow.html) details.

The [Java tracker Github repository](https://github.com/snowplow/snowplow-java-tracker) includes a mini demo, "simple-console". Follow the instructions in the README to send one event of each type to your event collector. Simple-console is provided as a simple reference app to help you set up the tracker.

These are the required objects for tracking using the Java tracker:

| Class                 | Function               |
| --------------------- | ---------------------- |
| `Tracker`             | Tracks events          |
| subclasses of `Event` | What you want to track |

### Configuring the `Tracker`

The `Tracker` class has the responsibility for tracking [events](/docs/sources/trackers/java-tracker/tracking-events/index.md). Certain properties can or must also be set when creating a `Tracker`, which will be attached to all events. These are `trackerNamespace`, `appId`, and `platform`.

Both `trackerNamespace` and `appId` are required arguments when creating a `Tracker`. Snowplow events are designed to be stored in a single data warehouse/lake, regardless of their source, to make data modeling easier and provide a single valuable source of truth for your business. The tracker namespace allows you to distinguish events sent by this specific `Tracker`, if you are using multiple `Tracker` instances within your app. It's also the identifier for `Tracker` objects in the `Snowplow` class. The `appId` allows you to identify events from this specific application, if you are tracking from multiple places.

The other Tracker property that will be added to all tracked events is `platform`. This is set by default to `srv` - "server-side app". To set another valid platform type, use the `DevicePlatform` enum during construction.

The final two `Tracker` configuration options are whether to use base-64 encoding, and whether to add a `Subject` object (see [here](/docs/sources/trackers/java-tracker/tracking-specific-client-side-properties/index.md) for details about `Subject`). By default, JSONs within the event are sent base-64 encoded. This can be set to `false` here at `Tracker` initialization.

To create a `Tracker` with custom configuration, use the `TrackerConfiguration` class.
```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("namespace", "appId")
        .base64Encoded(false)
        .platform(DevicePlatform.Desktop);

// Use the Snowplow class to create Trackers
Tracker tracker = Snowplow.createTracker(
    trackerConfig,
    new NetworkConfiguration("http://collector"));

// Alternatively, create an Emitter first, and then create a Tracker directly
// Emitters are introduced in the next section
BatchEmitter emitter = new BatchEmitter(new NetworkConfiguration("http://collector"));
Tracker tracker = new Tracker(trackerConfig, emitter);
```
This `Tracker` will produce events with the `platform` value `pc`.

See the API docs for the full [Tracker](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/Tracker.html), [TrackerConfiguration](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/configuration/TrackerConfiguration.html) and [Snowplow](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/Snowplow.html) details.

### Stopping the tracker

The default `Emitter`, `BatchEmitter`, contains a pool of non-daemon threads managed by a `ScheduledExecutorService`. To close the executor service and stop the threads, use the `close()` method. This method can be called directly on an `Emitter`, or via a `Tracker`:

```java
tracker.close()

// It's also possible to close the Emitter directly
tracker.getEmitter().close()
emitter.close()
```

There is no way to restart the `Emitter` after this. Note that if your app is not quit, events can still be tracked after `close()` has been called: they will accumulate in the `Emitter` buffer, unable to be sent.

### Logging

Logging in the Tracker is done using SLF4J. The majority of the logging set as `DEBUG` so it will not overly populate your own logging.

Since Java tracker v0.11, user-supplied values are only logged at `DEBUG` level.
