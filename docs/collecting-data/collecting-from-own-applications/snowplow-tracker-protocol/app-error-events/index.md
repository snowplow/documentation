---
title: "Application error events"
---

Exception (error) tracking captures any unhandled exceptions within the application.

 | 
---|---
Type | Event
Schema | `iglu://com.snowplowanalytics.snowplow/application_error/jsonschema/1-0-2` 
Web | ✅
Mobile | ✅
Atomic table field name | `unstruct_event_com_snowplowanalytics_snowplow_application_error_1`
Tracked automatically | ✅

All tracked events are self-describing events that follow the `application_error` schema.

<details>
  <summary>JSON schema of the application_error event</summary>
  <div>

```json title="iglu://com.snowplowanalytics.snowplow/application_error/jsonschema/1-0-2"
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an application error",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "application_error",
    "format": "jsonschema",
    "version": "1-0-2"
  },

  "type": "object",
  "properties": {
    "programmingLanguage": {
      "type": "string",
      "enum": [
        "JAVA",
        "SCALA",
        "KOTLIN",
        "GROOVY",
        "RUBY",
        "GOLANG",
        "JAVASCRIPT",
        "PHP",
        "PYTHON",
        "OBJECTIVEC",
        "SWIFT",
        "C",
        "CPLUSPLUS",
        "CSHARP",
        "ACTIONSCRIPT",
        "LUA",
        "RUST",
        "HASKELL",
        "CLOJURE",
        "ERLANG",
        "ELIXIR",
        "CRYSTAL",
        "PONY",
        "NIM"
      ]
    },
    "message": {
      "type": "string",
      "maxLength": 2048
    },
    "threadName": {
      "type": ["string", "null"],
      "maxLength": 1024
    },
    "threadId": {
      "type": ["integer", "null"],
      "minimum": 0,
      "maximum": 2147483647
    },
    "stackTrace": {
      "type": ["string", "null"],
      "maxLength": 8192
    },
    "causeStackTrace": {
      "type": ["string", "null"],
      "maxLength": 8192
    },
    "lineNumber": {
      "type": ["integer", "null"],
      "minimum": 0,
      "maximum": 2147483647
    },
    "className": {
      "type": ["string", "null"],
      "maxLength": 1024
    },
    "exceptionName": {
      "type": ["string", "null"],
      "maxLength": 1024
    },
    "isFatal": {
      "type": ["boolean", "null"]
    },
    "lineColumn": {
      "type": ["integer", "null"],
      "minimum": 0,
      "maximum": 2147483647
    },
    "fileName": {
      "type": ["string", "null"],
      "maxLength": 1024
    }
  },
  "required": ["programmingLanguage", "message"],
  "additionalProperties": false
}
```

   </div>
</details>

### How to track?

Both our Web and mobile trackers provide an automatic exception tracking feature.
Visit the following links to learn more about error tracking:

1. On Web, using the [error tracking plugin for the JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/error-tracking/index.md)
2. [iOS and Android tracking documentation](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/exception-tracking/index.md).
