---
title: "PHP tracker SDK"
sidebar_label: "PHP tracker"
date: "2020-02-26"
sidebar_position: 230
description: "Track events in PHP applications and scripts with the Snowplow PHP tracker SDK using trackers, subjects, and emitters."
keywords: ["php tracker", "php analytics", "composer package"]
content_type: sdk
---

```mdx-code-block
<BadgeGroup>
<TrackerTier id="php" />
<VersionBadge component="phpTracker" href="https://packagist.org/packages/snowplow/snowplow-tracker" />
</BadgeGroup>
```

The Snowplow PHP Tracker allows you to track Snowplow events from your PHP apps and scripts.

There are three basic types of object you will create when using the Snowplow PHP Tracker: Trackers, Subjects and Emitters.

A subject represents a user whose events are tracked. A tracker constructs events and sends them to one or more emitters. Each emitter then sends the event to the endpoint you configure, a Snowplow collector.

The current flow of the PHP Tracker is illustrated below:

![Flowchart showing the Snowplow PHP Tracker architecture: the Tracker contains one or more Emitters and one Subject; Emitters (SyncEmitter, CurlEmitter, SocketEmitter) buffer events and send them to the Collector; FileEmitter spawns Worker processes that consume event log files and send them to the Collector, with failed event logs copied to a failed folder](images/php-tracker-flow.png)
