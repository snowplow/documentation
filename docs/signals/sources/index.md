---
title: "Sources"
sidebar_position: 10
description: "Sources."
sidebar_label: "Sources"
---

A `Source` defines how an `Attribute` is calculated. There are two types of sources:

- Stream: Attributes are calculated in real time, making them ideal for instant personalization and session-based metrics.
- Batch: Attributes are calculated using historical data stored in your warehouse, suitable for metrics over longer time periods.

### When to use each source

- Use Stream Sources for real-time use cases, such as tracking the latest product a user viewed or the number of page views in a session.
- Use Batch Sources for historical analysis, such as calculating a user's purchase history or average session length.
