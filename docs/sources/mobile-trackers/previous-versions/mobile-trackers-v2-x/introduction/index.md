---
title: "Introduction"
date: "2021-04-12"
sidebar_position: 100
sidebar_label: "Introduction"
description: "Introduction to Mobile Trackers v2.0 configuration and setup."
keywords: ["mobile tracker v2", "configuration"]
---

The Mobile Trackers v2.0 can be configured at the startup with a set of Configuration objects. The entry point to setup the tracker is now the `Snowplow` class and the `createTracker` methods. They need a namespace string which is now mandatory.

The `createTracker` instance can be used to create multiple instances of the tracker in the same app. If you call it using a namespace already used, it will reconfigure the tracker with the same namespace. If you call it with a different namespace, the tracker will create a new independent tracker. Be sure to always use the same namespace if you want just a single instance of the tracker in the app

**Note**: The app can have multiple trackers and they are identified by the namespace. It's important to note that all the events not sent to the collector but stored in the tracker are attached to a specific namespace. This means that if a new configuration uses a different namespace, all those unsent event will still stored in the tracker, with no way to send them to any collector. To send them you need to reuse the original namespace string.

### Configurations

Fine tuning of the tracker is now possible with Configuration classes.

These are the classes for the configuration of the tracker:

- `NetworkConfiguration`: to configure network connection with the Snowplow collector.
- `TrackerConfiguration`: to configure contexts and automatic events of the tracker, and general behavior.
- `SessionConfiguration`: to configure session behavior.
- `EmitterConfiguration`: to fine tune about how the tracker sends events to the collector.
- `SubjectConfiguration`: to specify details to send with events about the user and the platform.
- `GdprConfiguration`: to configure the GDPR context.
- `GlobalContextsConfiguration`: to configure the GlobalContexts feature to dynamically send created contexts with some selected events.

Many of these settings can be changed at runtime through the tracker instance (`TrackerController`). Through the TrackerController you can access other subcontrollers (`SessionController`, `NetworkController`, etc.) which allows detailed settings of the tracker.

#### NetworkConfiguration

Represents the network communication configuration allowing the tracker to be able to send events to the Snowplow collector.

- **endpoint**: URL of the collector that is going to receive the events tracked by the tracker. The URL can include the schema/protocol (e.g.: `http://collector-url.com`). In case the URL doesn't include the schema/protocol, the HTTPS protocol is automatically selected.
- **method**: The method used to send the requests (GET or POST).
- **networkConnection**: (optional) The NetworkConnection component which will control the communication between the tracker and the collector.
- **customPostPath**: A custom path which will be added to the endpoint URL to specify the complete URL of the collector when paired with the POST method.

#### TrackerConfiguration

Represents the configuration of the tracker and the core tracker properties. The TrackerConfiguration can be used to setup the tracker behavior indicating what should be tracked in term of automatic tracking and contexts/entities to track with the events.

- **appId**: Identifier of the app.
- **devicePlatform** = mobile: It sets the device platform the tracker is running on.
- **base64encoding** = true: It indicates whether the JSON data in the payload should be base64 encoded.
- **logLevel** = OFF: It sets the log level of tracker logs.
- **loggerDelegate** = null: It sets the logger delegate that receive logs from the tracker.
- **sessionContext** = true: Whether session context is sent with all the tracked events.
- **applicationContext** = true: Whether application context is sent with all the tracked events.
- **platformContext** = true: Whether mobile/platform context is sent with all the tracked events.
- **geoLocationContext** = false: Whether geo-location context is sent with all the tracked events.
- **screenContext** = true: Whether screen context is sent with all the tracked events.
- **screenViewAutotracking** = true: Whether enable automatic tracking of ScreenView events.
- **lifecycleAutotracking** = false: Whether enable automatic tracking of background and foreground transitions.
- **installAutotracking** = true: Whether enable automatic tracking of install event.
- **exceptionAutotracking** = true: Whether enable crash reporting.

**Note**: On Android, **lifecycleAutotracking** requires `androidx.lifecycle:lifecycle-extensions` among the dependencies of the app.

#### SessionConfiguration

Represents the configuration of a Session object which gets appended to each event sent from the Tracker and changes based on the timeout set for the inactivity of app when in foreground or background.

Session data is maintained for the life of the application being installed on a device. Essentially it will update if it is not accessed within a configurable timeout.

- **foregroundTimeout** = 30 min: The amount of time that can elapse before the session id is updated while the app is in the foreground.
- **backgroundTimeout** = 30 min: The amount of time that can elapse before the session id is updated while the app is in the background.

#### EmitterConfiguration

Represents the tracker configuration from the emission perspective. It can be used to setup details about how the tracker should treat the events once they have been processed but not yet sent.

- **bufferOption** = single: Sets whether the buffer should send events instantly or after the buffer has reached it's limit. By default, this is set to BufferOption Default.
- **emitRange** = 150: Maximum number of events collected from the EventStore to be sent in a request.
- **threadPoolSize** = 15: Maximum number of threads working in parallel in the tracker to send requests.
- **byteLimitGet** = 40000: Maximum amount of bytes allowed to be sent in a payload in a GET request.
- **byteLimitPost** = 40000: Maximum amount of bytes allowed to be sent in a payload in a POST request.
- **eventStore** (optional): Custom component with full ownership for persisting events before to be sent to the collector. If it's not set the tracker will use a SQLite database as default EventStore.

#### SubjectConfiguration

Represents the configuration of the subject. The SubjectConfiguration can be used to setup the tracker with the basic information about the user and the app which will be attached on all the events as contexts.

- **userId** = null: The custom user identifier.
- **useragent** = null: The custom user-agent. It overrides the user-agent used by default.
- **ipAddress** = null: The IP address (not automatically set).
- **timezone** (set by the tracker): The current timezone label.
- **language** (set by the tracker): The language set in the device.
- **screenResolution** (set by the tracker): The screen resolution.
- **screenViewPort** = null: The screen viewport.
- **colorDepth** = null: The color depth.

#### GdprConfiguration

This class allows the GDPR configuration of the tracker.

#### GlobalContextsConfiguration

This class allows the setup of Global Contexts which are attached to selected events. The contexts are generated automatically by the tracker following the rules and generators provided by the developer. Each generator is associated to a filter/rule and a tag string used as identifier of the GlobalContexts generator. The filter/rule select the events where to apply the context and the generator creates the context for that event. Through the tag string is possible to add and remove the GlobalContexts generators at runtime.

### Events (out of the box)

There are some events that can be used out of the box for the manual tracking.

General events:

- Structured
- SelfDescribing
- Timing

Screen event

- ScreenView

GDPR events

- ConsentWithdrawn and ConsentGranted (with ConsentDocument)

ECommerce events

- EcommerceTransaction (with EcommerceTransactionItem)

Simple notification tracking events

- PushNotification
