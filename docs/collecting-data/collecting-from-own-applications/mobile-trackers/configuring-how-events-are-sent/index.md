---
title: "Configuring how events are sent"
date: "2022-08-30"
sidebar_position: 40
---

# Configuring how events are sent

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

To prevent unnecessary requests being made while the collector is unavailable, a backoff is added to all subsequent event sending attempts. This resets after a request is successful.

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

The tracker sends events in batches. The tracker allows only a choice of 1 (`BufferOption.single`), 10 (`BufferOption.defaultGroup`), or 25 (`BufferOption.largeGroup`) events at maximum per request payload. 

The tracker checks for events to send every time an event is tracked. Normally, the new event will be sent immediately in its own request (no batching), regardless of the `BufferOption` setting.

With very high event volumes, or when many events are buffered in the event store (e.g. if the network had been down), the `BufferOption` settings come into play. The maximum number of events to remove from the eventStore at once (by one thread) is set by the `EmitterConfiguration.emitRange` property: 150 events by default. These events are processed into requests with a maximum `BufferOption` of events per request.

If the event store is empty when the tracker tries to send events - because another thread has just sent them - the thread sleeps for 5 seconds before trying again. If this happens 5 times in a row in the same thread, event sending will be paused for the whole tracker. It is restarted when a new event arrives.

Configure the batch size like this:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let emitterConfig = EmitterConfiguration()
      .bufferOption(BufferOption.defaultGroup)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val emitterConfiguration = EmitterConfiguration()
    .bufferOption(BufferOption.DefaultGroup)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EmitterConfiguration emitterConfiguration = new EmitterConfiguration()
      .bufferOption(BufferOption.DefaultGroup);
```

  </TabItem>
</Tabs>
