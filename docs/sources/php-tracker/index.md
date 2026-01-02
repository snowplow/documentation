---
title: "PHP tracker SDK"
sidebar_label: "PHP tracker"
date: "2020-02-26"
sidebar_position: 230
description: "Track events in PHP applications and scripts with the Snowplow PHP tracker SDK using trackers, subjects, and emitters."
keywords: ["php tracker", "php analytics", "composer package"]
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import BadgeGroup from '@site/src/components/BadgeGroup';

<BadgeGroup>
<Badges badgeType="Early Release"></Badges>
<Badges badgeType="Snowplow Tracker Release"></Badges>
<Badges badgeType="Snowplow Tracker PHP Release"></Badges>
</BadgeGroup>
```

The Snowplow PHP Tracker allows you to track Snowplow events from your PHP apps and scripts.

There are three basic types of object you will create when using the Snowplow PHP Tracker: Trackers, Subjects and Emitters.

A subject represents a user whose events are tracked. A tracker constructs events and sends them to one or more emitters. Each emitter then sends the event to the endpoint you configure, a Snowplow collector.

The current flow of the PHP Tracker is illustrated below:

![](images/php-tracker-flow.png)
