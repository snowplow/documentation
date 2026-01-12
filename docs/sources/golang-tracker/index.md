---
title: "Golang tracker SDK"
sidebar_label: "Golang tracker"
description: "The Snowplow Golang Tracker enables server-side event tracking from Go applications. Create subjects, emitters, and trackers with persistent storage to send behavioral events to your Snowplow collector."
keywords: ["golang tracker", "go tracker", "go sdk", "server-side tracking", "go modules"]
sidebar_position: 170
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Actively Maintained"></Badges>
```

The [Snowplow Golang Tracker](https://github.com/snowplow/snowplow-golang-tracker) allows you to track Snowplow events from your Golang apps and servers.

There are four basic types of object you will create when using the Snowplow Golang Tracker: subjects, emitters, storage and trackers.

* A subject represents a user whose events are tracked.
* A tracker constructs events and sends them to an emitter.
* The emitter then sends the event to the endpoint you configure, a valid Snowplow Collector, which leverages a storage implementation to store them securely before sending to allow for recovery from failure.

:::note

As sending and processing of events is done asynchronously it is advised to create the Tracker as a singleton object. This is due to the fact that all events are first persistently stored in a local Sqlite3 database; if multiple Trackers are created there is the possibility of duplicate sending of events and overt consumption of resources.

See [here for instructions](http://blog.ralch.com/tutorial/design-patterns/golang-singleton/) on building a Singleton in Golang.

:::
