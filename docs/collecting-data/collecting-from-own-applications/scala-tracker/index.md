---
title: "Scala Tracker"
date: "2020-10-28"
sidebar_position: 210
---

```mdx-code-block
import Block2901 from "@site/docs/reusable/untitled-reusable-block-37/_index.md"

<Block2901/>
```

The Snowplow Scala Tracker allows you to track Snowplow events in your Scala apps and servers. The tracker should be straightforward to use if you are comfortable with Scala development.

There are three main classes which the Scala Tracker uses: subjects, emitters, and trackers.

A subject represents a single user whose events are tracked, and holds data specific to that user.

A tracker always has one active subject at a time associated with it. The default subject only has "platform=server" configured, but you can replace it with a subject containing more data. The tracker constructs events with that subject and sends them to one or more emitters, which sends them on to a Snowplow collector.
