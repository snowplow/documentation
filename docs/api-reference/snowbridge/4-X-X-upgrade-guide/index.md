---
title: "Snowbridge upgrade guide"
sidebar_label: "Snowbridge 5.x upgrade"
date: "2026-03-11"
sidebar_position: 500
description: "Upgrade Snowbridge to version 5.X.X with breaking changes to transformation configuration, target batching, and metrics."
keywords: ["snowbridge 5.x upgrade", "upgrade guide", "snowbridge migration", "version 5"]
---

## Version 5.0.0 breaking changes

### Transformation configuration syntax

**Breaking change**: multiple `transform {}` blocks are replaced by a single `transform {}` block containing multiple `use` sub-blocks.

**Migration required**: consolidate your transformation blocks into one.

**Before:**
```hcl
transform {
  use "spEnrichedFilter" {
    atomic_field  = "event_name"
    regex         = "^page_view$"
    filter_action = "keep"
  }
}

transform {
  use "js" {
    script_path = "/opt/script.js"
  }
}
```

**After (5.0.0):**
```hcl
transform {
  use "spEnrichedFilter" {
    atomic_field  = "event_name"
    regex         = "^page_view$"
    filter_action = "keep"
  }

  use "js" {
    script_path = "/opt/script.js"
  }
}
```

Transformations still run in the order they appear.

### HTTP target: batching options renamed and moved

**Breaking change**: the per-request sizing options on the HTTP target have been renamed and moved into a nested `batching {}` block.

| v4 field (top-level) | v5 field (inside `batching {}`) |
|---|---|
| `request_max_messages` | `max_batch_messages` |
| `request_byte_limit` | `max_batch_bytes` |
| `message_byte_limit` | `max_message_bytes` |

Two additional fields are new in v5:

| New field | Default | Description |
|---|---|---|
| `max_concurrent_batches` | `5` | Number of batches written to the target concurrently. |
| `flush_period_millis` | `500` | Milliseconds between timer-based batch flushes. |

**Before:**
```hcl
target {
  use "http" {
    url                  = "https://acme.com/x"
    request_max_messages = 20
    request_byte_limit   = 10000000
    message_byte_limit   = 10000000
  }
}
```

**After (5.0.0):**
```hcl
target {
  use "http" {
    url = "https://acme.com/x"

    batching {
      max_batch_messages     = 20
      max_batch_bytes        = 10000000
      max_message_bytes      = 10000000
      max_concurrent_batches = 5
      flush_period_millis    = 500
    }
  }
}
```

All other targets (Kafka, Kinesis, PubSub, SQS, EventHub) also gain the `batching {}` block in v5. If you do not configure it, target-specific defaults apply — see each target's configuration page.

### StatsD metrics: oversized messages no longer counted in failure metrics

**Breaking change**: the `failure_target_success` and `failure_target_failed` metrics now count only _invalid_ messages (data that could not be delivered and is not retryable). In v4 these metrics also included _oversized_ messages (messages exceeding the per-message byte limit).

Oversized messages are tracked as a separate concern in v5 and do not produce StatsD counter events.

If you have alerting or dashboards that rely on `failure_target_success` or `failure_target_failed` to cover oversized-message volumes, update those thresholds accordingly.

---

## Version 4.0.0 breaking changes

### HTTP target: ordered response rule evaluation

**Breaking change**: response rules are now evaluated in the order they are defined in the configuration, rather than being organized in separate `invalid` and `setup` blocks.

**Migration required**: update your HTTP target configuration to specify a `type` attribute for each rule.

**Before:**
```hcl
response_rules {
  invalid {
    http_codes = [400]
    body = "Invalid value for 'purchase' field"
  }
  setup {
    http_codes = [401, 403]
  }
}
```

**After (4.0.0):**
```hcl
response_rules {
  rule {
    type = "invalid"
    http_codes = [400]
    body = "Invalid value for 'purchase' field"
  }
  rule {
    type = "setup"
    http_codes = [401, 403]
  }
}
```

Rules are evaluated in the order they appear in your configuration. The first matching rule determines the error type.

---

## Version 3.0.0 breaking changes

The below breaking changes were made in version 3.0.0. All other functionality is backwards compatible.

### Lua support removed

Support for Lua transformations has been removed. If you are running a Lua transformation, you can port the logic to [Javascript](/docs/api-reference/snowbridge/configuration/transformations/custom-scripts/javascript-configuration/index.md) or [JQ](/docs/api-reference/snowbridge/configuration/transformations/builtin/jq.md).

### HTTP target: non-JSON data no longer supported

We never intended to support non-JSON data, but prior to version 3.0.0, the request body was simply populated with whatever bytes were found in the message data, regardless of whether it is valid JSON.

From version 3.0.0 onwards, only valid JSON will work, otherwise the message will be considered invalid and sent to the failure target.

### HTTP target: request batching

Many HTTP APIs allow sending several events in a single request by putting them into a JSON array. Since version 3.0.0, if the Snowbridge source provides data in batches, the HTTP target will batch events in this way.

As a consequence, even when the source provides events in a single event batch, it will now be placed into an array of one element. For example, prior to version 3.0.0, a request body might look like this:

```
{"foo": "bar"}
```

But it will now look like this:

```
[{"foo": "bar"}]
```
