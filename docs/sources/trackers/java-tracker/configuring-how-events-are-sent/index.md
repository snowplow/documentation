---
title: "Configuring how events are sent"
description: "Configure event transmission settings in Java tracker for optimal behavioral data delivery."
schema: "TechArticle"
keywords: ["Java Configuration", "Event Sending", "Java Setup", "Transport Config", "Java Analytics", "Event Delivery"]
date: "2022-03-24"
sidebar_position: 50
---

A user interacts with your app: an event is generated and tracked using `Tracker.track()`. But the event must be sent to your event collector, to enter your pipeline, before it has any value.

The Java tracker allows configuration of the network connection, event sending, and buffering of events. All of these configurations are contained within the `NetworkConfiguration` and `EmitterConfiguration` classes. The default configurations will be sufficient for many Snowplow users. The tables below show the different configuration options you can set.

Using `NetworkConfiguration`:

| NetworkConfiguration | Description              | Required?                                    |
|----------------------|--------------------------|----------------------------------------------|
| collectorUrl         | Event collector endpoint | Yes, unless an `HttpClientAdapter` is provided |
| httpClientAdapter    | `HttpClientAdapter` object | No                                           |
| cookieJar            | OkHttp `CookieJar` object  | No                                           |

The URL path for your collector endpoint should include the protocol, "http" or "https".

Using `EmitterConfiguration`:

| EmitterConfiguration      | Description                                | Required? | Default |
|---------------------------|--------------------------------------------|-----------|---------|
| batchSize                 | Number of events to batch into one request | No        | 50      |
| bufferCapacity            | Maximum number of events buffered          | No        | 10 000  |
| eventStore                | `EventStore` object                        | No        |         |
| customRetryForStatusCodes | Map of HTTP status codes to retry or not   | No        |         |
| threadCount               | Number of threads to use                   | No        | 50      |
| requestExecutorService    | `ScheduledExecutorService` object          | No        |         |
| callback                  | `EmitterCallback` object                   | No        |         |

See the API docs for the full [NetworkConfiguration](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/configuration/NetworkConfiguration.html) and [EmitterConfiguration](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/configuration/EmitterConfiguration.html) details.

The default `Emitter` is the `BatchEmitter`, which sends events asynchronously in batches using POST requests. If you need to send events synchronously, or with GET requests, we have provided an `Emitter` interface so you can create your own.

To create a `Tracker` manually, start by initialising an `Emitter`. The simplest `BatchEmitter` initialisation looks like this:
```java
BatchEmitter emitter = new BatchEmitter(new NetworkConfiguration("http://collectorEndpoint"));
```

When an `Event` is tracked using `Tracker.track()`, a payload (`TrackerPayload`) is generated from the `Event`. The payload is added to the `BatchEmitter`'s `InMemoryEventStore` buffer. This triggers a check on the size of the buffer. The number of stored events is compared with the configured `batchSize`; the default is 50 events per batch. If there are enough events, a batch's worth is asynchronously removed from the buffer for sending. The `BatchEmitter` prepares a request payload containing all the event payloads, and attempts to send it. On receiving a successful HTTP response code (2xx), the events are considered sent, and permanently deleted from the buffer.

If the event buffer is full, the payload will be dropped. Priority is given to older events. In this case, `Tracker.track()` returns `null` rather than the payload `eventId`.

### What happens if an event fails to send?

After a sending attempt, the fate of an event depends on which status code was received. A 2xx code is always considered successful. If the `HttpClientAdapter` returns a failure code (anything other than 2xx, with certain exceptions, see below), the events (as `TrackerPayload` objects) are returned to the buffer. They will be retried in future sending attempts. The returned events are added to the start of the buffer queue, as older events are prioritised over newer ones.

To prevent unnecessary requests being made while the collector is unavailable, an exponential backoff is added to all subsequent event sending attempts. This resets after a request is successful. The maximum backoff time between attempts is 10 minutes.

The status codes `400 Bad Request`, `401 Unauthorised`, `403 Forbidden`, `410 Gone`, or `422 Unprocessable Entity` are the exceptions: they are not retried by default. Payloads in requests receiving these responses are not returned to the buffer for retry. They are just deleted.

