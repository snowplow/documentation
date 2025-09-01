---
title: "When to use stream or batch sources"
sidebar_position: 15
sidebar_label: "Stream or batch?"
---

Whether to compute attributes in real-time from the event stream, or in batch from the warehouse is an important decision. Broadly, you might use:
* **Stream** for real-time use cases, such as tracking the latest product a user viewed, or the number of page views in a session
* **Batch** sources (warehouse tables) for historical analysis, such as calculating a user's purchase history or average session length

This table summarizes the options for different types of processing:

| Feature                            | Supported in real-time stream                                                 | Supported in batch |
| ---------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| Computing user lifetime attributes | ✅ from the point at which the attribute was defined                           | ✅                  |
| Time windowing operations          | ✅ but only the last 100 values might be included, depending on the definition | ✅                  |
| Reprocessing data                  | ❌ attributes are only calculated from the moment they are defined             | ✅                  |

## Stream windowing operations

Stream attributes defined with a `period` setting, e.g., last 15 minutes, are limited to the most recent 100 instances of the specified event in the pipeline. Only those occurrences are considered in the calculation. As a result, if you need to analyze user behavior or aggregate data over longer periods—such as counting page views over several hours or tracking all purchases in the past year—stream attributes may not capture the full picture. TODO clarity

This isn't the case for stream attributes that don't have a `period` window defined. In this case, Signals considers all events—starting from the time the attribute was defined—and values aren't forgotten.

## New or existing batch attributes

TODO

For batch attributes, you'll also need to set up a dbt project to run the attribute calculation models, and to provide Signals with details of the created table. Alternatively, you can use any pre-existing table. Check out the [batch engine tutorial](/tutorials/signals-batch-engine/start/) to learn more.
