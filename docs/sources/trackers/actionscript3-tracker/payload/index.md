---
title: "Payload"
date: "2020-02-25"
sidebar_position: 70
---

A Payload interface is used for implementing a TrackerPayload and SchemaPayload, but accordingly, can be used to implement your own Payload class if you choose.

### Tracker Payload

A TrackerPayload is used internally within the AS3 Tracker to create the tracking event payloads that are passed to an Emitter to be sent accordingly.

### Schema Payload

A SchemaPayload is used primarily as a wrapper around a TrackerPayload. After creating a TrackerPayload, you create a SchemaPayload and use `setData` with the Payload, followed by, `setSchema` to set the schema that the payload will be used against.

This is mainly used under the hood, in the Tracker class but is useful to know if you want to create your own Tracker class.

Here's a short example:

```java
// This is our TrackerPayload that we created
var payload:IPayload = new TrackerPayload();
trackerPayload.add("key", "value");

// We wrap that payload in a SchemaPayload before sending it.
var payload:SchemaPayload = new SchemaPayload();
payload.setSchema(Constants.SCHEMA_SCREEN_VIEW);
payload.setData(trackerPayload);
```
