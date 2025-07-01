---
title: "Configuring Signals"
sidebar_position: 1
sidebar_label: "Configuration"
---

By default, Signals calculates attributes in real time, in stream. Stream attributes are ideal for real-time use cases such as tracking the latest video a user played, or the number of page views in a session.

Use the Python SDK within a Jupyter notebook to define the attributes you want to calculate, as well as the entities that the attributes relate to. Group them together into a view, and apply this configuration to Signals.

All configuration is defined using the Signals Python SDK.

## Set up the SDK

TODO notebook setup

## Stream volume limit

Attributes are configured based on one or more Snowplow event schemas. For stream attributes, calculation is limited to the most recent 100 instances of the specified event(s) in the pipeline.

For example, you could configure a User entity with a `latest_video_played` stream attribute based on the Snowplow media `play_event` event. The 100 event volume window isn't a problem here, as the calculation is always updated with the latest `play_event` for that user. Conversely, for aggregated attributes based on common event types such as page views, the 100 event limit might limit the analytical accuracy.

For these attributes or for analyzing user behavior over longer periods, configuring a batch (warehouse) source is a better fit.

## Batch attributes

To configure attributes based on historical data, see [Batch calculations](/docs/signals/configuration/batch-calculations/index.md). Batch attributes are suitable for longer-term metrics such as a user's purchase history or average session length.

## Example use cases TODO

link to Signals tutorials here ADD LINKs
