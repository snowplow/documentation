---
title: "Python Tracker"
date: "2020-02-26"
sidebar_position: 200
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Early Release"></Badges>&nbsp;<Badges badgeType="Pypi Tracker Release"></Badges>&nbsp;<Badges badgeType="Snowplow Tracker Pypi Release"></Badges><br/>
```

The Snowplow Python Tracker allows you to track Snowplow events from your Python apps and games.

The tracker should be straightforward to use if you are comfortable with Python development; any prior experience with Snowplow's [JavaScript Tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md), Google Analytics or Mixpanel (which have similar APIs to Snowplow) is helpful but not necessary.

There are three basic types of objects you will create when using the Snowplow Python Tracker: subjects, emitters, and trackers.

A subject represents a user whose events are tracked. A tracker constructs events and sends them to one or more emitters. Each emitter then sends the event to the endpoint you configure. This will usually be a Snowplow collector, but could also be a Redis database or Celery task queue.

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
