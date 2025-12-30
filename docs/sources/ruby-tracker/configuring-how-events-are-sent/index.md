---
title: "Configure how events are sent for the Ruby tracker"
sidebar_label: "Configuring how events are sent"
date: "2021-10-26"
sidebar_position: 30
description: "Configure Ruby emitters and async emitters with collector endpoint, HTTP method, buffer size, and manual flushing for event delivery."
keywords: ["ruby emitter configuration", "async emitter", "event buffering"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

When you [initialize your Tracker object](/docs/sources/ruby-tracker/getting-started/index.md#tracking-design-and-initialization), you will need to provide one or more Emitter objects. Remember that we advise using the Singleton pattern, to avoid constantly recreating your objects.

There are two types of Emitter. The Emitter parent class can only send events synchronously. The AsyncEmitter subclass sends events asynchronously by default. We recommend you use the AsyncEmitter, to avoid slowing down your app.

Emitters and AsyncEmitters are initialized in the same way. An event collector endpoint is required, but there are various optional parameters that can also be set (see [API docs](https://snowplow.github.io/snowplow-ruby-tracker/SnowplowTracker/Emitter.html) and below table). A Tracker can have more than one associated Emitter or AsyncEmitter. These can be provided at Tracker initialization, or added later on.

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
emitter1 = SnowplowTracker::Emitter.new(endpoint: 'collector.example.com')
emitter2 = SnowplowTracker::AsyncEmitter.new(endpoint: 'collector2.example.com',
                                             options: { method: 'post' })
emitter3 = SnowplowTracker::AsyncEmitter.new(endpoint: 'collector.elsewhere.com',
                                             options: { protocol: 'https' })

tracker = SnowplowTracker::Tracker.new(emitters: [emitter1, emitter2])
tracker.add_emitter(emitter3)
```
  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
emitter1 = SnowplowTracker::Emitter.new('collector.example.com')
emitter2 = SnowplowTracker::AsyncEmitter.new('collector2.example.com',
                                             { method: 'post' })
emitter3 = SnowplowTracker::AsyncEmitter.new('collector.elsewhere.com',
                                             { protocol: 'https' })

tracker = SnowplowTracker::Tracker.new([emitter1, emitter2])
tracker.add_emitter(emitter3)
```
  </TabItem>
</Tabs>

Optional Emitter settings:

| **Optional parameter** | **Description**                                                   | **Default** |
| ---------------------- | ----------------------------------------------------------------- | ----------- |
| `path`                 | Override the default path for appending to the endpoint           | n/a         |
| `protocol`             | `http` or `https`                                                 | `http`      |
| `port`                 | The port for the connection                                       | n/a         |
| `method`               | `get` or `post`                                                   | `get`       |
| `buffer_size`          | The size of the buffer, i.e. the number of events to send at once | 1           |
| `on_success`           | A method to call if events were all sent successfully             | n/a         |
| `on_failure`           | A method to call if any events did not send                       | n/a         |
| `thread_count`         | Number of threads to use (relevant to AsyncEmitters only)         | 1           |
| `logger`               | Where to log                                                      | STDERR      |

Response status codes of 2xx or 3xx status codes are considered successful.

### Manual flushing

You may want to force an emitter to send all events in its buffer, even if the buffer is not full. The `Tracker` class has a `flush` method which flushes all its emitters. It accepts one argument, `async`, which defaults to false. Unless you set `async` to `true`, the flush will be synchronous: it will block until all queued events have been sent. Of course, if you are using Emitters rather than AsyncEmitters, the flush will always be synchronous, even if `async` is set to `true`.

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
# Synchronous flush
tracker.flush

# Asynchronous flush
tracker.flush(async: true)
```
  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
# Synchronous flush
tracker.flush

# Asynchronous flush
tracker.flush(true)
```
  </TabItem>
</Tabs>

### Logging

Emitters log messages about their activity and success during event sending. By default, Emitters log their activity to STDERR, using the Ruby standard library [Logger class](https://ruby-doc.org/stdlib-2.7.2/libdoc/logger/rdoc/Logger.html). Messages with a message level above INFO are logged. Advanced users might wish to alter how this logging occurs. You can change the message logging level, or, alternatively, you might want to disable logging completely, or log somewhere other than STDERR. Read how to do this in the [API docs](https://snowplow.github.io/snowplow-ruby-tracker/SnowplowTracker/Emitter.html).
