---
title: "Timestamps"
description: ""
date: "2025-05-15"
sidebar_position: 4
---

Snowplow events have multiple timestamps that are added as the payload moves through the pipeline.

The timestamps are:

| Timestamp             | Added by                                                                            | Description                                                                                                                                                            | In all events |
| --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `dvce_created_tstamp` | [Tracker](/docs/sources/trackers/index.md)                                          | The device's timestamp when the event was created                                                                                                                      | ✅             |
| `dvce_sent_tstamp`    | [Tracker](/docs/sources/trackers/index.md)                                          | The device's timestamp when the event was successfully sent to the Collector endpoint                                                                                  | ✅             |
| `true_tstamp`         | You                                                                                 | Exact timestamp, defined within your tracking code                                                                                                                     | ❌             |
| `collector_tstamp`    | [Collector](/docs/pipeline/collector/index.md)                                      | When the Collector received the event payload                                                                                                                          | ✅             |
| `derived_tstamp`      | [Enrich](/docs/api-reference/enrichment-components/index.md)                        | Calculated from other timestamps, or the same as `true_tstamp`                                                                                                         | ✅             |
| `etl_tstamp`          | [Enrich](/docs/api-reference/enrichment-components/index.md)                        | The time at which Enrich started processing the event                                                                                                                  | ✅             |
| `refr_device_tstamp`  | [Enrich](/docs/api-reference/enrichment-components/index.md)                        | Timestamp extracted from the [cross-domain navigation query string](/docs/pipeline/enrichments/available-enrichments/cross-navigation-enrichment/index.md), if present | ❌             |
| `load_tstamp`         | [Loader](/docs/destinations/warehouses-lakes/loading-process/index.md) or warehouse | Timestamp when the event was loaded into the warehouse                                                                                                                 | ✅             |

The `load_tstamp` is added either by the Loader or by the warehouse at the point of loading, depending on the Loader/warehouse.

## Derived timestamp

Snowplow recommends using the `derived_tstamp` as the primary event timestamp for analysis.

It's calculated as `collector_tstamp` minus the difference between the `dvce_sent_tstamp` and the `dvce_created_tstamp`. Alternatively, if `true_tstamp` is available, `derived_tstamp` is the same as `true_tstamp`.

This derived timestamp allows for devices with incorrectly set clocks, or delays in event sending due to network outages.

The calculation has two assumptions:
* We assume that, although `dvce_created_tstamp` and `dvce_sent_tstamp` can both be inaccurate, they're inaccurate in precisely the same way. If the device clock is 15 minutes fast at event creation, then it remains 15 minutes fast at event sending, whenever that might be.
* We assume that the time taken for an event to get from the device to the Collector is neglible, i.e. the lag between `dvce_sent_tstamp` and `collector_tstamp` is 0 seconds.
