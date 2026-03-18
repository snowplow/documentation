---
title: "Payload and logging"
sidebar_label: "Payload and logging"
date: "2022-05-12"
sidebar_position: 100
description: "Understand tracker payload structure and logging configuration in Java tracker v0.11."
keywords: ["tracker payload", "logging configuration"]
---

A Payload interface is used for implementing a TrackerPayload and SelfDescribingJson, but accordingly, can be used to implement your own Payload class if you choose.

### Tracker Payload

A TrackerPayload is used internally within the Java Tracker to create the tracking event payloads that are passed to an Emitter to be sent accordingly. It is essentially a wrapper around a `LinkedHashMap<String, String>` and does basic validation to ensure all key-value pairs are valid non-null and non-empty Strings.

### SelfDescribingJson

A SelfDescribingJson is used primarily to ease construction of self-describing JSON objects. It is a wrapper around a `LinkedHashMap<String, Object>` and will only ever contain two key-value pairs. A `schema` key with a valid schema value and a `data` key containing a `Map` of key-value pairs.

This is used under the hood but is also useful for to know about when attaching custom contexts to events or creating `Unstructured` events.

Here's a short example:

```java
// This is the Map we have created
Map<String, String> eventData = new HashMap<>();
eventData.put("Event", "Data")

// We wrap that map in a SelfDescribingJson before sending it
SelfDescribingJson json = new SelfDescribingJson("iglu:com.acme/example/jsonschema/1-0-0", eventData);
```

## Logging

Logging in the Tracker is done using SLF4J. The majority of the logging set as `DEBUG` so it will not overly populate your own logging.

Since Java tracker v0.11, user-supplied values are only logged at `DEBUG` level.
