---
title: "Configure how events are sent in the native mobile trackers"
sidebar_label: "Configuring how events are sent"
date: "2022-08-30"
sidebar_position: 40
description: "Configure network connections, event batching, and retry policies for sending events from mobile trackers to your collector."
keywords: ["event sending", "mobile tracker configuration", "network configuration"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

A user interacts with your app: an event is generated and tracked using `track` method of `TrackerController`. But the event must be sent to your event collector, to enter your pipeline, before it has any value.

The tracker allows the configuration of the network connection, event sending, and buffering of events. The default configurations will be sufficient for many Snowplow users but a better fine tuning can be set through the `EmitterConfiguration`.

## Configuring the network connection

The `NetworkConfiguration` is used to specify the collector endpoint:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let networkConfig = NetworkConfiguration(endpoint: "http://collector-endpoint")
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val networkConfig = NetworkConfiguration("http://collector-endpoint")
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
NetworkConfiguration networkConfig = new NetworkConfiguration("http://collector-endpoint");
```

  </TabItem>
</Tabs>


The URL path for your collector endpoint should include the protocol, "http" or "https". If not included in the URL, "https" connection will be used by default.

In particular cases it can be useful to have a full control of the component in charge to send the events. This can be achieved with a custom `NetworkConnection` that will take care to send the events to the collector:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let network = DefaultNetworkConnection(urlString: url, httpMethod: method)
network.emitThreadPoolSize = 20
network.byteLimitPost = 52000

let networkConfig = NetworkConfiguration(networkConnection: network)
```

In the example above we used the `DefaultNetworkConnection` but it can be used any custom component that implements the `NetworkConnection` interface.

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val connection = OkHttpNetworkConnectionBuilder(url, applicationContext)
    .method(method)
    .emitTimeout(10)
    .build()

val networkConfig = NetworkConfiguration(connection)
```

In the example above we used the `OkHttpNetworkConnection` but it can be used any custom component that implements the `NetworkConnection` interface.

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
OkHttpNetworkConnection connection =
      new OkHttpNetworkConnection.OkHttpNetworkConnectionBuilder(url, getApplicationContext())
            .method(method)
            .emitTimeout(10)
            .build();

NetworkConfiguration networkConfig = new NetworkConfiguration(connection);
```

In the example above we used the `OkHttpNetworkConnection` but it can be used any custom component that implements the `NetworkConnection` interface.

  </TabItem>
</Tabs>

## Persisting events with a custom EventStore

The tracker sends events asynchrounously in batches using POST requests. In case the collector is not reachable, the events are stored in an internal component called `EventStore` based on a SQLite database. The `EventStore` can be overriden with a custom one in case the developer require a different solution to persist the events before sending.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let eventStore = CustomEventStore(namespace: trackerNamespace);
let emitterConfig = EmitterConfiguration()
      .eventStore(eventStore)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val eventStore: EventStore = CustomEventStore(applicationContext, trackerNamespace)

val emitterConfiguration = EmitterConfiguration()
    .eventStore(eventStore)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EventStore eventStore = new CustomEventStore(getApplicationContext(), trackerNamespace);

EmitterConfiguration emitterConfiguration = new EmitterConfiguration()
      .eventStore(eventStore);
```

  </TabItem>
</Tabs>

In the example above the `CustomEventStore` is your implementation of the `EventStore` interface.

## What happens if an event fails to send?

The tracker has an option for setting response codes not to retry after. The intended use is for codes such as `400 Bad Request`, `401 Unauthorised`, `403 Forbidden`, `410 Gone`, `422 Unprocessable Entity`. When received in response from the Collector, the tracker doesn't retry to send events. Requests with all other 3xx, 4xx, and 5xx status codes are retried. The set of status codes for which events should be retried or not is customizable in `EmitterConfiguration`.

By default, the tracker retries sending events on all 3xx, 4xx, and 5xx status codes except the status codes indicated above. You may override the default behavior using the `customRetryForStatusCodes`. Please note that not retrying sending events to the Collector means that the events will be dropped when they fail to be sent. The `customRetryForStatusCodes` needs a dictionary that maps integers (status codes) to booleans (true for retry and false for not retry).

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let emitterConfig = EmitterConfiguration()
    .customRetryForStatusCodes({403, true}) // retry sending events even if collector returns 403 status
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val emitterConfiguration = EmitterConfiguration()
    .customRetryForStatusCodes(mapOf(
        403 to true
    ))
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EmitterConfiguration emitterConfiguration = new EmitterConfiguration()
      .customRetryForStatusCodes(new HashMap<>() {{ put(403, true); }});
```

  </TabItem>
</Tabs>

Starting from version 5.5.0, you can also completely disable retrying failed requests to the collector using the `EmitterConfiguration.retryFailedRequests` configuration option. If configured, events that fail to be sent in the first request to the collector will be dropped. This may be useful in situations where it's necessary to prevent traffic spikes with many events being sent at the same time.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let emitterConfig = EmitterConfiguration()
    .retryFailedRequests(false) // don't retry any failed requests to the collector (defaults to true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val emitterConfiguration = EmitterConfiguration()
    .retryFailedRequests(false) // don't retry any failed requests to the collector (defaults to true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EmitterConfiguration emitterConfiguration = new EmitterConfiguration()
      .retryFailedRequests(false); // don't retry any failed requests to the collector (defaults to true)
```

  </TabItem>
</Tabs>

## Configuring how many events to send in one request

There are two options in the `EmitterConfiguration` that are relevant for configuring how many events are sent per request to the collector:

1. `bufferOption` – How many events to wait for before making a request. Defaults to 1.
2. `emitRange` – The maximum amount of events to send in a request. Defaults to 25.

The `bufferOption` tells the tracker how many events have to accumulate in the event store before it should make a request to the collector.
There are three options: 1 (`BufferOption.single`), 10 (`BufferOption.smallGroup`), or 25 (`BufferOption.largeGroup`) events.
Choosing `BufferOption.smallGroup` means that 10 events need to be tracked before the first request to the collector is made.

With very high event volumes, or when many events are buffered in the event store (e.g. if the network had been down), the `emitRange` settings come into play.
This setting specifies the maximum number of events that can be sent in one request to the collector.
For instance, let's say that 100 events accumulate in the event store.
In case the default emit range (25) is used, the tracker will make 4 requests serially, one after the other, each with 25 events.

If the event store is empty when the tracker tries to send events - because another thread has just sent them - the thread sleeps for 5 seconds before trying again. If this happens 5 times in a row in the same thread, event sending will be paused for the whole tracker. It is restarted when a new event arrives.

Configure the batch size and emit range like this:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let emitterConfig = EmitterConfiguration()
      .bufferOption(BufferOption.single)
      .emitRange(25)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val emitterConfiguration = EmitterConfiguration()
    .bufferOption(BufferOption.Single)
    .emitRange(25)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EmitterConfiguration emitterConfiguration = new EmitterConfiguration()
      .bufferOption(BufferOption.Single)
      .emitRange(25);
```

  </TabItem>
</Tabs>

:::note Behavior before version 6.0.0 of the tracker
Before version 6 of the iOS and Android tracker, the `bufferOption` and `emitRange` had a slightly different meaning.
Events were sent right after they were tracked regardless of the `bufferOption` used.
The `bufferOption` was used to specify the maximum number of events per request and the `emitRange` specified the maximum number of total events to make in parallel requests at once.
For instance, if there were 100 events in the event store and `bufferOption` was set to 10 (called `defaultGroup` previously) and `emitRange` to 50, the tracker would make 5 parallel requests to the collector with 10 events each. After that it would make another 10 parallel requests to the collector with 10 events each.
:::

## Automatic clean up of the event store

:::note Not available before v6
This feature was introduced in version 6.0.0 of the iOS and Android trackers.
:::

Under some situations events may keep accumulating in the event store without the tracker being able to send them at all.
For instance, this may happen in case the user has an ad blocker installed or in case they permanently use the app offline.

If events accumulated in the event store without any limits, the size of the event store would keep getting bigger, potentially causing performance issues or app crashes.
To prevent this, the tracker automatically removes old events from the event store.
It removes old events based on two criteria that are configurable using `EmitterConfiguration`:

1. Maximum event store size (`maxEventStoreSize`) – in case the number of events surpasses this threshold, the oldest events will be removed until the number of events is under the threshold. Defaults to 1000.
2. Maximum event age (`maxEventStoreAge`) – events older than this threshold are removed. Defaults to 30 days.

The clean up is triggered before each emit attempt – before sending events to the collector.

You can configure the properties as follows.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let emitterConfig = EmitterConfiguration()
      .maxEventStoreSize(1000) // events
      .maxEventStoreAge(TimeInterval(60 * 60 * 24 * 30)) // 30 days
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val emitterConfiguration = EmitterConfiguration()
    .maxEventStoreSize(1000)
    .maxEventStoreAge(30.toDuration(DurationUnit.DAYS))
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EmitterConfiguration emitterConfiguration = new EmitterConfiguration()
      .maxEventStoreSize(1000)
      .maxEventStoreAge(Duration.ofDays(30).toKotlinDuration());
```

  </TabItem>
</Tabs>