Configure which codes to retry on or not using the `EmitterConfiguration` `customRetryForStatusCodes()` method when creating your tracker. This method takes a map of status codes and booleans (true for retry and false for not retry):

```java
// by default 403 isn't retried, but 500 is
Map<Integer, Boolean> customRetry = new HashMap<>();
customRetry.put(403, true);
customRetry.put(500, false);

Tracker tracker = Snowplow.createTracker(
                new TrackerConfiguration("namespace", "appId"),
                new NetworkConfiguration("https://collector"),
                new EmitterConfiguration().customRetryForStatusCodes(customCodes));

// A BatchEmitter can also be created directly
BatchEmitter emitter = new BatchEmitter(
      new NetworkConfiguration("https://collector"),
      new EmitterConfiguration().customRetryForStatusCodes(customRetry));
```
See below for information about retries within HTTP clients.

### Configuring how many events to send in one request

The BatchEmitter sends events in batches. This is more efficient than sending event requests singly, as only one set of POST headers is required for a number of events. The event collector receives the request and separates out the individual event payloads.

The default batch size is 50 events. If you have a high event volume, larger batches may be more suitable. However, there is theoretically a risk of creating oversized requests, which could result in `413 Payload Too Large` responses from your collector. The Java tracker and Snowplow collector do not currently have the ability to split oversized requests into smaller ones.

Configure the batch size like this:
```java
Tracker tracker = Snowplow.createTracker(
                new TrackerConfiguration("namespace", "appId"),
                new NetworkConfiguration("https://collector"),
                new EmitterConfiguration().batchSize(100));

// Batch size can be updated after initialization
tracker.getEmitter().setBatchSize(10)

// A BatchEmitter can also be created directly
BatchEmitter emitter = new BatchEmitter(
      new NetworkConfiguration("https://collector"),
      new EmitterConfiguration().batchSize(100))
```
The `batchSize` property was called `bufferSize` in versions before 0.12.

To force send all buffered events, as a single request:
```java
emitter.flushBuffer()
```

### Configuring how events are buffered

The Java tracker sends events asynchronously: the application is not blocked waiting for the tracked event to be sent. The tracked events are stored in memory until there are enough to send, or while the network is down. The default event store is `InMemoryEventStore`, added in version 0.12. This class stores the payloads in a queue, specifically a `LinkedBlockingDeque`.

The default buffer capacity is 10 000 events. This is the number of events that can be stored. When the buffer is full, new tracked payloads are dropped, so choosing the right capacity is important. If events are accumulating in your buffer because of a very high event volume, rather than because of network outages, consider using more threads (see below).

The theoretical maximum capacity is that of a`LinkedBlockingDeque`: `Integer.MAX_VALUE`. It's likely your application would run out of memory before buffering that many events. 

Creating a `BatchEmitter` with a custom maximum buffer capacity:
```java
Tracker tracker = Snowplow.createTracker(
                new TrackerConfiguration("namespace", "appId"),
                new NetworkConfiguration("https://collector-endpoint"),
                new EmitterConfiguration().bufferCapacity(100000));

// A BatchEmitter can also be created directly
BatchEmitter emitter = new BatchEmitter(
      new NetworkConfiguration("https://collector"),
      new EmitterConfiguration().bufferCapacity(100000));
```
The `BatchEmitter` in this tracker will store 100 000 events before starting to lose data.

We also provide an `EventStore` interface. To use a custom EventStore:
```java
Tracker tracker = Snowplow.createTracker(
                new TrackerConfiguration("namespace", "appId"),
                new NetworkConfiguration("https://collector-endpoint"),
                new EmitterConfiguration().eventStore(EventStore));

// A BatchEmitter can also be created directly
BatchEmitter emitter = new BatchEmitter(
      new NetworkConfiguration("https://collector"),
      new EmitterConfiguration().eventStore(EventStore));
```
If `bufferCapacity` is provided at the same time as `eventStore`, the `bufferCapacity` value will be discarded.

### Configuring the network connection

We currently offer two different HTTP clients that can be used to send events to your collector: OkHttp or Apache HTTP. Both libraries have broadly the same features, with some differences in their default configurations. If neither of these HTTP clients is suitable, we also provide an `HttpClientAdapter` interface. The `HttpClientAdapter` is a wrapper for HTTP client objects.

