---
title: "Golang Tracker"
date: "2020-02-26"
sidebar_position: 170
---

The Snowplow Golang Tracker allows you to track Snowplow events from your Golang apps and servers.

There are three basic types of object you will create when using the Snowplow Golang Tracker: subjects, emitters, and trackers.

A subject represents a user whose events are tracked. A tracker constructs events and sends them to an emitter. The emitter then sends the event to the endpoint you configure; a valid Snowplow Collector.

**READ ME**: As sending and processing of events is done asynchronously it is advised to create the Tracker as a singleton object. This is due to the fact that all events are first persistently stored in a local Sqlite3 database; if multiple Trackers are created there is the possibility of duplicate sending of events and overt consumption of resources.

See [here for instructions](http://blog.ralch.com/tutorial/design-patterns/golang-singleton/) on building a Singleton in Golang.
