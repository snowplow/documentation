---
title: "Media tracking"
date: "2021-12-23"
sidebar_position: 4500
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Media tracking enables collecting events about audio/video playback from the [Audio](https://developer.roku.com/en-gb/docs/references/scenegraph/media-playback-nodes/audio.md) and [Video](https://developer.roku.com/en-gb/docs/references/scenegraph/media-playback-nodes/video.md) nodes provided in the Roku SceneGraph SDK for media playback.
Once enabled for a node, the tracker subscribes to selected events and tracks them automatically.
This makes adding media tracking into your Roku channels really simple.

There are [multiple versions](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/media/index.md) of media tracking available, and the Roku tracker supports [v1](/docs/sources/trackers/roku-tracker/media-tracking/v1/index.md) and (from v0.3.0) [v2](/docs/sources/trackers/roku-tracker/media-tracking/v2/index.md).