:::note
Gradle users: [different dependencies](/docs/sources/trackers/java-tracker/installation-and-set-up/index.md) can be configured if you are using OkHttp or Apache HTTP.
:::

By default, the Java tracker uses OkHttp; an `OkHttpClientAdapter` object is generated when a `BatchEmitter` is created. See below for how to use Apache HTTP instead, or how to customise the OkHTTP setup.

To specify a completely different client adapter, use the `HttpClientAdapter` interface and initialize the `Tracker` like this:
```java
HttpClientAdapter adapter = {{ your implementation here }}

Tracker tracker = Snowplow.createTracker(
                new TrackerConfiguration("namespace", "appId"),
                new NetworkConfiguration(adapter));
```
Note that `collectorUrl` is not a required parameter for `NetworkConfiguration` when an `HttpClientAdapter` is specified. The `collectorUrl` is normally used to create the default `OkHttpClientAdapter`, therefore if a URL was provided here, it would be ignored.

HTTP request retry can be configured within the HTTP clients, on top of the Java tracker's handling of unsuccessful requests. The default HTTP client, OkHttp, [retries after certain types of connection failure](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-ok-http-client/-builder/retry-on-connection-failure/) by default. The Apache HTTP Client [retries a request up to 3 times](https://www.javadoc.io/doc/org.apache.httpcomponents/httpclient/4.3.5/org/apache/http/impl/client/DefaultHttpRequestRetryHandler.html) by default. 

#### OkHttpClient
The simplest OkHttpClient initialization looks like this:
```java
OkHttpClient client = new OkHttpClient();
```
This is the default as used in the `BatchEmitter`.

