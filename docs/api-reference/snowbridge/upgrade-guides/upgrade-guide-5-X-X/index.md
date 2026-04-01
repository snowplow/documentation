---
id: "Snowbridge 5.x upgrade"
title: "Snowbridge 5.x upgrade guide"
sidebar_label: "Snowbridge 5.x upgrade"
date: "2026-03-11"
sidebar_position: 500
description: "Upgrade Snowbridge to version 5.X.X with breaking changes to transformation configuration, target batching, and metrics."
keywords: ["snowbridge 5.x upgrade", "upgrade guide", "snowbridge migration", "version 5"]
---

## Version 5.0.0 breaking changes

### All sources

`concurrent_writes` setting has been removed. Concurrency is now configured at transformation and target levels: see [batching model](/docs/api-reference/snowbridge/concepts/batching-model/index.md) for more details.

### Transformation configuration syntax

Multiple `transform {}` blocks are replaced by a single `transform {}` block containing multiple `use` sub-blocks.

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

### HTTP target

#### Headers configuration

`headers` setting now accepts an object structure to define custom headers.

**Before:**
```hcl
target {
  use "http" {
    ...
    headers  = "{\"Accept-Language\":\"en-US\"}"
  }
}
```

**After (5.0.0):**
```hcl
target {
  use "http" {
    ...
    headers = {
      Accept-Language = "en-US"
    }
  }
}
```

#### Removal of deprecated settings

`request_timeout_in_seconds` setting has been removed.

**Migration required**: use `request_timeout_in_millis` setting instead.


#### Batching options renamed and moved

The per-request sizing options on the HTTP target have been renamed and moved into a nested `batching {}` block.

| v4 field (top-level) | v5 field (inside `batching {}`) | Default |
|---|---|---|
| `request_max_messages` | `max_batch_messages` | `50` |
| `request_byte_limit` | `max_batch_bytes` | `1048576` |
| `message_byte_limit` | `max_message_bytes` | `1048576` |

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

### EventHub target

Fields have been renamed and moved into a nested `batching {}` block:

| v4 field (top-level) | v5 field (inside `batching {}`) | Default |
|---|---|---|
| `chunk_message_limit` | `max_batch_messages` | `500` |
| `chunk_byte_limit` | `max_batch_bytes` | `1048576` |
| `message_byte_limit` | `max_message_bytes` | `1048576` |
| `batch_byte_limit` | `max_batch_bytes` | `1048576` |

Two additional fields are new in v5:

| New field | Default | Description |
|---|---|---|
| `max_concurrent_batches` | `5` | Number of batches written to the target concurrently. |
| `flush_period_millis` | `500` | Milliseconds between timer-based batch flushes. |

**Before:**
```hcl
target {
  use "eventhub" {
    message_byte_limit         = 1000000
    chunk_byte_limit           = 1000000
    chunk_message_limit        = 501
    batch_byte_limit           = 1000000
  }
}
```

**After (5.0.0):**
```hcl
target {
  use "eventhub" {
    batching {
      max_batch_messages     = 501
      max_batch_bytes        = 10000000
      max_message_bytes      = 10000000
      max_concurrent_batches = 5
      flush_period_millis    = 500
    }
  }
}
```

### Kafka target

Fields have been renamed and moved into a nested `batching {}` block:

| v4 field (top-level) | v5 field (inside `batching {}`) | Default |
|---|---|---|
| `flush_messages` | `max_batch_messages` | `100` |
| `flush_bytes` | `max_batch_bytes` | `1048576` |
| `byte_limit` | `max_message_bytes` | `1048576` |
| `flush_frequency` | `flush_period_millis` | `500` |

One additional field is new in v5:

| New field | Default | Description |
|---|---|---|
| `max_concurrent_batches` | `5` | Number of batches written to the target concurrently. |

**Before:**
```hcl
target {
  use "kafka" {
    byte_limit      = 1000000
    flush_frequency = 2
    flush_messages  = 2
    flush_bytes     = 2
  }
}
```

**After (5.0.0):**
```hcl
target {
  use "kafka" {
    batching {
      max_batch_messages     = 501
      max_batch_bytes        = 10000000
      max_message_bytes      = 10000000
      flush_period_millis    = 500
      max_concurrent_batches = 5
    }
  }
}
```

### Kinesis target

Field have been renamed and moved into a nested `batching {}` block:

| v4 field (top-level) | v5 field (inside `batching {}`) | Default |
|---|---|---|
| `request_max_messages` | `max_batch_messages` | `500` |

Four additional fields are new in v5:

| New field | Default | Description |
|---|---|---|
| `max_batch_bytes`   | `5242880` | Maximum byte limit for a single batched request. |
| `max_message_bytes` | `1048576` | Maximum byte limit for individual message. |
| `max_concurrent_batches` | `5` | Number of batches written to the target concurrently. |
| `flush_period_millis` | `500` | Milliseconds between timer-based batch flushes. |

**Before:**
```hcl
target {
  use "kinesis" {
    request_max_messages = 1
  }
}
```

**After (5.0.0):**
```hcl
target {
  use "kinesis" {
    batching {
      max_batch_messages     = 1
      max_batch_bytes        = 5242880
      max_message_bytes      = 1048576
      max_concurrent_batches = 5
      flush_period_millis    = 500
    }
  }
}
```

### PubSub & SQS targets

Similarly to the rest of the targets, `PubSub` and `SQS` targets now support a nested `batching {}` block:

* Pubsub

| Field | Default | Description |
|---|---|---|
| `max_batch_messages` | `100` | Maximum number of events that can go into one batched request |
| `max_batch_bytes`   | `10485760` | Maximum byte limit for a single batched request. |
| `max_message_bytes` | `10485760` | Maximum byte limit for individual message. |
| `max_concurrent_batches` | `5` | Number of batches written to the target concurrently. |
| `flush_period_millis` | `500` | Milliseconds between timer-based batch flushes. |

* SQS

| Field | Default | Description |
|---|---|---|
| `max_batch_messages` | `10` | Maximum number of events that can go into one batched request |
| `max_batch_bytes`   | `1048576` | Maximum byte limit for a single batched request. |
| `max_message_bytes` | `1048576` | Maximum byte limit for individual message. |
| `max_concurrent_batches` | `5` | Number of batches written to the target concurrently. |
| `flush_period_millis` | `500` | Milliseconds between timer-based batch flushes. |

### All targets

If `batching {}` block is not specified for the selected target, then target would use it's default batching configuration.