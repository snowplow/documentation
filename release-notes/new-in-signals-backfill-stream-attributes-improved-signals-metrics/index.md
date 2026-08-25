---
title: "New in Signals: backfill stream attributes and improved Signals metrics"
description: "We've rebuilt how Signals works with warehouse data, making it simpler to calculate over Snowplow events inside attribute groups."
date: "2026-06-26"
category:
  - "Product news"
components:
  - "Signals"
---
We've rebuilt how Signals works with warehouse data, making it simpler to calculate over Snowplow events inside attribute groups. You can now backfill stream attributes with data from your historical Snowplow events, and we've improved how pre-calculated values sync from your warehouse tables.

We've also added new metrics to the Signals UI to help you understand latency within Signals and track your usage by attribute group and service.

### Backfill your real-time attributes with history

Until now, a stream attribute group only started calculating from the moment you published it. New attribute groups had no history for their attributes on day one.

You can now enable backfill when you create a stream attribute group. Pick a start date, and on publish Signals reads your Snowplow `atomic` events table from that date up to the publish time and populates the attribute values for you. The streaming engine starts immediately and handles new events in real time, so you get historical context and live updates together.

This means your attributes are useful from the moment you publish. For example, if you personalize your homepage by a visitor's favourite product category, a returning customer gets a relevant experience on their first visit after publishing, instead of only once they've browsed enough for the attribute to build up. The same applies to attributes that only make sense with history behind them, like lifetime order count or total spend.

Backfill needs a warehouse connection. Snowflake and BigQuery are supported today, with Databricks support coming shortly.

### Sync pre-calculated attributes from your warehouse

The external batch source is now called the **Warehouse** source. It works the same way: if you have modeled data in your warehouse, you can sync it straight to the Profiles Store by creating an attribute group with a Warehouse source.

You choose the table, the timestamp field that tracks freshness, and the columns you want to sync. Signals only sends rows with a newer timestamp, so each sync stays incremental. This is a good fit for non-Snowplow data such as transactional records or CRM attributes.

We've also made performance improvements to how warehouse tables sync, with more improvements and configuration options planned.

Snowflake and BigQuery are supported today, with Databricks support coming shortly.

### New metrics to monitor Signals performance

You can now see how Signals is performing against the things that matter for real-time use cases. Three new metrics are available:

* **Attribute retrieval latency**: how long it takes to read attribute values back from the Profiles Store.
* **Attribute update latency**: how long it takes for a new event to be reflected in an updated attribute value.
* **Attribute requests**: the volume of attribute requests, broken down at the attribute group level.

### Get started

See the [Signals documentation](/docs/signals/) for full details on configuring backfills for stream attribute groups and syncs for warehouse sources.

New to Signals? You can [try Snowplow with a free trial](https://snowplow.io/get-started/snowplow-free-trial) to build real-time customer intelligence on your own data.
