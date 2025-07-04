---
title: "Sources"
sidebar_position: 10
sidebar_label: "Sources"
---

A `Source` defines how an `Attribute` is calculated. There are two types of sources:

- Stream: Attributes are calculated in real time, making them ideal for instant personalization and session-based metrics. This is the default source type.
- Batch: Attributes are calculated using historical data stored in your warehouse, suitable for metrics over longer time periods.

### When to use each source

Feature | Supported in stream | Supported in batch
--|--|--
Computing user lifetime attributes | Yes, from the point the attribute was defined | Yes
Reprocessing data | No, attributes are only calculated from the moment they are defined | Yes
Windowing operations (e.g., last 7 days) | Yes, but only last 100 values are considered* | Yes

:::note *Support for windowing operations in stream

Stream attributes defined with a `period` setting (e.g., last 7 days) are limited to the last 100 instances of an event. This means that when you define an attribute using a stream source, only the most recent 100 occurrences of the specified event are considered in the calculation. As a result, if you need to analyze user behavior or aggregate data over longer periods—such as tracking all purchases in the past year or counting page views over several months—stream attributes may not capture the full picture.

This is not the case for stream attributes that don't have a `period` window defined. In such cases, all events starting from the time the attribute was defined are considered and values are not forgotten.

:::

- Use Stream Sources for real-time use cases, such as tracking the latest product a user viewed or the number of page views in a session. 
- Use Batch Sources for historical analysis, such as calculating a user's purchase history or average session length.
