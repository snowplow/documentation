---
title: "Application error events"
sidebar_label: "Application error events"
sidebar_position: 30
description: "Automatically track exceptions and application errors with the application_error event schema on web and mobile."
keywords: ["error tracking", "exception tracking", "application_error", "crash reporting"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Exception (error) tracking captures exceptions within your application.

## Tracker support

This table shows the support for exception tracking across the main client-side Snowplow [tracker SDKs](/docs/sources/index.md). The server-side trackers don't include error tracking APIs.

| Tracker                                                                              | Supported | Since version | Auto-tracking | Notes                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------ | --------- | ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Web](/docs/sources/web-trackers/tracking-events/errors/index.md)                    | ✅         | 3.0.0         | ✅/❌           | Requires error tracking plugin. Track handled exceptions manually.                                                                                                                                                                   |
| [iOS](/docs/sources/mobile-trackers/tracking-events/exception-tracking/index.md)     | ✅         | 1.0.0         | ✅             |                                                                                                                                                                                                                                      |
| [Android](/docs/sources/mobile-trackers/tracking-events/exception-tracking/index.md) | ✅         | 1.0.0         | ✅             |                                                                                                                                                                                                                                      |
| React Native                                                                         | ❌         |               |               | Earlier versions of the React Native tracker supported error tracking for mobile platforms. This feature was removed in version 4.0.0 as it didn't work with JavaScript. Track errors manually using the `application_error` schema. |
| Flutter                                                                              | ❌         |               |               | Use the `application_error` schema for your own custom event.                                                                                                                                                                        |
| Roku                                                                                 | ❌         |               |               | Use the `application_error` schema for your own custom event.                                                                                                                                                                        |

## How to use the application error APIs

Exception autotracking is enabled by default in the native mobile trackers (iOS and Android).

The tracker will capture unhandled exceptions. These can crash the app, so it's likely that the event will be sent after restart. Note that in some situations, it may not be possible to capture all exception details before the app crashes.

The Errors plugin for the JavaScript trackers provides configuration for automatic tracking of unhandled exceptions, as well as a method for manually tracking handled exceptions.

## Event properties

All exception events use the same `application_error` schema, which has the following properties:

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: true}}
  example={{
    programmingLanguage: "JAVA",
    message: "java.lang.OutOfMemoryError error raised",
    exceptionName: "java.lang.OutOfMemoryError",
    isFatal: true,
    threadName: "main",
    threadId: 1,
    lineNumber: 10,
    className: "android.graphics.BitmapFactory",
    stackTrace: "java.lang.OutOfMemoryError"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an application error", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "application_error", "format": "jsonschema", "version": "1-0-2" }, "type": "object", "properties": { "programmingLanguage": { "type": "string", "enum": [ "JAVA", "SCALA", "KOTLIN", "GROOVY", "RUBY", "GOLANG", "JAVASCRIPT", "PHP", "PYTHON", "OBJECTIVEC", "SWIFT", "C", "CPLUSPLUS", "CSHARP", "ACTIONSCRIPT", "LUA", "RUST", "HASKELL", "CLOJURE", "ERLANG", "ELIXIR", "CRYSTAL", "PONY", "NIM" ] }, "message": { "type": "string", "maxLength": 2048 }, "threadName": { "type": ["string", "null"], "maxLength": 1024 }, "threadId": { "type": ["integer", "null"], "minimum": 0, "maximum": 2147483647 }, "stackTrace": { "type": ["string", "null"], "maxLength": 8192 }, "causeStackTrace": { "type": ["string", "null"], "maxLength": 8192 }, "lineNumber": { "type": ["integer", "null"], "minimum": 0, "maximum": 2147483647 }, "className": { "type": ["string", "null"], "maxLength": 1024 }, "exceptionName": { "type": ["string", "null"], "maxLength": 1024 }, "isFatal": { "type": ["boolean", "null"] }, "lineColumn": { "type": ["integer", "null"], "minimum": 0, "maximum": 2147483647 }, "fileName": { "type": ["string", "null"], "maxLength": 1024 } }, "required": ["programmingLanguage", "message"], "additionalProperties": false }} />
