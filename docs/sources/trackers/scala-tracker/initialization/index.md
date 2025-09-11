---
title: "Initialization"
description: "Initialize Scala tracker for behavioral event tracking in functional programming applications."
schema: "TechArticle"
keywords: ["Scala Initialization", "Scala Init", "Scala Setup", "Scala Configuration", "JVM Analytics", "Functional Programming"]
date: "2022-9-15"
sidebar_position: 10
---

Assuming you have completed the Scala Tracker Setup, you are ready to initialize the Scala Tracker.

## Emitters

Each tracker instance must be initialized with an Emitter which is responsible for firing events to a Collector. We offer two different modules of emitter: the http4s-emitter and the id-emitter

### ID Emitters

The emitters in the "id" module have a simpler developer interface, because return types are not wrapped in functional events. Use these emitters if your application code is not using any other typeclasses from the cats ecosystem.

The below code:

- Creates a non-blocking emitter `emitter1` which sends events to "mycollector.com" on the default port 80
- Creates a blocking emitter `emitter2` which sends events to “myothercollector.com” on port 8080
- Creates a tracker which can be used to send events to all emitters

```scala
import scala.concurrent.ExecutionContext.Implicits.global

import com.snowplowanalytics.snowplow.scalatracker.Tracker
import com.snowplowanalytics.snowplow.scalatracker.Emitter._
import com.snowplowanalytics.snowplow.scalatracker.emitters.id._
import cats.data.NonEmptyList

val emitter1 = AsyncEmitter.createAndStart(EndpointParams("mycollector.com"))
val emitter2 = SyncEmitter(EndpointParams("myothercollector.com", port = Some(8080)))
val tracker = new Tracker(NonEmptyList.of(emitter1, emitter2), "mytrackername", "myapplicationid")
```

When using this emitter, the methods on the tracker all return `Unit`, so there is no requirement to flatMap over effect types.

```scala
tracker.trackPageView("http://example.com") // returns Unit
tracker.trackTransaction("order1234", 42.0) // returns Unit
```

