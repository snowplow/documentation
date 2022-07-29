---
title: "Sending event: Emitter"
date: "2020-02-25"
sidebar_position: 60
---

Events are sent using an `Emitter` class. You can initialize a class with a collector endpoint URL and optionally choose the HTTP `POST` method instead of `GET`.

```java
Emitter(uri:string, httpMethod:String)
```

For example:

```java
var e1:Emitter = new Emitter("d3rkrsqld9gmqf.cloudfront.net");
var e2:Emitter = new Emitter("d3rkrsqld9gmqf.cloudfront.net", URLRequestMethod.POST);
```

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `uri` | The collector endpoint URI events will be sent to | Yes |
| `httpMethod` | The HTTP method to use when sending events | No |

### Using a buffer

A buffer is used to group events together in bulk before sending them. This is useful to reduce network usage. By default, the AS3 Emitter does not buffer but instead sends events instantly as soon as they are created. You can use a buffer instead by calling setBufferOption with the number of events to batch together in the buffer:

```java
var e1:Emitter = new Emitter("d3rkrsqld9gmqf.cloudfront.net");
e1.setBufferOption(BufferOption.BATCH);
```

There are two predefined constants but you can use any integer value:

| **Option** | **Description** |
| --- | --- |
| BufferOption.DEFAULT | 1\. Events are sent as soon as they are created |
| BufferOption.BATCH | 10\. Sends events in a group when 10 events are created |

### Choosing the HTTP method

Snowplow supports receiving events via `GET` and `POST` requests. In a `GET` request, each event is sent in an individual request. With POST requests, events are bundled together in one request.

You can set the HTTP method in the Emitter constructor:

```java
var e1:Emitter = new Emitter("d3rkrsqld9gmqf.cloudfront.net", URLRequestMethod.POST);
```

The default method is `GET`.

Actionscript provides standard constants for the two options in the URLRequestMethod class:

URLRequestMethod.GET URLRequestMethod.POST

### Method of sending HTTP requests

An AS3 Emitter sends requests asynchronously. Flash does not support synchronous requests.

### Emitter callback

The AS3 Emitter dispatches events when it succeeds or fails to flush the buffer.

You can register event listeners for these events if you need to handle the success or failure case. Here is a sample bit of code to show how it could work:

```java
var emitter:Emitter = new Emitter(testURL);
emitter.addEventListener(EmitterEvent.SUCCESS, function(bufferLength:int) {
    trace("Buffer length for POST/GET:" + bufferLength);
  }
);
emitter.addEventListener(EmitterEvent.FAILURE, function (successCount:int, failedEvents:Array, errorString:String) {
    trace("Failure, successCount: " + successCount + "\nfailedEvents:\n" + failedEvents.toString() + "\nerror:\n" + errorString:String);
  }
);
```

In the example, we can see in-line handling of the both cases. If events are all successfully sent, the success callback method receives the number of successful events sent. If there were any failures, the failure callback method receives the number of successful events sent (if any) and a _Array of events_ that failed to be sent (i.e. the HTTP state code did not return 200). In addition, in the case of failure, an additional parameter is provided with the text of the network or security error that caused the failure.
