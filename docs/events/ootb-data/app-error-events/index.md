---
title: "Application error events"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

Exception (error) tracking captures any unhandled exceptions within the application.

All tracked events are self-describing events that follow the `application_error` schema.

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

### How to track?

Both our Web and mobile trackers provide an automatic exception tracking feature.
Visit the following links to learn more about error tracking:

1. On Web, using the [error tracking plugin for the JavaScript tracker](/docs/sources/web-trackers/tracking-events/errors/index.md)
2. [iOS and Android tracking documentation](/docs/sources/mobile-trackers/tracking-events/exception-tracking/index.md).
