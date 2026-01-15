---
title: "User and session identifiers"
sidebar_label: "User and session"
sidebar_position: 180
description: "Track user and session identifiers including domain_userid, network_userid, session IDs, and custom business user IDs."
keywords: ["user identification", "session tracking", "domain_userid", "user_id", "session ID"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Snowplow tracks a number of different identifiers to help you understand user behavior across sessions and devices. Read more about these in the [User and session identifiers](/docs/events/identifiers/index.md) page.

The main user and session identifiers are tracked as:
* Atomic event properties
* Session entity properties

## User atomic event properties

These [properties](/docs/fundamentals/canonical-event/index.md#user-fields) can be assigned across all our trackers, regardless of the platform.

## Session entity

Some trackers can track an entity containing information about the current session.

The `client_session` entity contains data such as the session identifier and session index, as well as information about the previous session to help analysis.

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: true}}
  example={{
    sessionIndex: 7,
    sessionId: 'bca0fa0e-853c-41cf-9cc4-15048f6f0ff5',
    previousSessionId: 'fa008142-c427-4289-8424-6fb2b6576692',
    userId: '7a62ec9d-2aa0-4426-b014-eba2d0dcfebb',
    firstEventId: '1548BE58-4CE7-4A32-A5E8-2696ECE941F4',
    eventIndex: 66,
    storageMechanism: 'SQLITE',
    firstEventTimestamp: '2022-01-01T00:00:00Z'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a client-generated user session", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "client_session", "format": "jsonschema", "version": "1-0-2" }, "type": "object", "properties": { "userId": { "type": "string", "pattern": "^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$|^[0-9a-f]{16}$", "maxLength": 36, "description": "An identifier for the user of the session. It is set on app install." }, "sessionId": { "type": "string", "format": "uuid", "description": "An identifier for the session" }, "sessionIndex": { "type": "integer", "minimum": 0, "maximum": 2147483647, "description": "The index of the current session for this user" }, "eventIndex": { "type": [ "null", "integer" ], "minimum": 0, "maximum": 2147483647, "description": "Optional index of the current event in the session" }, "previousSessionId": { "type": [ "null", "string" ], "format": "uuid", "description": "The previous session identifier for this user" }, "storageMechanism": { "type": "string", "enum": [ "SQLITE", "COOKIE_1", "COOKIE_3", "LOCAL_STORAGE", "FLASH_LSO" ], "description": "The mechanism that the session information has been stored on the device" }, "firstEventId": { "type": [ "null", "string" ], "format": "uuid", "description": "The optional identifier of the first event for this session" }, "firstEventTimestamp": { "description": "Optional date-time timestamp of when the first event in the session was tracked", "type": [ "null", "string" ], "format": "date-time" } }, "required": [ "userId", "sessionId", "sessionIndex", "previousSessionId", "storageMechanism" ], "additionalProperties": false }} />


### Tracker support

This table shows the support for `client_session` entity tracking across the main [Snowplow tracker SDKs](/docs/sources/index.md).

| Tracker                                                                                      | Supported | Since version | Auto-tracking |
| -------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/session/index.md)                           | ✅         | 3.5.0         | ✅             |
| [iOS](/docs/sources/mobile-trackers/tracking-events/session-tracking/index.md)               | ✅         | 0.5.0         | ✅             |
| [Android](/docs/sources/mobile-trackers/tracking-events/session-tracking/index.md)           | ✅         | 0.5.0         | ✅             |
| [React Native](/docs/sources/react-native-tracker/tracking-events/session-tracking/index.md) | ✅         | 1.0.0         | ✅             |
| [Flutter](/docs/sources/flutter-tracker/sessions-and-data-model/index.md)                    | ✅         | 0.2.0         | ✅             |
| [Roku](/docs/sources/roku-tracker/adding-data/index.md)                                      | ✅         | 0.3.0         | ✅             |
| Node.js                                                                                      | ❌         |               |               |
| Golang                                                                                       | ❌         |               |               |
| [.NET](/docs/sources/net-tracker/setup/index.md)                                             | ✅         | 1.0.0         | ✅             |
| Java                                                                                         | ❌         |               |               |
| Python                                                                                       | ❌         |               |               |
| Scala                                                                                        | ❌         |               |               |
| Ruby                                                                                         | ❌         |               |               |
| Rust                                                                                         | ❌         |               |               |
| PHP                                                                                          | ❌         |               |               |
| [C++](/docs/sources/c-tracker/client-sessions/index.md)                                      | ✅         | 1.0.0         | ✅             |
| Unity                                                                                        | ❌         |               |               |
| Lua                                                                                          | ❌         |               |               |
| [Google Tag Manager](/docs/sources/google-tag-manager/settings-template/index.md)            | ✅         | v4            | ✅             |  |
