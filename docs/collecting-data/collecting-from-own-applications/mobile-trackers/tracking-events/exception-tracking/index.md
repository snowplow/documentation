---
title: "Exception Tracking"
date: "2023-01-03"
sidebar_position: 50
---

# Exception Tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

It captures any unhandled exceptions within the application.

The exception tracking is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .exceptionAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .exceptionAutotracking(true);
```

  </TabItem>
</Tabs>

It allows the tracker to intercept critical exceptions in the app. Exceptions can crash the app so it's likely that the event will be sent after the restart of the app. Being a critical situation we can't be 100% sure that all the exception stacktraces are reliably stored for sending before the crash of the app.
