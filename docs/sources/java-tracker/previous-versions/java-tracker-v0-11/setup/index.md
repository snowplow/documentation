---
title: "Setup"
sidebar_label: "Setup"
date: "2022-05-12"
sidebar_position: 10
description: "Installation and setup instructions for Java tracker version 0.11 using Maven, Gradle, or direct download."
keywords: ["java tracker v0.11 setup", "maven installation", "gradle setup"]
---

:::info These pages are for version 0.11
See [here](/docs/sources/java-tracker/installation-and-set-up/index.md) for the documentation for the latest version.
:::

## Integration options

### Tracker compatibility

The Snowplow Java Tracker has been built and tested using Java versions 8, 11 and 13, so should work within any Java application built using JDK8 upwards.

### Dependencies

To minimize jar bloat, we have tried to keep external dependencies to a minimum. For the full list of dependencies, please see our [Gradle build file](https://github.com/snowplow/snowplow-java-tracker/blob/master/build.gradle).

## Setup

### Installation

These instructions are for version 0.11 of the Snowplow Java Tracker.

You can also manually insert the Tracker by downloading the jar directly: [snowplow-java-tracker-0.11.0.jar](https://bintray.com/snowplow/snowplow-maven/download_file?file_path=com%2Fsnowplowanalytics%2Fsnowplow-java-tracker%2F0.11.0%2Fsnowplow-java-tracker-0.11.0.jar)

### Maven

Add into your project's `pom.xml`:

```xml
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-java-tracker</artifactId>
    <version>0.11.0</version>
</dependency>
```

### Gradle

Add into your project's `build.gradle`:

```gradle
dependencies {
    // Snowplow Java Tracker
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.11.0'
}
```

From v0.10.1 you can also specify the feature variants via Gradle, to pull in the required optional dependencies.

#### Adding OkHttp Support

```gradle
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.11.0'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.11.0') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-okhttp-support:0.11.0'
        }
    }
}
```

#### Adding ApacheHttp Support

```gradle
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.11.0'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.11.0') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-apachehttp-support:0.11.0'
        }
    }
}
```

### SBT

The Snowplow Java Tracker is also usable from Scala. Add this to your SBT config:

```scala
// Dependency
val snowplowTracker = "com.snowplowanalytics"  % "snowplow-java-tracker"  % "0.11.0"
```
