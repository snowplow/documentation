---
title: "Event timestamps"
---

### Timestamp parameters

| **Parameter** | **Table Column**           | **Type** | **Description**                                              | **Example values** |
|---------------|-----------------------|----------|--------------------------------------------------------------|--------------------|
| `dtm`         | `dvce_created_tstamp` | int      | Timestamp when event occurred, as recorded by client device  | `1361553733313`    |
| `stm`         | `dvce_sent_tstamp`    | int      | Timestamp when event was sent by client device to collector  | `1361553733371`    |
| `ttm`         | `true_tstamp`         | int      | User-set exact timestamp                                     | `1361553733371`    |
| `tz`          | `os_timezone`         | text     | Time zone of client devices OS                               | `Europe%2FLondon`  |

:::info

The Snowplow Collector will also capture `collector_tstamp` which the time the event arrived at the collector.

Snowplow will also calculate a `derived_tstamp` which attempts to make allowances for innaccurate device clocks.
The `ttm` field is used for a timestamp set on the client which should be taken as accurate. This will overwrite the `derived_tstamp` if set.

:::
