---
title: "Media tracking"
sidebar_position: 100
---

# Media tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Media from "@site/docs/reusable/media/_index.md"
```

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

<Media tracker="ios" />

### Auto-tracking events from AVPlayer

The tracker is able to automatically track media events from the [AVPlayer media player](https://developer.apple.com/documentation/avfoundation/avplayer).

The following events are tracked:

* play events
* pause events
* seek end events
* ping events
* percent progress events (if configured)
* buffer start events
* end event
* error event

The following snippets starts media tracking an AVPlayer instance (`player`):

```swift
let mediaTracking = tracker.media.startMediaTracking(
    player: player,
    configuration: MediaTrackingConfiguration(id: "XXXX")
)
```

You can use the `MediaTrackingConfiguration` to further configure the media tracking.

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

<Media tracker="android-kotlin" />

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

<Media tracker="android-java" />

  </TabItem>
</Tabs>
