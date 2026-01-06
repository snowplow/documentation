---
title: "Ruby tracker"
date: "2020-02-26"
sidebar_position: 220
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import {versions} from '@site/src/componentVersions';

<Badges badgeType="Actively Maintained"></Badges>
```

The Snowplow Ruby Tracker allows you to track Snowplow events in your Ruby applications and gems and Ruby on Rails web applications.

<p>The Ruby tracker is compatible with Ruby 2.1+, including Ruby 3.0+. The current tracker version is {versions.rubyTracker}.</p>

These pages will help you in setting up and using the Ruby tracker. There are more technical details in the [API docs.](https://snowplow.github.io/snowplow-ruby-tracker/SnowplowTracker.html)

As a server-side tracker, the Ruby tracker pairs very well with the JavaScript client-side tracker, if you are tracking events in a website. We've created a [simple demo Rails app](https://github.com/snowplow-industry-solutions/snowplow-ruby-tracker-examples), which incorporates both trackers, and also uses the Singleton pattern that we suggest for the Ruby tracker.

At its simplest, the Ruby tracker is used by calling a Tracker object's `track_x_event` method, such as `track_page_view`, which will send the event payload created to the Snowplow event collector.

There are three main classes which the Ruby Tracker uses: trackers, emitters, and subjects. These are introduced in more detail on the [next page](/docs/sources/ruby-tracker/getting-started/index.md). There are also further classes which allow you to add extra data to your events, discussed on the page '[Adding data to your events: context and more](/docs/sources/ruby-tracker/adding-data-events/index.md)'.
