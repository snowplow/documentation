---
title: "Scala client"
date: "2021-03-26"
sidebar_position: 70
---

## Overview

The [Scala client](https://github.com/snowplow/iglu-scala-client) is an Iglu client and schema resolver implemented in Scala.

Setting up the Scala client to use from your own code is straightforward.  
For actual examples of initialization you can look at [Scala client](https://github.com/snowplow/iglu-scala-client) page.

## Integration options

To minimize jar bloat, we have tried to keep external dependencies to a minimum. The main dependencies are on Jackson and JSON Schema-related libraries.

## Setup

### Hosting

The Scala client is published to Snowplow's [hosted Maven repository](http://maven.snplow.com), which should make it easy to add it as a dependency into your own Java app.

The current version of the Scala client is 1.0.2.

### SBT

Add this to your SBT config:

```
// Dependency
val igluClient = "com.snowplowanalytics" %% "iglu-scala-client"  % "1.0.2"
```

### Gradle

Add into `build.gradle`:

```
dependencies {
    ...
    // Iglu client
    compile 'com.snowplowanalytics:iglu-scala-client:0.4.0'
}
```

Now read the  [Scala client API](https://github.com/snowplow/iglu-scala-client) to start using the Scala client.
