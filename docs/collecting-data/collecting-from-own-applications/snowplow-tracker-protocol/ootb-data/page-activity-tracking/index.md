---
title: "Page activity events (page pings)"
---

Page pings are used to record users engaging with content on a web page after it has originally loaded. For example, it can be used to track how far down an article a user scrolls.

If enabled, the [activity tracking function](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#activity-tracking-page-pings) checks for engagement with a page after load. (E.g. mousemovement, scrolling etc...).

Page pings are identified by `e=pp`. As well as all the standard web fields, there are four additional fields that `pp` includes, which are used to identify how users are scrolling over web pages:

| **Atomic Table Column**      | **Type** | **Description**                                     | **Example values** |
|----------|-----------------------------------------------------|--------------------|
| `pp_xoffset_min` | integer  | Minimum page x offset seen in the last ping period  | `0`                |
| `pp_xoffset_max` | integer  | Maximum page x offset seen in the last ping period  | `100`              |
| `pp_yoffset_min` | integer  | Minimum page y offset seen in the last ping period  | `0`                |
| `pp_yoffset_max` | integer  | Maximum page y offset seen in the last ping period  | `100`              |

## Use in modeling

Page ping events are used by our [Snowplow Web Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md) to calculate page engagement metrics.
