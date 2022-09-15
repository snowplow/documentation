---
title: "Setup"
date: "2020-12-02"
sidebar_position: 0
---

The Tracker is published to Maven Central and JCenter, which should make it easy to add it as a dependency into your own Scala app.

## SBT

Add the Scala Tracker to your build.sbt like this:

```scala

libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-core" % "1.0.1"

// If you plan to use the http4s emitter with a blaze client
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-emitter-https" % "1.0.1"
libraryDependencies += "org.http4s" %% "http4s-blaze-client" % "0.21.5"

// If you plan to use the id emitters:
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-emitter-id" % "1.0.1"
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
    compile 'com.snowplowanalytics:snowplow-scala-tracker-core_2.13:1.0.1'

    // If you plan to use the http4s emitters with a blaze client
    compile 'com.snowplowanalytics:snowplow-scala-tracker-emitter-http4s_2.13:1.0.1'
    compile 'org.http4s:http4s-blaze.client_2.13:0.21.5'

    // If you plan to use the id emitters
    compile 'com.snowplowanalytics:snowplow-scala-tracker-emitter-id_2.13:1.0.1'
}
```

Notice a `_2.13` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.13.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.12).

## Maven

If you are using Maven for building your Scala application, then add into your project's `pom.xml`:

```xml
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker-core_2.13</artifactId>
    <version>1.0.1</version>
</dependency>

<!-- If you plan to use the http4s emitter with a blaze client: -->
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker-emitter-http4s_2.13</artifactId>
    <version>1.0.1</version>
</dependency>
<dependency>
    <groupId>org.http4s</groupId>
    <artifactId>http4s-blaze-client</artifactId>
    <version>0.21.5</version>
</dependency>

<!-- If you plan to use the id emitters: -->
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker-emitter-id_2.13</artifactId>
    <version>1.0.1</version>
</dependency>
```

Notice a `_2.13` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.13.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.12).
