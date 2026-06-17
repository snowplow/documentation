---
title: "Setup"
sidebar_label: "Setup"
date: "2020-10-28"
sidebar_position: 1000
description: "Install Scala tracker version 0.6.0 from Maven Central or JCenter using sbt, Gradle, or Maven with core and emitter-id modules."
keywords: ["scala 0.6 installation", "jcenter dependency", "scala tracker 0.6.0"]
---

The Tracker is published to Maven Central and JCenter, which should make it easy to add it as a dependency into your own Scala app.

## SBT

Add the Scala Tracker to your build.sbt like this:

```scala
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-core" % "0.6.1"
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-emitter-id" % "0.6.1"
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
    compile 'com.snowplowanalytics:snowplow-scala-tracker-core_2.12:0.6.1'
    compile 'com.snowplowanalytics:snowplow-scala-tracker-emitter-id_2.12:0.6.1'
}
```

Notice a `_2.12` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.12.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.11).

## Maven

If you are using Maven for building your Scala application, then add into your project's `pom.xml`:

```xml
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker_2.12</artifactId>
    <version>0.6.1</version>
</dependency>
```

Notice a `_2.12` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.12.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.11).
