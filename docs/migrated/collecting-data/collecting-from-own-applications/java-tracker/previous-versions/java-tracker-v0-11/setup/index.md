---
title: "Setup"
date: "2022-05-12"
sidebar_position: 10
---

## Integration options

### Tracker compatibility

The Snowplow Java Tracker has been built and tested using Java versions 8, 11 and 13, so should work within any Java application built using JDK8 upwards.

### Dependencies

To minimize jar bloat, we have tried to keep external dependencies to a minimum. For the full list of dependencies, please see our [Gradle build file](https://github.com/snowplow/snowplow-java-tracker/blob/master/build.gradle).

## Setup

### Installation

The current version of the Snowplow Java Tracker is **0.10.1**

You can also manually insert the Tracker by downloading the jar directly: [snowplow-java-tracker-0.10.1.jar](https://bintray.com/snowplow/snowplow-maven/download_file?file_path=com%2Fsnowplowanalytics%2Fsnowplow-java-tracker%2F0.9.0%2Fsnowplow-java-tracker-0.9.0.jar)

### Maven

Add into your project's `pom.xml`:

```
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-java-tracker</artifactId>
    <version>0.10.1</version>
</dependency>
```

### Gradle

Add into your project's `build.gradle`:

```
dependencies {
    // Snowplow Java Tracker
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.10.1'
}
```

From 0.10.1 you can also specify the feature variants via Gradle, to pull in the required optional dependencies.

#### Adding OkHttp Support

```
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.10.1'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.10.1') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-okhttp-support:0.10.1'
        }
    }
}
```

#### Adding ApacheHttp Support

```
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.10.1'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.10.1') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-apachehttp-support:0.10.1'
        }
    }
}
```

### SBT

The Snowplow Java Tracker is also usable from Scala. Add this to your SBT config:

```
// Dependency
val snowplowTracker = "com.snowplowanalytics"  % "snowplow-java-tracker"  % "0.10.1"
```
