---
title: "Track media events with the native mobile trackers"
sidebar_label: "Media"
sidebar_position: 100
description: "Track media playback events including play, pause, buffering, and completion using the mobile media tracking plugin."
keywords: ["media tracking", "video tracking", "avplayer tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Media from "@site/docs/reusable/media/_index.md"
```

<Media platforms={["ios", "android-kotlin", "android-java"]} />

## AVPlayer auto-tracking (iOS)

The iOS tracker can automatically track events from [AVPlayer](https://developer.apple.com/documentation/avfoundation/avplayer). Pass the player instance to `startMediaTracking`:

```swift
let mediaTracking = tracker.media.startMediaTracking(
    player: avPlayer,
    configuration: MediaTrackingConfiguration(id: "my-video")
)
```

The following events are auto-tracked:

* Play events
* Pause events
* Seek end events
* Ping events
* Percent progress events (if configured)
* Buffer start events
* End events
* Error events
