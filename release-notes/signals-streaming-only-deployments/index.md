---
title: "Signals streaming-only deployments"
description: "Snowplow Signals now supports streaming-only deployments, enabling organizations to activate real-time customer intelligence without requiring an immediate warehouse connection."
date: "2025-12-11"
update_type:
  - "Product news"
components:
  - "Signals"
---
Snowplow Signals now supports streaming-only deployments, enabling organizations to activate real-time customer intelligence without requiring an immediate warehouse connection. This expansion makes Signals accessible to teams that are not on Snowflake or Bigquery, or those focused exclusively on in-session and streaming use cases.

## What's New

Signals can now be deployed and operated without connecting a data warehouse upfront. Organizations can begin building stream attribute groups and activating real-time customer data using the Profiles API immediately, with the flexibility to add warehouse connectivity later when needed for batch processing capabilities.

When deploying Signals in streaming-only mode, you'll have full access to streaming attribute groups and real-time data activation. The platform will guide you to add a warehouse connection if you later want to enable batch attribute groups, external batch processing, or the preview function for testing attribute definitions against historical data.

## Key Benefits

**Faster time to value:** Start activating real-time behavioral data for AI-powered applications immediately, without warehouse setup overhead.

**Broader platform compatibility:** Teams using Redshift, Databricks, lakehouse, or other data platforms can now access Signals for streaming use cases while maintaining their existing data infrastructure.

**Flexible deployment path:** Begin with streaming capabilities and add warehouse connectivity on your timeline as your use cases evolve, rather than being blocked at the outset.

## Prerequisites

* Active Snowplow CDI (Cloud or Private Managed Cloud) pipeline
* Streaming use cases that don't require batch attribute processing

Organizations wanting to use batch attribute groups, external batch processing, or the preview function will need to connect a supported warehouse (Snowflake or BigQuery, with Databricks support coming soon).

## Learn More

* [Signals Documentation](/docs/signals/)
* Contact your Customer Success team to discuss streaming-only deployment options
