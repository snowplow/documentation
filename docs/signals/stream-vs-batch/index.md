---
title: "When to use stream or batch sources"
sidebar_position: 15
sidebar_label: "Stream or batch?"
---

Whether to compute attributes in real-time from the event stream, or in batch from the warehouse is an important decision. Broadly, you might use:
* **Stream** for real-time use cases, such as tracking the latest product a user viewed, or the number of page views in a session
* **Batch** sources (warehouse tables) for historical analysis, such as calculating a user's purchase history or average session length

This table summarizes the options for different types of processing:

| Feature                                 | Supported in stream                                                           | Supported in batch |
| --------------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| Computing user lifetime attributes      | ✅ from the point at which the attribute was defined                           | ✅                  |
| Reprocessing data                       | ❌ attributes are only calculated from the moment they are defined             | ✅                  |
| Windowing operations e.g., last 30 days | ✅ but only the last 100 values might be included, depending on the definition | ✅                  |

## Stream windowing operations

Stream attributes defined with a `period` setting, e.g., last 7 days, are limited to the most recent 100 instances of the specified event in the pipeline. Only those occurrences are considered in the calculation. As a result, if you need to analyze user behavior or aggregate data over longer periods—such as tracking all purchases in the past year or counting page views over several months—stream attributes may not capture the full picture.

This isn't the case for stream attributes that don't have a `period` window defined. In this case, Signals considers all events—starting from the time the attribute was defined—and values aren't forgotten.
