---
title: "C++ tracker SDK"
sidebar_label: "C++ tracker"
description: "The Snowplow C++ Tracker enables event tracking from C++ applications, games, and servers. Create subjects, emitters, and trackers to send behavioral events to your Snowplow collector."
keywords: ["c++ tracker", "cpp tracker", "c++ sdk", "server-side tracking", "game tracking"]
date: "2020-02-25"
sidebar_position: 240
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Actively Maintained"></Badges>
```

The [Snowplow C++ Tracker](https://github.com/snowplow/snowplow-cpp-tracker) allows you to track Snowplow events from your C++ apps, games and servers.

There are three basic types of object you will create when using the Snowplow C++ Tracker: subjects, emitters, and trackers.

- A subject represents a user whose events are tracked.
- A tracker constructs events and sends them to an emitter.
- The emitter then sends the event to the endpoint you configure; a valid Snowplow Collector.
