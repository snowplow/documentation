---
title: "Python tracker SDK"
sidebar_label: "Python tracker"
date: "2023-06-14"
sidebar_position: 200
description: "Track events in Python applications and games with the Snowplow Python tracker SDK using subjects, emitters, and trackers."
keywords: ["python tracker", "python analytics", "pypi package"]
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import BadgeGroup from '@site/src/components/BadgeGroup';

<BadgeGroup>
<Badges badgeType="Early Release"></Badges>
<Badges badgeType="Pypi Tracker Release"></Badges>
<Badges badgeType="Snowplow Tracker Pypi Release"></Badges>
</BadgeGroup>
```

The Snowplow Python Tracker allows you to track Snowplow events from your Python apps and games.

The tracker should be straightforward to use if you are comfortable with Python development; any prior experience with Snowplow's [JavaScript Tracker](/docs/sources/web-trackers/index.md), Google Analytics or Mixpanel (which have similar APIs to Snowplow) is helpful but not necessary.

There are three basic types of objects you will create when using the Snowplow Python Tracker: subjects, emitters, and trackers.

A subject represents a user whose events are tracked. A tracker constructs events and sends them to one or more emitters. Each emitter then sends the event to the endpoint you configure. This will usually be a Snowplow collector, but could also be a custom event store.
