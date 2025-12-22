---
title: "Using multiple trackers in one Java app"
date: "2022-03-24"
sidebar_position: 65
---

Rarely, a tracking implementation may benefit from instantiating multiple Java trackers, each with a different configuration. This will not be appropriate for most Snowplow users.

Creating and managing multiple trackers is easiest using the `Snowplow` interface (added in v1.0.0). All trackers created with `Snowplow.createTracker()` are added to a private static map. Different `Tracker` objects are distinguished using their namespaces.

In this example, the user wants to send some events to a different collector. They create two Trackers, one for each endpoint:

```java
Snowplow.createTracker("main_tracker", "appId", "http://endpoint");
Snowplow.createTracker("other_tracker", "appId", "http://other-endpoint");

Snowplow.getDefaultTracker().track(event);
Snowplow.getTracker("other_tracker").track(event2);
```

See the API docs for the full [Snowplow](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/Snowplow.html) details.

## Using different Snowplow trackers together

Because all Snowplow trackers create events with the same structure, it's easy to work with data from different Snowplow tracker SDKs. For example, you may wish to implement the Java tracker for back-end server tracking, in conjunction with a client-side tracker such as JavaScript or Flutter.

Read more about tracking client-side/server-side [here](/docs/sources/java-tracker/tracking-specific-client-side-properties/index.md).
