---
title: "When to use stream or batch sources"
sidebar_position: 15
sidebar_label: "Stream or batch?"
---

Whether to compute attributes in real-time from the event stream or in batch from the warehouse is an important decision. Broadly, you might use:
* **Stream** for real-time use cases, such as tracking the latest product a user viewed, or the number of page views in a session. Only Snowplow events can be considered.
* **Batch** sources (warehouse tables) for historical analysis, such as calculating a user's purchase history or average session length. You can use any data, even if it's not Snowplow events.

This table summarizes the options for different types of processing:

| Feature                            | Supported in real-time stream                                                 | Supported in batch |
| ---------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| Real-time calculation              | ✅                                                                             | ❌                  |
| Computing user lifetime attributes | ✅ from the point at which the attribute was defined                           | ✅                  |
| Time windowing operations          | ✅ but only the last 100 values might be included, depending on the definition | ✅                  |
| Reprocessing data                  | ❌ attributes are only calculated from the moment they are defined             | ✅                  |
| Non-Snowplow data                  | ❌                                                                             | ✅                  |

## Stream windowing attributes

Stream attributes defined with a `period` setting, e.g., last 15 minutes, are limited to the 100 most recent relevant events. Relevant events are those that cause the attribute value to be updated. As a result, if you need to analyze user behavior or aggregate data over longer periods, such as counting page views over several hours or tracking all purchases in the past year, stream attributes may not capture the full picture.

This isn't the case for stream attributes that don't have a `period` window defined. In this case, Signals considers all events—starting from the time the attribute was defined—and values aren't forgotten.

## Using non-Snowplow data

Signals allows you to use existing warehouse tables in two ways:
* Batch source: generate and calculate new tables of attributes from existing data, and sync them to the Profiles Store
* External batch source: sync tables of existing, pre-calculated values to the Profiles Store

The batch source tables can be any data, whether it's derived from Snowplow events or not. For example, you may want to include transactional data in your Signals use case.

Read more about using warehouse data in the [configuration](/docs/signals/configuration/batch-calculations/index.md) section.
