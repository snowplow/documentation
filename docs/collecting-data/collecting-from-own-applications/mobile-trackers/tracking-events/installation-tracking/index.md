---
title: "Installation Tracking"
date: "2023-01-03"
sidebar_position: 60
---

# Installation Tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

It tracks an install event which occurs the first time an application is opened. The tracker will record when it's first been installed, so deleting and reinstalling an app will trigger another install event.

If installation autotracking is not enabled, the tracker will still keep track of when the app was first installed, so that when enabled, the tracker will send the recorded install event with a timestamp reflecting when it was first installed.

The installation autotracking is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .installAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .installAutotracking(true);
```

  </TabItem>
</Tabs>
