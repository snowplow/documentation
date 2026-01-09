---
title: "Setup"
sidebar_label: "Setup"
date: "2020-02-26"
sidebar_position: 10
description: "Install Scala tracker version 0.5.0 from Maven Central or JCenter using sbt, Gradle, or Maven with Scala 2.10, 2.11, or 2.12 support."
keywords: ["scala 0.5 installation", "jcenter dependency", "scala tracker 0.5.0"]
---

The Tracker is published to Maven Central and JCenter, which should make it easy to add it as a dependency into your own Scala app.

## SBT

Add the Scala Tracker to your build.sbt like this:

```scala
resolvers += "JCenter" at "https://jcenter.bintray.com/" // you can omit if you're planning to use Maven Central

libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker" % "0.5.0"
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
    compile 'com.snowplowanalytics:snowplow-scala-tracker_2.12:0.5.0'
}
```

Notice a `_2.12` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.12.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.10 and 2.11).

## Maven

If you are using Maven for building your Scala application, then add the following code into your `HOME/.m2/settings.xml` to be able to use this repository:

```xml
<settings>
  <profiles>
    <profile>
      <!-- ... -->
      <repositories>
        <repository>
          <id>central</id>
          <name>bintray</name>
          <url>https://jcenter.bintray.com/</url>
          <releases>
            <enabled>true</enabled>
          </releases>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
        </repository>
      </repositories>
      <pluginRepositories>
        <pluginRepository>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
          <id>central</id>
          <name>bintray-plugins</name>
          <url>http://jcenter.bintray.com</url>
        </pluginRepository>
      </pluginRepositories>
    </profile>
  </profiles>
  <activeProfiles>
    <activeProfile>bintray</activeProfile>
  </activeProfiles>
</settings>
```

Then add into your project's `pom.xml`:

```xml
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker_2.12</artifactId>
    <version>0.5.0</version>
</dependency>
```

Notice a `_2.12` postfix in artifactId. This is used for Scala libraries and denote Scala version which artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.12.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.10 and 2.11).

## Older versions

Scala Tracker is published on JCenter and Maven Central since version 0.3.0. Previous versions can be found on Snowplow's [hosted Maven repository](http://maven.snplow.com/).
