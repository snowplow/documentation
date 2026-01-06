---
title: "Setup"
date: "2020-10-28"
sidebar_position: 1000
---

The Tracker is published to Maven Central and JCenter, which should make it easy to add it as a dependency into your own Scala app.

## SBT

Add the Scala Tracker to your build.sbt like this:

```scala
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-core" % "0.7.0"
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-emitter-id" % "0.7.0"
```

## Gradle

If you are using Gradle in your own Scala application, then add our Maven repository in your `build.gradle` file:

```gradle
repositories {
    ...
    jcenter()
}
```

Then add into the same file:

```gradle
dependencies {
    ...
    // Snowplow Scala Tracker
    compile 'com.snowplowanalytics:snowplow-scala-tracker-core_2.13:0.7.0'
    compile 'com.snowplowanalytics:snowplow-scala-tracker-emitter-id_2.13:0.7.0'
}
```

Notice a `_2.13` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.13.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.12).

## Maven

If you are using Maven for building your Scala application, then add into your project's `pom.xml`:

```xml
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker_2.13</artifactId>
    <version>0.7.0</version>
</dependency>
```

Notice a `_2.13` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.13.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.12).
