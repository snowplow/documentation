---
title: "Install the Scala tracker"
sidebar_label: "Installation"
date: "2022-9-15"
sidebar_position: 0
description: "Install the Snowplow Scala tracker from Maven Central or JCenter using sbt, Gradle, or Maven with support for http4s and id emitters."
keywords: ["scala tracker installation", "sbt dependency", "maven central"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Tracker is published to Maven Central and JCenter, which should make it easy to add it as a dependency into your own Scala app.
<Tabs groupId="packager" queryString>
<TabItem value="sbt" label="sbt" default>

Add the Scala Tracker to your build.sbt:

<CodeBlock language="scala" title="build.sbt">{
`libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-core" % "${versions.scalaTracker}"
\
// If you plan to use the http4s emitter with an Ember client
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-emitter-http4s" % "${versions.scalaTracker}"
libraryDependencies += "org.http4s" %% "http4s-ember-client" % "0.23.15"
\
// If you plan to use the id emitters:
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-emitter-id" % "${versions.scalaTracker}"
\
// If you plan to use EC2/GCE contexts:
libraryDependencies += "com.snowplowanalytics" %% "snowplow-scala-tracker-metadata" % "${versions.scalaTracker}"`
}</CodeBlock>
</TabItem>

<TabItem value="gradle" label="Gradle">

Add our Maven repository in your `build.gradle` file:

<CodeBlock language="gradle" title="build.gradle">{
`repositories {
    ...
    jcenter()
}`
}</CodeBlock>

Then add into the same file:

<CodeBlock language="gradle" title="build.gradle">{
`dependencies {
    ...
    // Snowplow Scala Tracker
    compile 'com.snowplowanalytics:snowplow-scala-tracker-core_2.13:${versions.scalaTracker}'
\
    // If you plan to use the http4s emitters with an Ember client
    compile 'com.snowplowanalytics:snowplow-scala-tracker-emitter-http4s_2.13:${versions.scalaTracker}'
    compile 'org.http4s:http4s-ember-client_2.13:0.23.15'
\
    // If you plan to use the id emitters
    compile 'com.snowplowanalytics:snowplow-scala-tracker-emitter-id_2.13:${versions.scalaTracker}'
\
    // If you plan to use EC2/GCE contexts:
    compile 'com.snowplowanalytics:snowplow-scala-tracker-metadata_2.13:${versions.scalaTracker}'
}`
}</CodeBlock>
</TabItem>

<TabItem value="maven" label="Maven">

Add into your project's `pom.xml`:

<CodeBlock language="maven" title="pom.xml">{
`<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker-core_2.13</artifactId>
    <version>${versions.scalaTracker}</version>
</dependency>
\
<!-- If you plan to use the http4s emitter with an Ember client: -->
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker-emitter-http4s_2.13</artifactId>
    <version>${versions.scalaTracker}</version>
</dependency>
<dependency>
    <groupId>org.http4s</groupId>
    <artifactId>http4s-ember-client</artifactId>
    <version>0.23.15</version>
</dependency>
\
<!-- If you plan to use the id emitters: -->
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker-emitter-id_2.13</artifactId>
    <version>${versions.scalaTracker}</version>
</dependency>
\
<!-- If you plan to use EC2/GCE contexts: -->
<dependency>
    <groupId>com.snowplowanalytics</groupId>
    <artifactId>snowplow-scala-tracker-metadata_2.13</artifactId>
    <version>${versions.scalaTracker}</version>
</dependency>`
}</CodeBlock>

</TabItem>
</Tabs>

:::info For Maven and Gradle users

Notice a `_2.13` postfix in artifactId. This is used for Scala libraries and denotes the Scala version which the artifact (in our case `snowplow-scala-tracker`) is compiled against. It also means that this library will bring a `org.scala-lang:scala-library_2.13.x` as transitive dependency and if you're using any other Scala dependency you should keep these postfixes in accordance (`snowplow-scala-tracker` is also compiled against Scala 2.12).

:::
