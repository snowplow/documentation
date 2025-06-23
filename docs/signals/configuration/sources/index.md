---
title: "Sources"
sidebar_position: 10
sidebar_label: "Sources"
---

A `Source` defines how an `Attribute` is calculated. There are two types of sources:

- Stream: Attributes are calculated in real time, making them ideal for instant personalization and session-based metrics. This is the default source type.
- Batch: Attributes are calculated using historical data stored in your warehouse, suitable for metrics over longer time periods.

### When to use each source

:::note Stream Limitations

Stream attributes are limited to the last 100 instances of an event. This means that when you define an attribute using a stream source, only the most recent 100 occurrences of the specified event are considered in the calculation. As a result, if you need to analyze user behavior or aggregate data over longer periods—such as tracking all purchases in the past year or counting page views over several months—stream attributes may not capture the full picture.

In cases where an attribute is likely to include more than 100 events for a user or entity, you should use a batch source instead. Batch sources process historical data stored in your data warehouse, allowing you to calculate attributes over much larger time windows or event volumes without this limitation. This approach ensures that your attributes remain accurate and comprehensive, even as the number of relevant events grows over time.


:::

- Use Stream Sources for real-time use cases, such as tracking the latest product a user viewed or the number of page views in a session. 
- Use Batch Sources for historical analysis, such as calculating a user's purchase history or average session length.
