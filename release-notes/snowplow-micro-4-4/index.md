---
title: "Snowplow Micro 4.4: event filtering, shareable views, and more"
description: "Micro versions 4.2, 4.3, and 4.4 add multi-select filters, auto-refresh, shareable view URLs, and periodic refresh of enrichment assets."
date: "2026-07-07"
category:
  - "Release notes"
components:
  - "Testing"
---

Since 4.1.2, we have released Snowplow Micro 4.2.0, 4.2.1, 4.3.0, 4.4.0, and 4.4.1. Here is what is new across those releases.

## Filter the events table on more than one value

In the [Micro dashboard](/docs/testing/snowplow-micro/ui/), you can now pick several values for the same column. Select from the suggested values or type a value and press Enter. Micro shows the events matching any of the values, so you can compare a handful of event types or app IDs in one table instead of switching between them.

The `user_id` column is also filterable now.

## Share a view with a colleague

The **Copy view URL** button encodes your selected columns, filters, and time range into the URL. Anyone who opens that URL sees the same view. (They can return to their preferred set of columns by opening Micro normally and not through the shared URL.)

## Follow events as they arrive

The dashboard toolbar got an auto-refresh toggle. Turn it on to reload the events table every few seconds, which is useful while you are sending events from a tracker and want to watch them land. It is off by default.

## Pick up updated enrichment assets

Enrichments that rely on downloaded assets, such as the IP lookup or referer parser [enrichments](/docs/testing/snowplow-micro/local/enrichments/), no longer use whatever was downloaded at startup for the lifetime of the app. Micro checks for new versions of those assets every few minutes and swaps them in.

## Other changes

Micro now runs Enrich 6.12.0, so enrichment behavior matches recent pipeline releases. We also bumped dependencies to address CVEs.
