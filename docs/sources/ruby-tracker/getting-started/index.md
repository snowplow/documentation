---
title: "Get started with the Ruby tracker"
sidebar_label: "Getting started"
date: "2021-10-15"
sidebar_position: 0
description: "Install the Ruby tracker gem, initialize trackers with emitters, configure subject properties, and implement singleton pattern for Ruby and Rails apps."
keywords: ["ruby tracker setup", "gem installation", "singleton pattern"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

The Snowplow Ruby Tracker is compatible with Ruby 2.1+, including 3.0+. To add the Snowplow Tracker to your Ruby app or gem, add this line to your Gemfile:

<CodeBlock language="ruby">{
`gem 'snowplow-tracker', '~> ${versions.rubyTracker}'`
}</CodeBlock>

To make the Snowplow Ruby Tracker work with as many different Ruby programs as possible, we have tried to keep external dependencies to a minimum. There are only two external dependencies currently, both of which are for development of the gem itself: [rspec](https://rspec.info/) and [webmock](https://rubygems.org/gems/webmock).

## Introduction to the tracker code

Find the Ruby tracker code [here](https://github.com/snowplow/snowplow-ruby-tracker), and the API documentation [here](https://snowplow.github.io/snowplow-ruby-tracker/index.html).

The main class of the Ruby tracker is the Tracker class. Trackers provide methods for tracking events, such as `track_page_view`. The Tracker creates an appropriate event payload out of the provided event properties. This payload is passed to one or more Emitters for sending to the event collector.

Data about users, and which platform (e.g. server-side app or mobile) the event occurred on, are managed by Subject objects. A Subject can be added to each event, and Trackers always have an associated Subject. Other information can be added to events using Page, DeviceTimestamp or TrueTimestamp objects, as well as via event context. Event context is added via SelfDescribingJson objects.

:::note
The Ruby tracker version 0.7.0 had some breaking changes, notably the addition of keyword arguments. Check out the tracker changelog [here](https://github.com/snowplow/snowplow-ruby-tracker/blob/master/CHANGELOG).
:::

## Tracking design and initialization

Designing how and what to track in your app is an important decision. Check out our docs about tracking design [here](/docs/event-studio/index.md).

We suggest implementing the Ruby tracker as a Singleton global object. This pattern is demonstrated in our [Ruby on Rails example app](https://github.com/snowplow-industry-solutions/snowplow-ruby-tracker-examples). Structuring your code in this way avoids wasting bandwidth or processing on reinitializing Trackers and Emitters for every page load or event sent.

Note that the [Rails demo](https://github.com/snowplow-industry-solutions/snowplow-ruby-tracker-examples) has both the Ruby and JavaScript trackers implemented. This combination of client- and server-side tracking can be highly effective and powerful. For example, you can discover how much effect adblockers are having on your tracking, by comparing the amount of client-side and server-side page view events you collect. It also allows you to track events in the most appropriate way for the event type. Check out this [blog post](https://snowplowanalytics.com/blog/2021/11/09/the-unrivaled-power-of-joining-client-and-server-side-tracking/) for more discussion about tracking client- and server-side.

The Tracker must be initialized with an Emitter or the subclass AsyncEmitter (or an array of Emitters/AsyncEmitters). The only required argument for an Emitter/AsyncEmitter is the endpoint, i.e. the address of the event collector.

Initializing a tracker instance:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
require 'snowplow-tracker'

emitter = SnowplowTracker::Emitter.new(endpoint: 'collector.example.com')
tracker = SnowplowTracker::Tracker.new(emitters: emitter)
# or
tracker = SnowplowTracker::Tracker.new(emitters: [emitter])
```

  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
require 'snowplow-tracker'

emitter = SnowplowTracker::Emitter.new('collector.example.com')
tracker = SnowplowTracker::Tracker.new(emitter)
# or
tracker = SnowplowTracker::Tracker.new([emitter])
```

  </TabItem>
</Tabs>


This Tracker will send events via GET to `http://collector.example.com/i`. To use other settings, such as POST or HTTPS, see "[Configuring how events are sent](/docs/sources/ruby-tracker/configuring-how-events-are-sent/index.md)".

:::warning
Do not include the protocol (HTTP or HTTPS) in your collector address. It will be added automatically.
:::

At initialization, two Tracker parameters can be set which will be added to all events. The first is the Tracker `namespace`. This is especially useful to distinguish between events from different Trackers, if more than one is being used. The second user-set Tracker property is the `app_id`. This is the unique identifier for the site or application, and is particularly useful for distinguishing between events when Snowplow tracking has been implemented in multiple apps.

A Tracker is always associated with a Subject. It will be generated automatically if one is not provided during initialization. It can be swapped out later for another Subject using `set_subject`.

The final initialization parameter is a setting for the base64-encoding of any JSONs in the event payload. The default is for JSONs to be encoded. Once the Tracker has been instantiated, it is not possible to change this setting.

Initializing a tracker instance with all possible settings used:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
require 'snowplow-tracker'

SnowplowTracker::Tracker.new(emitters: SnowplowTracker::Emitter.new(endpoint: 'collector.example.com'),
                             subject: SnowplowTracker::Subject.new,
                             namespace: 'tracker_no_encode',
                             app_id: 'rails_main',
                             encode_base64: false
                             )
```


  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
require 'snowplow-tracker'

SnowplowTracker::Tracker.new(SnowplowTracker::Emitter.new('collector.example.com'),
                             SnowplowTracker::Subject.new,
                             'tracker_no_encode',
                             'rails_main',
                             false
                             )
```

  </TabItem>
</Tabs>

You can create as many Tracker instances as you like within your app; each one is completely sandboxed. For example, you may wish to send certain events to a different collector endpoint (using a different Emitter), or with a different JSON base64-encoding choice. Make sure you set different Tracker namespaces when using multiple instances.

## Testing your tracking

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-tracking-with-micro/_index.md"

<TestingWithMicro/>
```

Check out our [Ruby tracker Rails demo](https://github.com/snowplow-industry-solutions/snowplow-ruby-tracker-examples) and [Snowplow Micro examples repo](https://github.com/snowplow-incubator/snowplow-micro-examples) for two examples of automated webapp testing using Snowplow Micro and the testing framework [Cypress](https://www.cypress.io/). Any end-to-end testing framework can be used.
