---
title: "Monitor your identity graph"
sidebar_label: "Monitoring"
sidebar_position: 3
description: "Track the size and health of your Snowplow Identities graph in Console, including total and active Snowplow IDs, deduplication rate, and identifiers per profile."
keywords: ["identities", "identity graph", "monitoring", "deduplication rate", "snowplow_id"]
date: "2026-10-28"
---

The **Overview** tab on the **Identities** page in [Snowplow Console](https://console.snowplowanalytics.com) shows how your identity graph is developing. Use it after you deploy Identities or change your [identifiers](/docs/identities/configuration/index.md#configure-identifiers) to check that events are linking to Snowplow IDs as you expect.

![Identities Overview tab in Console, showing headline figures for total and active Snowplow IDs, deduplication rate, and identifiers per profile, above a 30-day chart of Snowplow IDs over time](images/identities-overview.webp)

## Read the headline figures

The top of the tab shows four figures for the whole graph:

- **Total Snowplow IDs**: every [Snowplow ID](/docs/identities/concepts/index.md#snowplow-ids) created in the graph, including ones since merged into another
- **Active Snowplow IDs**: Snowplow IDs that haven't been [merged](/docs/identities/concepts/merges/index.md)
- **Deduplication rate**: the share of Snowplow IDs that have been merged into another Snowplow ID
- **Identifiers per profile**: the average number of identifiers the graph links to each active Snowplow ID, where each active Snowplow ID represents one user profile

A high **Identifiers per profile** value can mean that one of your identifiers is unstable for each user, which inflates the graph and increases cost. See [choosing identifiers](/docs/identities/configuration/choosing-identifiers/index.md) for how to check this against your warehouse.

## Track Snowplow IDs over time

Below the headline figures, a chart shows total and active Snowplow IDs over the last 30 days. A widening gap between the two lines means more Snowplow IDs are being merged.