The `SyncEmitter` blocks the whole thread when it sends events to the collector. The `AsyncEmitter` sends requests asynchronously from the tracker's main thread of execution, but in doing so it blocks a thread on the provided execution for each http request. The blocking calls are wrapped in scala's [blocking construct](https://www.scala-lang.org/api/current/scala/concurrent/index.html#blocking[T](body:=%3ET):T), which is respected by the global execution context.

We reccomend using `AsyncEmitter` if possible as to not block threads, only using `SyncEmitter` if you have a specific need for sync in your setup. 

### Http4s Emitter

Backed by a [Http4s](https://http4s.org/) client, this emitter captures actions in the context of a functional effect type, such as a cats IO, ZIO or Monix Task. This is the recommended emitter if you are familiar with functional programming and the cats ecosystem of type classes.

```scala
import cats.data.NonEmptyList
import cats.effect.std.Random
import cats.effect.{IO, Resource}
import org.http4s.ember.client.EmberClientBuilder

import com.snowplowanalytics.snowplow.scalatracker._
import com.snowplowanalytics.snowplow.scalatracker.Emitter._
import com.snowplowanalytics.snowplow.scalatracker.emitters.http4s._

val resource: Resource[IO, Tracker[IO]] = for {
  client <- EmberClientBuilder.default[IO].build
  rng <- Resource.eval(Random.scalaUtilRandom[IO])
  emitter1 <- Http4sEmitter.build[IO](EndpointParams("mycollector.com"), client)(implicitly, rng)
  emitter2 <- Http4sEmitter.build[IO](EndpointParams("myothercollector.com", port = Some(8080)), client)(implicitly, rng)
} yield new Tracker(NonEmptyList.of(emitter1, emitter2), "mytrackername", "myapplicationid")

resource.use { tracker =>
  // Use the tracker inside this block to initialize and run your application
  MyApp.run(tracker)
}
```

The above code:

- Creates a Http4s client from the EmberClientBuilder. Http4s offers other variants of the client, but Ember is the recommended default choice.
- Creates a Random instance, required to randomize the delay on request retries
- Creates an emitter `emitter1` which sends events to "mycollector.com" on the default port 80
- Creates a second emitter `emitter2` which sends events to “myothercollector.com” on port 8080
- Creates a tracker which can be used to send events to all emitters

Your application might then use the tracker by flatMapping over the functional effect:

```scala
for {
  _ <- tracker.trackPageView("http://example.com")
  _ <- tracker.trackTransaction("order1234", 42.0)
} yield ()
```

## Subject

You can configure a subject with extra data and attach it to the tracker so that the data will be attached to every event:

```scala
val subject = new Subject()
  .setUserId("user-00035")
  .setPlatform(Desktop)
val tracker = Tracker(emitters, ns, appId).setSubject(subject)
```

Alternatively, you can set the subject for each event individually.

## Buffer Configuration

Emitters use a buffer, so they can send larger payloads comprising several events, instead of sending each event immediately. You can choose the behavior of your emitter's buffering by passing in a `BufferConfig` during initialisation. For example:

```scala
val emitter = Http4sEmitter.build[IO](endpoint, bufferConfig = PayloadSize(40000))
```

The available configs are:

- `EventsCardinality(size: Int)` Configures the emitter to buffer events and send batched payloads comprising a fixed number of events
- `PayloadSize(bytes: Int)` Configures the emitter to buffer events and send batched payloads of a minimum size in bytes
- `NoBuffering` Configures the emitter to send events immediately to the collector, without buffering for larger batches
- `OneOf(left: BufferConfig, right: BufferConfig)` Configures the emitter to buffer events until either of the inner BufferConfigs say the queue is full

## Retry Policies

Emitters can be configured to retry sending events to the collector if the initial attempt fails. For example:

```scala
val emitter = Http4sEmitter.build[IO](endpoint, retryPolicy = MaxAttempts(10))
```

The available policies are:

- `RetryForever` A RetryPolicy with no cap on maximum of attempts to send an event to the collector. This policy might appear attractive where it is critical to avoid data loss because it never deliberately drops events. However, it could cause a backlog of events in the buffered queue if the collector is unavailable for too long. This RetryPolicy could be paired with an `EventQueuePolicy` that manages the behavior of a large backlog.
- `MaxAttempts(max: Int)` A RetryPolicy which drops events after failing to contact the collector within a fixed number of attempts. This policy can smooth over short outages of connection to the collector. Events will be dropped only if the collector is unreachable for a relatively long span of time. Dropping events can be a safety mechanism against a growing backlog of unsent events.
- `NoRetry` A RetryPolicy that drops events immediately after a failed attempt to send to the collector.

## Event Queue Policy

An `EventQueuePolicy` becomes important when the queue of pending events grows to an unexpectedly large number; for example, if the collector is unreachable for a long period of time

Picking an EventQueuePolicy is an opportunity to protect against excessive heap usage by limiting the maximum size of the queue

An EventQueuePolicy can be paired with an appropriate `RetryPolicy`, which controls dropping events when they cannot be sent

For example:

```scala
val emitter = new Http4sEmitter(endpoint, queuePolicy = IgnoreWhenFull(100))
```

The available policies are:

- `UnboundedQueue`. An `EventQueuePolicy` with no upper bound on the number pending events in the emitter's queue. This policy never deliberately drops events, but it comes at the expense of potentially high heap usage if the collector is unavailable for a long period of time.
- `BlockwhenFull(limit: Int)`. An `EventQueuePolicy` that blocks the tracker's thread until the queue of pending events falls below a threshold. This policy never deliberately drops events, but it comes at the expense of blocking threads if the collector is unavailable for long period of time.
- `IgnoreWhenFull(limit: Int)`. An `EventQueuePolicy` that silently drops new events when the queue of pending events exceeds a threshold.
- `ErrorWhenFull(limit: Int)`. An `EventQueuePolicy` that raises an exception when the queue of pending events exceeds a threshold.

## Global contexts

You can configure your tracker to add a context to every event sent:

```scala
val tracker = Tracker(emitters, namespace, appId).addContext(selfDescribingJson)
```

There is also syntax for adding EC2 or GCE contexts automatically:

#### EC2 Context

Amazon [Elastic Cloud](https://aws.amazon.com/ec2/) can provide basic information about instance running your app. You can add this informational as additional custom context to all sent events by enabling it in Tracker after initializaiton of your tracker:

```scala
import com.snowplowanalytics.snowplow.scalatracker.metadata._
val tracker = Tracker(emitters, ns, appId).enableEc2Context()
```

#### Google Compute Engine Metadata context

Google [Cloud Compute Engine](https://cloud.google.com/compute) can provide basic information about instance running your app. You can add this informational as additional custom context to all sent events by enabling it in Tracker after initializaiton of your tracker:

```scala
import com.snowplowanalytics.snowplow.scalatracker.metadata._
val tracker = Tracker(emitters, ns, appId).enableGceContext()
```

This will add [`iglu:com.google.cloud.gce/instance_metadata/jsonschema/1-0-0`](https://github.com/snowplow/iglu-central/blob/152c90a72d5888460985ea43605afb5252180b10/schemas/com.google.cloud.gce/instance_metadata/jsonschema/1-0-0) context to all your events

## Callbacks

All emitters supplied with Scala Tracker support callbacks invoked after every sent event (or batch of events) whether it was successful or not. This feature particularly useful for checking collector unavailability and tracker debugging.

Callbacks should have following signature:

```scala
type Callback = (Emitter.EndpointParams, Emitter.Request, Emitter.Result) => Unit
```

- `EndpointParams` is collector configuration attached to emitter
- `Request` is raw collector's payload, which can be either `GET` or `POST` and holding number of undertaken attempts
- `Result` is processed collector's response or failure reason. You'll want to pattern-match it to either no-op or notify DevOps about non-working collector

To add a callback to `AsyncBatchEmitter` you can use following approach:

```scala
import com.snowplowanalytics.snowplow.scalatracker.Emitter._

def emitterCallback(params: EndpointParams, req: Request, res: Result): Unit = {
  res match {
    case Result.Success(_) => ()
    case Result.Failure(code) => 
      devopsIncident(s"Scala Tracker got unexpected HTTP code $code from ${params.getUri}")
    case Result.TrackerFailure(exception) => 
      devopsIncident(s"Scala Tracker failed to reach ${params.getUri} with following exception $exception after ${req.attempt} attempt")
    case Result.RetriesExceeded(failure) =>
      devopsIncident(s"Scala Tracker has stopped trying to deliver payload after following failure: $failure")
      savePayload(req)      // can be investigated and sent afterwards
  }
}

val emitter = AsyncEmitter.createAndStart(endpointParams, callback = Some(emitterCallback))
```

The async emitter will perform callbacks asynchronously in its `ExecutionContext`.