To add configuration, pass a `OkHttpClientAdapter` during Tracker initialization.  
For example, setting timeouts:
```java
OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(5, TimeUnit.SECONDS)
      .readTimeout(5, TimeUnit.SECONDS)
      .writeTimeout(5, TimeUnit.SECONDS)
      .build();

OkHttpClientAdapter adapter = new OkHttpClientAdapter(
      "http://collector-endpoint.com", 
      client
);

Tracker tracker = Snowplow.createTracker(
                new TrackerConfiguration("namespace", "appId"),
                new NetworkConfiguration(adapter));
```
The URL is the address for your collector. See [Square's API docs](https://square.github.io/okhttp/3.x/okhttp/okhttp3/OkHttpClient.Builder.html) for the full list of options.

#### Apache HTTP Client
The simplest Apache HTTP Client initialization looks like this:
```java
CloseableHttpClient client = HttpClients.createDefault();
```
Wrap the Client in an `ApacheHttpClientAdapter` to pass it to the tracker during initialization.

You are encouraged to research how best to set up your Apache Client for maximum performance. For example, by default the Apache Client will never time out, and will also allow only two outbound connections at a time. In this code block, a `PoolingHttpClientConnectionManager` is used to allow up to 50 concurrent outbound connections:
```java
PoolingHttpClientConnectionManager manager = new PoolingHttpClientConnectionManager();
manager.setDefaultMaxPerRoute(50);

CloseableHttpClient client = HttpClients.custom()
      .setConnectionManager(manager)
      .build();

ApacheHttpClientAdapter adapter = new ApacheHttpClientAdapter(
      "http://collector-endpoint.com", 
      client
);

Tracker tracker = Snowplow.createTracker(
                new TrackerConfiguration("namespace", "appId"),
                new NetworkConfiguration(adapter));
```
The URL is the address for your collector. See [Apache's HttpClient docs](https://hc.apache.org/httpcomponents-client-4.5.x/index.html) for more information about configuring the client.

### Configuring the Java tracker threads

The `BatchEmitter` contains threads for concurrent event sending. This is managed by an `ScheduledThreadPoolExecutor`. By default, the thread pool has up to 50 threads, helpfully named e.g. "snowplow-emitter-pool-1-request-thread-1". The bigger the pool of threads, the faster events can be sent. Set the number of threads depending on many events you are sending, and how strong a computer the tracker is running on.

The process of getting events from the buffer, creating a request payload, and sending the POST request occurs within a single thread.

Specifying the maximum number of event sending threads, in this case to 1: 
```java
Tracker tracker = Snowplow.createTracker(
                  new TrackerConfiguration("namespace", "appId"),
                  new NetworkConfiguration("https://collector"),
                  new EmitterConfiguration().threadCount(1));

// A BatchEmitter can also be created directly
BatchEmitter emitter = new BatchEmitter(
      new NetworkConfiguration("https://collector"),
      new EmitterConfiguration().threadCount(1));
```

It's also possible to provide your own `ScheduledExecutorService`:
```java
Tracker tracker = Snowplow.createTracker(
                  new TrackerConfiguration("namespace", "appId"),
                  new NetworkConfiguration("https://collector"),
                  new EmitterConfiguration().requestExecutorService(ScheduledExecutorService));

// A BatchEmitter can also be created directly
BatchEmitter emitter = new BatchEmitter(
      new NetworkConfiguration("https://collector"),
      new EmitterConfiguration().requestExecutorService(ScheduledExecutorService));
```
The default thread pool uses non-daemon threads. To stop the threads and shut down the `ExecutorService`, call `Emitter.close()` (or `Tracker.close()`). There is no way to restart the `Emitter` after this.

### Persisting cookies using a CookieJar

:::note
The `OkHttpClientWithCookieJarAdapter` was released in the version 2.0.0 of the Java tracker.
:::

As described [here](/docs/sources/trackers/java-tracker/tracking-specific-client-side-properties/index.md), the event collector sets a third-party cookie. This cookie is extracted during event processing (enrichment phase) into the `network_userid` property, the server-side user identifier. To persist this cookie across requests, use the `OkHttpClientWithCookieJarAdapter` when creating your `BatchEmitter` or `Tracker`. Note that the `OkHttpClientWithCookieJarAdapter` uses an in-memory cookie jar, so the cookies, and `network_userid`, will not persist when it goes out of memory.

The simplest implementation looks like this:
```java
Tracker tracker = Snowplow.createTracker(
                  new TrackerConfiguration("namespace", "appId"),
                  new NetworkConfiguration(new OkHttpClientWithCookieJarAdapter("http://collector")));

// A BatchEmitter can also be created directly                       
BatchEmitter emitter = new BatchEmitter(networkConfig);
```

The specified `CookieJar` will be ignored if a custom `HttpClientAdapter` is provided. To use a `CookieJar` with a custom `OkHttpClientAdapter`, it must be added using the `OkHttpClient.Builder`:

```java
OkHttpClient httpClient = new OkHttpClient.Builder()
                  .cookieJar(new CollectorCookieJar())
                  .build();
adapter = new OkHttpClientAdapter("http://collectorEndpoint", httpClient);

Tracker tracker = Snowplow.createTracker(
                  new TrackerConfiguration("namespace", "appId"),
                  new NetworkConfiguration(adapter));
```

Any custom `OkHttp` `CookieJar` (other than the `CollectorCookieJar` provided in the tracker) could be used instead.

### Using the Emitter callback

To gain visibility on tracker activity, you may wish to take advantage of the `EmitterCallback` interface. This interface was added in v1.0.0, and requires `onSuccess()` and `onFailure()` methods.You can use `EmitterCallback` to create your own tracker metrics.

The `onSuccess()` callback is called when a request has successfully sent to the event collector (HTTP status code 2xx). It takes a list of the `TrackerPayload` objects that were batched into the request.

The `onFailure()` callback is called at several different points of failure. It also takes a list of the `TrackerPayload` objects involved, however, two other parameters are required. The first is the enum `FailureType`, explaining what kind of failure has occurred. The second is a boolean for whether or not the events will be returned to the buffer for sending retry.

The possible `FailureType` options are: `REJECTED_BY_COLLECTOR`, when HTTP status codes other than 2xx are received for a request; `TRACKER_STORAGE_FULL`, when events are lost because the `InMemoryEventStore` buffer is full; `HTTP_CONNECTION_FAILURE`, for unsuccessful requests or `HttpClientAdapter` exceptions; or `EMITTER_REQUEST_FAILURE`, for a `BatchEmitter` exception.

Configure a callback in your tracker like this:
```java
EmitterCallback callback = {{ your implementation here }}
Tracker tracker = Snowplow.createTracker(
                  new TrackerConfiguration("namespace", "appId"),
                  new NetworkConfiguration("https://collector"),
                  new EmitterConfiguration().callback(callback));
```
