---
title: "Initialization"
sidebar_label: "Initialization"
date: "2020-10-28"
sidebar_position: 2000
description: "Initialize Scala tracker 0.6.0 with async and sync emitters, configure subjects, enable EC2/GCE contexts, and add callbacks for event delivery."
keywords: ["scala 0.6 initialization", "async emitter", "batch emitter"]
---

## Tracker

Assuming you have completed the Scala Tracker Setup, you are ready to initialize the Scala Tracker.

```scala
import scala.concurrent.ExecutionContext.Implicits.global

import com.snowplowanalytics.snowplow.scalatracker._
import com.snowplowanalytics.snowplow.scalatracker.emitters._

val emitter1 = AsyncEmitter.createAndStart("mycollector.com")
val emitter2 = new SyncEmitter("myothercollector.com", port = 8080)
val emitter3 = AsyncBatchEmitter.createAndStart(host = "myothercollector.com", port = 8080, bufferSize = 32)
val tracker = new Tracker(List(emitter1, emitter2, emitter3), "mytrackername", "myapplicationid")
```

The above code:

- creates a non-blocking emitter, `emitter1`, with global execution context, which sends events to "mycollector.com" on the default port, port 80
- creates a blocking emitter, `emitter2`, which sends events to "myothercollector.com" on port 8080
- creates a non-blocking batch `emitter3`, with global execution context, which will buffer events until buffer size reach 32 events and then send all of them at once in POST request
- creates a tracker which can be used to send events to all emitters

## Subject

You can configure a subject with extra data and attach it to the tracker so that the data will be attached to every event:

```scala
val subject = new Subject()
  .setUserId("user-00035")
  .setPlatform(Desktop)
tracker.setSubject(subject)
```

## EC2 Context

Amazon [Elastic Cloud](https://aws.amazon.com/ec2/) can provide basic information about instance running your app. You can add this informational as additional custom context to all sent events by enabling it in Tracker after initializaiton of your tracker:

```scala
tracker.enableEc2Context()
```

## Google Compute Engine Metadata context

Google [Cloud Compute Engine](https://cloud.google.com/compute) can provide basic information about instance running your app. You can add this informational as additional custom context to all sent events by enabling it in Tracker after initializaiton of your tracker:

```scala
tracker.enableGceContext()
```

This will add [`iglu:com.google.cloud.gce/instance_metadata/jsonschema/1-0-0`](https://github.com/snowplow/iglu-central/blob/152c90a72d5888460985ea43605afb5252180b10/schemas/com.google.cloud.gce/instance_metadata/jsonschema/1-0-0) context to all your events

## Callbacks

All emitters supplied with Scala Tracker support callbacks invoked after every sent event (or batch of events) whether it was successful or not. This feature particularly useful for checking collector unavailability and tracker debugging.

Callbacks should have following signature:

```scala
type Callback = (CollectorParams, CollectorRequest, CollectorResponse) => Unit
```

- `CollectorParams` is collector configuration attached to emitter
- `CollectorRequest` is raw collector's payload, which can be either `GET` or `POST` and holding number of undertaken attempts
- `CollectorResponse` is processed collector's response or failure reason. You'll want to pattern-match it to either no-op or notify DevOps about non-working collector

To add a callback to `AsyncBatchEmitter` you can use following approach:

```scala
def emitterCallback(params: CollectorParams, req: CollectorRequest, res: CollectorResponse): Unit = {
  res match {
    case TEmitter.CollectorSuccess(_) => ()
    case TEmitter.CollectorFailure(code) => 
      devopsIncident(s"Scala Tracker got unexpected HTTP code $code from ${params.getUri}")
    case TEmitter.TrackerFailure(exception) => 
      devopsIncident(s"Scala Tracker failed to reach ${params.getUri} with following exception $exception after ${req.attempt} attempt")
    case TEmitter.RetriesExceeded(failure) =>
      devopsIncident(s"Scala Tracker has stopped trying to deliver payload after following failure: $failure")
      savePayload(req)      // can be investigated and sent afterwards
  }
}
val emitter = AsyncBatchEmitter.createAndStart(collector, port, bufferSize = 32, callback = Some(emitterCallback _))
```

All async emitters will perform callbacks asynchronously in their `ExecutionContext`.
