---
title: "Initialize and configure the Flutter tracker"
sidebar_label: "Initialization and configuration"
sidebar_position: 2000
description: "Initialize the Flutter tracker with createTracker method and configure TrackerConfiguration, SubjectConfiguration, GdprConfiguration, and EmitterConfiguration. Set up app identifiers, context entities, session tracking, and anonymous tracking options."
keywords: ["flutter configuration", "tracker initialization", "tracker configuration", "subject configuration", "gdpr configuration"]
---

The package provides a single method to initialize and configure a new tracker, the `Snowplow.createTracker` method. It accepts configuration parameters for the tracker and returns a `SnowplowTracker` instance.

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
    namespace: 'ns1',
    endpoint: 'http://...',
    trackerConfig: const TrackerConfiguration(...),
    gdprConfig: const GdprConfiguration(...),
    subjectConfig: const SubjectConfiguration(...));
);
```

The method returns a `SnowplowTracker` instance. This can be later used for tracking events, or accessing tracker properties. However, all methods provided by the `SnowplowTracker` instance are also available as static functions in the `Snowplow` class but they require passing the tracker namespace as string.

The only required attributes of the `Snowplow.createTracker` method are `namespace` used to identify the tracker, and the Snowplow collector `endpoint`. Additionally, one can configure the HTTP method to be used when sending events to the collector, as well as a custom POST path, and provide configuration by instantiating classes for `TrackerConfiguration`, `SubjectConfiguration`, or `GdprConfiguration`. By default, events are sent by POST. The following arguments are accepted by the `Snowplow.createTracker` method:

| Attribute        | Type                    | Description                                                                          |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `namespace`      | `String`                | Tracker namespace to identify the tracker.                                           |
| `endpoint`       | `String`                | URI for the Snowplow collector endpoint.                                             |
| `method`         | `Method?`               | HTTP method to use: `Method.get` or `Method.post` (`Method.post` is default).        |
| `customPostPath` | `String?`               | Custom POST path.                                                                    |
| `requestHeaders` | `Map<String, String>?`  | Map of custom HTTP headers to add to requests to the collector.                      |
| `trackerConfig`  | `TrackerConfiguration?` | Configuration of the tracker and the core tracker properties.                        |
| `gdprConfig`     | `GdprConfiguration?`    | Determines the GDPR context that will be attached to all events sent by the tracker. |
| `subjectConfig`  | `SubjectConfiguration?` | Subject information about tracked user and device that is added to events.           |
| `emitterConfig`  | `EmitterConfiguration?` | Configuration for how the events are sent.                                           |

:::note
The ability to set `customPostPath` was added in v0.2.0. Setting a custom POST path can be useful in avoiding adblockers; it replaces the default "com.snowplowanalytics/snowplow/tp2". Your event collector must also be configured to accept the custom path.
:::
:::note
The `EmitterConfiguration` class was added in v0.3.0.
:::

## Configuration of tracker properties: `TrackerConfiguration`

`TrackerConfiguration` provides options to configure properties and features of the tracker. In addition to setting the app identifier and device platform, the configuration enables turning several automatic context entities on and off.

| Attribute                      | Type                         | Description                                                                                                                                                                                | Android | iOS | Web | Default                                       |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | --- | --- | --------------------------------------------- |
| `appId`                        | `String?`                    | Identifier of the app.                                                                                                                                                                     | ✔       | ✔   | ✔   | null on Web, bundle identifier on iOS/Android |
| `devicePlatform`               | `DevicePlatform?`            | The device platform the tracker runs on. Available options are provided by the `DevicePlatform` enum.                                                                                      | ✔       | ✔   | ✔   | "web" on Web, "mob" on iOS/Android            |
| `base64Encoding`               | `bool?`                      | Indicates whether payload JSON data should be base64 encoded.                                                                                                                              | ✔       | ✔   | ✔   | true                                          |
| `platformContext`              | `bool?`                      | Indicates whether [platform](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-2) (mobile) entity should be attached to tracked events.          | ✔       | ✔   |     | true                                          |
| `geoLocationContext`           | `bool?`                      | Indicates whether [geo-location](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0) entity should be attached to tracked events.          | ✔       | ✔   | ✔   | false                                         |
| `sessionContext`               | `bool?`                      | Indicates whether [session](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) entity should be attached to tracked events.                    | ✔       | ✔   | ✔   | true                                          |
| `webPageContext`               | `bool?`                      | Indicates whether a context entity about current [web page](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0) should be attached to tracked events. |         |     | ✔   | true                                          |
| `screenContext`                | `bool?`                      | Indicates whether [screen](http://iglucentral.com/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) entity should be attached to tracked events.                               | ✔       | ✔   |     | true                                          |
| `applicationContext`           | `bool?`                      | Indicates whether [application](http://iglucentral.com/schemas/com.snowplowanalytics.mobile/application/jsonschema/1-0-0) entity should be attached to tracked events.                     | ✔       | ✔   |     | true                                          |
| `webActivityTracking`          | `WebActivityTracking?`       | Enables activity tracking using page views and pings on the Web.                                                                                                                           |         |     | ✔   | true                                          |
| `userAnonymisation`            | `bool?`                      | Anonymizes certain user identifiers.                                                                                                                                                       | ✔       | ✔   | ✔   | false                                         |
| `lifecycleAutotracking`        | `bool?`                      | Indicates whether the [lifecycle](iglu:com.snowplowanalytics.mobile/application_lifecycle/jsonschema/1-0-0) entity and foreground and background events should be autotracked.             | ✔       | ✔   |     | true                                          |
| `screenEngagementAutotracking` | `bool?`                      | Indicates whether to enable tracking of the screen end event and the screen summary context entity.                                                                                        | ✔       | ✔   |     | true                                          |
| `platformContextProperties`    | `PlatformContextProperties?` | Overrides for the values for properties of the platform context entity.                                                                                                                    | ✔       | ✔   |     | null                                          |

:::note
The ability to enable `userAnonymisation`, or the screen and application context entities, was added in v0.3.0.
:::

:::note
The ability to enable `lifecycleAutotracking` was added in v0.5.0.
:::

The optional `WebActivityTracking` property configures page tracking on Web. Initializing the configuration will inform `SnowplowObserver` observers (see section on auto-tracking in "Tracking events") to auto track `PageViewEvent` events instead of `ScreenView` events on navigation changes. Further, setting the `minimumVisitLength` and `heartbeatDelay` properties of the `WebActivityTracking` instance will enable activity tracking using 'page ping' events on Web.

Activity tracking monitors whether a user continues to engage with a page over time, and record how they digest content on the page over time. That is accomplished using 'page ping' events. If activity tracking is enabled, the web page is monitored to see if a user is engaging with it. (E.g. is the tab in focus, does the mouse move over the page, does the user scroll etc.) If any of these things occur in a set period of time (`minimumVisitLength` seconds from page load and every `heartbeatDelay` seconds after that), a page ping event fires, and records the maximum scroll left / right and up / down in the last ping period. If there is no activity in the page (e.g. because the user is on a different browser tab), no page ping fires.

Lifecycle autotracking is only available on mobile apps (iOS and Android). When configured (it is enabled by default), a Lifecycle context entity is attached to all events. It records whether the app was visible or not when the event was tracked. In addition, a `Background` event will be tracked when the app is moved to background, and a `Foreground` event when the app moves back to foreground (becomes visible on the screen).

Screen engagement autotracking is also only available on mobile apps (iOS and Android). When configured (it is enabled by default), a screen summary context entity will be tracked along with screen end, foreground and background events. Make sure that you have lifecycle autotracking enabled for screen summary to have complete information.

See [this page](/docs/sources/flutter-tracker/anonymous-tracking/index.md) for information about anonymous tracking.

## Configuration of emitter properties: `EmitterConfiguration`

This Configuration class was added in v0.3.0. Currently, the only property is `serverAnonymisation`.

| Attribute             | Type    | Description                                        | Android | iOS | Web | Default |
| --------------------- | ------- | -------------------------------------------------- | ------- | --- | --- | ------- |
| `serverAnonymisation` | `bool?` | Prevents tracking of server-side user identifiers. | ✔       | ✔   | ✔   | false   |

## Configuration of subject information: `SubjectConfiguration`

Subject information are persistent and global information about the tracked device or user. They apply to all events and are assigned as event properties.

Some of the properties are only configurable on iOS and Android and are automatically assigned on the Web.

| Attribute          | Type      | Description                                                     | Android | iOS | Web                              | Default |
| ------------------ | --------- | --------------------------------------------------------------- | ------- | --- | -------------------------------- | ------- |
| `userId`           | `String?` | Business ID of the user.                                        | ✔       | ✔   | ✔                                |         |
| `networkUserId`    | `String?` | Network user ID (UUIDv4).                                       | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `domainUserId`     | `String?` | Domain user ID (UUIDv4).                                        | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `userAgent`        | `String?` | Custom user-agent. It overrides the user-agent used by default. | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `ipAddress`        | `String?` | IP address.                                                     | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `timezone`         | `String?` | The timezone label.                                             | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `language`         | `String?` | The language set on the device.                                 | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `screenResolution` | `Size?`   | The screen resolution on the device.                            | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `screenViewport`   | `Size?`   | The screen viewport.                                            | ✔       | ✔   | Non-configurable, auto-assigned. |         |
| `colorDepth`       | `double?` | The color depth.                                                | ✔       | ✔   | Non-configurable, auto-assigned. |         |

The configured attributes are mapped to Snowplow event properties described in the [Snowplow Tracker Protocol](/docs/events/index.md). They are mapped as follows:

| Attribute                 | Event Property      |
| ------------------------- | ------------------- |
| `userId`                  | `uid`               |
| `networkUserId`           | `network_userid`    |
| `domainUserId`            | `domain_userid`     |
| `userAgent`               | `useragent`         |
| `ipAddress`               | `user_ipaddress`    |
| `timezone`                | `os_timezone`       |
| `language`                | `lang`              |
| `screenResolution.width`  | `dvce_screenwidth`  |
| `screenResolution.height` | `dvce_screenheight` |
| `screenViewport.width`    | `br_viewwidth`      |
| `screenViewport.height`   | `br_viewheight`     |
| `colorDepth`              | `br_colordepth`     |

## GDPR context entity configuration: `GdprConfiguration`

Determines the GDPR context that will be attached to all events sent by the tracker.

| Attribute             | Type     | Description                  | Android | iOS | Web | Default |
| --------------------- | -------- | ---------------------------- | ------- | --- | --- | ------- |
| `basisForProcessing`  | `String` | Basis for processing.        | ✔       | ✔   | ✔   |         |
| `documentId`          | `String` | ID of a GDPR basis document. | ✔       | ✔   | ✔   |         |
| `documentVersion`     | `String` | Version of the document.     | ✔       | ✔   | ✔   |         |
| `documentDescription` | `String` | Description of the document. | ✔       | ✔   | ✔   |
